import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  UsersResponseDto,
  CredentialsResponseDto,
  PermissionsResponseDto,
  StatsResponseDto,
} from './dto';

@ApiTags('系统管理')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: '获取用户列表', description: '管理员查看所有用户信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取用户列表',
    type: UsersResponseDto,
  })
  async getUsers(): Promise<UsersResponseDto> {
    return this.adminService.getUsers();
  }

  @Get('credentials')
  @ApiOperation({ summary: '获取凭证列表', description: '查看系统内所有凭证记录' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取凭证列表',
    type: CredentialsResponseDto,
  })
  async getCredentials(): Promise<CredentialsResponseDto> {
    return this.adminService.getCredentials();
  }

  @Get('permissions')
  @ApiOperation({ summary: '获取权限设置', description: '管理权限控制设置' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取权限设置',
    type: PermissionsResponseDto,
  })
  async getPermissions(): Promise<PermissionsResponseDto> {
    return this.adminService.getPermissions();
  }

  @Get('stats')
  @ApiOperation({
    summary: '获取系统统计',
    description: '查看系统统计数据，如用户数量、凭证数量等',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取系统统计数据',
    type: StatsResponseDto,
  })
  async getStats(): Promise<StatsResponseDto> {
    return this.adminService.getStats();
  }
}
