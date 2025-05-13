import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { CreateIdentityDto, UpdateIdentityDto, BindIdentityDto } from './dto';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get()
  @ApiOperation({ summary: '获取身份列表' })
  async getIdentities() {
    try {
      const identities = await this.identityService.findAll();
      return {
        code: 0,
        message: '获取身份列表成功',
        data: identities,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '获取身份列表失败',
        data: null,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取身份详情' })
  async getIdentityById(@Param('id') id: string) {
    try {
      const identity = await this.identityService.findById(id);
      return {
        code: 0,
        message: '获取身份详情成功',
        data: identity,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '获取身份详情失败',
        data: null,
      };
    }
  }

  @Post()
  @ApiOperation({ summary: '创建身份' })
  async createIdentity(@Body() createIdentityDto: CreateIdentityDto) {
    try {
      const identity = await this.identityService.create(createIdentityDto);
      return {
        code: 0,
        message: '创建身份成功',
        data: identity,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '创建身份失败',
        data: null,
      };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新身份' })
  async updateIdentity(@Param('id') id: string, @Body() updateIdentityDto: UpdateIdentityDto) {
    try {
      const identity = await this.identityService.update(id, updateIdentityDto);
      return {
        code: 0,
        message: '更新身份成功',
        data: identity,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '更新身份失败',
        data: null,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除身份' })
  async deleteIdentity(@Param('id') id: string) {
    try {
      await this.identityService.remove(id);
      return {
        code: 0,
        message: '删除身份成功',
        data: null,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '删除身份失败',
        data: null,
      };
    }
  }

  @Post('bind')
  @ApiOperation({ summary: '绑定DID到身份' })
  async bindIdentity(@Body() bindIdentityDto: BindIdentityDto) {
    try {
      const identity = await this.identityService.bindDid(bindIdentityDto);
      return {
        code: 0,
        message: '绑定DID成功',
        data: identity,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '绑定DID失败',
        data: null,
      };
    }
  }

  @Post(':id/unbind')
  @ApiOperation({ summary: '解绑DID' })
  async unbindIdentity(@Param('id') id: string) {
    try {
      await this.identityService.unbindDid(id);
      return {
        code: 0,
        message: '解绑DID成功',
        data: null,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '解绑DID失败',
        data: null,
      };
    }
  }

  @Put(':id/default')
  @ApiOperation({ summary: '设置默认身份' })
  async setDefaultIdentity(@Param('id') id: string) {
    try {
      await this.identityService.setDefault(id);
      return {
        code: 0,
        message: '设置默认身份成功',
        data: null,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '设置默认身份失败',
        data: null,
      };
    }
  }

  @Get(':id/credentials')
  @ApiOperation({ summary: '获取身份关联凭证' })
  async getIdentityCredentials(@Param('id') id: string) {
    try {
      const credentials = await this.identityService.getCredentials(id);
      return {
        code: 0,
        message: '获取身份关联凭证成功',
        data: credentials,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '获取身份关联凭证失败',
        data: null,
      };
    }
  }

  @Get(':id/login-history')
  @ApiOperation({ summary: '获取登录历史' })
  async getLoginHistory(@Param('id') id: string) {
    try {
      const loginHistory = await this.identityService.getLoginHistory(id);
      return {
        code: 0,
        message: '获取登录历史成功',
        data: loginHistory,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '获取登录历史失败',
        data: null,
      };
    }
  }

  @Get(':id/profile')
  @ApiOperation({ summary: '获取身份资料' })
  async getProfile(@Param('id') id: string) {
    try {
      const profile = await this.identityService.getProfile(id);
      return {
        code: 0,
        message: '获取身份资料成功',
        data: profile,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '获取身份资料失败',
        data: null,
      };
    }
  }

  @Put(':id/profile')
  @ApiOperation({ summary: '更新身份资料' })
  async updateProfile(@Param('id') id: string, @Body() profileData: any) {
    try {
      const profile = await this.identityService.updateProfile(id, profileData);
      return {
        code: 0,
        message: '更新身份资料成功',
        data: profile,
      };
    } catch (error) {
      return {
        code: 500,
        message: error.message || '更新身份资料失败',
        data: null,
      };
    }
  }
}
