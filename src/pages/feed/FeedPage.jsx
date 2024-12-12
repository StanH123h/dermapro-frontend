import React, {useState} from 'react';
import {Input, Layout} from "@douyinfe/semi-ui";
import {motion} from "framer-motion"
import {IconSearch} from '@douyinfe/semi-icons';
import "./FeedPage.scss"
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";
import RandomTipsDisplay from "./RandomTipsDisplay";

export const FeedPage = () => {
    const {Header, Footer, Content} = Layout;
    // 所有的Tip组件存放在一个数组中

    const SearchBar = () => {
        const [onFocus, setOnFocus] = useState(false);

        return (
            <motion.div
                className="search-bar-container"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    overflow: "hidden", // 防止内容溢出
                }}
            >
                <IconSearch className="icon" size="large" />
                <motion.input
                    className="search-bar"
                    style={{
                        fontSize: "16px",
                    }}
                    // 动画配置
                    animate={{
                        width: onFocus ? "66vw" : "40vw", // 聚焦时延伸，失去聚焦时恢复
                    }}
                    transition={{
                        type: "spring", // 弹簧效果
                        stiffness: 300, // 刚度，数值越高动画越紧凑
                        damping: 20, // 阻尼，数值越低弹跳越多
                    }}
                    onFocus={() => setOnFocus(true)}
                    onBlur={() => setOnFocus(false)}
                    placeholder="搜索..."
                />
            </motion.div>
        );
    };
    return (
        <div className={"feed-page"}>
            <Layout>
                <Header className={"header"}>
                    <SearchBar/>
                </Header>
                <Content className={"content"}>
                    <RandomTipsDisplay/>
                </Content>
                <Footer className={"footer"}>
                    <BottomNavBar currentPage={"home"}/>
                </Footer>
            </Layout>
        </div>
    );
};
