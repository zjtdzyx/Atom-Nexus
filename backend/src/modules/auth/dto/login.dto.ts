import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '是否记住登录状态',
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
