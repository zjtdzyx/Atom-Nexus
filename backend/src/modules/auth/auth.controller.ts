import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifyDidDto, VerifyCredentialDto } from './dto';
import { DidVerificationResult, CredentialVerificationResult } from './models/auth.model';

@ApiTags('身份认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-did')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '验证DID的真实性' })
  @ApiBody({ type: VerifyDidDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'DID验证结果', 
    type: DidVerificationResult 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'DID格式无效或参数错误' 
  })
  async verifyDid(
    @Body() dto: VerifyDidDto
  ): Promise<DidVerificationResult> {
    return this.authService.verifyDid(dto);
  }

  @Post('verify-credential')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '验证VC凭证的有效性' })
  @ApiBody({ type: VerifyCredentialDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: '凭证验证结果', 
    type: CredentialVerificationResult 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: '凭证格式无效或参数错误' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: '凭证未找到' 
  })
  async verifyCredential(
    @Body() dto: VerifyCredentialDto
  ): Promise<CredentialVerificationResult> {
    return this.authService.verifyCredential(dto);
  }
} 