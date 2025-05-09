import { http } from '../utils/http';
import type { Identity } from '../stores/identity';

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
    return http.get('/api/identity');
  },

  /**
   * 获取身份详情
   * @param id 身份ID
   */
  getIdentityById(id: string): Promise<ApiResponse<Identity>> {
    return http.get(`/api/identity/${id}`);
  },

  /**
   * 创建新身份
   * @param identity 身份信息
   */
  createIdentity(data: Partial<Identity>): Promise<ApiResponse<Identity>> {
    return http.post('/api/identity', data);
  },

  /**
   * 更新身份信息
   * @param id 身份ID
   * @param identity 更新的身份信息
   */
  updateIdentity(id: string, data: Partial<Identity>): Promise<ApiResponse<Identity>> {
    return http.put(`/api/identity/${id}`, data);
  },

  /**
   * 删除身份
   * @param id 身份ID
   */
  deleteIdentity(id: string): Promise<ApiResponse<void>> {
    return http.delete(`/api/identity/${id}`);
  },

  /**
   * 绑定现有DID到身份
   * @param did DID标识符
   */
  bindIdentity(data: { did: string; alias: string }): Promise<ApiResponse<Identity>> {
    return http.post('/api/identity/bind', data);
  },

  /**
   * 解绑DID
   * @param identityId 身份ID
   */
  unbindIdentity(identityId: string): Promise<ApiResponse<void>> {
    return http.post(`/api/identity/${identityId}/unbind`);
  },

  /**
   * 设置默认身份
   * @param id 身份ID
   */
  setDefaultIdentity(id: string): Promise<ApiResponse<void>> {
    return http.put(`/api/identity/${id}/default`, {});
  },

  /**
   * 获取身份关联凭证
   * @param id 身份ID
   */
  getIdentityCredentials(id: string): Promise<ApiResponse<any[]>> {
    return http.get(`/api/identity/${id}/credentials`);
  },

  /**
   * 获取身份活动历史
   * @param id 身份ID
   * @param params 查询参数
   */
  getIdentityActivities(id: string, params?: any): Promise<ApiResponse<any[]>> {
    return http.get(`/api/identity/${id}/activities`, { params });
  },

  /**
   * 导出身份
   * @param id 身份ID
   */
  exportIdentity(id: string): Promise<ApiResponse<any>> {
    return http.get(`/api/identity/${id}/export`);
  },

  /**
   * 身份恢复
   * @param data 恢复数据
   */
  recoverIdentity(data: any): Promise<ApiResponse<Identity>> {
    return http.post('/api/identity/recover', data);
  },
};
