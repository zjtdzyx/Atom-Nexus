import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user-response.dto';

export enum ResourceType {
  CREDENTIAL = 'credential',
  DID = 'did',
  USER = 'user',
  SYSTEM = 'system',
  API = 'api',
}

export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export class PermissionItemDto {
  @ApiProperty({
    description: '权限ID',
    example: 'perm-123456',
  })
  id: string;

  @ApiProperty({
    description: '角色',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;

  @ApiProperty({
    description: '资源类型',
    enum: ResourceType,
    example: ResourceType.CREDENTIAL,
  })
  resourceType: ResourceType;

  @ApiProperty({
    description: '操作类型',
    enum: OperationType,
    example: OperationType.READ,
  })
  operation: OperationType;

  @ApiProperty({
    description: '是否允许',
    example: true,
  })
  isAllowed: boolean;

  @ApiProperty({
    description: '权限描述',
    example: '允许管理员读取所有凭证信息',
  })
  description: string;

  @ApiProperty({
    description: '创建时间',
    example: '2023-04-12T08:15:30Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '更新时间',
    example: '2023-04-12T08:15:30Z',
  })
  updatedAt: string;
}

export class RolePermissionDto {
  @ApiProperty({
    description: '角色',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;

  @ApiProperty({
    description: '角色描述',
    example: '系统管理员，拥有最高权限',
  })
  description: string;

  @ApiProperty({
    description: '权限列表',
    type: [PermissionItemDto],
  })
  permissions: PermissionItemDto[];
}

export class PermissionsResponseDto {
  @ApiProperty({
    description: '角色权限列表',
    type: [RolePermissionDto],
  })
  rolePermissions: RolePermissionDto[];

  @ApiProperty({
    description: '总角色数',
    example: 4,
  })
  totalRoles: number;

  @ApiProperty({
    description: '总权限项数',
    example: 25,
  })
  totalPermissions: number;

  @ApiProperty({
    description: '最后更新时间',
    example: '2023-07-10T11:20:35Z',
  })
  lastUpdatedAt: string;
}
