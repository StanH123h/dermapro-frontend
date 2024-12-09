import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.scss';

export const WelcomePage = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="welcome-page">
            <h1 className="welcome-title">欢迎来到</h1>
            <h2 className="app-name">肤质</h2>
            <div className="button-container">
                <button className="register-button" onClick={handleRegister}>
                    注册
                </button>
                <button className="login-button" onClick={handleLogin}>
                    登录
                </button>
            </div>
        </div>
    );
};
