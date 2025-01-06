import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";  // Import framer-motion
import "./BottomNavBar.scss";
import {
    IconFolder,
    IconFolderStroked,
    IconHome,
    IconHomeStroked,
    IconUser,
    IconUserStroked
} from "@douyinfe/semi-icons";

export const BottomNavBar = ({ currentPage }) => {
    const navigate = useNavigate();

    // Define a router map for the navigation
    const routerMap = {
        Home: "/",
        HistoryData: "/history",
        Profile: "/profile",
    };

    // Handle click on a navigation item
    const handleNavClick = (page) => {
        navigate(routerMap[page]); // Navigate to the corresponding route
    };

    // Motion variants for scale effect
    const scaleVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.2 },  // Scale up on hover
        selected: { scale: 1.2 },  // Scale up when selected
    };

    return (
        <div className="bottom-nav-bar">
            {/* Bottom navigation items */}
            <div className="items">
                <motion.div
                    className="nav-item"
                    onClick={() => handleNavClick("HistoryData")}
                    style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    initial="initial"
                    whileHover="hover"
                    animate={currentPage === "history" ? "selected" : "initial"}  // Apply scale effect if selected
                    variants={scaleVariants}  // Link the scale variants
                >
                    {currentPage === "history" ? <IconFolder className={"icon"}/> : <IconFolderStroked className={"icon"}/>}
                </motion.div>

                <motion.div
                    className="nav-item"
                    onClick={() => handleNavClick("Home")}
                    style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    initial="initial"
                    whileHover="hover"
                    animate={currentPage === "home" ? "selected" : "initial"}
                    variants={scaleVariants}
                >
                    {currentPage === "home" ? <IconHome className={"icon"}/> : <IconHomeStroked className={"icon"}/>}
                </motion.div>

                <motion.div
                    className="nav-item"
                    onClick={() => handleNavClick("Profile")}
                    style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    initial="initial"
                    whileHover="hover"
                    animate={currentPage === "profile" ? "selected" : "initial"}
                    variants={scaleVariants}
                >
                    {currentPage === "profile" ? <IconUser className={"icon"}/> : <IconUserStroked className={"icon"}/>}
                </motion.div>
            </div>

        </div>
    );
};
