import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class RecoverDidDto {
  @ApiProperty({ 
    description: '需要恢复的DID标识符', 
    example: 'did:example:123456789abcdef'
  })
  @IsString()
  @IsNotEmpty()
  did: string;

  @ApiProperty({ 
    description: '关联邮箱', 
    required: false,
    example: 'user@example.com'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    description: '恢复验证码', 
    required: false,
    example: '123456'
  })
  @IsString()
  @IsOptional()
  verificationCode?: string;

  @ApiProperty({ 
    description: '备用邮箱', 
    required: false,
    example: 'recovery@example.com'
  })
  @IsEmail()
  @IsOptional()
  recoveryEmail?: string;

  @ApiProperty({ 
    description: '安全问题答案', 
    required: false,
    example: {
      '我的生日是？': '2000-01-01',
      '我的家乡是？': '北京'
    }
  })
  @IsObject()
  @IsOptional()
  securityAnswers?: Record<string, string>;

  @ApiProperty({ 
    description: '其他恢复信息', 
    required: false,
    example: { phoneNumber: '+86123456789' }
  })
  @IsObject()
  @IsOptional()
  additionalRecoveryInfo?: Record<string, any>;
} 