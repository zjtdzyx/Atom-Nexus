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
    return http.get('/credentials', { params });
  },

  /**
   * 获取凭证详情
   * @param id 凭证ID
   */
  getCredentialById(id: string): Promise<ApiResponse<Credential>> {
    return http.get(`/credentials/${id}`);
  },

  /**
   * 验证凭证有效性
   * @param id 凭证ID
   */
  verifyCredentialById(id: string): Promise<ApiResponse<VerifyResult>> {
    return http.post(`/credentials/verify/${id}`);
  },

  /**
   * 验证凭证JSON
   * @param credentialData 凭证数据
   */
  verifyCredentialJson(credentialData: any): Promise<ApiResponse<VerifyResult>> {
    return http.post('/credentials/verify', credentialData);
  },

  /**
   * 撤销凭证
   * @param id 凭证ID
   * @param reason 撤销原因
   */
  revokeCredential(id: string, reason?: string): Promise<ApiResponse<any>> {
    return http.post(`/credentials/${id}/revoke`, { reason });
  },

  /**
   * 颁发新凭证
   * @param data 凭证数据
   */
  issueCredential(data: any): Promise<ApiResponse<Credential>> {
    return http.post('/credentials/issue', data);
  },

  /**
   * 生成凭证分享链接或二维码
   * @param id 凭证ID
   */
  shareCredential(id: string): Promise<ApiResponse<any>> {
    return http.post(`/credentials/${id}/share`);
  },

  /**
   * 获取凭证模板列表
   */
  getCredentialTemplates(): Promise<ApiResponse<any[]>> {
    return http.get('/api/credentials/templates');
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
    return http.post(`/api/credentials/${id}/share`, options);
  },

  /**
   * 获取凭证历史记录
   * @param id 凭证ID
   */
  getCredentialHistory(id: string): Promise<ApiResponse<any[]>> {
    return http.get(`/api/credentials/${id}/history`);
  },

  /**
   * 根据DID获取所有凭证
   * @param did DID
   */
  getCredentialsByDid(did: string): Promise<ApiResponse<Credential[]>> {
    return http.get('/api/credentials', { params: { did } });
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
    return http.get(`/api/credentials/${id}/export`, { params: { format } });
  },

  /**
   * 获取凭证统计信息
   */
  getCredentialStats(): Promise<ApiResponse<any>> {
    return http.get('/api/credentials/stats');
  },
};
