import { ApiProperty } from '@nestjs/swagger';

export class UserStatsDto {
  @ApiProperty({
    description: '总用户数',
    example: 5280,
  })
  totalUsers: number;

  @ApiProperty({
    description: '活跃用户数',
    example: 3150,
  })
  activeUsers: number;

  @ApiProperty({
    description: '今日新增用户',
    example: 48,
  })
  newUsersToday: number;

  @ApiProperty({
    description: '本周新增用户',
    example: 325,
  })
  newUsersThisWeek: number;

  @ApiProperty({
    description: '本月新增用户',
    example: 1200,
  })
  newUsersThisMonth: number;
}

export class CredentialStatsDto {
  @ApiProperty({
    description: '总凭证数',
    example: 15240,
  })
  totalCredentials: number;

  @ApiProperty({
    description: '活跃凭证数',
    example: 14200,
  })
  activeCredentials: number;

  @ApiProperty({
    description: '已撤销凭证数',
    example: 520,
  })
  revokedCredentials: number;

  @ApiProperty({
    description: '今日签发凭证',
    example: 125,
  })
  issuedToday: number;

  @ApiProperty({
    description: '本周签发凭证',
    example: 850,
  })
  issuedThisWeek: number;

  @ApiProperty({
    description: '本月签发凭证',
    example: 3600,
  })
  issuedThisMonth: number;
}

export class SystemStatsDto {
  @ApiProperty({
    description: '系统启动时间',
    example: '2023-07-01T00:00:00Z',
  })
  startTime: string;

  @ApiProperty({
    description: '运行时长（小时）',
    example: 720,
  })
  uptime: number;

  @ApiProperty({
    description: 'CPU使用率',
    example: 45.8,
  })
  cpuUsage: number;

  @ApiProperty({
    description: '内存使用率',
    example: 62.3,
  })
  memoryUsage: number;

  @ApiProperty({
    description: '磁盘使用率',
    example: 38.7,
  })
  diskUsage: number;

  @ApiProperty({
    description: '今日API调用总数',
    example: 25840,
  })
  apiCallsToday: number;

  @ApiProperty({
    description: '平均响应时间（毫秒）',
    example: 85,
  })
  avgResponseTime: number;
}

export class StatsResponseDto {
  @ApiProperty({
    description: '用户统计',
    type: UserStatsDto,
  })
  userStats: UserStatsDto;

  @ApiProperty({
    description: '凭证统计',
    type: CredentialStatsDto,
  })
  credentialStats: CredentialStatsDto;

  @ApiProperty({
    description: '系统统计',
    type: SystemStatsDto,
  })
  systemStats: SystemStatsDto;

  @ApiProperty({
    description: '统计数据生成时间',
    example: '2023-07-30T12:34:56Z',
  })
  generatedAt: string;
}
