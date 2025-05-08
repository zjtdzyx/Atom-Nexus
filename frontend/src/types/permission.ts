/**
 * 权限类型定义
 */

/**
 * 权限操作类型
 */
export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  DELEGATE = 'delegate',
  ADMIN = 'admin',
}

/**
 * 资源类型
 */
export enum ResourceType {
  CREDENTIAL = 'credential',
  IDENTITY = 'identity',
  DOCUMENT = 'document',
  SERVICE = 'service',
}

/**
 * 权限对象
 */
export interface Permission {
  id: string;
  targetDid: string;
  resourceId: string;
  resourceType: ResourceType;
  action: PermissionAction;
  grantedBy: string;
  grantedAt: string;
  expiresAt: string | null;
  revoked: boolean;
  revokedAt: string | null;
  revokedBy: string | null;
  conditions: PermissionCondition[];
  proof: PermissionProof | null;
}

/**
 * 权限条件
 */
export interface PermissionCondition {
  type: string;
  value: any;
}

/**
 * 权限验证证明
 */
export interface PermissionProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  signature: string;
}

/**
 * 权限审计日志
 */
export interface AuditLog {
  id: string;
  action: string;
  targetDid: string;
  resourceId: string;
  resourceType: string;
  performedBy: string;
  timestamp: string;
  details: Record<string, any>;
}

/**
 * 权限查询参数
 */
export interface PermissionQuery {
  targetDid?: string;
  resourceId?: string;
  resourceType?: ResourceType;
  action?: PermissionAction;
  includeRevoked?: boolean;
  page?: number;
  limit?: number;
}
