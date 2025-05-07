import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';
import { CredentialService } from './credential.service';
import { IssueCredentialDto, RevokeCredentialDto } from './dto';
import { 
  CredentialResponse, 
  CredentialDetailResponse, 
  CredentialShareResponse, 
  RevokeCredentialResponse 
} from './models/credential.model';

@ApiTags('凭证管理')
@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('issue')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '签发新的VC凭证' })
  @ApiBody({ type: IssueCredentialDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: '凭证签发成功', 
    type: CredentialResponse 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: '请求数据无效' 
  })
  async issueCredential(
    @Body() dto: IssueCredentialDto
  ): Promise<CredentialResponse> {
    return this.credentialService.issueCredential(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '查询凭证详情' })
  @ApiParam({ name: 'id', description: '凭证ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: '凭证详情', 
    type: CredentialDetailResponse 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: '凭证不存在' 
  })
  async getCredentialDetails(
    @Param('id') id: string
  ): Promise<CredentialDetailResponse> {
    return this.credentialService.getCredentialDetails(id);
  }

  @Post(':id/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '撤销已签发的凭证' })
  @ApiParam({ name: 'id', description: '凭证ID' })
  @ApiBody({ type: RevokeCredentialDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: '凭证撤销成功', 
    type: RevokeCredentialResponse 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: '凭证不存在或已被撤销' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: '无权撤销此凭证' 
  })
  async revokeCredential(
    @Param('id') id: string,
    @Body() dto: RevokeCredentialDto
  ): Promise<RevokeCredentialResponse> {
    return this.credentialService.revokeCredential(id, dto);
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成凭证分享链接或二维码' })
  @ApiParam({ name: 'id', description: '凭证ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: '分享链接生成成功', 
    type: CredentialShareResponse 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: '凭证不存在' 
  })
  async shareCredential(
    @Param('id') id: string
  ): Promise<CredentialShareResponse> {
    return this.credentialService.shareCredential(id);
  }
} 