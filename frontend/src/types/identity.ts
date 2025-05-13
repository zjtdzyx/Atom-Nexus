/**
 * 身份状态枚举
 */
export enum IdentityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
}

/**
 * 身份类型定义
 */
export interface Identity {
  id: string;
  did: string;
  alias: string;
  type: string;
  status: IdentityStatus;
  isDefault: boolean;
  isActive: boolean;
  publicKey: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    [key: string]: any;
  };
}

/**
 * 登录历史记录
 */
export interface LoginHistory {
  id: string;
  identityId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  device?: string;
  success: boolean;
  failureReason?: string;
}

/**
 * 身份资料
 */
export interface IdentityProfile {
  id: string;
  identityId: string;
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    telegram?: string;
    [key: string]: string | undefined;
  };
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * 身份活动类型
 */
export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE_CREDENTIAL = 'create_credential',
  VERIFY_CREDENTIAL = 'verify_credential',
  REVOKE_CREDENTIAL = 'revoke_credential',
  UPDATE_PROFILE = 'update_profile',
  BIND_DID = 'bind_did',
  UNBIND_DID = 'unbind_did',
}

/**
 * 身份活动记录
 */
export interface IdentityActivity {
  id: string;
  identityId: string;
  type: ActivityType;
  timestamp: string;
  details: {
    [key: string]: any;
  };
  ipAddress?: string;
  userAgent?: string;
}
