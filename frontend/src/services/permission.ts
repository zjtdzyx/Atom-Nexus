import { http } from '../utils/http';
import type { Permission, AuditLog } from '../stores/permission';

// 统一API响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 权限检查结果
interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
}

// 权限服务
export const permissionService = {
  // 获取所有权限
  getPermissions(params?: any): Promise<ApiResponse<Permission[]>> {
    return http.get('/permissions', { params });
  },

  // 获取单个权限详情
  getPermissionById(id: string): Promise<ApiResponse<Permission>> {
    return http.get(`/permissions/${id}`);
  },

  // 创建新权限
  createPermission(data: Partial<Permission>): Promise<ApiResponse<Permission>> {
    return http.post('/permissions', data);
  },

  // 更新权限
  updatePermission(id: string, data: Partial<Permission>): Promise<ApiResponse<Permission>> {
    return http.put(`/permissions/${id}`, data);
  },

  // 撤销权限
  revokePermission(id: string, reason?: string): Promise<ApiResponse<void>> {
    return http.post(`/permissions/${id}/revoke`, { reason });
  },

  // 删除权限
  deletePermission(id: string): Promise<ApiResponse<void>> {
    return http.delete(`/permissions/${id}`);
  },

  // 获取资源的权限列表
  getResourcePermissions(
    resourceType: 'credential' | 'identity' | 'data',
    resourceId: string
  ): Promise<ApiResponse<Permission[]>> {
    return http.get('/permissions', {
      params: { resourceType, resourceId },
    });
  },

  // 获取DID相关权限
  getDidPermissions(did: string): Promise<ApiResponse<Permission[]>> {
    return http.get(`/permissions/${did}`);
  },

  // 验证权限
  checkPermission(params: {
    subject: string;
    resourceType: 'credential' | 'identity' | 'data';
    resourceId: string;
    action: string;
  }): Promise<ApiResponse<PermissionCheckResult>> {
    return http.post('/permissions/check', params);
  },

  // 获取审计日志
  getAuditLogs(params?: any): Promise<ApiResponse<AuditLog[]>> {
    return http.get('/permissions/audit', { params });
  },

  // 获取资源的审计日志
  getResourceAuditLogs(
    resourceType: 'credential' | 'identity' | 'data',
    resourceId: string
  ): Promise<ApiResponse<AuditLog[]>> {
    return http.get('/api/permissions/audit', {
      params: { resourceType, resourceId },
    });
  },

  // 添加审计日志
  addAuditLog(logData: Partial<AuditLog>): Promise<ApiResponse<AuditLog>> {
    return http.post('/api/permissions/audit', logData);
  },

  // 批量修改权限
  batchUpdatePermissions(
    permissionIds: string[],
    updateData: Partial<Permission>
  ): Promise<ApiResponse<void>> {
    return http.put('/api/permissions/batch', {
      ids: permissionIds,
      data: updateData,
    });
  },

  // 获取权限模板
  getPermissionTemplates(): Promise<ApiResponse<any[]>> {
    return http.get('/api/permissions/templates');
  },

  // 设置凭证访问权限
  setPermission(data: any): Promise<ApiResponse<any>> {
    return http.post('/permissions/set', data);
  },
};
