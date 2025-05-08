import { defineStore } from 'pinia';
import { developerService } from '@/services/developer';
import type { ApiDocument, SdkInfo, ExampleProject, ApiKey } from '@/types/developer';

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

interface DeveloperState {
  apiDocumentation: ApiDocument | null;
  sdkList: SdkInfo[];
  currentSdk: SdkInfo | null;
  exampleProjects: ExampleProject[];
  apiKeys: ApiKey[];
  loading: boolean;
  error: string | null;
}

export const useDeveloperStore = defineStore('developer', {
  state: (): DeveloperState => ({
    apiDocumentation: null,
    sdkList: [],
    currentSdk: null,
    exampleProjects: [],
    apiKeys: [],
    loading: false,
    error: null,
  }),

  getters: {
    getSdkById: (state) => (id: string) => {
      return state.sdkList.find((sdk) => sdk.id === id) || null;
    },

    getExampleProjectById: (state) => (id: string) => {
      return state.exampleProjects.find((project) => project.id === id) || null;
    },
  },

  actions: {
    async fetchApiDocumentation() {
      this.loading = true;
      this.error = null;

      try {
        this.apiDocumentation = await developerService.getApiDocumentation();
      } catch (error: any) {
        this.error = error.message || '获取API文档失败';
        console.error('获取API文档失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSdkList() {
      this.loading = true;
      this.error = null;

      try {
        this.sdkList = await developerService.getSdkList();
      } catch (error: any) {
        this.error = error.message || '获取SDK列表失败';
        console.error('获取SDK列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSdkById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        this.currentSdk = await developerService.getSdkById(id);
      } catch (error: any) {
        this.error = error.message || '获取SDK详情失败';
        console.error('获取SDK详情失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async getSdkDownloadUrl(id: string, version: string): Promise<string | null> {
      this.loading = true;
      this.error = null;

      try {
        return await developerService.getSdkDownloadUrl(id, version);
      } catch (error: any) {
        this.error = error.message || '获取SDK下载链接失败';
        console.error('获取SDK下载链接失败:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchExampleProjects() {
      this.loading = true;
      this.error = null;

      try {
        this.exampleProjects = await developerService.getExampleProjects();
      } catch (error: any) {
        this.error = error.message || '获取示例项目列表失败';
        console.error('获取示例项目列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchApiKeys() {
      this.loading = true;
      this.error = null;

      try {
        this.apiKeys = await developerService.getApiKeys();
      } catch (error: any) {
        this.error = error.message || '获取API密钥列表失败';
        console.error('获取API密钥列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async createApiKey(name: string, permissions: string[]) {
      this.loading = true;
      this.error = null;

      try {
        const apiKey = await developerService.createApiKey(name, permissions);
        this.apiKeys.push(apiKey);
        return apiKey;
      } catch (error: any) {
        this.error = error.message || '创建API密钥失败';
        console.error('创建API密钥失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteApiKey(id: string) {
      this.loading = true;
      this.error = null;

      try {
        await developerService.deleteApiKey(id);
        this.apiKeys = this.apiKeys.filter((key) => key.id !== id);
      } catch (error: any) {
        this.error = error.message || '删除API密钥失败';
        console.error('删除API密钥失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      this.apiDocumentation = null;
      this.sdkList = [];
      this.currentSdk = null;
      this.exampleProjects = [];
      this.apiKeys = [];
      this.loading = false;
      this.error = null;
    },
  },
});
