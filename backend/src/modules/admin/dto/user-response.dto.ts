import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DEVELOPER = 'developer',
  ISSUER = 'issuer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class UserResponseDto {
  @ApiProperty({
    description: '用户ID',
    example: 'usr-123456',
  })
  id: string;

  @ApiProperty({
    description: '用户名',
    example: 'zhangsan',
  })
  username: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'zhangsan@example.com',
  })
  email: string;

  @ApiProperty({
    description: '手机号码',
    example: '+8613512345678',
  })
  phone: string;

  @ApiProperty({
    description: '真实姓名',
    example: '张三',
  })
  realName: string;

  @ApiProperty({
    description: '用户角色',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: '用户状态',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: '用户DID',
    example: 'did:atom:123456789abcdefghi',
  })
  did: string;

  @ApiProperty({
    description: '注册时间',
    example: '2023-05-20T10:30:45Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '最后登录时间',
    example: '2023-07-15T14:22:18Z',
  })
  lastLoginAt: string;

  @ApiProperty({
    description: '关联的凭证数量',
    example: 5,
  })
  credentialCount: number;
}

export class UsersResponseDto {
  @ApiProperty({
    description: '用户列表',
    type: [UserResponseDto],
  })
  users: UserResponseDto[];

  @ApiProperty({
    description: '总数',
    example: 100,
  })
  total: number;
}
