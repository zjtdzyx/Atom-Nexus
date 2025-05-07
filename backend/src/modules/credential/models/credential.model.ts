import { ApiProperty } from '@nestjs/swagger';
import { CredentialType } from '../dto';

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

export class CredentialResponse {
  @ApiProperty({ description: '凭证唯一ID' })
  id: string;

  @ApiProperty({ description: '凭证类型', enum: CredentialType })
  type: CredentialType;

  @ApiProperty({ description: '凭证签发者ID' })
  issuerId: string;

  @ApiProperty({ description: '凭证主题ID' })
  subjectId: string;

  @ApiProperty({ description: '凭证创建时间' })
  issuanceDate: string;

  @ApiProperty({ description: '凭证过期时间', required: false })
  expirationDate?: string;

  @ApiProperty({ description: '凭证状态', enum: CredentialStatus })
  status: CredentialStatus;

  @ApiProperty({ description: '凭证存证交易哈希', required: false })
  transactionHash?: string;
}

export class CredentialDetailResponse extends CredentialResponse {
  @ApiProperty({ description: '凭证主题完整信息' })
  subject: Record<string, any>;

  @ApiProperty({ description: '凭证声明内容' })
  claims: Record<string, any>;

  @ApiProperty({ description: '凭证证明信息' })
  proof: {
    @ApiProperty({ description: '证明类型' })
    type: string;

    @ApiProperty({ description: '证明创建时间' })
    created: string;

    @ApiProperty({ description: '验证方法' })
    verificationMethod: string;

    @ApiProperty({ description: '证明目的' })
    proofPurpose: string;

    @ApiProperty({ description: '签名值' })
    signatureValue: string;
  };
}

export class CredentialShareResponse {
  @ApiProperty({ description: '凭证分享ID' })
  shareId: string;

  @ApiProperty({ description: '凭证ID' })
  credentialId: string;

  @ApiProperty({ description: '分享链接' })
  shareUrl: string;

  @ApiProperty({ description: '分享二维码数据 (Base64)' })
  qrCodeData?: string;

  @ApiProperty({ description: '分享创建时间' })
  createdAt: string;

  @ApiProperty({ description: '分享过期时间', required: false })
  expiresAt?: string;
}

export class RevokeCredentialResponse {
  @ApiProperty({ description: '凭证ID' })
  credentialId: string;

  @ApiProperty({ description: '撤销状态', enum: CredentialStatus })
  status: CredentialStatus;

  @ApiProperty({ description: '撤销时间' })
  revokedAt: string;

  @ApiProperty({ description: '撤销者ID' })
  revokedBy: string;

  @ApiProperty({ description: '撤销原因', required: false })
  reason?: string;

  @ApiProperty({ description: '链上撤销交易哈希', required: false })
  transactionHash?: string;
} 