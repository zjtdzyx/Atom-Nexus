import { defineStore } from 'pinia';
import axios from 'axios';

// 用户接口定义
export interface User {
  id: string;
  username: string;
  did: string;
  email?: string;
  registeredAt: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
}

// 凭证接口定义
export interface AdminCredential {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  type: string;
  issuedAt: string;
  expiresAt?: string;
  status: 'valid' | 'expired' | 'revoked';
  verificationCount: number;
}

// 权限接口定义
export interface AdminPermission {
  id: string;
  credentialId: string;
  credentialName: string;
  grantorId: string;
  grantorName: string;
  granteeId: string;
  granteeName: string;
  permissionType: string;
  grantedAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'revoked';
}

// 统计数据接口
export interface Stats {
  userStats: {
    total: number;
    activeToday: number;
    newThisWeek: number;
    growthRate: number;
  };
  credentialStats: {
    total: number;
    valid: number;
    expired: number;
    revoked: number;
    issuedThisMonth: number;
  };
  permissionStats: {
    total: number;
    active: number;
    mostUsedType: string;
  };
  systemStats: {
    apiCallsToday: number;
    averageResponseTime: number;
    totalStorage: string;
    uptime: string;
  };
}

// Store状态接口
interface AdminState {
  users: User[];
  credentials: AdminCredential[];
  permissions: AdminPermission[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    currentPage: number;
    pageSize: number;
  };
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    users: [],
    credentials: [],
    permissions: [],
    stats: null,
    loading: false,
    error: null,
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
  }),

  getters: {
    getUsers: (state) => state.users,
    getCredentials: (state) => state.credentials,
    getPermissions: (state) => state.permissions,
    getStats: (state) => state.stats,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
    getPagination: (state) => state.pagination,
  },

  actions: {
    // 获取用户列表
    async fetchUsers(page = 1, pageSize = 10) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/admin/users', {
          params: { page, pageSize },
        });

        this.users = response.data.data || [];
        this.pagination = {
          total: response.data.total || 0,
          currentPage: page,
          pageSize,
        };
      } catch (error) {
        console.error('获取用户列表失败:', error);
        this.error = error instanceof Error ? error.message : '获取用户列表失败';
      } finally {
        this.loading = false;
      }
    },

    // 获取凭证列表
    async fetchCredentials(page = 1, pageSize = 10) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/admin/credentials', {
          params: { page, pageSize },
        });

        this.credentials = response.data.data || [];
        this.pagination = {
          total: response.data.total || 0,
          currentPage: page,
          pageSize,
        };
      } catch (error) {
        console.error('获取凭证列表失败:', error);
        this.error = error instanceof Error ? error.message : '获取凭证列表失败';
      } finally {
        this.loading = false;
      }
    },

    // 获取权限列表
    async fetchPermissions(page = 1, pageSize = 10) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/admin/permissions', {
          params: { page, pageSize },
        });

        this.permissions = response.data.data || [];
        this.pagination = {
          total: response.data.total || 0,
          currentPage: page,
          pageSize,
        };
      } catch (error) {
        console.error('获取权限列表失败:', error);
        this.error = error instanceof Error ? error.message : '获取权限列表失败';
      } finally {
        this.loading = false;
      }
    },

    // 获取统计数据
    async fetchStats() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/admin/stats');
        this.stats = response.data.data || null;
      } catch (error) {
        console.error('获取统计数据失败:', error);
        this.error = error instanceof Error ? error.message : '获取统计数据失败';
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
