import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Permission, AuditLog, PermissionQuery } from '@/types/permission';
import { logger } from '@/utils/logger';

const API_BASE_URL = '/api/permission';

/**
 * 权限管理服务
 */
export const permissionService = {
  /**
   * 获取权限列表
   * @param query 查询参数
   */
  async getPermissions(
    query: PermissionQuery = {}
  ): Promise<AxiosResponse<{ total: number; items: Permission[] }>> {
    logger.info('API:Permission', '开始请求权限列表', query);
    try {
      const response = await axios.get(`${API_BASE_URL}/list`, { params: query });
      logger.info('API:Permission', '请求权限列表成功', { count: response.data.items.length });
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '请求权限列表失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取单个权限详情
   * @param id 权限ID
   */
  async getPermissionById(id: string): Promise<AxiosResponse<Permission>> {
    logger.info('API:Permission', '开始请求权限详情', { id });
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      logger.info('API:Permission', '请求权限详情成功');
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '请求权限详情失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 创建权限
   * @param permission 权限数据
   */
  async createPermission(permission: Partial<Permission>): Promise<AxiosResponse<Permission>> {
    logger.info('API:Permission', '开始创建权限');
    try {
      const response = await axios.post(`${API_BASE_URL}`, permission);
      logger.info('API:Permission', '创建权限成功', { id: response.data.id });
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '创建权限失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 更新权限
   * @param id 权限ID
   * @param permission 更新的权限数据
   */
  async updatePermission(
    id: string,
    permission: Partial<Permission>
  ): Promise<AxiosResponse<Permission>> {
    logger.info('API:Permission', '开始更新权限', { id });
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, permission);
      logger.info('API:Permission', '更新权限成功');
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '更新权限失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 撤销权限
   * @param id 权限ID
   * @param reason 撤销原因
   */
  async revokePermission(id: string, reason?: string): Promise<AxiosResponse<Permission>> {
    logger.info('API:Permission', '开始撤销权限', { id, reason });
    try {
      const response = await axios.post(`${API_BASE_URL}/${id}/revoke`, { reason });
      logger.info('API:Permission', '撤销权限成功');
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '撤销权限失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 删除权限
   * @param id 权限ID
   */
  async deletePermission(id: string): Promise<AxiosResponse<void>> {
    logger.info('API:Permission', '开始删除权限', { id });
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      logger.info('API:Permission', '删除权限成功');
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '删除权限失败', { id, error: error.message });
      throw error;
    }
  },

  /**
   * 获取权限审计日志
   * @param params 查询参数
   */
  async getAuditLogs(
    params: {
      page?: number;
      limit?: number;
      targetDid?: string;
      action?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<AxiosResponse<{ total: number; items: AuditLog[] }>> {
    logger.info('API:Permission', '开始请求权限审计日志', params);
    try {
      const response = await axios.get(`${API_BASE_URL}/audit-logs`, { params });
      logger.info('API:Permission', '请求权限审计日志成功', { count: response.data.items.length });
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '请求权限审计日志失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 为DID分配权限
   * @param did 目标DID
   * @param permissions 权限列表
   */
  async assignPermissions(
    did: string,
    permissions: Partial<Permission>[]
  ): Promise<AxiosResponse<void>> {
    logger.info('API:Permission', '开始分配权限', { did, permissionCount: permissions.length });
    try {
      const response = await axios.post(`${API_BASE_URL}/assign`, { did, permissions });
      logger.info('API:Permission', '分配权限成功');
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '分配权限失败', { did, error: error.message });
      throw error;
    }
  },

  /**
   * 获取DID的权限列表
   * @param did 目标DID
   */
  async getDidPermissions(did: string): Promise<AxiosResponse<{ permissions: Permission[] }>> {
    logger.info('API:Permission', '开始请求DID权限列表', { did });
    try {
      const response = await axios.get(`${API_BASE_URL}/did/${did}`);
      logger.info('API:Permission', '请求DID权限列表成功', {
        count: response.data.permissions.length,
      });
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '请求DID权限列表失败', { did, error: error.message });
      throw error;
    }
  },

  /**
   * 验证权限
   * @param did 目标DID
   * @param resourceId 资源ID
   * @param action 操作类型
   */
  async verifyPermission(
    did: string,
    resourceId: string,
    action: string
  ): Promise<AxiosResponse<{ allowed: boolean; reason?: string }>> {
    logger.info('API:Permission', '开始验证权限', { did, resourceId, action });
    try {
      const response = await axios.post(`${API_BASE_URL}/verify`, { did, resourceId, action });
      logger.info('API:Permission', '验证权限成功', { allowed: response.data.allowed });
      return response;
    } catch (error: any) {
      logger.error('API:Permission', '验证权限失败', {
        did,
        resourceId,
        action,
        error: error.message,
      });
      throw error;
    }
  },
};
