import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class DecryptDataDto {
  @ApiProperty({
    description: '待解密的数据',
    example: 'U2FsdGVkX1+A2KAIw9vXqc7oQT...（加密后的数据）',
  })
  @IsNotEmpty({ message: '加密数据不能为空' })
  @IsString({ message: '加密数据必须是字符串' })
  encryptedData: string;

  @ApiProperty({
    description: '解密密钥',
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
