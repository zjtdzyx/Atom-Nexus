import { ApiProperty } from '@nestjs/swagger';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum ApiCategory {
  IDENTITY = 'identity',
  CREDENTIAL = 'credential',
  VERIFICATION = 'verification',
  PERMISSION = 'permission',
  DEVELOPER = 'developer',
}

export class ApiEndpointDto {
  @ApiProperty({
    description: 'API ID',
    example: 'api-123456',
  })
  id: string;

  @ApiProperty({
    description: 'API名称',
    example: '创建DID',
  })
  name: string;

  @ApiProperty({
    description: 'API路径',
    example: '/api/v1/did/create',
  })
  path: string;

  @ApiProperty({
    description: 'HTTP方法',
    enum: HttpMethod,
    example: HttpMethod.POST,
  })
  method: HttpMethod;

  @ApiProperty({
    description: 'API分类',
    enum: ApiCategory,
    example: ApiCategory.IDENTITY,
  })
  category: ApiCategory;

  @ApiProperty({
    description: 'API描述',
    example: '创建新的去中心化身份标识符',
  })
  description: string;

  @ApiProperty({
    description: '版本',
    example: 'v1',
  })
  version: string;

  @ApiProperty({
    description: '是否需要认证',
    example: true,
  })
  requiresAuth: boolean;

  @ApiProperty({
    description: '请求格式',
    type: 'object',
    example: {
      type: 'object',
      properties: {
        method: { type: 'string', enum: ['atom'] },
        publicKey: { type: 'string' },
      },
      required: ['method'],
    },
  })
  requestSchema?: Record<string, any>;

  @ApiProperty({
    description: '响应格式',
    type: 'object',
    example: {
      type: 'object',
      properties: {
        did: { type: 'string' },
        didDocument: { type: 'object' },
      },
    },
  })
  responseSchema?: Record<string, any>;

  @ApiProperty({
    description: '示例代码',
    example: 'const response = await client.did.create({ method: "atom" });',
  })
  sampleCode?: string;

  @ApiProperty({
    description: '文档链接',
    example: 'https://docs.atom-nexus.com/api/did/create',
  })
  documentationUrl?: string;
}

export class ApiListResponseDto {
  @ApiProperty({
    description: 'API列表',
    type: [ApiEndpointDto],
  })
  apis: ApiEndpointDto[];

  @ApiProperty({
    description: 'API总数',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: '文档链接',
    example: 'https://docs.atom-nexus.com/api',
  })
  documentationUrl: string;
}
