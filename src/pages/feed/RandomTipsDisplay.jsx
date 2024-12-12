import React, { useState, useEffect } from 'react';
import { Tip1Preview, Tip1Details } from "./tip1";
import { Tip6Preview, Tip6Details } from "./tip6";
import { Tip2Preview, Tip2Details } from "./tip2";
import { Tip3Preview, Tip3Details } from "./tip3";
import { Tip4Preview, Tip4Details } from "./tip4";
import { Tip5Preview, Tip5Details } from "./tip5";
import "./RandomTipsDisplay.scss";
import { Card } from "@douyinfe/semi-ui";
import {motion} from "framer-motion"

const RandomTipsDisplay = () => {
    const tips = [
        { preview: <Tip1Preview />, details: <Tip1Details /> },
        { preview: <Tip2Preview />, details: <Tip2Details /> },
        { preview: <Tip3Preview />, details: <Tip3Details /> },
        { preview: <Tip4Preview />, details: <Tip4Details /> },
        { preview: <Tip5Preview />, details: <Tip5Details /> },
        { preview: <Tip6Preview />, details: <Tip6Details /> }
    ];

    // Shuffle array function
    const shuffleArray = (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        return shuffled;
    };

    // Select random tips
    const getRandomTips = (tips, count) => {
        const shuffledTips = shuffleArray(tips);
        return shuffledTips.slice(0, count); // Return the first `count` random tips
    };

    const [randomTips, setRandomTips] = useState([]);
    const [showDetails, setShowDetails] = useState([]);

    // Toggle the visibility of details for each tip
    const toggleDetails = (index) => {
        setShowDetails(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index]; // Toggle visibility for the clicked tip
            return newState;
        });
    };

    // Initialize random tips on page load
    useEffect(() => {
        const randomCount = 5; // Random number of tips to display
        setRandomTips(getRandomTips(tips, randomCount));
        setShowDetails(new Array(randomCount).fill(false)); // Initially hide all details
    }, []);

    return (
        <motion.div className={"tips"} layout>
            {randomTips.map((tip, index) => (
                <Card
                    key={index}
                    className={`tip ${showDetails[index] ? 'expanded' : ''}`}
                    onClick={() => toggleDetails(index)}
                >
                    {/* Show preview */}
                    <div className="tip-preview">
                        {tip.preview}
                    </div>

                    {/* Show details if toggled */}
                    {showDetails[index] && <motion.div>{tip.details}</motion.div>}
                </Card>
            ))}
        </motion.div>
    );
};

export default RandomTipsDisplay;