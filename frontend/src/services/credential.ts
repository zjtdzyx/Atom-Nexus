import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Credential, VerificationResult, CredentialTemplate } from '@/types/credential';
import { logger } from '@/utils/logger';

const API_BASE_URL = '/api/credential';

/**
 * 凭证管理API服务
 */
export const credentialService = {
  /**
   * 获取凭证列表
   * @param page 页码
   * @param limit 每页条数
   */
  async getCredentials(page = 1, limit = 10): Promise<AxiosResponse<Credential[]>> {
    logger.info('API:Credential', '开始请求凭证列表', { page, limit });
    try {
      const response = await axios.get(`${API_BASE_URL}/list`, {
        params: { page, limit },
      });
      logger.info('API:Credential', '请求凭证列表成功', { count: response.data.length });
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '请求凭证列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取凭证详情
   * @param id 凭证ID
   */
  async getCredentialById(id: string): Promise<AxiosResponse<Credential>> {
    logger.info('API:Credential', '开始请求凭证详情', { id });
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      logger.info('API:Credential', '请求凭证详情成功');
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '请求凭证详情失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 颁发新凭证
   * @param credentialData 凭证数据
   */
  async issueCredential(credentialData: Partial<Credential>): Promise<AxiosResponse<Credential>> {
    logger.info('API:Credential', '开始颁发凭证');
    try {
      const response = await axios.post(`${API_BASE_URL}/issue`, credentialData);
      logger.info('API:Credential', '颁发凭证成功', { id: response.data.id });
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '颁发凭证失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 验证凭证
   * @param id 凭证ID
   */
  async verifyCredential(id: string): Promise<AxiosResponse<VerificationResult>> {
    logger.info('API:Credential', '开始验证凭证', { id });
    try {
      const response = await axios.post(`${API_BASE_URL}/${id}/verify`);
      logger.info('API:Credential', '验证凭证成功', { result: response.data.isValid });
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '验证凭证失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 撤销凭证
   * @param id 凭证ID
   * @param reason 撤销原因
   */
  async revokeCredential(id: string, reason?: string): Promise<AxiosResponse<void>> {
    logger.info('API:Credential', '开始撤销凭证', { id, reason });
    try {
      const response = await axios.post(`${API_BASE_URL}/${id}/revoke`, { reason });
      logger.info('API:Credential', '撤销凭证成功');
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '撤销凭证失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 更新凭证状态
   * @param id 凭证ID
   * @param status 新状态
   */
  async updateCredentialStatus(id: string, status: string): Promise<AxiosResponse<Credential>> {
    logger.info('API:Credential', '开始更新凭证状态', { id, status });
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}/status`, { status });
      logger.info('API:Credential', '更新凭证状态成功');
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '更新凭证状态失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取凭证模板列表
   */
  async getCredentialTemplates(): Promise<AxiosResponse<CredentialTemplate[]>> {
    logger.info('API:Credential', '开始请求凭证模板列表');
    try {
      const response = await axios.get(`${API_BASE_URL}/templates`);
      logger.info('API:Credential', '请求凭证模板列表成功', { count: response.data.length });
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '请求凭证模板列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 根据模板创建凭证
   * @param templateId 模板ID
   * @param data 凭证数据
   */
  async createCredentialFromTemplate(
    templateId: string,
    data: any
  ): Promise<AxiosResponse<Credential>> {
    logger.info('API:Credential', '开始基于模板创建凭证', { templateId });
    try {
      const response = await axios.post(`${API_BASE_URL}/templates/${templateId}/create`, data);
      logger.info('API:Credential', '基于模板创建凭证成功', { id: response.data.id });
      return response;
    } catch (error: any) {
      logger.error('API:Credential', '基于模板创建凭证失败', { templateId, error: error.message });
      throw error;
    }
  },
};
