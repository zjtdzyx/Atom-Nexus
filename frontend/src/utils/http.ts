import axios from 'axios';
import { logger } from './logger';

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 记录请求日志
    logger.info('API:Request', `开始请求: ${config.method?.toUpperCase()} ${config.url}`, {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    });

    // 从本地存储获取token
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    logger.error('API:Request', '请求配置错误', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 记录响应成功日志
    logger.info(
      'API:Response',
      `请求成功: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      }
    );

    // 如果是标准响应格式，检查code
    if (response.data && typeof response.data.code !== 'undefined') {
      // 如果业务状态码不为0，说明有业务错误
      if (response.data.code !== 0) {
        const error = new Error(response.data.message || '未知错误');
        return Promise.reject(error);
      }
    }

    return response.data;
  },
  (error) => {
    // 记录响应错误日志
    logger.error('API:Response', '请求失败', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // 处理特定HTTP状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，可能需要重新登录
          window.location.href = '/auth/login';
          break;
        case 403:
          // 权限不足
          break;
        case 404:
          // 资源不存在
          break;
        case 500:
          // 服务器错误
          break;
        default:
          break;
      }

      // 优先使用服务器返回的错误信息
      if (error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
      }
    }

    return Promise.reject(error);
  }
);

export { http };
