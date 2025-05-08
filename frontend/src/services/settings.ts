import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 系统设置类型定义
export interface SystemSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notification: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  securityLevel: 'low' | 'medium' | 'high';
  updatedAt: string;
}

// 用户偏好设置
export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    loginAlert: boolean;
    securityAlert: boolean;
  };
  updatedAt: string;
}

// 获取系统设置
export async function fetchSystemSettings(): Promise<AxiosResponse<SystemSettings>> {
  return http.get('/api/settings/system');
}

// 更新系统设置
export async function updateSystemSettings(
  data: Partial<Omit<SystemSettings, 'id' | 'updatedAt'>>
): Promise<AxiosResponse<SystemSettings>> {
  return http.put('/api/settings/system', data);
}

// 获取用户偏好设置
export async function fetchUserPreferences(): Promise<AxiosResponse<UserPreferences>> {
  return http.get('/api/settings/preferences');
}

// 更新用户偏好设置
export async function updateUserPreferences(
  data: Partial<Omit<UserPreferences, 'userId' | 'updatedAt'>>
): Promise<AxiosResponse<UserPreferences>> {
  return http.put('/api/settings/preferences', data);
}

// 重置用户偏好设置为系统默认值
export async function resetUserPreferences(): Promise<AxiosResponse<UserPreferences>> {
  return http.post('/api/settings/preferences/reset');
}
