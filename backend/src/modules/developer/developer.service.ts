import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  DeveloperRegisterDto,
  DeveloperRegisterResponseDto,
  DeveloperResponseDto,
  DeveloperStatus,
  SdkResponseDto,
  SdkPlatform,
  SdkVersionInfo,
  SdkDownloadInfo,
  ApiListResponseDto,
  ApiEndpointDto,
  HttpMethod,
  ApiCategory,
} from './dto';

@Injectable()
export class DeveloperService {
  // 模拟数据存储
  private developers: Map<string, DeveloperResponseDto> = new Map();
  private apis: ApiEndpointDto[] = [];

  constructor() {
    // 预填充一些示例API数据
    this.initializeApiData();
  }

  /**
   * 列出全部开放的API
   */
  async listApis(): Promise<ApiListResponseDto> {
    return {
      apis: this.apis,
      total: this.apis.length,
      documentationUrl: 'https://docs.atom-nexus.com/api',
    };
  }

  /**
   * 获取SDK下载信息
   */
  async getSdk(): Promise<SdkResponseDto> {
    // 准备SDK下载信息
    const sdks: SdkDownloadInfo[] = [
      this.createJavaScriptSdk(),
      this.createTypescriptSdk(),
      this.createJavaSdk(),
      this.createPythonSdk(),
    ];

    return {
      sdks,
      total: sdks.length,
      sdkHomepageUrl: 'https://atom-nexus.com/developers/sdk',
      supportUrl: 'https://atom-nexus.com/developers/support',
    };
  }

  /**
   * 开发者注册
   */
  async registerDeveloper(dto: DeveloperRegisterDto): Promise<DeveloperRegisterResponseDto> {
    try {
      // 生成开发者ID和API密钥
      const id = `dev-${uuidv4()}`;
      const apiKey = `ak_${this.generateRandomString(24)}`;
      const now = new Date().toISOString();

      // 创建开发者信息
      const developer: DeveloperResponseDto = {
        id,
        name: dto.name,
        contactPerson: dto.contactPerson,
        email: dto.email,
        phone: dto.phone,
        type: dto.type,
        status: DeveloperStatus.PENDING, // 初始状态为待审核
        scenarios: dto.scenarios,
        applicationName: dto.applicationName,
        applicationDescription: dto.applicationDescription,
        website: dto.website,
        apiKey,
        apiKeyCreatedAt: now,
        createdAt: now,
        updatedAt: now,
        dashboardUrl: `https://developers.atom-nexus.com/dashboard?id=${id}`,
        documentationUrl: 'https://docs.atom-nexus.com',
      };

      // 保存开发者信息
      this.developers.set(id, developer);

      // 返回注册结果
      return {
        status: 'pending',
        message: '开发者注册申请已提交，我们将尽快审核',
        developer,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: `开发者注册失败: ${error.message}`,
        developer: null,
      };
    }
  }

