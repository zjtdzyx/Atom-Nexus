import { ApiProperty } from '@nestjs/swagger';
import { DeveloperType, ApplicationScenario } from './developer-register.dto';

export enum DeveloperStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export class DeveloperResponseDto {
  @ApiProperty({
    description: '开发者ID',
    example: 'dev-123456',
  })
  id: string;

  @ApiProperty({
    description: '开发者/公司名称',
    example: '创新科技有限公司',
  })
  name: string;

  @ApiProperty({
    description: '联系人',
    example: '张三',
  })
  contactPerson: string;

  @ApiProperty({
    description: '联系邮箱',
    example: 'contact@example.com',
  })
  email: string;

  @ApiProperty({
    description: '联系电话',
    example: '+8613812345678',
  })
  phone: string;

  @ApiProperty({
    description: '开发者类型',
    enum: DeveloperType,
    example: DeveloperType.ORGANIZATION,
  })
  type: DeveloperType;

  @ApiProperty({
    description: '开发者状态',
    enum: DeveloperStatus,
    example: DeveloperStatus.APPROVED,
  })
  status: DeveloperStatus;

  @ApiProperty({
    description: '应用场景',
    enum: ApplicationScenario,
    isArray: true,
    example: [ApplicationScenario.IDENTITY_VERIFICATION, ApplicationScenario.CREDENTIAL_ISSUANCE],
  })
  scenarios: ApplicationScenario[];

  @ApiProperty({
    description: '项目/应用名称',
    example: '身份通行证',
  })
  applicationName: string;

  @ApiProperty({
    description: '项目/应用描述',
    example: '基于区块链的分布式身份认证系统',
  })
  applicationDescription: string;

  @ApiProperty({
    description: '项目网站',
    required: false,
    example: 'https://example.com',
  })
  website?: string;

  @ApiProperty({
    description: 'API密钥',
    example: 'ak_2x4F9eJ8sK7tL1pQ5zR3vN6b',
  })
  apiKey: string;

  @ApiProperty({
    description: 'API密钥创建时间',
    example: '2023-05-20T10:30:45Z',
  })
  apiKeyCreatedAt: string;

  @ApiProperty({
    description: '注册时间',
    example: '2023-05-20T10:30:45Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '更新时间',
    example: '2023-05-20T15:45:30Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: '开发者控制台URL',
    example: 'https://developers.atom-nexus.com/dashboard',
  })
  dashboardUrl: string;

  @ApiProperty({
    description: '文档链接',
    example: 'https://docs.atom-nexus.com',
  })
  documentationUrl: string;
}

export class DeveloperRegisterResponseDto {
  @ApiProperty({
    description: '注册状态',
    enum: ['success', 'pending', 'failed'],
    example: 'success',
  })
  status: 'success' | 'pending' | 'failed';

  @ApiProperty({
    description: '消息',
    example: '开发者注册成功',
  })
  message: string;

  @ApiProperty({
    description: '开发者信息',
    type: DeveloperResponseDto,
  })
  developer: DeveloperResponseDto;
}
