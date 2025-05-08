import axios from 'axios';
import type { Identity, LoginHistory } from '@/types/identity';

const API_BASE_URL = '/api/identity';

/**
 * 身份管理API服务
 */
export const identityService = {
  /**
   * 获取用户身份列表
   */
  async getIdentities(): Promise<Identity[]> {
    const response = await axios.get(`${API_BASE_URL}/list`);
    return response.data;
  },

  /**
   * 获取身份详情
   * @param id 身份ID
   */
  async getIdentityById(id: string): Promise<Identity> {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * 创建新身份
   * @param identity 身份信息
   */
  async createIdentity(identity: Partial<Identity>): Promise<Identity> {
    const response = await axios.post(`${API_BASE_URL}`, identity);
    return response.data;
  },

  /**
   * 更新身份信息
   * @param id 身份ID
   * @param identity 更新的身份信息
   */
  async updateIdentity(id: string, identity: Partial<Identity>): Promise<Identity> {
    const response = await axios.put(`${API_BASE_URL}/${id}`, identity);
    return response.data;
  },

  /**
   * 删除身份
   * @param id 身份ID
   */
  async deleteIdentity(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  /**
   * 获取登录历史记录
   * @param identityId 身份ID
   * @param page 页码
   * @param limit 每页条数
   */
  async getLoginHistory(identityId: string, page = 1, limit = 10): Promise<LoginHistory[]> {
    const response = await axios.get(`${API_BASE_URL}/${identityId}/login-history`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * 获取身份资料
   * @param identityId 身份ID
   */
  async getProfile(identityId: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/${identityId}/profile`);
    return response.data;
  },

  /**
   * 更新身份资料
   * @param identityId 身份ID
   * @param profileData 资料数据
   */
  async updateProfile(identityId: string, profileData: any): Promise<any> {
    const response = await axios.put(`${API_BASE_URL}/${identityId}/profile`, profileData);
    return response.data;
  },
};
