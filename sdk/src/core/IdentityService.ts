import { ApiClient } from '../utils/ApiClient';
import { Identity, CreateIdentityParams, ApiResponse } from '../types';

/**
 * 身份管理服务，处理DID创建与管理相关功能
 */
export class IdentityService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * 创建新的身份（DID）
   */
  public async create(params: CreateIdentityParams): Promise<ApiResponse<Identity>> {
    return this.apiClient.post<Identity>('/identity', params);
  }

  /**
   * 获取身份详情
   */
  public async get(did: string): Promise<ApiResponse<Identity>> {
    return this.apiClient.get<Identity>(`/identity/${did}`);
  }

  /**
   * 更新身份信息
   */
  public async update(did: string, data: Partial<CreateIdentityParams>): Promise<ApiResponse<Identity>> {
    return this.apiClient.put<Identity>(`/identity/${did}`, data);
  }

  /**
   * 列出用户所有身份
   */
  public async list(): Promise<ApiResponse<Identity[]>> {
    return this.apiClient.get<Identity[]>('/identity');
  }

  /**
   * 删除身份
   */
  public async delete(did: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/identity/${did}`);
  }

  /**
   * 解析DID
   */
  public async resolve(did: string): Promise<ApiResponse<Identity>> {
    return this.apiClient.get<Identity>(`/identity/resolve?did=${did}`);
  }
} 