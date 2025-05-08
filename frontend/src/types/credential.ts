/**
 * 凭证类型定义
 */
export interface Credential {
  id: string;
  issuer: string;
  holder: string;
  type: string[];
  issuanceDate: string;
  expirationDate?: string;
  status: CredentialStatus;
  proof?: CredentialProof;
  credentialSubject: Record<string, any>;
}

/**
 * 凭证状态
 */
export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
}

/**
 * 凭证证明
 */
export interface CredentialProof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  signature: string;
}

/**
 * 验证结果
 */
export interface VerificationResult {
  isValid: boolean;
  checks: {
    signature: boolean;
    expiration: boolean;
    revocation: boolean;
    format: boolean;
  };
  errors?: string[];
}

/**
 * 凭证模板
 */
export interface CredentialTemplate {
  id: string;
  name: string;
  description?: string;
  type: string[];
  schema: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
