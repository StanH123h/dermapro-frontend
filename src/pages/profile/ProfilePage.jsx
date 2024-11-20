import {Layout} from "@douyinfe/semi-ui";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";
import React from "react";


export const ProfilePage = () => {
    const {Header, Content, Footer} = Layout;
    return (
        <div className={"profile-page"}>
            <Layout>
                <Header className={"header"}>
                </Header>
                <Content className={"content"}>
                </Content>
                <Footer className={"footer"}>
                    <BottomNavBar currentPage={"profile"}/>
                </Footer>
            </Layout>
        </div>
    )
}