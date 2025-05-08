import axios from 'axios';
import type { ApiDocument, SdkInfo } from '@/types/developer';
import { logger } from '@/utils/logger';

const API_BASE_URL = '/api/developer';

/**
 * 开发者工具API服务
 */
export const developerService = {
  /**
   * 获取API文档
   */
  async getApiDocumentation(): Promise<ApiDocument> {
    logger.info('API:Developer', '开始请求API文档');
    try {
      const response = await axios.get(`${API_BASE_URL}/api-docs`);
      logger.info('API:Developer', '请求API文档成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Developer', '请求API文档失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取SDK列表
   */
  async getSdkList(): Promise<SdkInfo[]> {
    logger.info('API:Developer', '开始请求SDK列表');
    try {
      const response = await axios.get(`${API_BASE_URL}/sdk`);
      logger.info('API:Developer', '请求SDK列表成功', { count: response.data.length });
      return response.data;
    } catch (error: any) {
      logger.error('API:Developer', '请求SDK列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取SDK详情
   * @param id SDK ID
   */
  async getSdkById(id: string): Promise<SdkInfo> {
    logger.info('API:Developer', '开始请求SDK详情', { id });
    try {
      const response = await axios.get(`${API_BASE_URL}/sdk/${id}`);
      logger.info('API:Developer', '请求SDK详情成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Developer', '请求SDK详情失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取SDK下载链接
   * @param id SDK ID
   * @param version 版本号
   */
  async getSdkDownloadUrl(id: string, version: string): Promise<string> {
    logger.info('API:Developer', '开始请求SDK下载链接', { id, version });
    try {
      const response = await axios.get(`${API_BASE_URL}/sdk/${id}/download`, {
        params: { version },
      });
      logger.info('API:Developer', '请求SDK下载链接成功');
      return response.data.downloadUrl;
    } catch (error: any) {
      logger.error('API:Developer', '请求SDK下载链接失败', { id, version, error: error.message });
      throw error;
    }
  },

  /**
   * 获取示例项目列表
   */
  async getExampleProjects(): Promise<any[]> {
    logger.info('API:Developer', '开始请求示例项目列表');
    try {
      const response = await axios.get(`${API_BASE_URL}/examples`);
      logger.info('API:Developer', '请求示例项目列表成功', { count: response.data.length });
      return response.data;
    } catch (error: any) {
      logger.error('API:Developer', '请求示例项目列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取示例项目详情
   * @param id 示例项目ID
   */
  async getExampleProjectById(id: string): Promise<any> {
    logger.info('API:Developer', '开始请求示例项目详情', { id });
    try {
      const response = await axios.get(`${API_BASE_URL}/examples/${id}`);
      logger.info('API:Developer', '请求示例项目详情成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Developer', '请求示例项目详情失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取API密钥列表
   */
  async getApiKeys(): Promise<any[]> {
    logger.info('API:Developer', '开始请求API密钥列表');
    try {
      const response = await axios.get(`${API_BASE_URL}/api-keys`);
      logger.info('API:Developer', '请求API密钥列表成功', { count: response.data.length });
      return response.data;
    } catch (error: any) {
      logger.error('API:Developer', '请求API密钥列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 创建新的API密钥
   * @param name 密钥名称
   * @param permissions 权限范围
   */
  async createApiKey(name: string, permissions: string[]): Promise<any> {
    logger.info('API:Developer', '开始创建API密钥', { name, permissions });
    try {
      const response = await axios.post(`${API_BASE_URL}/api-keys`, {
        name,
        permissions,
      });
      logger.info('API:Developer', '创建API密钥成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Developer', '创建API密钥失败', { name, error: error.message });
      throw error;
    }
  },

  /**
   * 删除API密钥
   * @param id 密钥ID
   */
  async deleteApiKey(id: string): Promise<void> {
    logger.info('API:Developer', '开始删除API密钥', { id });
    try {
      await axios.delete(`${API_BASE_URL}/api-keys/${id}`);
      logger.info('API:Developer', '删除API密钥成功');
    } catch (error: any) {
      logger.error('API:Developer', '删除API密钥失败', { id, error: error.message });
      throw error;
    }
  },
};
