import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class EncryptDataDto {
  @ApiProperty({
    description: '待加密的数据',
    example: { username: '张三', id: '12345', email: 'zhangsan@example.com' },
  })
  @IsNotEmpty({ message: '数据不能为空' })
  data: string | Record<string, any>;

  @ApiProperty({
    description: '加密密钥',
    example: 'c9b5ad78e31a4c87a8ef8f49b5fb4e13',
  })
  @IsNotEmpty({ message: '密钥不能为空' })
  @IsString({ message: '密钥必须是字符串' })
  key: string;

  @ApiProperty({
    description: '加密算法',
    example: 'AES-256-CBC',
    required: false,
    default: 'AES-256-CBC',
  })
  @IsOptional()
  @IsString({ message: '加密算法必须是字符串' })
  algorithm?: string;
}
