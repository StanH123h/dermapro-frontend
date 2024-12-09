import React, { useState } from 'react';
import { Form, Button, Toast } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './LoginPage.scss'; // 引入 SCSS 文件

export const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/user/doLogin', null, {
                params: {
                    email: values.email,
                    pwd: values.password,
                },
            });
            if (response.status === 200) {
                localStorage.setItem("fuzhitoken",response.data.data.tokenValue)
                Toast.success('登录成功！');
                navigate('/');
            }
        } catch (err) {
            Toast.error('登录失败，请检查邮箱和密码！');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">用户登录</h2>
                <Form
                    layout="vertical"
                    onSubmit={(values) => handleLogin(values)}
                    onValueChange={(values) => console.log(values)}
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
                        <Button
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                            className="login-button"
                        >
                            登录
                        </Button>
                    </div>
                </Form>
                <div className="login-footer">
                    <Button
                        type="tertiary"
                        onClick={() => navigate('/register')}
                        className="register-button"
                    >
                        没有账号？去注册
                    </Button>
                </div>
            </div>
        </div>
    );
};
