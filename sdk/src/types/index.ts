// SDK配置类型
export interface SDKConfig {
  apiKey?: string;
  environment?: 'development' | 'production';
  apiUrl?: string;
  options?: {
    timeout?: number;
    autoRefreshToken?: boolean;
  };
}

// 身份类型
export interface Identity {
  did: string;
  publicKey: string;
  privateKey?: string;
  name?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 创建身份参数
export interface CreateIdentityParams {
  name?: string;
  email?: string;
}

// 凭证类型
export interface Credential {
  id: string;
  type: string | string[];
  issuer: string;
  subject: string;
  issuanceDate: Date;
  expirationDate?: Date;
  claims: Record<string, any>;
  proof?: CredentialProof;
}

// 凭证证明类型
export interface CredentialProof {
  type: string;
  created: Date;
  verificationMethod: string;
  signature: string;
}

// 签发凭证参数
export interface IssueCredentialParams {
  type: string | string[];
  subject: string;
  claims: Record<string, any>;
  expiresIn?: string;
}

// 验证凭证参数
export interface VerifyCredentialParams {
  credentialId?: string;
  credential?: Credential;
}

// 验证结果
export interface VerificationResult {
  isValid: boolean;
  errors?: string[];
  issuer?: string;
  subject?: string;
  issuanceDate?: Date;
  expirationDate?: Date;
}

// 凭证分享参数
export interface ShareCredentialParams {
  id: string;
  expiresIn?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
} 