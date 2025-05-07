import { ApiProperty } from '@nestjs/swagger';
import { PermissionType, PermissionScope } from './set-permission.dto';
import { AuditActionType } from './audit-permission.dto';

export class PermissionConfigResponse {
  @ApiProperty({
    description: '权限配置ID',
    example: 'perm-123456789'
  })
  id: string;

  @ApiProperty({
    description: '授权者DID',
    example: 'did:atom:owner123'
  })
  ownerDid: string;

  @ApiProperty({
    description: '被授权者DID',
    example: 'did:atom:recipient456'
  })
  recipientDid: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    example: PermissionType.PERSISTENT
  })
  type: PermissionType;

  @ApiProperty({
    description: '凭证权限配置',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        credentialId: { type: 'string', example: 'vc-123456789' },
        scopes: { type: 'array', items: { type: 'string', enum: Object.values(PermissionScope) } },
        fields: { type: 'array', items: { type: 'string' }, example: ['name', 'email'] }
      }
    }
  })
  credentials: Array<{
    credentialId: string;
    scopes: PermissionScope[];
    fields?: string[];
  }>;

  @ApiProperty({
    description: '创建时间',
    example: '2023-05-20T10:30:45Z'
  })
  createdAt: string;

  @ApiProperty({
    description: '更新时间',
    example: '2023-05-20T10:30:45Z'
  })
  updatedAt: string;

  @ApiProperty({
    description: '过期时间',
    required: false,
    example: '2024-12-31T23:59:59Z'
  })
  expiresAt?: string;

  @ApiProperty({
    description: '权限状态',
    enum: ['active', 'expired', 'revoked'],
    example: 'active'
  })
  status: 'active' | 'expired' | 'revoked';

  @ApiProperty({
    description: '附加说明',
    required: false,
    example: '用于职位申请验证'
  })
  description?: string;
}

export class AuditLogEntry {
  @ApiProperty({
    description: '审计日志ID',
    example: 'log-123456789'
  })
  id: string;

  @ApiProperty({
    description: '操作时间',
    example: '2023-05-20T10:30:45Z'
  })
  timestamp: string;

  @ApiProperty({
    description: '操作类型',
    enum: AuditActionType,
    example: AuditActionType.ACCESS
  })
  actionType: AuditActionType;

  @ApiProperty({
    description: '用户DID',
    example: 'did:atom:user123'
  })
  userDid: string;

  @ApiProperty({
    description: '目标DID',
    required: false,
    example: 'did:atom:recipient456'
  })
  targetDid?: string;

  @ApiProperty({
    description: '凭证ID',
    required: false,
    example: 'vc-123456789'
  })
  credentialId?: string;

  @ApiProperty({
    description: '权限ID',
    required: false,
    example: 'perm-123456789'
  })
  permissionId?: string;

  @ApiProperty({
    description: '操作详情',
    type: 'object',
    required: false
  })
  details?: Record<string, any>;

  @ApiProperty({
    description: 'IP地址',
    required: false,
    example: '192.168.1.1'
  })
  ipAddress?: string;

  @ApiProperty({
    description: '用户代理',
    required: false,
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  })
  userAgent?: string;
}

export class AuditLogResponse {
  @ApiProperty({
    description: '审计日志列表',
    type: [AuditLogEntry]
  })
  logs: AuditLogEntry[];

  @ApiProperty({
    description: '总记录数',
    example: 50
  })
  total: number;

  @ApiProperty({
    description: '页码',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: '每页记录数',
    example: 10
  })
  limit: number;
}

export class SetPermissionResponse {
  @ApiProperty({
    description: '操作状态',
    enum: ['success', 'failed'],
    example: 'success'
  })
  status: 'success' | 'failed';

  @ApiProperty({
    description: '消息',
    example: '权限设置成功'
  })
  message: string;

  @ApiProperty({
    description: '权限配置',
    type: PermissionConfigResponse
  })
  permission: PermissionConfigResponse;
} 