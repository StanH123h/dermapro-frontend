import React, { useEffect, useRef, useState } from "react";
import { Layout, List, Avatar, Typography } from "@douyinfe/semi-ui";
import { BottomNavBar } from "../../components/BottomNavBar/BottomNavBar";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./HistoryPage.scss";
import { PhotoSnapButton } from "../../components/PhotoSnapButton/PhotoSnapButton";

export const HistoryPage = () => {
    const location = useLocation();
    const dataType = location.state?.dataType;
    const [displayDataType, setDisplayDataType] = useState(dataType || "insight");
    const [historyData, setHistoryData] = useState([]); // Set initial state as an empty array
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();
    const { Header, Content, Footer } = Layout;
    const historySectionRef = useRef(null); // Ref for scrolling

    // Fetch historical data
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axiosInstance.get("/analysis/getSkinAnalysisHistory", {
                    headers: {
                        "Content-Type": "application/form-data", // Ensure Content-Type is correct
                    },
                });
                console.log(response.data);
                // Ensure the data is an array
                if (Array.isArray(response.data)) {
                    setHistoryData(response.data); // Set the data if it's an array
                } else {
                    console.error("Returned data is not an array");
                    setHistoryData([]); // Set as an empty array if data is not valid
                }
            } catch (error) {
                console.error("Failed to fetch history data:", error);
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        // Scroll to history section if displayDataType is "history"
        if (displayDataType === "history" && historySectionRef.current) {
            document.getElementById("history").scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
        }
    }, [displayDataType]);

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

    // Format the data for the line chart
    const LineChartComponent = () => {
        function formatDate(date) {
            const month = date.getMonth() + 1;  // getMonth() returns 0-11, so add 1
            const day = date.getDate();         // getDate() returns 1-31
            return `${month}-${day}`;
        }

        const formattedData = historyData.map((item) => ({
            date: formatDate(new Date(item.timeStamp)),  // Format the date
            得分: item.score,
        }));

        return (
                <ResponsiveContainer width="100%" height={300} className={"graph"}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="得分" stroke="#8884d8" activeDot={{ r: 8 }} />
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
                        <Typography.Text>加载中...</Typography.Text> {/* Loading state */}
                    </Content>
                ) : historyData.length > 0 ? (
                    <Content className="content">
                        {/* Insights Section */}
                        <div className="insights">
                            <h1 className={"title"}>洞察</h1>
                            <h3 className="graph-name">肤质得分变化</h3>
                            <LineChartComponent />
                        </div>
                        <h1 ref={historySectionRef} className="title">历史</h1> {/* History section */}
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
                                        header={<Avatar className="avatar" shape="square" />}
                                        main={
                                            <div className="info">
                                                <Typography.Text className="score">
                                                    <span className="value">{item.score}分</span>
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
