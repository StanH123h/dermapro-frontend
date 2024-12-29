// src/api/axios.js
// src/api/axios.js
import axios from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: 'http://81.70.219.168:8080',
    timeout: 100000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        // 从 localStorage 获取最新的 fuzhitoken
        const token = localStorage.getItem('fuzhitoken');
        if (token) {
            config.headers['fuzhitoken'] = `${token}`; // 将 token 添加到请求头
        }
        return config;
    },
    (error) => {
        // 对请求错误进行处理
        return Promise.reject(error);
    }
);

export default axiosInstance;

