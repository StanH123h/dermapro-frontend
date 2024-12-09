import "./DetailedReportPage.scss"
import {Layout} from "@douyinfe/semi-ui";
import {IconChevronLeft} from "@douyinfe/semi-icons";
import {AcneAnalyze, SkinAnalysis} from "../detectionresult/DetectionResultPage";
import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import {useEffect, useState} from "react";
import axiosInstance from "../../api/axiosInstance";
import mockData from "../detectionresult/mockdata.json"
export const DetailedReportPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");  // 获取查询参数中的 id

    const navigate = useNavigate();
    const [data,setData]=useState([])
    const { Header, Content, Footer } = Layout;
    useEffect(() => {
        setData(mockData)
    }, []);
    return (
        <div className="detailed-report-page">
            <Layout>
                <Header className="header">
                    <IconChevronLeft onClick={() => navigate("/history")} />
                </Header>
                <Content className="content">
                    <div className="report-info">
                        <h3 className="title">皮肤报告:2024/09/27</h3>
                        <span className="result-id" style={{ color: "rgb(150,152,152)" }}>
                            ID:{id} {/* 显示查询参数中的 ID */}
                        </span>
                    </div>
                    <AcneAnalyze imgUrl={"暂无"} data={mockData} />
                    <SkinAnalysis data={mockData.result}></SkinAnalysis>
                </Content>
                <Footer className="footer"></Footer>
            </Layout>
        </div>
    );
};
