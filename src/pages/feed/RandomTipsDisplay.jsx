import React, { useState } from 'react';
import { Card } from "@douyinfe/semi-ui";
import { motion } from "framer-motion";
import "./RandomTipsDisplay.scss";

const RandomTipsDisplay = ({ tips }) => {
    const [showDetails, setShowDetails] = useState([]);

    // Toggle the visibility of details for each tip
    const toggleDetails = (index) => {
        setShowDetails(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index]; // Toggle visibility for the clicked tip
            return newState;
        });
    };

    return (
        <motion.div className="tips" layout>
            {tips.map((tip, index) => (
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
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}  // Start collapsed
                        animate={{ opacity: showDetails[index] ? 1 : 0, height: showDetails[index] ? "auto" : 0 }} // Animate expansion
                        transition={{
                            type: "spring",
                            stiffness: 125,
                            damping: 25,
                            mass: 1,
                        }}
                        style={{ overflow: "hidden" }}  // Prevent overflow when expanding/collapsing
                    >
                        {showDetails[index] && tip.details}
                    </motion.div>
                </Card>
            ))}
        </motion.div>
    );
};

export default RandomTipsDisplay;
