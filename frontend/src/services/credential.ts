import axios from 'axios';
import type { Credential, VerificationResult } from '@/types/credential';

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
  async getCredentials(page = 1, limit = 10): Promise<Credential[]> {
    const response = await axios.get(`${API_BASE_URL}/list`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * 获取凭证详情
   * @param id 凭证ID
   */
  async getCredentialById(id: string): Promise<Credential> {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * 颁发新凭证
   * @param credentialData 凭证数据
   */
  async issueCredential(credentialData: Partial<Credential>): Promise<Credential> {
    const response = await axios.post(`${API_BASE_URL}/issue`, credentialData);
    return response.data;
  },

  /**
   * 验证凭证
   * @param id 凭证ID
   */
  async verifyCredential(id: string): Promise<VerificationResult> {
    const response = await axios.post(`${API_BASE_URL}/${id}/verify`);
    return response.data;
  },

  /**
   * 撤销凭证
   * @param id 凭证ID
   * @param reason 撤销原因
   */
  async revokeCredential(id: string, reason?: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/${id}/revoke`, { reason });
  },

  /**
   * 更新凭证状态
   * @param id 凭证ID
   * @param status 新状态
   */
  async updateCredentialStatus(id: string, status: string): Promise<Credential> {
    const response = await axios.put(`${API_BASE_URL}/${id}/status`, { status });
    return response.data;
  },

  /**
   * 获取凭证模板列表
   */
  async getCredentialTemplates(): Promise<any[]> {
    const response = await axios.get(`${API_BASE_URL}/templates`);
    return response.data;
  },

  /**
   * 根据模板创建凭证
   * @param templateId 模板ID
   * @param data 凭证数据
   */
  async createCredentialFromTemplate(templateId: string, data: any): Promise<Credential> {
    const response = await axios.post(`${API_BASE_URL}/templates/${templateId}/create`, data);
    return response.data;
  },
};
