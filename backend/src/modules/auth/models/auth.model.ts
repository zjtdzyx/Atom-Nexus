import { ApiProperty } from '@nestjs/swagger';

export enum VerificationStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

export class DidVerificationResult {
  @ApiProperty({
    description: '验证状态',
    enum: VerificationStatus,
    example: VerificationStatus.SUCCESS
  })
  status: VerificationStatus;

  @ApiProperty({
    description: '验证消息',
    example: 'DID验证成功'
  })
  message: string;

  @ApiProperty({
    description: '验证的DID标识符',
    example: 'did:atom:123456789abcdefghi'
  })
  did: string;

  @ApiProperty({
    description: 'DID文档',
    type: 'object',
    required: false
  })
  didDocument?: Record<string, any>;

  @ApiProperty({
    description: 'DID控制者',
    example: '0x123456789abcdef',
    required: false
  })
  controller?: string;

  @ApiProperty({
    description: '公钥信息',
    type: 'array',
    required: false
  })
  publicKeys?: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyHex?: string;
    publicKeyBase58?: string;
  }>;

  @ApiProperty({
    description: '验证详情',
    type: 'object',
    required: false
  })
  details?: Record<string, any>;
}

export class CredentialVerificationResult {
  @ApiProperty({
    description: '验证状态',
    enum: VerificationStatus,
    example: VerificationStatus.SUCCESS
  })
  status: VerificationStatus;

  @ApiProperty({
    description: '验证消息',
    example: '凭证验证成功'
  })
  message: string;

  @ApiProperty({
    description: '凭证ID',
    example: 'vc-123456789',
    required: false
  })
  credentialId?: string;

  @ApiProperty({
    description: '签发者DID',
    example: 'did:atom:issuer123',
    required: false
  })
  issuer?: string;

  @ApiProperty({
    description: '签名验证结果',
    type: 'boolean'
  })
  signatureValid: boolean;

  @ApiProperty({
    description: '凭证是否过期',
    type: 'boolean',
    required: false
  })
  isExpired?: boolean;

  @ApiProperty({
    description: '凭证是否被撤销',
    type: 'boolean',
    required: false
  })
  isRevoked?: boolean;

  @ApiProperty({
    description: '验证时间',
    example: '2023-05-10T15:30:45Z'
  })
  verifiedAt: string;

  @ApiProperty({
    description: '验证详情',
    type: 'object',
    required: false
  })
  details?: Record<string, any>;
} 