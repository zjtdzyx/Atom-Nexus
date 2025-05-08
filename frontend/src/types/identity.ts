/**
 * 身份类型定义
 */
export interface Identity {
  id: string;
  did: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

/**
 * 登录历史记录
 */
export interface LoginHistory {
  id: string;
  identityId: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  status: 'success' | 'failed';
  location?: string;
}

/**
 * 身份资料
 */
export interface IdentityProfile {
  identityId: string;
  displayName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  socialLinks?: SocialLink[];
  customFields?: Record<string, any>;
}

/**
 * 社交媒体链接
 */
export interface SocialLink {
  platform: string;
  url: string;
}
