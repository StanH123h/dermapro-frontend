import React from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();  // Initialize the navigate function

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

    return (
        <div className="bottom-nav-bar">
            {/* Bottom navigation items */}
            <div
                className="nav-item"
                onClick={() => handleNavClick("HistoryData")}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
                {currentPage === "history" ? <IconFolder /> : <IconFolderStroked />}
            </div>
            <div
                className="nav-item"
                onClick={() => handleNavClick("Home")}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
                {currentPage === "home" ? <IconHome /> : <IconHomeStroked />}
            </div>
            <div
                className="nav-item"
                onClick={() => handleNavClick("Profile")}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
                {currentPage === "profile" ? <IconUser /> : <IconUserStroked />}
            </div>
        </div>
    );
};