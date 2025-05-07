import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PermissionType {
  ONE_TIME = 'one_time',
  PERSISTENT = 'persistent',
  PARTIAL = 'partial',
}

export enum PermissionScope {
  READ = 'read',
  VERIFY = 'verify',
  SHARE = 'share',
  FULL = 'full',
}

class CredentialPermission {
  @ApiProperty({
    description: '凭证ID',
    example: 'vc-123456789',
  })
  @IsString()
  @IsNotEmpty()
  credentialId: string;

  @ApiProperty({
    description: '授权范围',
    enum: PermissionScope,
    example: PermissionScope.READ,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PermissionScope, { each: true })
  scopes: PermissionScope[];

  @ApiProperty({
    description: '授权字段（仅部分授权时有效）',
    type: [String],
    required: false,
    example: ['name', 'email'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];
}

export class SetPermissionDto {
  @ApiProperty({
    description: '授权者DID',
    example: 'did:atom:owner123',
  })
  @IsString()
  @IsNotEmpty()
  ownerDid: string;

  @ApiProperty({
    description: '被授权者DID',
    example: 'did:atom:recipient456',
  })
  @IsString()
  @IsNotEmpty()
  recipientDid: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    example: PermissionType.PERSISTENT,
  })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiProperty({
    description: '凭证权限设置',
    type: [CredentialPermission],
  })
  @ValidateNested({ each: true })
  @Type(() => CredentialPermission)
  @IsArray()
  credentials: CredentialPermission[];

  @ApiProperty({
    description: '权限过期时间',
    required: false,
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({
    description: '是否记录审计日志',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  audit?: boolean;

  @ApiProperty({
    description: '附加说明',
    required: false,
    example: '用于职位申请验证',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
