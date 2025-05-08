import http from '@/utils/http';
import type { AxiosResponse } from 'axios';
import { logger } from '@/utils/logger';

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

/**
 * 获取系统设置
 */
export async function fetchSystemSettings(): Promise<AxiosResponse<SystemSettings>> {
  logger.info('API:Settings', '开始请求系统设置');
  try {
    const response = await http.get('/api/settings/system');
    logger.info('API:Settings', '请求系统设置成功');
    return response;
  } catch (error: any) {
    logger.error('API:Settings', '请求系统设置失败', { error: error.message });
    throw error;
  }
}

/**
 * 更新系统设置
 * @param data 系统设置数据
 */
export async function updateSystemSettings(
  data: Partial<Omit<SystemSettings, 'id' | 'updatedAt'>>
): Promise<AxiosResponse<SystemSettings>> {
  logger.info('API:Settings', '开始更新系统设置');
  try {
    const response = await http.put('/api/settings/system', data);
    logger.info('API:Settings', '更新系统设置成功');
    return response;
  } catch (error: any) {
    logger.error('API:Settings', '更新系统设置失败', { error: error.message });
    throw error;
  }
}

/**
 * 获取用户偏好设置
 */
export async function fetchUserPreferences(): Promise<AxiosResponse<UserPreferences>> {
  logger.info('API:Settings', '开始请求用户偏好设置');
  try {
    const response = await http.get('/api/settings/preferences');
    logger.info('API:Settings', '请求用户偏好设置成功');
    return response;
  } catch (error: any) {
    logger.error('API:Settings', '请求用户偏好设置失败', { error: error.message });
    throw error;
  }
}

/**
 * 更新用户偏好设置
 * @param data 用户偏好设置数据
 */
export async function updateUserPreferences(
  data: Partial<Omit<UserPreferences, 'userId' | 'updatedAt'>>
): Promise<AxiosResponse<UserPreferences>> {
  logger.info('API:Settings', '开始更新用户偏好设置');
  try {
    const response = await http.put('/api/settings/preferences', data);
    logger.info('API:Settings', '更新用户偏好设置成功');
    return response;
  } catch (error: any) {
    logger.error('API:Settings', '更新用户偏好设置失败', { error: error.message });
    throw error;
  }
}

/**
 * 重置用户偏好设置为系统默认值
 */
export async function resetUserPreferences(): Promise<AxiosResponse<UserPreferences>> {
  logger.info('API:Settings', '开始重置用户偏好设置');
  try {
    const response = await http.post('/api/settings/preferences/reset');
    logger.info('API:Settings', '重置用户偏好设置成功');
    return response;
  } catch (error: any) {
    logger.error('API:Settings', '重置用户偏好设置失败', { error: error.message });
    throw error;
  }
}
