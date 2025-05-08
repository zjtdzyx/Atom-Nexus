import { defineStore } from 'pinia';
import { developerService } from '@/services/developer';
import type { ApiDocument, SdkInfo, ExampleProject, ApiKey } from '@/types/developer';
import { logger } from '@/utils/logger';

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

      logger.info('Store:Developer', '开始获取API文档');

      try {
        this.apiDocumentation = await developerService.getApiDocumentation();
        logger.info('Store:Developer', 'API文档获取成功');
      } catch (error: any) {
        this.error = error.message || '获取API文档失败';
        logger.error('Store:Developer', 'API文档获取失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async fetchSdkList() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Developer', '开始获取SDK列表');

      try {
        this.sdkList = await developerService.getSdkList();
        logger.info('Store:Developer', 'SDK列表获取成功', { count: this.sdkList.length });
      } catch (error: any) {
        this.error = error.message || '获取SDK列表失败';
        logger.error('Store:Developer', 'SDK列表获取失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async fetchSdkById(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Developer', '开始获取SDK详情', { id });

      try {
        this.currentSdk = await developerService.getSdkById(id);
        logger.info('Store:Developer', 'SDK详情获取成功');
      } catch (error: any) {
        this.error = error.message || '获取SDK详情失败';
        logger.error('Store:Developer', 'SDK详情获取失败', { id, error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async getSdkDownloadUrl(id: string, version: string): Promise<string | null> {
      this.loading = true;
      this.error = null;

      logger.info('Store:Developer', '开始获取SDK下载链接', { id, version });

      try {
        const url = await developerService.getSdkDownloadUrl(id, version);
        logger.info('Store:Developer', 'SDK下载链接获取成功');
        return url;
      } catch (error: any) {
        this.error = error.message || '获取SDK下载链接失败';
        logger.error('Store:Developer', 'SDK下载链接获取失败', {
          id,
          version,
          error: error.message,
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchExampleProjects() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Developer', '开始获取示例项目列表');

      try {
        this.exampleProjects = await developerService.getExampleProjects();
        logger.info('Store:Developer', '示例项目列表获取成功', {
          count: this.exampleProjects.length,
        });
      } catch (error: any) {
        this.error = error.message || '获取示例项目列表失败';
        logger.error('Store:Developer', '示例项目列表获取失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async fetchApiKeys() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Developer', '开始获取API密钥列表');

      try {
        this.apiKeys = await developerService.getApiKeys();
        logger.info('Store:Developer', 'API密钥列表获取成功', { count: this.apiKeys.length });
      } catch (error: any) {
        this.error = error.message || '获取API密钥列表失败';
        logger.error('Store:Developer', 'API密钥列表获取失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async createApiKey(name: string, permissions: string[]) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Developer', '开始创建API密钥', { name, permissions });

      try {
        const apiKey = await developerService.createApiKey(name, permissions);
        this.apiKeys.push(apiKey);
        logger.info('Store:Developer', 'API密钥创建成功', { id: apiKey.id });
        return apiKey;
      } catch (error: any) {
        this.error = error.message || '创建API密钥失败';
        logger.error('Store:Developer', 'API密钥创建失败', { name, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteApiKey(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Developer', '开始删除API密钥', { id });

      try {
        await developerService.deleteApiKey(id);
        this.apiKeys = this.apiKeys.filter((key) => key.id !== id);
        logger.info('Store:Developer', 'API密钥删除成功');
      } catch (error: any) {
        this.error = error.message || '删除API密钥失败';
        logger.error('Store:Developer', 'API密钥删除失败', { id, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      logger.info('Store:Developer', '重置开发者状态');
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
