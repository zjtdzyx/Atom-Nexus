import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SDKConfig, ApiResponse } from '../types';

export class ApiClient {
  private client: AxiosInstance;
  private config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: config.options?.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey || '',
      },
    });

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleApiError(error)
    );
  }

  /**
   * 发送GET请求
   */
  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = { params };
      const response: AxiosResponse = await this.client.get(url, config);
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.formatError<T>(error);
    }
  }

  /**
   * 发送POST请求
   */
  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.post(url, data);
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.formatError<T>(error);
    }
  }

  /**
   * 发送PUT请求
   */
  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.put(url, data);
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.formatError<T>(error);
    }
  }

  /**
   * 发送DELETE请求
   */
  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.delete(url);
      return this.formatResponse<T>(response);
    } catch (error) {
      return this.formatError<T>(error);
    }
  }

  /**
   * 处理API错误
   */
  private handleApiError(error: any): Promise<never> {
    if (error.response && error.response.status === 401) {
      // 处理认证错误
      // 如果需要，可以在这里添加token刷新逻辑
    }
    return Promise.reject(error);
  }

  /**
   * 格式化API响应
   */
  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data,
    };
  }

  /**
   * 格式化API错误
   */
  private formatError<T>(error: any): ApiResponse<T> {
    const errorResponse: ApiResponse<T> = {
      success: false,
      error: {
        code: 'unknown_error',
        message: 'An unknown error occurred',
      },
    };

    if (error.response) {
      // 处理服务器返回的错误
      const { data } = error.response;
      if (data.error) {
        errorResponse.error = data.error;
      } else {
        errorResponse.error = {
          code: `http_${error.response.status}`,
          message: data.message || error.message || 'Server error',
        };
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorResponse.error = {
        code: 'network_error',
        message: 'No response received from server',
      };
    } else {
      // 发送请求时出错
      errorResponse.error = {
        code: 'request_error',
        message: error.message || 'Error setting up request',
      };
    }

    return errorResponse;
  }
} 