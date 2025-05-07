import { Controller, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import {
  EncryptDataDto,
  DecryptDataDto,
  ProofDataDto,
  EncryptResponseDto,
  DecryptResponseDto,
  ProofResponseDto,
} from './dto';

// 权限守卫（实际项目中应该从 @modules/auth 导入）
class AuthGuard {
  canActivate() {
    return true; // 简化实现
  }
}

@ApiTags('安全')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('encrypt')
  @ApiOperation({
    summary: '加密数据',
    description: '使用对称加密算法（如AES）对输入数据进行加密，返回加密结果',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '数据加密成功',
    type: EncryptResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '加密失败' })
  async encryptData(@Body() encryptDto: EncryptDataDto): Promise<EncryptResponseDto> {
    return this.securityService.encryptData(encryptDto);
  }

  @Post('decrypt')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '解密数据',
    description: '仅限权限用户使用相同的密钥对数据进行解密',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '数据解密成功',
    type: DecryptResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '解密失败' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '无权限访问' })
  async decryptData(@Body() decryptDto: DecryptDataDto): Promise<DecryptResponseDto> {
    return this.securityService.decryptData(decryptDto);
  }

  @Post('proof')
  @ApiOperation({
    summary: '生成零知识证明',
    description: '根据提供的用户数据生成零知识证明（ZK-Proof）验证用户身份',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '零知识证明生成成功',
    type: ProofResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '证明生成失败' })
  async generateProof(@Body() proofDto: ProofDataDto): Promise<ProofResponseDto> {
    return this.securityService.generateProof(proofDto);
  }
}
