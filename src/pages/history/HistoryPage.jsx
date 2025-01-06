// HistoryPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Layout, List, Avatar, Typography } from "@douyinfe/semi-ui";
import { BottomNavBar } from "../../components/BottomNavBar/BottomNavBar";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./HistoryPage.scss";

export const HistoryPage = () => {
    const location = useLocation();
    const dataType = location.state?.dataType;
    const [displayDataType, setDisplayDataType] = useState(dataType || "insight");
    const [historyData, setHistoryData] = useState([]); // 初始状态为空数组
    const [loading, setLoading] = useState(true); // 加载状态
    const navigate = useNavigate();
    const { Header, Content, Footer } = Layout;
    const historySectionRef = useRef(null); // 用于滚动的 Ref

    useEffect(() => {
        const fetchHistory = async () => {
            const cachedData = localStorage.getItem("historyData");
            const cacheTimestamp = localStorage.getItem("historyCacheTimestamp");
            const now = Date.now();

            // 检查缓存是否存在且不过期（例如：缓存时间小于30分钟）
            if (cachedData && cacheTimestamp && now - cacheTimestamp < 30 * 60 * 1000) {
                setHistoryData(JSON.parse(cachedData));
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get("/analysis/getSkinAnalysisHistory", {
                    headers: {
                        "Content-Type": "application/form-data",
                    },
                });

                if (Array.isArray(response.data)) {
                    setHistoryData(response.data);
                    // 存储数据到缓存中
                    localStorage.setItem("historyData", JSON.stringify(response.data));
                    localStorage.setItem("historyCacheTimestamp", now.toString());
                } else {
                    console.error("Returned data is not an array");
                    setHistoryData([]);
                }
            } catch (error) {
                console.error("Failed to fetch history data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        // 如果 displayDataType 是 "history"，则滚动到历史部分
        if (displayDataType === "history" && historySectionRef.current) {
            document.getElementById("history").scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
        }
    }, [displayDataType]);

    const formatHistoryTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        const minutes = Math.floor(diff / (1000 * 60));
        if(minutes === 0) return "刚刚";
        if (minutes < 60) return `${minutes} 分钟前`;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) return `${hours} 小时前`;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days < 30) return `${days} 天前`;

        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        if (months < 12) return `${months} 月前`;

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        return `${years} 年前`;
    };

    // 数据聚合函数：按日期聚合 total_score（取平均值）
    const aggregateHistoryData = (data) => {
        const groupedData = {};

        data.forEach(item => {
            const date = formatDate(new Date(item.timeStamp));
            if (!groupedData[date]) {
                groupedData[date] = { date, total_score: 0, count: 0 };
            }
            groupedData[date].total_score += item.score.total_score;
            groupedData[date].count += 1;
        });

        // 计算每个日期的平均分
        const aggregatedData = Object.values(groupedData).map(item => ({
            date: item.date,
            平均得分: parseFloat((item.total_score / item.count).toFixed(2)), // 保留两位小数
        }));

        // 按日期排序
        aggregatedData.sort((a, b) => new Date(a.date) - new Date(b.date));

        return aggregatedData;
    };

    //统计这些数据中有多少不同的日期
    const countDifferentDates=(data)=>{
        const dates=[];
        data.forEach(item=>{
            const date = formatDate(new Date(item.timeStamp));
            if(!dates.includes(date)){
                dates.push(date)
            }
        })
        return dates.length;
    }

    // 日期格式化函数（用于聚合）
    const formatDate = (date) => {
        const month = date.getMonth() + 1;  // getMonth() 返回 0-11，加 1
        const day = date.getDate();         // getDate() 返回 1-31
        return `${month}-${day}`;
    };

    // 格式化折线图的数据
    const LineChartComponent = () => {
        const formattedData = aggregateHistoryData(historyData);

        return (
            <ResponsiveContainer width="100%" height={300} className={"graph"}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="平均得分" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className={"history-page"}>
            <Layout>
                <Header className={"header"} />
                {loading ? (
                    <Content className="content">
                        <Typography.Text>加载中...</Typography.Text> {/* 加载状态 */}
                    </Content>
                ) : historyData.length > 0 ? (
                    <Content className="content">
                        {/* Insights Section */}
                        {countDifferentDates(historyData)>=2?(
                        <div className="insights">
                            <h1 className={"title"}>洞察</h1>
                            <h3 className="graph-name">肤质得分变化</h3>
                            <LineChartComponent />
                        </div>
                            ):<></>}
                        <h1 ref={historySectionRef} id="history" className="title">历史</h1> {/* 添加 id="history" */}
                        <List
                            className="history"
                            dataSource={historyData}
                            renderItem={(item) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={item.id}
                                >
                                    <List.Item
                                        onClick={() => navigate(`/detailed-report-page?id=${item.id}`)}
                                        className="item"
                                        header={<Avatar className="avatar" shape="square" src={`https://www.fuzhi.space/${item.imageKey}`} spinning />}
                                        main={
                                            <div className="info">
                                                <Typography.Text className="score">
                                                    <span className="value">{item.score.total_score}分</span>
                                                </Typography.Text>
                                                <br />
                                                <Typography.Text className="time">
                                                    <span className="value">{formatHistoryTime(item.timeStamp)}</span>
                                                </Typography.Text>
                                            </div>
                                        }
                                    />
                                </motion.div>
                            )}
                        />
                    </Content>
                ) : (
                    <Content className="content">
                        <div className="no-data-container">
                            <img src="/icon-no-data.svg" alt="no-data" className="no-data"/>
                            <span>暂无历史数据</span>
                        </div>
                    </Content>
                )}
                <Footer className={"footer"}>
                    <BottomNavBar currentPage={"history"} />
                </Footer>
            </Layout>
        </div>
    );
};
