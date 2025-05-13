import { http } from '../utils/http';
import type { Identity, LoginHistory, IdentityProfile } from '../types/identity';
import { logger } from '../utils/logger';

// 统一API响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 身份管理API服务
 */
export const identityService = {
  /**
   * 获取用户身份列表
   */
  getIdentities(): Promise<ApiResponse<Identity[]>> {
    logger.info('API:Identity', '开始请求身份列表');
    try {
      return http.get('/api/identity');
    } catch (error: any) {
      logger.error('API:Identity', '获取身份列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取身份详情
   * @param id 身份ID
   */
  getIdentityById(id: string): Promise<ApiResponse<Identity>> {
    logger.info('API:Identity', '开始请求身份详情', { id });
    try {
      return http.get(`/api/identity/${id}`);
    } catch (error: any) {
      logger.error('API:Identity', '获取身份详情失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 创建新身份
   * @param identity 身份信息
   */
  createIdentity(data: Partial<Identity>): Promise<ApiResponse<Identity>> {
    logger.info('API:Identity', '开始创建身份', data);
    try {
      return http.post('/api/identity', data);
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
  updateIdentity(id: string, data: Partial<Identity>): Promise<ApiResponse<Identity>> {
    logger.info('API:Identity', '开始更新身份', { id, data });
    try {
      return http.put(`/api/identity/${id}`, data);
    } catch (error: any) {
      logger.error('API:Identity', '更新身份失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 删除身份
   * @param id 身份ID
   */
  deleteIdentity(id: string): Promise<ApiResponse<void>> {
    logger.info('API:Identity', '开始删除身份', { id });
    try {
      return http.delete(`/api/identity/${id}`);
    } catch (error: any) {
      logger.error('API:Identity', '删除身份失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 绑定现有DID到身份
   * @param did DID标识符
   */
  bindIdentity(data: { did: string; alias: string }): Promise<ApiResponse<Identity>> {
    logger.info('API:Identity', '开始绑定DID', data);
    try {
      return http.post('/api/identity/bind', data);
    } catch (error: any) {
      logger.error('API:Identity', '绑定DID失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 解绑DID
   * @param identityId 身份ID
   */
  unbindIdentity(identityId: string): Promise<ApiResponse<void>> {
    logger.info('API:Identity', '开始解绑DID', { identityId });
    try {
      return http.post(`/api/identity/${identityId}/unbind`);
    } catch (error: any) {
      logger.error('API:Identity', '解绑DID失败', { identityId, error: error.message });
      throw error;
    }
  },

  /**
   * 设置默认身份
   * @param id 身份ID
   */
  setDefaultIdentity(id: string): Promise<ApiResponse<void>> {
    logger.info('API:Identity', '开始设置默认身份', { id });
    try {
      return http.put(`/api/identity/${id}/default`, {});
    } catch (error: any) {
      logger.error('API:Identity', '设置默认身份失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取身份关联凭证
   * @param id 身份ID
   */
  getIdentityCredentials(id: string): Promise<ApiResponse<any[]>> {
    logger.info('API:Identity', '开始获取身份关联凭证', { id });
    try {
      return http.get(`/api/identity/${id}/credentials`);
    } catch (error: any) {
      logger.error('API:Identity', '获取身份关联凭证失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取身份活动历史
   * @param id 身份ID
   * @param params 查询参数
   */
  getIdentityActivities(id: string, params?: any): Promise<ApiResponse<any[]>> {
    logger.info('API:Identity', '开始获取身份活动历史', { id, params });
    try {
      return http.get(`/api/identity/${id}/activities`, { params });
    } catch (error: any) {
      logger.error('API:Identity', '获取身份活动历史失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取登录历史
   * @param id 身份ID
   */
  getLoginHistory(id: string): Promise<LoginHistory[]> {
    logger.info('API:Identity', '开始获取登录历史', { id });
    try {
      return http.get(`/api/identity/${id}/login-history`).then((res) => res.data);
    } catch (error: any) {
      logger.error('API:Identity', '获取登录历史失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取身份资料
   * @param id 身份ID
   */
  getProfile(id: string): Promise<IdentityProfile> {
    logger.info('API:Identity', '开始获取身份资料', { id });
    try {
      return http.get(`/api/identity/${id}/profile`).then((res) => res.data);
    } catch (error: any) {
      logger.error('API:Identity', '获取身份资料失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 更新身份资料
   * @param id 身份ID
   * @param data 资料数据
   */
  updateProfile(id: string, data: any): Promise<IdentityProfile> {
    logger.info('API:Identity', '开始更新身份资料', { id, data });
    try {
      return http.put(`/api/identity/${id}/profile`, data).then((res) => res.data);
    } catch (error: any) {
      logger.error('API:Identity', '更新身份资料失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 导出身份
   * @param id 身份ID
   */
  exportIdentity(id: string): Promise<ApiResponse<any>> {
    logger.info('API:Identity', '开始导出身份', { id });
    try {
      return http.get(`/api/identity/${id}/export`);
    } catch (error: any) {
      logger.error('API:Identity', '导出身份失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 身份恢复
   * @param data 恢复数据
   */
  recoverIdentity(data: any): Promise<ApiResponse<Identity>> {
    logger.info('API:Identity', '开始恢复身份', data);
    try {
      return http.post('/api/identity/recover', data);
    } catch (error: any) {
      logger.error('API:Identity', '恢复身份失败', { error: error.message });
      throw error;
    }
  },
};
