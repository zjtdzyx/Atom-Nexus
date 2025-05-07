import { ApiClient } from '../utils/ApiClient';
import { 
  Credential, 
  IssueCredentialParams, 
  VerifyCredentialParams,
  VerificationResult,
  ShareCredentialParams,
  ApiResponse
} from '../types';

/**
 * 凭证管理服务，处理凭证签发、验证、存储、展示等功能
 */
export class CredentialService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * 签发新凭证
   */
  public async issue(params: IssueCredentialParams): Promise<ApiResponse<Credential>> {
    return this.apiClient.post<Credential>('/credential/issue', params);
  }

  /**
   * 验证凭证
   */
  public async verify(params: VerifyCredentialParams): Promise<ApiResponse<VerificationResult>> {
    return this.apiClient.post<VerificationResult>('/credential/verify', params);
  }

  /**
   * 获取凭证
   */
  public async get(id: string): Promise<ApiResponse<Credential>> {
    return this.apiClient.get<Credential>(`/credential/${id}`);
  }

  /**
   * 列出用户所有凭证
   */
  public async list(): Promise<ApiResponse<Credential[]>> {
    return this.apiClient.get<Credential[]>('/credential');
  }

  /**
   * 撤销凭证
   */
  public async revoke(id: string, reason?: string): Promise<ApiResponse<void>> {
    return this.apiClient.post<void>(`/credential/${id}/revoke`, { reason });
  }

  /**
   * 生成分享链接
   */
  public async share(params: ShareCredentialParams): Promise<ApiResponse<{ shareableLink: string }>> {
    return this.apiClient.post<{ shareableLink: string }>('/credential/share', params);
  }
}