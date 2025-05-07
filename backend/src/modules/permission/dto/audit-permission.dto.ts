import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export enum AuditActionType {
  SET = 'set',
  ACCESS = 'access',
  REVOKE = 'revoke',
  UPDATE = 'update',
  ALL = 'all',
}

export class AuditPermissionDto {
  @ApiProperty({
    description: '开始时间',
    required: false,
    example: '2023-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: '结束时间',
    required: false,
    example: '2023-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: '用户DID',
    required: false,
    example: 'did:atom:user123',
  })
  @IsString()
  @IsOptional()
  userDid?: string;

  @ApiProperty({
    description: '目标DID（被授权者）',
    required: false,
    example: 'did:atom:recipient456',
  })
  @IsString()
  @IsOptional()
  targetDid?: string;

  @ApiProperty({
    description: '凭证ID',
    required: false,
    example: 'vc-123456789',
  })
  @IsString()
  @IsOptional()
  credentialId?: string;

  @ApiProperty({
    description: '操作类型',
    required: false,
    enum: AuditActionType,
    default: AuditActionType.ALL,
  })
  @IsEnum(AuditActionType)
  @IsOptional()
  actionType?: AuditActionType;

  @ApiProperty({
    description: '每页记录数',
    required: false,
    default: 10,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: '页码',
    required: false,
    default: 1,
  })
  @IsOptional()
  page?: number;
}
