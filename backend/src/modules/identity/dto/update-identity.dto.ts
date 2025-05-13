import { IsString, IsOptional, IsObject, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IdentityStatus } from '../entities/identity.entity';

export class UpdateIdentityDto {
  @ApiProperty({ description: '身份别名', required: false })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty({ description: '是否默认', required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: '是否激活', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: '身份状态',
    enum: IdentityStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(IdentityStatus)
  status?: IdentityStatus;

  @ApiProperty({ description: '元数据', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
