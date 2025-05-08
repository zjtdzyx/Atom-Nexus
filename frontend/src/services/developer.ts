import axios from 'axios';
import type { ApiDocument, SdkInfo } from '@/types/developer';

const API_BASE_URL = '/api/developer';

/**
 * 开发者工具API服务
 */
export const developerService = {
  /**
   * 获取API文档
   */
  async getApiDocumentation(): Promise<ApiDocument> {
    const response = await axios.get(`${API_BASE_URL}/api-docs`);
    return response.data;
  },

  /**
   * 获取SDK列表
   */
  async getSdkList(): Promise<SdkInfo[]> {
    const response = await axios.get(`${API_BASE_URL}/sdk`);
    return response.data;
  },

  /**
   * 获取SDK详情
   * @param id SDK ID
   */
  async getSdkById(id: string): Promise<SdkInfo> {
    const response = await axios.get(`${API_BASE_URL}/sdk/${id}`);
    return response.data;
  },

  /**
   * 获取SDK下载链接
   * @param id SDK ID
   * @param version 版本号
   */
  async getSdkDownloadUrl(id: string, version: string): Promise<string> {
    const response = await axios.get(`${API_BASE_URL}/sdk/${id}/download`, {
      params: { version },
    });
    return response.data.downloadUrl;
  },

  /**
   * 获取示例项目列表
   */
  async getExampleProjects(): Promise<any[]> {
    const response = await axios.get(`${API_BASE_URL}/examples`);
    return response.data;
  },

  /**
   * 获取示例项目详情
   * @param id 示例项目ID
   */
  async getExampleProjectById(id: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/examples/${id}`);
    return response.data;
  },

  /**
   * 获取API密钥列表
   */
  async getApiKeys(): Promise<any[]> {
    const response = await axios.get(`${API_BASE_URL}/api-keys`);
    return response.data;
  },

  /**
   * 创建新的API密钥
   * @param name 密钥名称
   * @param permissions 权限范围
   */
  async createApiKey(name: string, permissions: string[]): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/api-keys`, {
      name,
      permissions,
    });
    return response.data;
  },

  /**
   * 删除API密钥
   * @param id 密钥ID
   */
  async deleteApiKey(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api-keys/${id}`);
  },
};
