import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateDidDto {
  @ApiProperty({ 
    description: '用户钱包地址', 
    required: false,
    example: '0x1234567890abcdef1234567890abcdef12345678'
  })
  @IsString()
  @ValidateIf(o => !o.email && !o.socialAccount)
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({ 
    description: '用户邮箱', 
    required: false,
    example: 'user@example.com'
  })
  @IsEmail()
  @ValidateIf(o => !o.walletAddress && !o.socialAccount)
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    description: '社交账号标识符', 
    required: false,
    example: 'user123'
  })
  @IsString()
  @ValidateIf(o => !o.walletAddress && !o.email)
  @IsOptional()
  socialAccount?: string;

  @ApiProperty({ 
    description: '社交平台提供商（如 google、twitter）', 
    required: false,
    example: 'google'
  })
  @IsString()
  @ValidateIf(o => !!o.socialAccount)
  @IsOptional()
  provider?: string;

  @ApiProperty({ 
    description: '备用邮箱（用于恢复）', 
    required: false,
    example: 'recovery@example.com'
  })
  @IsEmail()
  @IsOptional()
  recoveryEmail?: string;

  @ApiProperty({ 
    description: '恢复选项（用于后续恢复身份）', 
    required: false,
    example: { securityQuestions: ['我的生日是？', '我的家乡是？'] }
  })
  @IsOptional()
  recoveryOptions?: Record<string, any>;
} 