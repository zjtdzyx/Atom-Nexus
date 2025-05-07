import { defineStore } from 'pinia';
import axios from 'axios';

// API 接口定义
export interface Api {
  id: string;
  name: string;
  path: string;
  method: string;
  description: string;
  category: string;
  authRequired: boolean;
  deprecated?: boolean;
  version: string;
  documentationUrl?: string;
}

// SDK 接口定义
export interface Sdk {
  id: string;
  name: string;
  language: string;
  version: string;
  downloadUrl: string;
  description: string;
  size: string;
  lastUpdated: string;
}

// 开发者注册信息接口
export interface DeveloperRegistration {
  name: string;
  email: string;
  organization?: string;
  purpose: string;
  applicationDescription: string;
  agreeToTerms: boolean;
}

// 开发者注册响应
export interface RegistrationResponse {
  success: boolean;
  apiKey?: string;
  message?: string;
}

// Store状态接口
interface DeveloperState {
  apis: Api[];
  sdks: Sdk[];
  loading: boolean;
  error: string | null;
  registrationResult: RegistrationResponse | null;
}

export const useDeveloperStore = defineStore('developer', {
  state: (): DeveloperState => ({
    apis: [],
    sdks: [],
    loading: false,
    error: null,
    registrationResult: null,
  }),

  getters: {
    getApis: (state) => state.apis,
    getApisByCategory: (state) => {
      const grouped: Record<string, Api[]> = {};
      state.apis.forEach((api) => {
        if (!grouped[api.category]) {
          grouped[api.category] = [];
        }
        grouped[api.category].push(api);
      });
      return grouped;
    },
    getSdks: (state) => state.sdks,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
    getRegistrationResult: (state) => state.registrationResult,
  },

  actions: {
    // 获取API列表
    async fetchApis() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/developer/apis');
        this.apis = response.data.data || [];
      } catch (error) {
        console.error('获取API列表失败:', error);
        this.error = error instanceof Error ? error.message : '获取API列表失败';
      } finally {
        this.loading = false;
      }
    },

    // 获取SDK信息
    async fetchSdkLink() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/developer/sdk');
        this.sdks = response.data.data || [];
      } catch (error) {
        console.error('获取SDK信息失败:', error);
        this.error = error instanceof Error ? error.message : '获取SDK信息失败';
      } finally {
        this.loading = false;
      }
    },

    // 注册开发者
    async registerDeveloper(registration: DeveloperRegistration) {
      this.loading = true;
      this.error = null;
      this.registrationResult = null;

      try {
        const response = await axios.post('/developer/register', registration);
        this.registrationResult = {
          success: true,
          apiKey: response.data.apiKey,
          message: response.data.message || '注册成功',
        };
        return this.registrationResult;
      } catch (error) {
        console.error('开发者注册失败:', error);
        this.error = error instanceof Error ? error.message : '开发者注册失败';
        this.registrationResult = {
          success: false,
          message: this.error,
        };
        return this.registrationResult;
      } finally {
        this.loading = false;
      }
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },

    // 清除注册结果
    clearRegistrationResult() {
      this.registrationResult = null;
    },
  },
});
