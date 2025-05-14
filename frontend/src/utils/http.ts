import axios from 'axios';
import { logger } from './logger';

// 记录API基本URL配置，便于调试
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
logger.info('API:Config', `API基本URL: ${apiBaseUrl || '(未设置，使用相对路径)'}`);

// 创建axios实例
const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 确保API路径前缀正确
    if (config.url && !config.url.startsWith('/api/')) {
      config.url = `/api${config.url}`;
    }

    // 详细的请求日志，包括完整URL
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    logger.info('API:Request', `开始请求: ${config.method?.toUpperCase()} ${fullUrl}`, {
      fullUrl,
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      params: config.params,
      data: config.data,
    });

    // 从本地存储获取token
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      logger.debug('API:Auth', '添加认证令牌到请求头');
    } else if (!token) {
      logger.debug('API:Auth', '请求不含认证令牌');
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
    const fullUrl = response.config.baseURL
      ? `${response.config.baseURL}${response.config.url}`
      : response.config.url;
    logger.info('API:Response', `请求成功: ${response.config.method?.toUpperCase()} ${fullUrl}`, {
      fullUrl,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    // 返回响应数据而不是整个响应对象
    return response.data;
  },
  async (error) => {
    // 记录详细的响应错误日志
    const fullUrl = error.config?.baseURL
      ? `${error.config.baseURL}${error.config.url}`
      : error.config?.url;
    logger.error('API:Response', '请求失败', {
      fullUrl,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // 处理特定HTTP状态码
    if (error.response) {
      const status = error.response.status;

      // 处理401未授权错误
      if (status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            logger.info('API:Auth', '尝试刷新令牌');

            // 刷新令牌的逻辑
            const response = await axios.post(`${apiBaseUrl}/api/auth/refresh-token`, {
              refreshToken,
            });

            if (response.data && response.data.accessToken) {
              // 保存新令牌
              localStorage.setItem('accessToken', response.data.accessToken);

              // 重试原请求
              const config = error.config;
              config.headers.Authorization = `Bearer ${response.data.accessToken}`;
              logger.info('API:Auth', '令牌已刷新，重试原请求');
              return axios(config);
            }
          } catch (refreshError) {
            logger.error('API:Auth', '刷新令牌失败', refreshError);
            // 刷新失败，重定向到登录页
            window.location.href = '/auth/login?error=token_refresh_failed';
          }
        } else {
          // 没有刷新令牌，必须重新登录
          logger.warn('API:Response', '用户未授权，需要重新登录');
          window.location.href = '/auth/login?error=unauthorized';
        }
      }
      // 权限不足
      else if (status === 403) {
        logger.warn('API:Response', '权限不足，无法访问资源');
        window.location.href = '/auth/login?error=forbidden';
      }
      // 资源不存在
      else if (status === 404) {
        logger.warn('API:Response', `请求的资源不存在: ${fullUrl}`);
      }
      // 服务器错误
      else if (status === 500) {
        logger.error('API:Response', `服务器内部错误: ${fullUrl}`);
      }
      // 其他错误
      else {
        logger.warn('API:Response', `未处理的HTTP错误状态码: ${status}`);
      }

      // 优先使用服务器返回的错误信息
      if (error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      logger.error('API:Response', `未收到服务器响应: ${fullUrl}`, {
        request: error.request,
      });
      error.message = '服务器未响应，请检查网络连接';
    } else {
      // 请求配置错误
      logger.error('API:Response', '请求配置错误', {
        error: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// 创建一个重试请求的包装函数
const withRetry = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.response?.status >= 500 || !error.response)) {
      logger.warn('API:Retry', `请求失败，将在${delay}ms后重试，剩余重试次数: ${retries - 1}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// 导出增强的HTTP客户端
export const httpWithRetry = {
  get: (url: string, config?: any) => withRetry(() => http.get(url, config)),
  post: (url: string, data?: any, config?: any) => withRetry(() => http.post(url, data, config)),
  put: (url: string, data?: any, config?: any) => withRetry(() => http.put(url, data, config)),
  delete: (url: string, config?: any) => withRetry(() => http.delete(url, config)),
};

export { http };
