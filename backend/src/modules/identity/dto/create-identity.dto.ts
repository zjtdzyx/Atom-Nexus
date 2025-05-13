import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIdentityDto {
  @ApiProperty({ description: 'DID标识符', example: 'did:ethr:0x1234...' })
  @IsString()
  did: string;

  @ApiProperty({ description: '身份别名', example: '我的主身份' })
  @IsString()
  alias: string;

  @ApiProperty({ description: '身份类型', example: 'personal' })
  @IsString()
  type: string;

  @ApiProperty({ description: '公钥', example: '0x1234...' })
  @IsString()
  publicKey: string;

  @ApiProperty({ description: '元数据', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
