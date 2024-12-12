import React from 'react';
import {useNavigate} from 'react-router-dom';
import './WelcomePage.scss';
import {IconArrowRight} from "@douyinfe/semi-icons";
import {motion} from "framer-motion";

export const WelcomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
            navigate("/login")
    };

    return (
        <div className="welcome-page">
            <img className={"img"} src="/welcome-page-img.png"/>
            <div className="text">
                <h1 className="welcome-title">欢迎来到</h1>
                <h2 className="app-name">肤智</h2>
            </div>
            <div className="button-container">
                <motion.button
                    className="login-button"
                    onAnimationComplete={handleLogin}
                    whileTap={{scale:0.8}}
                    animate={{scale: [1, 1.15, 1]}} // 定义缩放循环动画
                    transition={{
                        duration: 2, // 动画周期时间（秒）
                        repeat: Infinity, // 无限循环
                        repeatType: "mirror", // 循环方式：镜像（从1到1.1再回到1）
                        ease: "easeInOut", // 缓动函数
                    }}
                >
                    <IconArrowRight className={"arrow-icon"}/>
                </motion.button>
            </div>
        </div>
    );
};
