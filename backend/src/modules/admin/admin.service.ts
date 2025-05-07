import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  UsersResponseDto,
  UserResponseDto,
  UserRole,
  UserStatus,
  CredentialsResponseDto,
  CredentialResponseDto,
  CredentialType,
  CredentialStatus,
  PermissionsResponseDto,
  RolePermissionDto,
  PermissionItemDto,
  ResourceType,
  OperationType,
  StatsResponseDto,
  UserStatsDto,
  CredentialStatsDto,
  SystemStatsDto,
} from './dto';

@Injectable()
export class AdminService {
  // 模拟数据存储
  private users: UserResponseDto[] = [];
  private credentials: CredentialResponseDto[] = [];
  private permissions: PermissionItemDto[] = [];

  constructor() {
    // 初始化模拟数据
    this.initMockData();
  }

  /**
   * 获取所有用户信息
   */
  async getUsers(): Promise<UsersResponseDto> {
    return {
      users: this.users,
      total: this.users.length,
    };
  }

  /**
   * 获取所有凭证信息
   */
  async getCredentials(): Promise<CredentialsResponseDto> {
    return {
      credentials: this.credentials,
      total: this.credentials.length,
    };
  }

  /**
   * 获取权限配置信息
   */
  async getPermissions(): Promise<PermissionsResponseDto> {
    // 按角色分组权限
    const roleMap = new Map<UserRole, RolePermissionDto>();

    // 为每个角色创建初始对象
    Object.values(UserRole).forEach((role) => {
      roleMap.set(role, {
        role,
        description: this.getRoleDescription(role),
        permissions: [],
      });
    });

    // 将权限分配到对应的角色
    this.permissions.forEach((permission) => {
      const rolePermission = roleMap.get(permission.role);
      if (rolePermission) {
        rolePermission.permissions.push(permission);
      }
    });

    return {
      rolePermissions: Array.from(roleMap.values()),
      totalRoles: roleMap.size,
      totalPermissions: this.permissions.length,
      lastUpdatedAt: new Date().toISOString(),
    };
  }

  /**
   * 获取系统统计数据
   */
  async getStats(): Promise<StatsResponseDto> {
    const userStats: UserStatsDto = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter((user) => user.status === UserStatus.ACTIVE).length,
      newUsersToday: 48, // 模拟数据
      newUsersThisWeek: 325, // 模拟数据
      newUsersThisMonth: 1200, // 模拟数据
    };

    const credentialStats: CredentialStatsDto = {
      totalCredentials: this.credentials.length,
      activeCredentials: this.credentials.filter((cred) => cred.status === CredentialStatus.ACTIVE)
        .length,
      revokedCredentials: this.credentials.filter(
        (cred) => cred.status === CredentialStatus.REVOKED
      ).length,
      issuedToday: 125, // 模拟数据
      issuedThisWeek: 850, // 模拟数据
      issuedThisMonth: 3600, // 模拟数据
    };

    const systemStats: SystemStatsDto = {
      startTime: '2023-07-01T00:00:00Z', // 模拟数据
      uptime: 720, // 模拟数据，单位小时
      cpuUsage: 45.8, // 模拟数据
      memoryUsage: 62.3, // 模拟数据
      diskUsage: 38.7, // 模拟数据
      apiCallsToday: 25840, // 模拟数据
      avgResponseTime: 85, // 模拟数据，单位毫秒
    };

