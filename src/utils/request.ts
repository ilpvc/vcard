import axios from 'axios';
import config from '../config/index'

// 创建 axios 实例
const instance = axios.create({
    baseURL: config.baseUrl, // 后端 API 地址
    timeout: 5000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 可在此添加 token 等信息
        console.log('Request:', config);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response.data; // 返回数据部分
    },
    error => {
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

export default instance;
