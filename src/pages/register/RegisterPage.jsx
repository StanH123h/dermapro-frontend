import React, { useState } from 'react';
import { Form, Button, Toast } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './RegisterPage.scss';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/user/register', {
                email: values.email,
                pwd: values.password,
                gender: values.gender || 0,
                phoneNumber: values.phoneNumber,
                name: values.name,
                age: values.age,
            });
            if (response.status === 201) {
                Toast.success('注册成功！跳转至登录页面');
                navigate('/login');
            }
        } catch (err) {
            Toast.error('注册失败，请检查输入！');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h2 className="register-title">用户注册</h2>
                <Form
                    layout="vertical"
                    onSubmit={(values) => handleRegister(values)}
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
                    <Form.Input
                        field="name"
                        label="姓名"
                        placeholder="请输入姓名"
                        style={{ width: '100%' }}
                    />
                    <Form.Input
                        field="phoneNumber"
                        label="电话号码"
                        placeholder="请输入电话号码"
                        style={{ width: '100%' }}
                    />
                    <Form.Input
                        field="age"
                        label="年龄"
                        placeholder="请输入年龄"
                        type="number"
                        style={{ width: '100%' }}
                    />
                    <Form.Select
                        field="gender"
                        label="性别"
                        placeholder="请选择性别"
                        style={{ width: '100%' }}
                        optionList={[
                            { label: '男性', value: 0 },
                            { label: '女性', value: 1 },
                            { label: '其他', value: 2 },
                        ]}
                    />
                    <div className="register-actions">
                        <Button
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                            className="register-button"
                        >
                            注册
                        </Button>
                    </div>
                </Form>
                <div className="register-footer">
                    <Button
                        type="tertiary"
                        onClick={() => navigate('/login')}
                        className="login-button"
                    >
                        已有账号？去登录
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
