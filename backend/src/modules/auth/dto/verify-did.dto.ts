import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VerifyDidDto {
  @ApiProperty({
    description: 'DID标识符',
    example: 'did:atom:123456789abcdefghi'
  })
  @IsString()
  @IsNotEmpty()
  did: string;

  @ApiProperty({
    description: '验证方法（可选）',
    required: false,
    enum: ['resolve', 'authenticate', 'full'],
    default: 'resolve'
  })
  @IsString()
  @IsOptional()
  method?: 'resolve' | 'authenticate' | 'full';

  @ApiProperty({
    description: '验证选项（可选）',
    required: false,
    type: 'object'
  })
  @IsOptional()
  options?: Record<string, any>;
} 