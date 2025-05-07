import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  SetPermissionDto,
  AuditPermissionDto,
  PermissionConfigResponse,
  AuditLogResponse,
  AuditLogEntry,
  SetPermissionResponse,
  AuditActionType,
} from './dto';

@Injectable()
export class PermissionService {
  // 模拟数据存储
  private permissions: Map<string, PermissionConfigResponse> = new Map();
  private auditLogs: AuditLogEntry[] = [];

  /**
   * 设置权限
   */
  async setPermission(dto: SetPermissionDto): Promise<SetPermissionResponse> {
    try {
      // 生成权限ID
      const id = `perm-${uuidv4()}`;
      const now = new Date().toISOString();

      // 创建权限配置
      const permission: PermissionConfigResponse = {
        id,
        ownerDid: dto.ownerDid,
        recipientDid: dto.recipientDid,
        type: dto.type,
        credentials: dto.credentials,
        createdAt: now,
        updatedAt: now,
        expiresAt: dto.expiresAt,
        status: 'active',
        description: dto.description,
      };

      // 保存权限配置
      this.permissions.set(id, permission);

      // 记录审计日志
      if (dto.audit !== false) {
        this.createAuditLog({
          actionType: AuditActionType.SET,
          userDid: dto.ownerDid,
          targetDid: dto.recipientDid,
          permissionId: id,
          details: {
            permissionType: dto.type,
            credentials: dto.credentials.map((c) => c.credentialId),
          },
        });
      }

      // 返回设置结果
      return {
        status: 'success',
        message: '权限设置成功',
        permission,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `权限设置失败: ${error.message}`,
        permission: null,
      };
    }
  }

  /**
   * 查询权限审计日志
   */
  async auditPermissions(dto: AuditPermissionDto): Promise<AuditLogResponse> {
    const {
      startDate,
      endDate,
      userDid,
      targetDid,
      credentialId,
      actionType = AuditActionType.ALL,
      page = 1,
      limit = 10,
    } = dto;

    // 查询条件过滤
    let filteredLogs = [...this.auditLogs];

    // 时间范围过滤
    if (startDate) {
      const startTime = new Date(startDate).getTime();
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp).getTime() >= startTime);
    }

    if (endDate) {
      const endTime = new Date(endDate).getTime();
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp).getTime() <= endTime);
    }

    // 用户DID过滤
    if (userDid) {
      filteredLogs = filteredLogs.filter((log) => log.userDid === userDid);
    }

    // 目标DID过滤
    if (targetDid) {
      filteredLogs = filteredLogs.filter((log) => log.targetDid === targetDid);
    }

    // 凭证ID过滤
    if (credentialId) {
      filteredLogs = filteredLogs.filter((log) => log.credentialId === credentialId);
    }

    // 操作类型过滤
    if (actionType !== AuditActionType.ALL) {
      filteredLogs = filteredLogs.filter((log) => log.actionType === actionType);
    }

    // 按时间倒序排序
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 计算分页
    const total = filteredLogs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return {
      logs: paginatedLogs,
      total,
      page,
      limit,
    };
  }

  /**
   * 根据DID查询权限配置
   */
  async getPermissionByDid(did: string): Promise<PermissionConfigResponse[]> {
    if (!did) {
      throw new BadRequestException('DID不能为空');
    }

    // 查找该DID作为授权者或接收者的所有权限配置
    const didPermissions: PermissionConfigResponse[] = [];

    for (const permission of this.permissions.values()) {
      if (permission.ownerDid === did || permission.recipientDid === did) {
        // 检查权限是否已过期
        if (permission.expiresAt && new Date(permission.expiresAt) < new Date()) {
          permission.status = 'expired';
        }

        didPermissions.push(permission);
      }
    }

    if (didPermissions.length === 0) {
      throw new NotFoundException(`未找到DID: ${did} 的权限配置`);
    }

    // 记录审计日志
    this.createAuditLog({
      actionType: AuditActionType.ACCESS,
      userDid: did,
      details: {
        action: 'permission_query',
        count: didPermissions.length,
      },
    });

    return didPermissions;
  }

  /**
   * 创建审计日志
   */
  private createAuditLog(data: {
    actionType: AuditActionType;
    userDid: string;
    targetDid?: string;
    credentialId?: string;
    permissionId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): void {
    const logEntry: AuditLogEntry = {
      id: `log-${uuidv4()}`,
      timestamp: new Date().toISOString(),
      actionType: data.actionType,
      userDid: data.userDid,
      targetDid: data.targetDid,
      credentialId: data.credentialId,
      permissionId: data.permissionId,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    };

    this.auditLogs.push(logEntry);
  }
}
