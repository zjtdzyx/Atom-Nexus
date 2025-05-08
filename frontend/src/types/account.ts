/**
 * 用户资料
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

/**
 * 安全设置
 */
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  passwordStrength: 'weak' | 'medium' | 'strong';
  lastActivity: {
    time: string;
    ip: string;
    location?: string;
  };
  activeSessions: Session[];
}

/**
 * 会话信息
 */
export interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location?: string;
  lastActive: string;
  isCurrent: boolean;
}
