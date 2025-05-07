import { ApiProperty } from '@nestjs/swagger';

export enum CredentialType {
  IDENTITY = 'identity',
  EDUCATION = 'education',
  EMPLOYMENT = 'employment',
  MEMBERSHIP = 'membership',
  CERTIFICATE = 'certificate',
  OTHER = 'other',
}

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
}

export class CredentialResponseDto {
  @ApiProperty({
    description: '凭证ID',
    example: 'cred-123456',
  })
  id: string;

  @ApiProperty({
    description: '凭证类型',
    enum: CredentialType,
    example: CredentialType.IDENTITY,
  })
  type: CredentialType;

  @ApiProperty({
    description: '凭证状态',
    enum: CredentialStatus,
    example: CredentialStatus.ACTIVE,
  })
  status: CredentialStatus;

  @ApiProperty({
    description: '签发方DID',
    example: 'did:atom:issuer123456789',
  })
  issuerId: string;

  @ApiProperty({
    description: '签发方名称',
    example: '北京市公安局',
  })
  issuerName: string;

  @ApiProperty({
    description: '持有者DID',
    example: 'did:atom:holder123456789',
  })
  holderId: string;

  @ApiProperty({
    description: '持有者名称',
    example: '张三',
  })
  holderName: string;

  @ApiProperty({
    description: '签发日期',
    example: '2023-06-15T09:20:30Z',
  })
  issuanceDate: string;

  @ApiProperty({
    description: '过期日期',
    example: '2025-06-15T09:20:30Z',
  })
  expirationDate: string;

  @ApiProperty({
    description: '凭证内容摘要',
    example: '身份认证凭证，包含基本身份信息',
  })
  summary: string;

  @ApiProperty({
    description: '凭证使用次数',
    example: 3,
  })
  usageCount: number;

  @ApiProperty({
    description: '最后使用时间',
    example: '2023-07-20T15:45:22Z',
  })
  lastUsedAt: string;
}

export class CredentialsResponseDto {
  @ApiProperty({
    description: '凭证列表',
    type: [CredentialResponseDto],
  })
  credentials: CredentialResponseDto[];

  @ApiProperty({
    description: '总数',
    example: 200,
  })
  total: number;
}
