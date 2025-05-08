import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 安全审计日志类型
export interface SecurityAuditLog {
  id: string;
  userId: string;
  userName: string;
  eventType:
    | 'login'
    | 'logout'
    | 'password_change'
    | 'key_rotation'
    | 'permission_change'
    | 'identity_operation';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: string;
  result: 'success' | 'failure';
}

// 安全设置类型
export interface SecuritySettings {
  id: string;
  userId: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email' | null;
  sessionTimeout: number; // 会话超时时间（分钟）
  passwordExpiryDays: number; // 密码过期天数
  loginNotifications: boolean; // 登录通知
  unauthorizedAccessAlerts: boolean; // 未授权访问提醒
  lastUpdated: string;
}

// 获取安全审计日志
export async function fetchSecurityAuditLogs(
  params: {
    page?: number;
    pageSize?: number;
    userId?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    result?: 'success' | 'failure';
  } = {}
): Promise<AxiosResponse<{ total: number; items: SecurityAuditLog[] }>> {
  return http.get('/api/security/audit-logs', { params });
}

// 获取安全设置
export async function fetchSecuritySettings(): Promise<AxiosResponse<SecuritySettings>> {
  return http.get('/api/security/settings');
}

// 更新安全设置
export async function updateSecuritySettings(
  data: Partial<Omit<SecuritySettings, 'id' | 'userId' | 'lastUpdated'>>
): Promise<AxiosResponse<SecuritySettings>> {
  return http.put('/api/security/settings', data);
}

// 启用两因素认证
export async function enableTwoFactor(
  method: 'app' | 'sms' | 'email'
): Promise<AxiosResponse<{ setupData: any }>> {
  return http.post('/api/security/two-factor/enable', { method });
}

// 禁用两因素认证
export async function disableTwoFactor(): Promise<AxiosResponse<void>> {
  return http.post('/api/security/two-factor/disable');
}

// 验证两因素认证
export async function verifyTwoFactor(code: string): Promise<AxiosResponse<{ verified: boolean }>> {
  return http.post('/api/security/two-factor/verify', { code });
}

// 修改密码
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<AxiosResponse<{ success: boolean }>> {
  return http.post('/api/security/change-password', data);
}

// 生成恢复码
export async function generateRecoveryCodes(): Promise<AxiosResponse<{ codes: string[] }>> {
  return http.post('/api/security/recovery-codes/generate');
}

// 获取活跃会话列表
export async function fetchActiveSessions(): Promise<
  AxiosResponse<
    Array<{
      id: string;
      deviceName: string;
      browser: string;
      operatingSystem: string;
      ipAddress: string;
      location: string;
      lastActive: string;
      isCurrent: boolean;
    }>
  >
> {
  return http.get('/api/security/sessions');
}

// 终止会话
export async function terminateSession(sessionId: string): Promise<AxiosResponse<void>> {
  return http.delete(`/api/security/sessions/${sessionId}`);
}

// 终止除当前会话外的所有会话
export async function terminateAllOtherSessions(): Promise<AxiosResponse<void>> {
  return http.delete('/api/security/sessions');
}
