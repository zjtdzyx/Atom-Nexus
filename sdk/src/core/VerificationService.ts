import { ApiClient } from '../utils/ApiClient';
import { VerificationResult, ApiResponse } from '../types';

/**
 * 验证服务，处理凭证验证相关功能
 */
export class VerificationService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * 通过共享链接验证凭证
   */
  public async verifySharedLink(shareableLink: string): Promise<ApiResponse<VerificationResult>> {
    return this.apiClient.get<VerificationResult>(`/verification/link?url=${encodeURIComponent(shareableLink)}`);
  }

  /**
   * 通过二维码验证凭证
   */
  public async verifyQrCode(qrCodeData: string): Promise<ApiResponse<VerificationResult>> {
    return this.apiClient.post<VerificationResult>('/verification/qr', { qrCodeData });
  }

  /**
   * 获取验证请求历史
   */
  public async getVerificationHistory(): Promise<ApiResponse<any[]>> {
    return this.apiClient.get<any[]>('/verification/history');
  }
} 