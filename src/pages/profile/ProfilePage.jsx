import {Avatar, Card, Layout} from "@douyinfe/semi-ui";
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";
import React from "react";
import "./ProfilePage.scss"
import {PhotoSnapButton} from "../../components/PhotoSnapButton";

export const ProfilePage = () => {
    const {Header, Content, Footer} = Layout;
    return (
        <div className={"profile-page"}>
            <Layout>
                <Header className={"header"}>
                    <PhotoSnapButton/>
                </Header>
                <Content className={"content"}>
                    <div className="user-name-and-avatar">
                    <Avatar size="large" style={{margin: 4}} alt='User'>
                        U
                    </Avatar>
                        <h3>User</h3>
                    </div>
                    <div className="skin-history-and-trend">
                        <Card className={"skin-trend"}>
                            <h4>肤质变化</h4>
                            jdhahsdosahdoihasoihosah
                        </Card>
                        <Card className={"skin-history"}>
                            <h4>肤质历史</h4>
                            qowiduwqduiwq9d0uqw90duqw
                        </Card>
                    </div>
                    <Card className="my-skin-info">
                        <h4>我的皮肤信息</h4>
                        <br/>
                        <h4>年龄</h4>
                        <h4>肤质</h4>
                        <h4>性别</h4>
                        <br/>
                    </Card>
                    <Card className="my-footprint">
                        <h4>我的浏览足迹</h4>
                    </Card>
                    <Card className="my-subscribes">
                        <h4>我收藏的文章</h4>
                    </Card>
                </Content>
                <Footer className={"footer"}>
                    <BottomNavBar currentPage={"profile"}/>
                </Footer>
            </Layout>
        </div>
    )
}