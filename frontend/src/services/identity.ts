import axios from 'axios';
import type { Identity, LoginHistory, IdentityProfile } from '@/types/identity';
import { logger } from '@/utils/logger';

const API_BASE_URL = '/api/identity';

/**
 * 身份管理API服务
 */
export const identityService = {
  /**
   * 获取用户身份列表
   */
  async getIdentities(): Promise<Identity[]> {
    logger.info('API:Identity', '开始请求身份列表');
    try {
      const response = await axios.get(`${API_BASE_URL}/list`);
      logger.info('API:Identity', '请求身份列表成功', { count: response.data.length });
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '请求身份列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取身份详情
   * @param id 身份ID
   */
  async getIdentityById(id: string): Promise<Identity> {
    logger.info('API:Identity', '开始请求身份详情', { id });
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      logger.info('API:Identity', '请求身份详情成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '请求身份详情失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 创建新身份
   * @param identity 身份信息
   */
  async createIdentity(identity: Partial<Identity>): Promise<Identity> {
    logger.info('API:Identity', '开始创建身份', { identity });
    try {
      const response = await axios.post(`${API_BASE_URL}`, identity);
      logger.info('API:Identity', '创建身份成功', { id: response.data.id });
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '创建身份失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 更新身份信息
   * @param id 身份ID
   * @param identity 更新的身份信息
   */
  async updateIdentity(id: string, identity: Partial<Identity>): Promise<Identity> {
    logger.info('API:Identity', '开始更新身份', { id });
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, identity);
      logger.info('API:Identity', '更新身份成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '更新身份失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 删除身份
   * @param id 身份ID
   */
  async deleteIdentity(id: string): Promise<void> {
    logger.info('API:Identity', '开始删除身份', { id });
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      logger.info('API:Identity', '删除身份成功');
    } catch (error: any) {
      logger.error('API:Identity', '删除身份失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取登录历史记录
   * @param identityId 身份ID
   * @param page 页码
   * @param limit 每页条数
   */
  async getLoginHistory(identityId: string, page = 1, limit = 10): Promise<LoginHistory[]> {
    logger.info('API:Identity', '开始请求登录历史', { identityId, page, limit });
    try {
      const response = await axios.get(`${API_BASE_URL}/${identityId}/login-history`, {
        params: { page, limit },
      });
      logger.info('API:Identity', '请求登录历史成功', { count: response.data.length });
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '请求登录历史失败', { identityId, error: error.message });
      throw error;
    }
  },

  /**
   * 获取身份资料
   * @param identityId 身份ID
   */
  async getProfile(identityId: string): Promise<IdentityProfile> {
    logger.info('API:Identity', '开始请求身份资料', { identityId });
    try {
      const response = await axios.get(`${API_BASE_URL}/${identityId}/profile`);
      logger.info('API:Identity', '请求身份资料成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '请求身份资料失败', { identityId, error: error.message });
      throw error;
    }
  },

  /**
   * 更新身份资料
   * @param identityId 身份ID
   * @param profileData 资料数据
   */
  async updateProfile(identityId: string, profileData: IdentityProfile): Promise<IdentityProfile> {
    logger.info('API:Identity', '开始更新身份资料', { identityId });
    try {
      const response = await axios.put(`${API_BASE_URL}/${identityId}/profile`, profileData);
      logger.info('API:Identity', '更新身份资料成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '更新身份资料失败', { identityId, error: error.message });
      throw error;
    }
  },

  /**
   * 绑定现有DID到身份
   * @param did DID标识符
   */
  async bindDid(did: string): Promise<Identity> {
    logger.info('API:Identity', '开始绑定DID', { did });
    try {
      const response = await axios.post(`${API_BASE_URL}/bind`, { did });
      logger.info('API:Identity', '绑定DID成功', { id: response.data.id });
      return response.data;
    } catch (error: any) {
      logger.error('API:Identity', '绑定DID失败', { did, error: error.message });
      throw error;
    }
  },

  /**
   * 解绑DID
   * @param identityId 身份ID
   */
  async unbindDid(identityId: string): Promise<void> {
    logger.info('API:Identity', '开始解绑DID', { identityId });
    try {
      await axios.post(`${API_BASE_URL}/${identityId}/unbind`);
      logger.info('API:Identity', '解绑DID成功');
    } catch (error: any) {
      logger.error('API:Identity', '解绑DID失败', { identityId, error: error.message });
      throw error;
    }
  },
};