    return {
      userStats,
      credentialStats,
      systemStats,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * 获取角色描述
   */
  private getRoleDescription(role: UserRole): string {
    const descriptions = {
      [UserRole.ADMIN]: '系统管理员，拥有最高权限',
      [UserRole.USER]: '普通用户，可使用基本功能',
      [UserRole.DEVELOPER]: '开发者，可访问开发者API',
      [UserRole.ISSUER]: '凭证签发者，可签发和管理凭证',
    };
    return descriptions[role];
  }

  /**
   * 初始化模拟数据
   */
  private initMockData(): void {
    // 初始化用户数据
    this.initMockUsers();
    // 初始化凭证数据
    this.initMockCredentials();
    // 初始化权限数据
    this.initMockPermissions();
  }

  /**
   * 初始化模拟用户数据
   */
  private initMockUsers(): void {
    // 添加一些模拟用户
    this.users = [
      {
        id: `usr-${uuidv4()}`,
        username: 'admin',
        email: 'admin@example.com',
        phone: '+8613900000000',
        realName: '管理员',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        did: `did:atom:${this.generateRandomString(16)}`,
        createdAt: '2023-01-01T00:00:00Z',
        lastLoginAt: '2023-07-29T08:45:12Z',
        credentialCount: 5,
      },
      {
        id: `usr-${uuidv4()}`,
        username: 'zhangsan',
        email: 'zhangsan@example.com',
        phone: '+8613912345678',
        realName: '张三',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        did: `did:atom:${this.generateRandomString(16)}`,
        createdAt: '2023-02-15T10:30:45Z',
        lastLoginAt: '2023-07-28T15:22:30Z',
        credentialCount: 3,
      },
      {
        id: `usr-${uuidv4()}`,
        username: 'lisi',
        email: 'lisi@example.com',
        phone: '+8613987654321',
        realName: '李四',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        did: `did:atom:${this.generateRandomString(16)}`,
        createdAt: '2023-03-10T14:25:30Z',
        lastLoginAt: '2023-07-25T09:10:45Z',
        credentialCount: 2,
      },
      {
        id: `usr-${uuidv4()}`,
        username: 'wangwu',
        email: 'wangwu@example.com',
        phone: '+8613567891234',
        realName: '王五',
        role: UserRole.DEVELOPER,
        status: UserStatus.ACTIVE,
        did: `did:atom:${this.generateRandomString(16)}`,
        createdAt: '2023-04-05T09:15:20Z',
        lastLoginAt: '2023-07-29T10:05:18Z',
        credentialCount: 4,
      },
      {
        id: `usr-${uuidv4()}`,
        username: 'zhaoliu',
        email: 'zhaoliu@example.com',
        phone: '+8613812345678',
        realName: '赵六',
        role: UserRole.ISSUER,
        status: UserStatus.ACTIVE,
        did: `did:atom:${this.generateRandomString(16)}`,
        createdAt: '2023-05-12T11:40:15Z',
        lastLoginAt: '2023-07-27T14:30:22Z',
        credentialCount: 8,
      },
    ];
  }

  /**
   * 初始化模拟凭证数据
   */
  private initMockCredentials(): void {
    // 添加一些模拟凭证
    this.credentials = [
      {
        id: `cred-${uuidv4()}`,
        type: CredentialType.IDENTITY,
        status: CredentialStatus.ACTIVE,
        issuerId: 'did:atom:issuer12345',
        issuerName: '北京市公安局',
        holderId: 'did:atom:holder12345',
        holderName: '张三',
        issuanceDate: '2023-03-15T09:20:30Z',
        expirationDate: '2025-03-15T09:20:30Z',
        summary: '身份认证凭证，包含基本身份信息',
        usageCount: 5,
        lastUsedAt: '2023-07-20T15:45:22Z',
      },
      {
        id: `cred-${uuidv4()}`,
        type: CredentialType.EDUCATION,
        status: CredentialStatus.ACTIVE,
        issuerId: 'did:atom:issuer54321',
        issuerName: '北京大学',
        holderId: 'did:atom:holder12345',
        holderName: '张三',
        issuanceDate: '2023-04-10T10:15:45Z',
        expirationDate: '2026-04-10T10:15:45Z',
        summary: '学历证明凭证，包含教育经历信息',
        usageCount: 2,
        lastUsedAt: '2023-06-05T09:30:15Z',
      },
      {
        id: `cred-${uuidv4()}`,
        type: CredentialType.EMPLOYMENT,
        status: CredentialStatus.ACTIVE,
        issuerId: 'did:atom:issuer67890',
        issuerName: '创新科技有限公司',
        holderId: 'did:atom:holder54321',
        holderName: '李四',
        issuanceDate: '2023-05-20T14:30:00Z',
        expirationDate: '2024-05-20T14:30:00Z',
        summary: '就业证明凭证，包含工作信息',
        usageCount: 1,
        lastUsedAt: '2023-07-01T11:20:35Z',
      },
      {
        id: `cred-${uuidv4()}`,
        type: CredentialType.CERTIFICATE,
        status: CredentialStatus.ACTIVE,
        issuerId: 'did:atom:issuer24680',
        issuerName: '中国软件协会',
        holderId: 'did:atom:holder67890',
        holderName: '王五',
        issuanceDate: '2023-06-15T08:45:30Z',
        expirationDate: '2026-06-15T08:45:30Z',
        summary: '专业技能认证凭证，认证软件开发能力',
        usageCount: 3,
        lastUsedAt: '2023-07-15T16:40:10Z',
      },
      {
        id: `cred-${uuidv4()}`,
        type: CredentialType.MEMBERSHIP,
        status: CredentialStatus.REVOKED,
        issuerId: 'did:atom:issuer13579',
        issuerName: '健身俱乐部',
        holderId: 'did:atom:holder24680',
        holderName: '赵六',
        issuanceDate: '2023-02-01T16:20:45Z',
        expirationDate: '2024-02-01T16:20:45Z',
        summary: '会员资格凭证，包含会员级别和权益',
        usageCount: 8,
        lastUsedAt: '2023-05-10T18:15:30Z',
      },
    ];
  }

  /**
   * 初始化模拟权限数据
   */
  private initMockPermissions(): void {
    // 创建模拟权限数据
    this.permissions = [
      // 管理员权限
      this.createPermissionItem(
        UserRole.ADMIN,
        ResourceType.USER,
        OperationType.CREATE,
        true,
        '允许管理员创建用户'
      ),
      this.createPermissionItem(
        UserRole.ADMIN,
        ResourceType.USER,
        OperationType.READ,
        true,
        '允许管理员查看所有用户'
      ),
      this.createPermissionItem(
        UserRole.ADMIN,
        ResourceType.USER,
        OperationType.UPDATE,
        true,
        '允许管理员更新用户信息'
      ),
      this.createPermissionItem(
        UserRole.ADMIN,
        ResourceType.USER,
        OperationType.DELETE,
        true,
        '允许管理员删除用户'
      ),
      this.createPermissionItem(
        UserRole.ADMIN,
        ResourceType.CREDENTIAL,
        OperationType.READ,
        true,
        '允许管理员查看所有凭证'
      ),
      this.createPermissionItem(
        UserRole.ADMIN,
        ResourceType.SYSTEM,
        OperationType.MANAGE,
        true,
        '允许管理员管理系统配置'
      ),

      // 普通用户权限
      this.createPermissionItem(
        UserRole.USER,
        ResourceType.USER,
        OperationType.READ,
        true,
        '允许用户查看自己的信息'
      ),
      this.createPermissionItem(
        UserRole.USER,
        ResourceType.USER,
        OperationType.UPDATE,
        true,
        '允许用户更新自己的信息'
      ),
      this.createPermissionItem(
        UserRole.USER,
        ResourceType.CREDENTIAL,
        OperationType.READ,
        true,
        '允许用户查看自己的凭证'
      ),

      // 开发者权限
      this.createPermissionItem(
        UserRole.DEVELOPER,
        ResourceType.API,
        OperationType.READ,
        true,
        '允许开发者查看API文档'
      ),
      this.createPermissionItem(
        UserRole.DEVELOPER,
        ResourceType.USER,
        OperationType.READ,
        true,
        '允许开发者查看自己的信息'
      ),
      this.createPermissionItem(
        UserRole.DEVELOPER,
        ResourceType.USER,
        OperationType.UPDATE,
        true,
        '允许开发者更新自己的信息'
      ),

      // 凭证签发者权限
      this.createPermissionItem(
        UserRole.ISSUER,
        ResourceType.CREDENTIAL,
        OperationType.CREATE,
        true,
        '允许签发者创建凭证'
      ),
      this.createPermissionItem(
        UserRole.ISSUER,
        ResourceType.CREDENTIAL,
        OperationType.READ,
        true,
        '允许签发者查看自己签发的凭证'
      ),
      this.createPermissionItem(
        UserRole.ISSUER,
        ResourceType.CREDENTIAL,
        OperationType.UPDATE,
        true,
        '允许签发者更新自己签发的凭证'
      ),
      this.createPermissionItem(
        UserRole.ISSUER,
        ResourceType.CREDENTIAL,
        OperationType.DELETE,
        false,
        '不允许签发者删除凭证'
      ),
    ];
  }

  /**
   * 创建单个权限项
   */
  private createPermissionItem(
    role: UserRole,
    resourceType: ResourceType,
    operation: OperationType,
    isAllowed: boolean,
    description: string
  ): PermissionItemDto {
    return {
      id: `perm-${uuidv4()}`,
      role,
      resourceType,
      operation,
      isAllowed,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * 生成随机字符串
   */
  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
