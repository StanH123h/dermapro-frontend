import axios from 'axios';
import { Toast } from '@douyinfe/semi-ui';

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: 'https://fuzhi.space/api',
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
        console.error('请求拦截器错误:', error);
        Toast.error('请求发送失败，请检查网络连接');
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        // 对响应数据进行处理
        return response.data;
    },
    (error) => {
        if(error.response.data.code===1005){
            return;
        }
        if (error.response) {
            // 获取错误状态码
            const status = error.response.status;

            // 根据错误状态码处理错误
            switch (status) {
                case 400:
                    Toast.error('发生错误，请刷新页面或稍后再尝试');
                    break;
                case 401:
                    Toast.warning('您未登陆,即将跳转至登录页面');
                    setTimeout(()=>{
                        // 清除过期的 token
                        localStorage.removeItem('fuzhitoken');
                        // 导航到 /login
                        window.location.href = '/login';
                    },1000)
                    break;
                case 403:
                    Toast.warning('您未登陆,即将跳转至登录页面');
                    setTimeout(()=>{
                        // 清除过期的 token
                        localStorage.removeItem('fuzhitoken');
                        // 导航到 /login
                        window.location.href = '/login';
                    },1000)
                    break;
                case 404:
                    Toast.error('发生错误，请刷新页面或稍后再尝试');
                    break;
                case 500:
                    Toast.error('发生错误，请刷新页面或稍后再尝试');
                    break;
                case 502:
                    Toast.error('发生错误，请刷新页面或稍后再尝试');
                    break;
                case 503:
                    Toast.error('发生错误，请刷新页面或稍后再尝试');
                    break;
                case 504:
                    Toast.error('发生错误，请刷新页面或稍后再尝试');
                    break;
                default:
                    Toast.error(`发生错误，请刷新页面或稍后再尝试`);
            }
        } else {
            // 无响应或其他错误
            Toast.error('网络错误或服务器无响应，请检查网络连接');
        }

        // 记录错误而不抛出全屏错误
        console.error('响应拦截器捕获错误:', error);

        // 返回 Promise.reject，以便让调用方处理错误（如果需要）
        return Promise.reject(error);
    }
);

export default axiosInstance;