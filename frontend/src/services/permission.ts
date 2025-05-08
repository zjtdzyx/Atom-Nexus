import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 权限类型定义
export interface Permission {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionAuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  ipAddress: string;
  timestamp: string;
  details: string;
}

// 获取权限列表
export async function fetchPermissions(
  params: { page?: number; pageSize?: number } = {}
): Promise<AxiosResponse<{ total: number; items: Permission[] }>> {
  return http.get('/api/permissions', { params });
}

// 获取单个权限详情
export async function fetchPermissionById(id: string): Promise<AxiosResponse<Permission>> {
  return http.get(`/api/permissions/${id}`);
}

// 创建权限
export async function createPermission(
  data: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AxiosResponse<Permission>> {
  return http.post('/api/permissions', data);
}

// 更新权限
export async function updatePermission(
  id: string,
  data: Partial<Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<AxiosResponse<Permission>> {
  return http.put(`/api/permissions/${id}`, data);
}

// 删除权限
export async function deletePermission(id: string): Promise<AxiosResponse<void>> {
  return http.delete(`/api/permissions/${id}`);
}

// 获取权限审计日志
export async function fetchPermissionAuditLogs(
  params: {
    page?: number;
    pageSize?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<AxiosResponse<{ total: number; items: PermissionAuditLog[] }>> {
  return http.get('/api/permissions/audit-logs', { params });
}

// 为身份绑定权限
export async function assignPermissionToIdentity(
  identityId: string,
  permissionIds: string[]
): Promise<AxiosResponse<void>> {
  return http.post(`/api/identities/${identityId}/permissions`, { permissionIds });
}

// 获取身份的权限列表
export async function getIdentityPermissions(
  identityId: string
): Promise<AxiosResponse<{ permissions: Permission[] }>> {
  return http.get(`/api/identities/${identityId}/permissions`);
}

// 移除身份的权限
export async function removePermissionFromIdentity(
  identityId: string,
  permissionId: string
): Promise<AxiosResponse<void>> {
  return http.delete(`/api/identities/${identityId}/permissions/${permissionId}`);
}
