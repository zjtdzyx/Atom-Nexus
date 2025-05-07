import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

export enum DeveloperType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
  ENTERPRISE = 'enterprise',
  EDUCATIONAL = 'educational',
}

export enum ApplicationScenario {
  IDENTITY_VERIFICATION = 'identity_verification',
  ACCESS_CONTROL = 'access_control',
  DOCUMENT_VERIFICATION = 'document_verification',
  CREDENTIAL_ISSUANCE = 'credential_issuance',
  OTHER = 'other',
}

export class DeveloperRegisterDto {
  @ApiProperty({
    description: '开发者/公司名称',
    example: '创新科技有限公司',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '联系人',
    example: '张三',
  })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({
    description: '联系邮箱',
    example: 'contact@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '联系电话',
    example: '+8613812345678',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: '开发者类型',
    enum: DeveloperType,
    example: DeveloperType.ORGANIZATION,
  })
  @IsEnum(DeveloperType)
  @IsNotEmpty()
  type: DeveloperType;

  @ApiProperty({
    description: '应用场景',
    enum: ApplicationScenario,
    isArray: true,
    example: [ApplicationScenario.IDENTITY_VERIFICATION, ApplicationScenario.CREDENTIAL_ISSUANCE],
  })
  @IsEnum(ApplicationScenario, { each: true })
  @IsNotEmpty()
  scenarios: ApplicationScenario[];

  @ApiProperty({
    description: '项目/应用名称',
    example: '身份通行证',
  })
  @IsString()
  @IsNotEmpty()
  applicationName: string;

  @ApiProperty({
    description: '项目/应用描述',
    example: '基于区块链的分布式身份认证系统',
  })
  @IsString()
  @IsNotEmpty()
  applicationDescription: string;

  @ApiProperty({
    description: '项目网站',
    required: false,
    example: 'https://example.com',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: '预计调用量/月',
    required: false,
    example: '10000',
  })
  @IsString()
  @IsOptional()
  estimatedRequestsPerMonth?: string;

  @ApiProperty({
    description: '附加信息',
    required: false,
    example: '我们希望接入贵平台的DID认证系统，用于企业级身份验证',
  })
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
