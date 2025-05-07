import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class CredentialProof {
  @ApiProperty({
    description: '证明类型',
    example: 'EcdsaSecp256k1Signature2019'
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: '签名值',
    example: 'z58dJ9......G9ycFxjk'
  })
  @IsString()
  @IsNotEmpty()
  signatureValue: string;

  @ApiProperty({
    description: '创建时间',
    example: '2023-05-10T12:30:45Z'
  })
  @IsString()
  @IsOptional()
  created?: string;

  @ApiProperty({
    description: '验证方法',
    example: 'did:atom:issuer123#keys-1'
  })
  @IsString()
  @IsOptional()
  verificationMethod?: string;
}

export class VerifyCredentialDto {
  @ApiProperty({
    description: '凭证ID',
    example: 'vc-123456789',
    required: false
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: '完整凭证内容（如果没有提供ID）',
    type: 'object',
    required: false
  })
  @IsObject()
  @IsOptional()
  credential?: Record<string, any>;

  @ApiProperty({
    description: '凭证证明信息',
    required: true
  })
  @ValidateNested()
  @Type(() => CredentialProof)
  @IsNotEmpty()
  proof: CredentialProof;

  @ApiProperty({
    description: '是否检查撤销状态',
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  checkRevocationStatus?: boolean;

  @ApiProperty({
    description: '是否验证签发者',
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  verifyIssuer?: boolean;
} 