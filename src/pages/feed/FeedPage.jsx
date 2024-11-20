import React, { useState, useEffect } from 'react';
import { Tip1 } from "./tip1";
import { Tip6 } from "./tip6";
import { Tip2 } from "./tip2";
import { Tip3 } from "./tip3";
import { Tip4 } from "./tip4";
import { Tip5 } from "./tip5";
import {Input, Layout} from "@douyinfe/semi-ui";
import { IconSearch } from '@douyinfe/semi-icons';
import "./FeedPage.scss"
import {BottomNavBar} from "../../components/BottomNavBar/BottomNavBar";

export const FeedPage = () => {
    const { Header, Footer, Content } = Layout;
    // 所有的Tip组件存放在一个数组中
    const tips = [<Tip1 />, <Tip2 />, <Tip3 />, <Tip4 />, <Tip5 />, <Tip6 />];

    // 打乱数组顺序的函数
    const shuffleArray = (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
        }
        return shuffled;
    };

    // 随机选择几个Tip组件进行显示
    const getRandomTips = (tips, count) => {
        const shuffledTips = shuffleArray(tips);
        return shuffledTips.slice(0, count); // 选择前 `count` 个元素
    };

    const SearchBar=()=>{
        return(
            <Input className={"search-bar"} prefix={<IconSearch />} showClear></Input>
        )
    }

    const [randomTips, setRandomTips] = useState([]);

    // 页面加载时获取随机的Tips
    useEffect(() => {
        const randomCount = 5; // 随机显示1到所有Tips之间的数量
        setRandomTips(getRandomTips(tips, randomCount));
    }, []);

    return (
        <div className={"feed-page"}>
            <Layout>
            <Header className={"header"}>
                <SearchBar/>
            </Header>
            <Content className={"content"}>
            {randomTips.map((tip, index) => (
                <div key={index}>
                    {tip}
                    {index < randomTips.length - 1 && <hr />}
                </div>
            ))}
            </Content>
            <Footer className={"footer"}>
                <BottomNavBar currentPage={"home"} />
            </Footer>
            </Layout>
        </div>
    );
};
