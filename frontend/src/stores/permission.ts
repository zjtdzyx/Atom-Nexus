import { defineStore } from 'pinia';
import { logger } from '../utils/logger';
import { permissionService } from '../services/permission';

// 权限类型定义
export interface Permission {
  id: string;
  type: 'credential' | 'identity' | 'data';
  resourceId: string;
  subject: string; // 授权对象的DID
  action: 'read' | 'write' | 'verify' | 'revoke' | 'admin';
  conditions?: {
    expires?: string;
    ip?: string[];
    domain?: string[];
    oneTime?: boolean;
    [key: string]: any;
  };
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    name?: string;
    description?: string;
    [key: string]: any;
  };
}

// 审计记录类型
export interface AuditLog {
  id: string;
  permissionId: string;
  action: 'access' | 'verify' | 'update' | 'revoke' | 'create';
  status: 'success' | 'denied';
  actor: string; // 执行者DID
  resourceId: string;
  resourceType: 'credential' | 'identity' | 'data';
  timestamp: string;
  ip?: string;
  userAgent?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [] as Permission[],
    currentPermission: null as Permission | null,
    auditLogs: [] as AuditLog[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    // 按资源类型分组的权限
    permissionsByType: (state) => {
      const grouped: Record<string, Permission[]> = {
        credential: [],
        identity: [],
        data: [],
      };

      state.permissions.forEach((permission) => {
        grouped[permission.type].push(permission);
      });

      return grouped;
    },

    // 活跃状态的权限
    activePermissions: (state) =>
      state.permissions.filter((permission) => permission.status === 'active'),

    // 已撤销的权限
    revokedPermissions: (state) =>
      state.permissions.filter((permission) => permission.status === 'revoked'),

    // 已过期的权限
    expiredPermissions: (state) =>
      state.permissions.filter((permission) => permission.status === 'expired'),
  },

  actions: {
    // 获取所有权限
    async fetchPermissions() {
      this.isLoading = true;
      this.error = null;

      logger.info('Store:Permission', '开始获取权限列表');

      try {
        const response = await permissionService.getPermissions();
        this.permissions = response.data;
        logger.info('Store:Permission', '权限列表获取成功', { count: response.data.length });
      } catch (err: any) {
        this.error = err.message || '获取权限列表失败';
        logger.error('Store:Permission', '权限列表获取失败', { error: err });
      } finally {
        this.isLoading = false;
      }
    },

    // 获取单个权限详情
    async fetchPermissionById(id: string) {
      logger.info('Store:Permission', '开始获取权限详情', { id });

      try {
        const response = await permissionService.getPermissionById(id);
        this.currentPermission = response.data;
        logger.info('Store:Permission', '权限详情获取成功', { id });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '权限详情获取失败', { id, error: err });
        throw err;
      }
    },

    // 创建新权限
    async createPermission(permissionData: Partial<Permission>) {
      logger.info('Store:Permission', '开始创建新权限', { data: permissionData });

      try {
        const response = await permissionService.createPermission(permissionData);
        this.permissions.push(response.data);
        logger.info('Store:Permission', '新权限创建成功', { id: response.data.id });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '创建权限失败', { error: err });
        throw err;
      }
    },

    // 更新权限
    async updatePermission(id: string, updateData: Partial<Permission>) {
      logger.info('Store:Permission', '开始更新权限', { id, data: updateData });

      try {
        const response = await permissionService.updatePermission(id, updateData);

        // 更新状态中的权限
        const index = this.permissions.findIndex((permission) => permission.id === id);
        if (index !== -1) {
          this.permissions[index] = { ...this.permissions[index], ...response.data };
        }

        // 如果是当前选中的权限，也更新currentPermission
        if (this.currentPermission && this.currentPermission.id === id) {
          this.currentPermission = { ...this.currentPermission, ...response.data };
        }

        logger.info('Store:Permission', '权限更新成功', { id });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '更新权限失败', { id, error: err });
        throw err;
      }
    },

    // 撤销权限
    async revokePermission(id: string, reason?: string) {
      logger.info('Store:Permission', '开始撤销权限', { id, reason });

      try {
        await permissionService.revokePermission(id, reason);

        // 更新状态中的权限状态
        const index = this.permissions.findIndex((permission) => permission.id === id);
        if (index !== -1) {
          this.permissions[index].status = 'revoked';
        }

        // 如果是当前选中的权限，也更新currentPermission
        if (this.currentPermission && this.currentPermission.id === id) {
          this.currentPermission.status = 'revoked';
        }

        logger.info('Store:Permission', '权限撤销成功', { id });
      } catch (err: any) {
        logger.error('Store:Permission', '撤销权限失败', { id, error: err });
        throw err;
      }
    },

    // 设置权限
    async setPermission(data: any) {
      logger.info('Store:Permission', '开始设置权限', { data });

      try {
        const response = await permissionService.setPermission(data);
        logger.info('Store:Permission', '权限设置成功');
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '权限设置失败', { error: err });
        throw err;
      }
    },

    // 获取审计日志
    async fetchAuditLogs(params?: any) {
      logger.info('Store:Permission', '获取审计日志', { params });

      try {
        const response = await permissionService.getAuditLogs(params);
        this.auditLogs = response.data;
        logger.info('Store:Permission', '审计日志获取成功', { count: response.data.length });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '获取审计日志失败', { error: err });
        throw err;
      }
    },

    // 获取资源的权限列表（如凭证的权限）
    async fetchResourcePermissions(
      resourceType: 'credential' | 'identity' | 'data',
      resourceId: string
    ) {
      logger.info('Store:Permission', '获取资源权限列表', { resourceType, resourceId });

      try {
        const response = await permissionService.getResourcePermissions(resourceType, resourceId);
        logger.info('Store:Permission', '资源权限列表获取成功', { count: response.data.length });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '获取资源权限列表失败', { error: err });
        throw err;
      }
    },

    // 获取DID相关权限
    async fetchDidPermissions(did: string) {
      logger.info('Store:Permission', '获取DID权限列表', { did });

      try {
        const response = await permissionService.getDidPermissions(did);
        logger.info('Store:Permission', 'DID权限列表获取成功', { count: response.data.length });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '获取DID权限列表失败', { error: err });
        throw err;
      }
    },

    // 验证权限
    async checkPermission(permissionParams: {
      subject: string;
      resourceType: 'credential' | 'identity' | 'data';
      resourceId: string;
      action: string;
    }) {
      logger.info('Store:Permission', '验证权限', permissionParams);

      try {
        const response = await permissionService.checkPermission(permissionParams);
        logger.info('Store:Permission', '权限验证完成', {
          hasPermission: response.data.hasPermission,
        });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '权限验证失败', { error: err });
        throw err;
      }
    },

    // 获取资源的审计日志
    async fetchResourceAuditLogs(
      resourceType: 'credential' | 'identity' | 'data',
      resourceId: string
    ) {
      logger.info('Store:Permission', '获取资源审计日志', { resourceType, resourceId });

      try {
        const response = await permissionService.getResourceAuditLogs(resourceType, resourceId);
        logger.info('Store:Permission', '资源审计日志获取成功', { count: response.data.length });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Permission', '获取资源审计日志失败', { error: err });
        throw err;
      }
    },
  },
});