  /**
   * 生成随机字符串
   */
  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * 初始化API数据
   */
  private initializeApiData(): void {
    this.apis = [
      // DID相关API
      {
        id: `api-${uuidv4()}`,
        name: '创建DID',
        path: '/api/v1/did/create',
        method: HttpMethod.POST,
        category: ApiCategory.IDENTITY,
        description: '创建新的去中心化身份标识符',
        version: 'v1',
        requiresAuth: true,
        requestSchema: {
          type: 'object',
          properties: {
            method: { type: 'string', enum: ['atom'] },
            publicKey: { type: 'string' },
          },
          required: ['method'],
        },
        responseSchema: {
          type: 'object',
          properties: {
            did: { type: 'string' },
            didDocument: { type: 'object' },
          },
        },
        sampleCode: 'const response = await client.did.create({ method: "atom" });',
        documentationUrl: 'https://docs.atom-nexus.com/api/did/create',
      },
      {
        id: `api-${uuidv4()}`,
        name: '解析DID',
        path: '/api/v1/did/resolve/{did}',
        method: HttpMethod.GET,
        category: ApiCategory.IDENTITY,
        description: '解析DID并返回DID文档',
        version: 'v1',
        requiresAuth: true,
        requestSchema: null,
        responseSchema: {
          type: 'object',
          properties: {
            did: { type: 'string' },
            didDocument: { type: 'object' },
          },
        },
        sampleCode: 'const didDoc = await client.did.resolve("did:atom:123456789abcdefghi");',
        documentationUrl: 'https://docs.atom-nexus.com/api/did/resolve',
      },

      // 凭证相关API
      {
        id: `api-${uuidv4()}`,
        name: '签发凭证',
        path: '/api/v1/credentials/issue',
        method: HttpMethod.POST,
        category: ApiCategory.CREDENTIAL,
        description: '签发新的可验证凭证',
        version: 'v1',
        requiresAuth: true,
        requestSchema: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['identity', 'education'] },
            issuerId: { type: 'string' },
            subject: { type: 'object' },
            claims: { type: 'object' },
          },
          required: ['type', 'issuerId', 'subject', 'claims'],
        },
        responseSchema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            issuanceDate: { type: 'string' },
          },
        },
        sampleCode: 'const credential = await client.credential.issue({ type: "identity", ... });',
        documentationUrl: 'https://docs.atom-nexus.com/api/credentials/issue',
      },
      {
        id: `api-${uuidv4()}`,
        name: '验证凭证',
        path: '/api/v1/auth/verify-credential',
        method: HttpMethod.POST,
        category: ApiCategory.VERIFICATION,
        description: '验证凭证的有效性',
        version: 'v1',
        requiresAuth: true,
        requestSchema: {
          type: 'object',
          properties: {
            credential: { type: 'object' },
            proof: { type: 'object' },
          },
          required: ['credential', 'proof'],
        },
        responseSchema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['success', 'failed', 'partial'] },
            signatureValid: { type: 'boolean' },
          },
        },
        sampleCode: 'const result = await client.auth.verifyCredential({ credential, proof });',
        documentationUrl: 'https://docs.atom-nexus.com/api/auth/verify-credential',
      },

      // 权限相关API
      {
        id: `api-${uuidv4()}`,
        name: '设置权限',
        path: '/api/v1/permissions/set',
        method: HttpMethod.POST,
        category: ApiCategory.PERMISSION,
        description: '设置凭证访问权限',
        version: 'v1',
        requiresAuth: true,
        requestSchema: {
          type: 'object',
          properties: {
            ownerDid: { type: 'string' },
            recipientDid: { type: 'string' },
            type: { type: 'string', enum: ['one_time', 'persistent', 'partial'] },
            credentials: { type: 'array' },
          },
          required: ['ownerDid', 'recipientDid', 'type', 'credentials'],
        },
        responseSchema: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            permission: { type: 'object' },
          },
        },
        sampleCode:
          'const permissionResult = await client.permission.set({ ownerDid, recipientDid, ... });',
        documentationUrl: 'https://docs.atom-nexus.com/api/permissions/set',
      },
    ];

    // 开发者相关API
    this.apis.push(
      {
        id: `api-${uuidv4()}`,
        name: '列出开放API',
        path: '/api/v1/developer/apis',
        method: HttpMethod.GET,
        category: ApiCategory.DEVELOPER,
        description: '列出全部开放的API',
        version: 'v1',
        requiresAuth: false,
        requestSchema: null,
        responseSchema: {
          type: 'object',
          properties: {
            apis: { type: 'array' },
            total: { type: 'number' },
          },
        },
        sampleCode: 'const apiList = await client.developer.listApis();',
        documentationUrl: 'https://docs.atom-nexus.com/api/developer/apis',
      },
      {
        id: `api-${uuidv4()}`,
        name: '获取SDK信息',
        path: '/api/v1/developer/sdk',
        method: HttpMethod.GET,
        category: ApiCategory.DEVELOPER,
        description: '获取SDK下载链接',
        version: 'v1',
        requiresAuth: false,
        requestSchema: null,
        responseSchema: {
          type: 'object',
          properties: {
            sdks: { type: 'array' },
            total: { type: 'number' },
          },
        },
        sampleCode: 'const sdkInfo = await client.developer.getSdk();',
        documentationUrl: 'https://docs.atom-nexus.com/api/developer/sdk',
      },
      {
        id: `api-${uuidv4()}`,
        name: '开发者注册',
        path: '/api/v1/developer/register',
        method: HttpMethod.POST,
        category: ApiCategory.DEVELOPER,
        description: '第三方开发者注册',
        version: 'v1',
        requiresAuth: false,
        requestSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            type: { type: 'string', enum: ['individual', 'organization'] },
          },
          required: ['name', 'email', 'type'],
        },
        responseSchema: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            developer: { type: 'object' },
          },
        },
        sampleCode:
          'const result = await client.developer.register({ name: "Example Corp", ... });',
        documentationUrl: 'https://docs.atom-nexus.com/api/developer/register',
      }
    );
  }

  /**
   * 创建JavaScript SDK信息
   */
  private createJavaScriptSdk(): SdkDownloadInfo {
    const currentVersion: SdkVersionInfo = {
      version: '1.2.0',
      releaseDate: '2023-07-15',
      releaseNotes: '增加了凭证验证功能，优化了DID解析性能',
    };

    const previousVersions: SdkVersionInfo[] = [
      {
        version: '1.1.0',
        releaseDate: '2023-04-20',
        releaseNotes: '增加了凭证签发和权限管理功能',
      },
      {
        version: '1.0.0',
        releaseDate: '2023-01-10',
        releaseNotes: '初始版本，支持基本DID操作',
      },
    ];

    return {
      name: 'Atom Nexus SDK for JavaScript',
      platform: SdkPlatform.JAVASCRIPT,
      packageInstallCommand: 'npm install @atom-nexus/sdk',
      downloadUrl: 'https://cdn.atom-nexus.com/sdk/javascript/atom-nexus-sdk-1.2.0.zip',
      currentVersion,
      previousVersions,
      documentationUrl: 'https://docs.atom-nexus.com/sdk/javascript',
      repositoryUrl: 'https://github.com/atom-nexus/sdk-javascript',
      sampleCode: 'const client = new AtomNexusClient({ apiKey: "YOUR_API_KEY" });',
    };
  }

  /**
   * 创建TypeScript SDK信息
   */
  private createTypescriptSdk(): SdkDownloadInfo {
    const currentVersion: SdkVersionInfo = {
      version: '1.2.0',
      releaseDate: '2023-07-15',
      releaseNotes: '增加了凭证验证功能，优化了DID解析性能，完善了类型定义',
    };

    const previousVersions: SdkVersionInfo[] = [
      {
        version: '1.1.0',
        releaseDate: '2023-04-20',
        releaseNotes: '增加了凭证签发和权限管理功能',
      },
      {
        version: '1.0.0',
        releaseDate: '2023-01-10',
        releaseNotes: '初始版本，支持基本DID操作',
      },
    ];

    return {
      name: 'Atom Nexus SDK for TypeScript',
      platform: SdkPlatform.TYPESCRIPT,
      packageInstallCommand: 'npm install @atom-nexus/sdk',
      downloadUrl: 'https://cdn.atom-nexus.com/sdk/typescript/atom-nexus-sdk-1.2.0.zip',
      currentVersion,
      previousVersions,
      documentationUrl: 'https://docs.atom-nexus.com/sdk/typescript',
      repositoryUrl: 'https://github.com/atom-nexus/sdk-typescript',
      sampleCode:
        'import { AtomNexusClient } from "@atom-nexus/sdk";\nconst client = new AtomNexusClient({ apiKey: "YOUR_API_KEY" });',
    };
  }

  /**
   * 创建Java SDK信息
   */
  private createJavaSdk(): SdkDownloadInfo {
    const currentVersion: SdkVersionInfo = {
      version: '1.1.0',
      releaseDate: '2023-06-10',
      releaseNotes: '增加了凭证验证和权限管理功能',
    };

    const previousVersions: SdkVersionInfo[] = [
      {
        version: '1.0.0',
        releaseDate: '2023-02-15',
        releaseNotes: '初始版本，支持基本DID和凭证操作',
      },
    ];

    return {
      name: 'Atom Nexus SDK for Java',
      platform: SdkPlatform.JAVA,
      packageInstallCommand: 'implementation "com.atomnexus:sdk:1.1.0"',
      downloadUrl: 'https://cdn.atom-nexus.com/sdk/java/atom-nexus-sdk-1.1.0.jar',
      currentVersion,
      previousVersions,
      documentationUrl: 'https://docs.atom-nexus.com/sdk/java',
      repositoryUrl: 'https://github.com/atom-nexus/sdk-java',
      sampleCode:
        'AtomNexusClient client = new AtomNexusClient.Builder()\n  .apiKey("YOUR_API_KEY")\n  .build();',
    };
  }

  /**
   * 创建Python SDK信息
   */
  private createPythonSdk(): SdkDownloadInfo {
    const currentVersion: SdkVersionInfo = {
      version: '1.0.0',
      releaseDate: '2023-05-20',
      releaseNotes: '初始版本，支持DID操作和凭证管理',
    };

    const previousVersions: SdkVersionInfo[] = [];

    return {
      name: 'Atom Nexus SDK for Python',
      platform: SdkPlatform.PYTHON,
      packageInstallCommand: 'pip install atom-nexus-sdk',
      downloadUrl: 'https://cdn.atom-nexus.com/sdk/python/atom-nexus-sdk-1.0.0.tar.gz',
      currentVersion,
      previousVersions,
      documentationUrl: 'https://docs.atom-nexus.com/sdk/python',
      repositoryUrl: 'https://github.com/atom-nexus/sdk-python',
      sampleCode:
        'from atom_nexus import AtomNexusClient\n\nclient = AtomNexusClient(api_key="YOUR_API_KEY")',
    };
  }
}
