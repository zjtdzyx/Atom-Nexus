import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 系统统计数据类型
export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalIdentities: number;
  totalCredentials: number;
  newUsersToday: number;
  newIdentitiesToday: number;
  newCredentialsToday: number;
  storageUsed: number;
  totalStorageCapacity: number;
}

// 系统活动日志类型
export interface SystemActivityLog {
  id: string;
  action: string;
  module: string;
  userId: string;
  userName: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  timestamp: string;
}

// 系统配置类型
export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description: string;
  category: string;
  isPublic: boolean;
  updatedAt: string;
  updatedBy: string;
}

// 获取系统统计数据
export async function fetchSystemStats(): Promise<AxiosResponse<SystemStats>> {
  return http.get('/api/admin/stats');
}

// 获取系统活动日志
export async function fetchSystemActivityLogs(
  params: {
    page?: number;
    pageSize?: number;
    module?: string;
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<AxiosResponse<{ total: number; items: SystemActivityLog[] }>> {
  return http.get('/api/admin/activity-logs', { params });
}

// 获取系统配置列表
export async function fetchSystemConfigs(
  params: {
    category?: string;
    isPublic?: boolean;
    search?: string;
  } = {}
): Promise<AxiosResponse<SystemConfig[]>> {
  return http.get('/api/admin/configs', { params });
}

// 获取单个系统配置
export async function fetchSystemConfigByKey(key: string): Promise<AxiosResponse<SystemConfig>> {
  return http.get(`/api/admin/configs/${key}`);
}

// 更新系统配置
export async function updateSystemConfig(
  key: string,
  value: any
): Promise<AxiosResponse<SystemConfig>> {
  return http.put(`/api/admin/configs/${key}`, { value });
}

// 批量更新系统配置
export async function batchUpdateSystemConfigs(
  configs: Array<{ key: string; value: any }>
): Promise<AxiosResponse<{ success: boolean; updatedCount: number }>> {
  return http.put('/api/admin/configs', { configs });
}

// 获取系统登录历史
export async function fetchLoginHistory(
  params: {
    page?: number;
    pageSize?: number;
    userId?: string;
    status?: 'success' | 'failure';
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<
  AxiosResponse<{
    total: number;
    items: Array<{
      id: string;
      userId: string;
      userName: string;
      ipAddress: string;
      userAgent: string;
      location: string;
      status: 'success' | 'failure';
      failReason: string | null;
      timestamp: string;
    }>;
  }>
> {
  return http.get('/api/admin/login-history', { params });
}

// 发送系统通知
export async function sendSystemNotification(data: {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  userIds?: string[]; // 如果为空则发送给所有用户
  expiresAt?: string;
}): Promise<AxiosResponse<{ success: boolean; sentCount: number }>> {
  return http.post('/api/admin/notifications', data);
}

// 系统备份
export async function createSystemBackup(
  data: {
    includeUsers?: boolean;
    includeIdentities?: boolean;
    includeCredentials?: boolean;
    includeStorage?: boolean;
    description?: string;
  } = {}
): Promise<
  AxiosResponse<{
    id: string;
    fileName: string;
    size: number;
    downloadUrl: string;
    createdAt: string;
  }>
> {
  return http.post('/api/admin/backup', data);
}

// 获取备份列表
export async function fetchBackups(
  params: {
    page?: number;
    pageSize?: number;
  } = {}
): Promise<
  AxiosResponse<{
    total: number;
    items: Array<{
      id: string;
      fileName: string;
      size: number;
      downloadUrl: string;
      description: string;
      createdAt: string;
      createdBy: string;
    }>;
  }>
> {
  return http.get('/api/admin/backups', { params });
}

// 系统恢复
export async function restoreSystem(
  backupId: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return http.post('/api/admin/restore', { backupId });
}

// 获取系统健康状态
export async function fetchSystemHealth(): Promise<
  AxiosResponse<{
    status: 'healthy' | 'unhealthy' | 'degraded';
    database: {
      status: 'up' | 'down' | 'degraded';
      responseTime: number;
    };
    cacheService: {
      status: 'up' | 'down';
      responseTime: number;
    };
    storageService: {
      status: 'up' | 'down' | 'degraded';
      responseTime: number;
    };
    externalServices: Array<{
      name: string;
      status: 'up' | 'down';
      responseTime: number;
    }>;
    memoryUsage: number;
    cpuUsage: number;
    uptime: number;
  }>
> {
  return http.get('/api/admin/health');
}
