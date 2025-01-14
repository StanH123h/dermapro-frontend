// DetailedReportPage.jsx
import "./DetailedReportPage.scss";
import { Layout } from "@douyinfe/semi-ui";
import { IconChevronLeft } from "@douyinfe/semi-icons";
import { AcneAnalyze, SkinAnalysis } from "../detectionresult/DetectionResultPage";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从 0 开始，需要 +1
    const day = date.getDate();

    return `${year}/${month}/${day}`;
};

export const DetailedReportPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // 获取查询参数中的 id
    const navigate = useNavigate();
    const [data, setData] = useState({ result: {} });
    const [loading, setLoading] = useState(true);
    const { Header, Content, Footer } = Layout;

    useEffect(() => {
        if (!id) {
            console.error("No id provided in query parameters");
            // 跳转回历史页面或显示错误信息
            navigate("/history");
            return;
        }

        console.log("Fetching data for ID:", id);
        axiosInstance
            .get("/analysis/getSkinAnalysisReport", { params: { "id":id } })
            .then((res) => {
                console.log("Response received:", res);
                const fetchedData = res.data || {};
                console.log("Fetched Data Result:", fetchedData.result);
                setData(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch data:", error);
                setData({ result: {} });
                setLoading(false);
            });
    }, [id, navigate]);

    return (
        <div className="detailed-report-page">
            <Layout>
                <Header className="header">
                    <IconChevronLeft onClick={() => navigate("/history")} />
                </Header>
                <Content className="content">
                    {loading ? (
                        <div className="loading">加载中...</div>
                    ) : (
                        <>
                            <div className="report-info">
                                <h3 className="title">皮肤报告:{formatTimestamp(data.timeStamp)}</h3>
                                <span className="result-id" style={{ color: "rgb(150,152,152)" }}>
                                    ID: {id}
                                </span>
                            </div>
                            <AcneAnalyze imgUrl={"https://www.fuzhi.space/"+data.imageKey} data={data} />
                            <SkinAnalysis data={data.result} />
                        </>
                    )}
                </Content>
                <Footer className="footer"></Footer>
            </Layout>
        </div>
    );
};
