import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiParam } from '@nestjs/swagger';
import { DidService, DIDDocument, DIDInfo } from './did.service';
import { CreateDidDto, RecoverDidDto } from './dto';

@ApiTags('DID')
@Controller('did')
export class DidController {
  constructor(private readonly didService: DidService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '注册DID',
    description: '通过钱包地址、邮箱或社交账号创建去中心化身份',
  })
  @SwaggerResponse({
    status: 201,
    description: 'DID创建成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            did: { type: 'string', example: 'did:email:1234567890abcdef' },
            didDocument: {
              type: 'object',
              properties: {
                '@context': {
                  type: 'array',
                  items: {
                    type: 'string',
                    example: 'https://www.w3.org/ns/did/v1',
                  },
                },
                id: { type: 'string', example: 'did:email:1234567890abcdef' },
                controller: { type: 'string', example: 'did:email:1234567890abcdef' },
                verificationMethod: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'did:email:1234567890abcdef#keys-1' },
                      type: { type: 'string', example: 'Ed25519VerificationKey2020' },
                      controller: { type: 'string', example: 'did:email:1234567890abcdef' },
                      publicKeyHex: {
                        type: 'string',
                        example: '6a7280fec3467e73b0de36357d5707790d58b8a718e7f3f549a4ae5fce0e1e8c',
                      },
                    },
                  },
                },
                authentication: {
                  type: 'array',
                  items: {
                    type: 'string',
                    example: 'did:email:1234567890abcdef#keys-1',
                  },
                },
              },
            },
          },
        },
        message: { type: 'string', example: 'DID创建成功' },
      },
    },
  })
  @SwaggerResponse({
    status: 400,
    description: '参数错误',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'string',
          example: 'DID创建失败: 必须提供钱包地址、邮箱或社交账号中的至少一种',
        },
      },
    },
  })
  async registerDid(@Body() createDidDto: CreateDidDto) {
    return this.didService.registerDid(createDidDto);
  }

  @Post('recover')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '恢复DID',
    description: '通过多重身份验证信息恢复DID',
  })
  @SwaggerResponse({
    status: 200,
    description: 'DID恢复成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            did: { type: 'string', example: 'did:email:1234567890abcdef' },
            didDocument: { type: 'object' },
          },
        },
        message: { type: 'string', example: 'DID恢复成功' },
      },
    },
  })
  @SwaggerResponse({
    status: 400,
    description: 'DID恢复失败',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'DID恢复失败: DID不存在' },
      },
    },
  })
  @SwaggerResponse({
    status: 401,
    description: '身份验证失败',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'DID恢复失败: 恢复验证失败，提供的信息不正确' },
      },
    },
  })
  async recoverDid(@Body() recoverDidDto: RecoverDidDto) {
    return this.didService.recoverDid(recoverDidDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '查询用户信息',
    description: '根据DID查询用户详细信息',
  })
  @ApiParam({
    name: 'id',
    description: 'DID标识符',
    example: 'did:email:1234567890abcdef',
  })
  @SwaggerResponse({
    status: 200,
    description: '成功获取用户信息',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            didInfo: {
              type: 'object',
              properties: {
                did: { type: 'string', example: 'did:email:1234567890abcdef' },
                method: { type: 'string', example: 'email' },
                identifier: { type: 'string', example: 'email:user@example.com' },
                recoveryEmail: { type: 'string', example: 'recovery@example.com' },
                createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
              },
            },
            didDocument: { type: 'object' },
          },
        },
      },
    },
  })
  @SwaggerResponse({
    status: 404,
    description: 'DID不存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: '获取用户信息失败: DID不存在' },
      },
    },
  })
  async getUserInfo(@Param('id') did: string) {
    return this.didService.getUserInfo(did);
  }
}
