import React, {useEffect, useState} from "react";
import {Layout, List, Avatar, Typography} from "@douyinfe/semi-ui";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";
import {motion} from "framer-motion"
import {useLocation, useNavigate} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import "./HistoryPage.scss"
import {PhotoSnapButton} from "../../components/PhotoSnapButton/PhotoSnapButton";

export const HistoryPage = () => {
    const location = useLocation();
    const dataType = location.state?.dataType;
    const [displayDataType, setDisplayDataType] = useState(dataType || "history");
    const [historyData, setHistoryData] = useState([]); // 用于存储历史记录
    const [loading, setLoading] = useState(true); // 加载状态
    const navigate = useNavigate();
    const {Header, Content, Footer} = Layout;

    // 获取历史数据
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // const response = await axiosInstance.get("/analysis/getSkinAnalysisHistory", {
                //     headers: {
                //         "Content-Type": "application/form-data", // 确保 Content-Type 正确
                //     },
                // });
                // console.log(response.data)
                const response = {
                    data: [
                        {
                            "id": "12345",
                            "timeStamp": "2024-12-18T09:30:00.123456789",
                            "score": 85,
                            "imageKey": "image_12345.jpg"
                        },
                        {
                            "id": "12346",
                            "timeStamp": "2024-12-17T14:30:00.123456789",
                            "score": 75,
                            "imageKey": "image_12345.jpg"
                        },
                        {
                            "id": "12346",
                            "timeStamp": "2024-11-07T14:30:00.123456789",
                            "score": 5,
                            "imageKey": "image_12345.jpg"
                        },
                        {
                            "id": "12346",
                            "timeStamp": "2024-10-08T14:30:00.123456789",
                            "score": 35,
                            "imageKey": "image_12345.jpg"
                        },
                        {
                            "id": "12346",
                            "timeStamp": "2023-10-09T14:30:00.123456789",
                            "score": 30,
                            "imageKey": "image_12345.jpg"
                        },
                        {
                            "id": "12346",
                            "timeStamp": "2023-10-10T14:30:00.123456789",
                            "score": 100,
                            "imageKey": "image_12345.jpg"
                        },
                    ]
                };
                setHistoryData(response.data); // 保存返回的数据
            } catch (error) {
                console.error("获取历史数据失败:", error);
            } finally {
                setLoading(false); // 无论成功或失败都停止加载
            }
        };
        fetchHistory();
    }, []);

    const formatHistoryTime = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        const minutes = Math.floor(diff / (1000 * 60));
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

    // 将 historyData 转换为折线图所需的数据格式
    const LineChartComponent = () => {

        function formatDate(date) {
            const month = date.getMonth() + 1;  // getMonth() 返回 0-11，所以要加 1
            const day = date.getDate();         // getDate() 返回 1-31

            return `${month}-${day}`;
        }

        const formattedData = historyData.map((item) => ({
            date: formatDate(new Date(item.timeStamp)),  // 使用手动实现的格式化函数
            score: item.score,
        }));

        return (
            <ResponsiveContainer width="100%" height={300} className={"graph"}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis domain={[0, 100]}/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{r: 8}}/>
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className={"history-page"}>
            <Layout>
                <Header className={"header"}>
                    <span></span>
                    <Typography.Title heading={6}>
                        <a onClick={() => setDisplayDataType("history")}
                           style={displayDataType === "history" ? {color: "#999"} : {color: "#007bff"}}>历史记录</a>
                        /
                        <a onClick={() => setDisplayDataType("insight")}
                           style={displayDataType === "insight" ? {color: "#999"} : {color: "#007bff"}}>洞察</a>
                    </Typography.Title>
                    <span></span>
                </Header>
                <Content className={"content"}>
                    {displayDataType === "history" ? (
                        loading ? (
                            <Typography.Text>加载中...</Typography.Text>
                        ) : historyData.length > 0 ? (
                            <List
                                className={"history"}
                                dataSource={historyData}
                                renderItem={(item) => (
                                    <motion.div initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}>
                                        <List.Item
                                            onClick={() => {
                                                navigate(`/detailed-report-page?id=${item.id}`);
                                            }}
                                            className={"item"}
                                            key={item.id}
                                            header={<Avatar className={"avatar"} shape="square"/>}
                                            main={
                                                <div className={"info"}>
                                                    <Typography.Text className={"score"} ><span></span> <span className="value">{item.score}分</span></Typography.Text>
                                                    <br/>
                                                    <Typography.Text className={"time"}> <span className="value">{formatHistoryTime(item.timeStamp)}</span> </Typography.Text>
                                                </div>
                                            }
                                        />
                                    </motion.div>
                                )}
                            />
                        ) : (
                            <Typography.Text>暂无历史记录</Typography.Text>
                        )
                    ) : (
                        <div className={"insights"}>
                            <h3 className={"title"}>肤质得分变化</h3>
                            <LineChartComponent/>
                        </div>
                    )}
                </Content>
                <Footer className={"footer"}>
                    <BottomNavBar currentPage={"history"}/>
                </Footer>
            </Layout>
        </div>
    );
};
