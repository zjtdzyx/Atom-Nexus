import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RevokeCredentialDto {
  @ApiProperty({ 
    description: '撤销原因', 
    required: false,
    example: '信息过期' 
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ 
    description: '撤销操作者ID', 
    required: true,
    example: 'did:atom:issuer123' 
  })
  @IsString()
  @IsNotEmpty()
  revokedBy: string;

  @ApiProperty({ 
    description: '是否在链上记录撤销状态', 
    required: false,
    default: true 
  })
  @IsOptional()
  storeOnChain?: boolean;
} 