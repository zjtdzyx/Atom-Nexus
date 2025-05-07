import { IdentityService } from './IdentityService';
import { CredentialService } from './CredentialService';
import { VerificationService } from './VerificationService';
import { SDKConfig } from '../types';
import { ApiClient } from '../utils/ApiClient';

/**
 * Atom Nexus SDK 主类，提供去中心化身份与凭证管理功能
 */
export class AtomNexusSDK {
  private config: SDKConfig;
  private apiClient: ApiClient;

  public identity: IdentityService;
  public credential: CredentialService;
  public verification: VerificationService;

  /**
   * 创建 Atom Nexus SDK 实例
   * @param config SDK 配置
   */
  constructor(config: SDKConfig) {
    this.config = this.mergeWithDefaultConfig(config);
    this.apiClient = new ApiClient(this.config);
    
    // 初始化服务
    this.identity = new IdentityService(this.apiClient);
    this.credential = new CredentialService(this.apiClient);
    this.verification = new VerificationService(this.apiClient);
  }

  /**
   * 合并用户配置与默认配置
   */
  private mergeWithDefaultConfig(config: SDKConfig): SDKConfig {
    return {
      apiKey: config.apiKey,
      environment: config.environment || 'development',
      apiUrl: config.apiUrl || (config.environment === 'production' 
        ? 'https://api.atom-nexus.xyz/v1' 
        : 'https://dev-api.atom-nexus.xyz/v1'),
      options: {
        timeout: config.options?.timeout || 10000,
        autoRefreshToken: config.options?.autoRefreshToken !== false,
      },
    };
  }

  /**
   * 获取SDK版本
   */
  public getVersion(): string {
    return '0.1.0';
  }
} 