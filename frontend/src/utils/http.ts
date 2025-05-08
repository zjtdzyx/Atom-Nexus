import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 记录请求日志
    logger.info('HTTP', `发起请求: ${config.method?.toUpperCase()} ${config.url}`, {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
    });

    // 从pinia获取token（在组件外获取）
    const authStore = useAuthStore();
    const token = authStore.accessToken;

    // 如果有token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    logger.error('HTTP', '请求配置错误', { error: error.message });
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 记录成功响应日志
    logger.info(
      'HTTP',
      `请求成功: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        url: response.config.url,
      }
    );

    // 直接返回数据
    return response;
  },
  async (error: AxiosError) => {
    if (!error.response) {
      logger.error('HTTP', '网络错误', { error: error.message });
      return Promise.reject(new Error('网络错误，请检查您的网络连接'));
    }

    const { status, data } = error.response as AxiosResponse;

    // 记录错误响应日志
    logger.error('HTTP', `请求失败: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status,
      url: error.config?.url,
      data,
    });

    // 根据状态码处理不同错误
    switch (status) {
      case 400:
        // Bad Request
        return Promise.reject(new Error(data.message || '请求参数错误'));

      case 401: {
        // 未授权或token过期
        const authStore = useAuthStore();

        logger.warn('HTTP', 'Token失效，尝试刷新');

        // 尝试刷新token
        const refreshSuccess = await authStore.refreshAuthToken();

        // 如果刷新成功，重试原始请求
        if (refreshSuccess && error.config) {
          logger.info('HTTP', 'Token刷新成功，重试请求');
          return http(error.config);
        }

        // 刷新失败，跳转登录页
        logger.warn('HTTP', 'Token刷新失败，重定向到登录页面');
        authStore.logoutUser();
        window.location.href = '/auth/login';
        return Promise.reject(new Error('登录已过期，请重新登录'));
      }

      case 403:
        // 权限不足
        return Promise.reject(new Error(data.message || '您没有权限执行此操作'));

      case 404:
        // 资源不存在
        return Promise.reject(new Error(data.message || '请求的资源不存在'));

      case 500:
        // 服务器错误
        return Promise.reject(new Error(data.message || '服务器错误，请稍后重试'));

      default:
        return Promise.reject(new Error(data.message || `请求失败(${status})`));
    }
  }
);

// 封装GET请求
export const get = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return http.get<T>(url, config);
};

// 封装POST请求
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return http.post<T>(url, data, config);
};

// 封装PUT请求
export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return http.put<T>(url, data, config);
};

// 封装DELETE请求
export const del = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return http.delete<T>(url, config);
};

// 默认导出
export default {
  get,
  post,
  put,
  delete: del,
  instance: http,
};
