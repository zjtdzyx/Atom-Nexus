import { http } from '../utils/http';
import type { Credential, VerifyResult } from '../stores/credential';

// 统一API响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 凭证管理API服务
 */
export const credentialService = {
  /**
   * 获取凭证列表
   * @param params 查询参数
   */
  getCredentials(params?: any): Promise<ApiResponse<Credential[]>> {
    return http.get('/api/credential', { params });
  },

  /**
   * 获取凭证详情
   * @param id 凭证ID
   */
  getCredentialById(id: string): Promise<ApiResponse<Credential>> {
    return http.get(`/api/credential/${id}`);
  },

  /**
   * 颁发新凭证
   * @param data 凭证数据
   */
  issueCredential(data: any): Promise<ApiResponse<Credential>> {
    return http.post('/api/credential/issue', data);
  },

  /**
   * 验证凭证
   * @param id 凭证ID
   */
  verifyCredential(id: string): Promise<ApiResponse<VerifyResult>> {
    return http.post(`/api/credential/${id}/verify`);
  },

  /**
   * 验证凭证（通过上传JSON）
   * @param credentialJson 凭证JSON
   */
  verifyCredentialJson(credentialJson: any): Promise<ApiResponse<VerifyResult>> {
    return http.post('/api/credential/verify', { credential: credentialJson });
  },

  /**
   * 撤销凭证
   * @param id 凭证ID
   * @param reason 撤销原因
   */
  revokeCredential(id: string, reason?: string): Promise<ApiResponse<void>> {
    return http.post(`/api/credential/${id}/revoke`, { reason });
  },

  /**
   * 删除凭证（从本地存储中）
   * @param id 凭证ID
   */
  deleteCredential(id: string): Promise<ApiResponse<void>> {
    return http.delete(`/api/credential/${id}`);
  },

  /**
   * 获取凭证模板列表
   */
  getCredentialTemplates(): Promise<ApiResponse<any[]>> {
    return http.get('/api/credential/templates');
  },

  /**
   * 获取凭证共享链接
   * @param id 凭证ID
   * @param options 选项
   */
  getCredentialShareLink(
    id: string,
    options?: any
  ): Promise<ApiResponse<{ url: string; expiresAt?: string }>> {
    return http.post(`/api/credential/${id}/share`, options);
  },

  /**
   * 获取凭证历史记录
   * @param id 凭证ID
   */
  getCredentialHistory(id: string): Promise<ApiResponse<any[]>> {
    return http.get(`/api/credential/${id}/history`);
  },

  /**
   * 根据DID获取所有凭证
   * @param did DID
   */
  getCredentialsByDid(did: string): Promise<ApiResponse<Credential[]>> {
    return http.get('/api/credential', { params: { did } });
  },

  /**
   * 导出凭证
   * @param id 凭证ID
   * @param format 格式
   */
  exportCredential(
    id: string,
    format: 'json' | 'jwt' | 'jsonld' = 'json'
  ): Promise<ApiResponse<any>> {
    return http.get(`/api/credential/${id}/export`, { params: { format } });
  },

  /**
   * 获取凭证统计信息
   */
  getCredentialStats(): Promise<ApiResponse<any>> {
    return http.get('/api/credential/stats');
  },
};
