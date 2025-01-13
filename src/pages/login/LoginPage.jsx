import React, { useState } from 'react';
import { Form, Button, Toast } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './LoginPage.scss'; // 引入 SCSS 文件
import {motion} from "framer-motion";

export const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [loginOptionIsChoosed, setLoginOptionIsChoosed] = useState(false)

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/user/doLogin', null, {
                params: {
                    email: values.email,
                    pwd: values.password,
                },
            });
            if (response.code === 200) {
                localStorage.setItem("fuzhitoken",response.data.tokenValue)
                Toast.success('登录成功！');
                    navigate('/');
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <motion.h2 className="login-title" initial={{ fontSize:"0rem" }}
                    animate={{ fontSize:"1.5rem" }}><img className={"icon"} src={"leaf-svgrepo-com.svg"}></img>DermaPro</motion.h2>
                <p className={"product-description"}>
                    欢迎来到肤质(DermaPro),您的私人皮肤专家。发现洞察您的皮肤健康，并获得个性化的建议。
                </p>
                {
                    !loginOptionIsChoosed? (
                        <div className="options">
                            <motion.button className={"login-button"}
                                           initial={{height:"0vh",width:"0vw"}} animate={{height:"4vh",width:"100%",borderRadius:"1vw",border:"none"}}
                                           whileTap={{ scale: 0.8 }}
                                          onClick={()=>setLoginOptionIsChoosed(true)}
                                           transition={{ type: "spring", stiffness: 400, damping: 35 }}>
                                登录
                            </motion.button>
                            <motion.button className={"sign-up-button"}
                                           initial={{height:"0vh",width:"0vw"}}
                                           animate={{height:"4vh",width:"100%",borderRadius:"1vw",border:"1px black solid",boxSizing:"border-box"}}
                                           whileTap={{ scale: 0.8 }}
                                           transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                           onClick={()=>navigate("/register")}
                            >
                                注册
                            </motion.button>
                        </div>
                    ):<></>
                }


                {loginOptionIsChoosed ? (
                    <>
                        <Form
                            layout="vertical"
                            onSubmit={(values) => handleLogin(values)}
                        >
                            <Form.Input
                                field="email"
                                label="邮箱"
                                placeholder="请输入邮箱"
                                style={{ width: '100%' }}
                                rules={[{ required: true, message: '请输入邮箱' }]}
                            />
                            <Form.Input
                                field="password"
                                label="密码"
                                placeholder="请输入密码"
                                type="password"
                                style={{ width: '100%' }}
                                rules={[{ required: true, message: '请输入密码' }]}
                            />
                            <div className="login-actions">
                                <motion.button
                                    htmlType="submit"
                                    type="primary"
                                    loading={loading}
                                    className="login-button"
                                    initial={{height:"0vh",width:"0vw"}} animate={{height:"4vh",width:"100%",borderRadius:"1vw",border:"none"}}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={()=>setLoginOptionIsChoosed(true)}
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}>
                                    登录
                                </motion.button>
                            </div>
                        </Form>
                        <div className="login-footer">
                            <motion.button
                                type="tertiary"
                                whileTap={{ scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                onClick={()=>navigate('/register')}
                                className="register-button"
                            >
                                没有账号？去注册
                            </motion.button>
                        </div>
                    </>
                ):<></>}
            </div>
        </div>
    );
};
