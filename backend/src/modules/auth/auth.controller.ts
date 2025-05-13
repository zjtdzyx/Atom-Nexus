import { Controller, Post, Body, HttpStatus, HttpCode, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  VerifyDidDto,
  VerifyCredentialDto,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  CheckAvailabilityDto,
} from './dto';
import {
  DidVerificationResult,
  CredentialVerificationResult,
  LoginResponse,
} from './models/auth.model';

@ApiTags('身份认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
    type: LoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '用户名或密码错误',
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '注册成功',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '注册信息无效',
  })
  async register(@Body() dto: RegisterDto): Promise<{ success: boolean; message: string }> {
    return this.authService.register(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登出成功',
  })
  async logout(): Promise<void> {
    return this.authService.logout();
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '令牌刷新成功',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '刷新令牌无效或已过期',
  })
  async refreshToken(
    @Body() dto: RefreshTokenDto
  ): Promise<{ accessToken: string; expiresIn: number }> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Get('check-username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '检查用户名是否可用' })
  @ApiQuery({ name: 'username', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户名可用性检查结果',
  })
  async checkUsernameAvailability(
    @Query('username') username: string
  ): Promise<{ available: boolean }> {
    return this.authService.checkUsernameAvailability(username);
  }

  @Get('check-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '检查邮箱是否可用' })
  @ApiQuery({ name: 'email', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '邮箱可用性检查结果',
  })
  async checkEmailAvailability(@Query('email') email: string): Promise<{ available: boolean }> {
    return this.authService.checkEmailAvailability(email);
  }

  @Post('verify-did')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '验证DID的真实性' })
  @ApiBody({ type: VerifyDidDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'DID验证结果',
    type: DidVerificationResult,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'DID格式无效或参数错误',
  })
  async verifyDid(@Body() dto: VerifyDidDto): Promise<DidVerificationResult> {
    return this.authService.verifyDid(dto);
  }

  @Post('verify-credential')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '验证VC凭证的有效性' })
  @ApiBody({ type: VerifyCredentialDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '凭证验证结果',
    type: CredentialVerificationResult,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '凭证格式无效或参数错误',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '凭证未找到',
  })
  async verifyCredential(@Body() dto: VerifyCredentialDto): Promise<CredentialVerificationResult> {
    return this.authService.verifyCredential(dto);
  }
}
