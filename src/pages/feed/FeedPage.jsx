import React, { useState, useEffect } from 'react';
import { Layout } from "@douyinfe/semi-ui";
import { motion } from "framer-motion";
import { IconSearch } from '@douyinfe/semi-icons';
import "./FeedPage.scss";
import { BottomNavBar } from "../../components/BottomNavBar/BottomNavBar";
import RandomTipsDisplay from "./RandomTipsDisplay";
import { tipsData } from "./tipsData";
import {PhotoSnapButton} from "../../components/PhotoSnapButton/PhotoSnapButton"; // Import the tips data from a centralized file

export const FeedPage = () => {
    const { Header, Footer, Content } = Layout;

    // State to manage the search query and filtered tips
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTips, setFilteredTips] = useState([]);
    const [isOnFocus,setIsOnFocus] = useState(false)

    // Shuffle function to randomize the tips an return 5 of them
    const shuffleArray = (array) => {
        const shuffled = [...array];
        const selectedItems = [];

        // 随机选择 `count` 个元素
        while (selectedItems.length < 5 && shuffled.length > 0) {
            const randomIndex = Math.floor(Math.random() * shuffled.length); // 随机索引
            selectedItems.push(shuffled.splice(randomIndex, 1)[0]); // 抽取并删除已选择元素
        }

        return selectedItems;
    };

    // Effect to filter or shuffle tips based on search query
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = tipsData.filter(tip =>
                tip.title.toLowerCase().includes(searchQuery.toLowerCase()) // Match title with search query
            );
            setFilteredTips(filtered);
        } else {
            const shuffledTips = shuffleArray(tipsData); // Shuffle tips if there's no search query
            setFilteredTips(shuffledTips);
        }
    }, [searchQuery]); // Re-run whenever search query changes

    return (
        <div className="feed-page">
            <Layout>
                {/* Header with Search Bar */}
                <Header className="header">
                    <motion.div
                        className="search-bar-container"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            overflow: "hidden", // Prevent overflow
                        }}
                    >
                        <IconSearch className="icon" size="large" />
                        <motion.input
                            className="search-bar"
                            style={{
                                fontSize: "16px",
                            }}
                            animate={{
                                width: isOnFocus ? "66vw" : "40vw", // Expand when user types something
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update query on input change
                            placeholder="搜索..."
                            onFocus={()=>setIsOnFocus(true)}
                            onBlur={()=>setIsOnFocus(false)}
                        />
                    </motion.div>
                </Header>

                {/* Content Area: Display Random or Filtered Tips */}
                <Content className="content">
                    <RandomTipsDisplay tips={filteredTips} /> {/* Pass the filtered or shuffled tips */}
                </Content>

                {/* Footer with Bottom Navigation Bar */}
                <Footer className="footer">
                    <BottomNavBar currentPage={"home"} />
                </Footer>
            </Layout>
        </div>
    );
};
