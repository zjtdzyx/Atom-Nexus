import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CredentialType {
  IDENTITY = 'identity',
  EDUCATION = 'education',
  EMPLOYMENT = 'employment',
  CERTIFICATION = 'certification',
  MEMBERSHIP = 'membership',
  CUSTOM = 'custom',
}

class SubjectData {
  @ApiProperty({ description: '凭证主题的ID (通常是DID)' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '凭证主题的名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '其他自定义属性', required: false, type: 'object' })
  @IsObject()
  @IsOptional()
  additionalData?: Record<string, any>;

  [key: string]: any;
}

export class IssueCredentialDto {
  @ApiProperty({
    description: '凭证类型',
    enum: CredentialType,
    example: CredentialType.IDENTITY,
  })
  @IsEnum(CredentialType)
  @IsNotEmpty()
  type: CredentialType;

  @ApiProperty({ description: '签发者ID (DID)', example: 'did:atom:issuer123' })
  @IsString()
  @IsNotEmpty()
  issuerId: string;

  @ApiProperty({ description: '凭证主题信息' })
  @ValidateNested()
  @Type(() => SubjectData)
  @IsNotEmpty()
  subject: SubjectData;

  @ApiProperty({
    description: '凭证有效期(ISO日期字符串)',
    required: false,
    example: '2025-12-31T23:59:59Z',
  })
  @IsString()
  @IsOptional()
  expirationDate?: string;

  @ApiProperty({ description: '凭证内容/声明', type: 'object' })
  @IsObject()
  @IsNotEmpty()
  claims: Record<string, any>;

  @ApiProperty({ description: '凭证上链存证', default: true })
  @IsOptional()
  storeOnChain?: boolean;
}
