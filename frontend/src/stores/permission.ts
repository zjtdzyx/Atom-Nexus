import { defineStore } from 'pinia';
import axios from 'axios';

// 权限类型枚举
export enum PermissionType {
  ONE_TIME = 'one_time',
  LONG_TERM = 'long_term',
  PARTIAL = 'partial',
}

// 审计日志接口
export interface AuditLog {
  id: string;
  operator: string;
  operatorName?: string;
  action: string;
  resource: string;
  resourceId: string;
  targetDid: string;
  timestamp: string;
  details?: Record<string, any>;
}

// 权限设置接口
export interface PermissionSetting {
  credentialId: string;
  targetDid: string;
  permissionType: PermissionType;
  expirationDate?: string;
  allowedClaims?: string[];
  note?: string;
}

// DID权限接口
export interface DidPermission {
  id: string;
  did: string;
  credentialId: string;
  credentialName?: string;
  permissionType: PermissionType;
  grantedAt: string;
  expirationDate?: string;
  allowedClaims?: string[];
  issuerId: string;
  issuerName?: string;
  status: 'active' | 'revoked' | 'expired';
}

// Store状态接口
interface PermissionState {
  auditLogs: AuditLog[];
  didPermissions: DidPermission[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    currentPage: number;
    pageSize: number;
  };
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    auditLogs: [],
    didPermissions: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
  }),

  getters: {
    getAuditLogs: (state) => state.auditLogs,
    getDidPermissions: (state) => state.didPermissions,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
    getPagination: (state) => state.pagination,
  },

  actions: {
    // 获取审计日志
    async fetchAuditLogs(page = 1, pageSize = 10) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/permissions/audit', {
          params: { page, pageSize },
        });

        this.auditLogs = response.data.data.logs || [];
        this.pagination = {
          total: response.data.data.total || 0,
          currentPage: page,
          pageSize,
        };
      } catch (error) {
        console.error('获取审计日志失败:', error);
        this.error = error instanceof Error ? error.message : '获取审计日志失败';
      } finally {
        this.loading = false;
      }
    },

    // 设置权限
    async setPermission(settings: PermissionSetting) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/permissions/set', settings);
        return {
          success: true,
          message: '权限设置成功',
          data: response.data.data,
        };
      } catch (error) {
        console.error('设置权限失败:', error);
        this.error = error instanceof Error ? error.message : '设置权限失败';
        return {
          success: false,
          message: this.error,
        };
      } finally {
        this.loading = false;
      }
    },

    // 获取指定DID的权限
    async fetchDidPermissions(did: string) {
      this.loading = true;
      this.error = null;
      this.didPermissions = [];

      try {
        const response = await axios.get(`/permissions/${did}`);
        this.didPermissions = response.data.data || [];
      } catch (error) {
        console.error('获取DID权限失败:', error);
        this.error = error instanceof Error ? error.message : '获取DID权限失败';
      } finally {
        this.loading = false;
      }
    },

    // 撤销权限
    async revokePermission(permissionId: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/permissions/revoke', { permissionId });
        return {
          success: true,
          message: '撤销权限成功',
          data: response.data.data,
        };
      } catch (error) {
        console.error('撤销权限失败:', error);
        this.error = error instanceof Error ? error.message : '撤销权限失败';
        return {
          success: false,
          message: this.error,
        };
      } finally {
        this.loading = false;
      }
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },
  },
});
