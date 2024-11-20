import {Layout} from "@douyinfe/semi-ui";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";
import React from "react";


export const HistoryPage = () => {
    const {Header, Content, Footer} = Layout;
    return (
        <div className={"history-page"}>
            <Layout>
                <Header className={"header"}>
                </Header>
                <Content className={"content"}>
                </Content>
                <Footer className={"footer"}>
                    <BottomNavBar currentPage={"history"}/>
                </Footer>
            </Layout>
        </div>
    )
}