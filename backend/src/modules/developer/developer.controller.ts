import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeveloperService } from './developer.service';
import {
  DeveloperRegisterDto,
  DeveloperRegisterResponseDto,
  ApiListResponseDto,
  SdkResponseDto,
} from './dto';

@ApiTags('开发者平台')
@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Get('apis')
  @ApiOperation({ summary: '获取API列表', description: '获取平台所有可用的API列表及详细信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取API列表', type: ApiListResponseDto })
  async listApis(): Promise<ApiListResponseDto> {
    return this.developerService.listApis();
  }

  @Get('sdk')
  @ApiOperation({ summary: '获取SDK信息', description: '获取各编程语言SDK的下载信息和链接' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取SDK信息', type: SdkResponseDto })
  async getSdk(): Promise<SdkResponseDto> {
    return this.developerService.getSdk();
  }

  @Post('register')
  @ApiOperation({ summary: '开发者注册', description: '注册为第三方开发者，获取API接入凭证' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '开发者注册成功',
    type: DeveloperRegisterResponseDto,
  })
  async registerDeveloper(
    @Body() registerDto: DeveloperRegisterDto
  ): Promise<DeveloperRegisterResponseDto> {
    return this.developerService.registerDeveloper(registerDto);
  }
}
