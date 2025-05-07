import { Controller, Post, Get, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import {
  SetPermissionDto,
  AuditPermissionDto,
  PermissionConfigResponse,
  AuditLogResponse,
  SetPermissionResponse,
  AuditActionType,
} from './dto';

@ApiTags('权限管理')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('set')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '设置凭证访问权限' })
  @ApiBody({ type: SetPermissionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '权限设置成功',
    type: SetPermissionResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求数据无效',
  })
  async setPermission(@Body() dto: SetPermissionDto): Promise<SetPermissionResponse> {
    return this.permissionService.setPermission(dto);
  }

  @Get('audit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '查询权限审计日志' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'userDid', required: false })
  @ApiQuery({ name: 'targetDid', required: false })
  @ApiQuery({ name: 'credentialId', required: false })
  @ApiQuery({
    name: 'actionType',
    required: false,
    enum: AuditActionType,
    example: AuditActionType.ALL,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '权限审计日志列表',
    type: AuditLogResponse,
  })
  async auditPermissions(@Query() dto: AuditPermissionDto): Promise<AuditLogResponse> {
    return this.permissionService.auditPermissions(dto);
  }

  @Get(':did')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '查看DID的权限配置' })
  @ApiParam({ name: 'did', description: 'DID标识符' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'DID权限配置列表',
    type: [PermissionConfigResponse],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '未找到DID的权限配置',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'DID无效',
  })
  async getPermissionByDid(@Param('did') did: string): Promise<PermissionConfigResponse[]> {
    return this.permissionService.getPermissionByDid(did);
  }
}
