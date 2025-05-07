import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  UploadFileResponseDto,
  FileDataDto,
  StorageIndexResponseDto,
  StorageIndexItemDto,
  FileCategory,
} from './dto';

// 模拟IPFS客户端接口
interface IpfsClient {
  add(data: Buffer): Promise<{ cid: string; size: number }>;
  get(cid: string): Promise<Buffer>;
}

// 模拟Ceramic客户端接口
interface CeramicClient {
  store(data: Record<string, any>): Promise<{ streamId: string; size: number }>;
  load(streamId: string): Promise<Record<string, any>>;
}

@Injectable()
export class StorageService {
  private ipfsClient: IpfsClient;
  private ceramicClient: CeramicClient;
  private storageIndexes: Map<string, StorageIndexItemDto> = new Map();
  private tempStorageDir: string = path.join(process.cwd(), 'tmp', 'storage');

  constructor() {
    // 初始化去中心化存储客户端（这里使用模拟实现）
    this.initStorageClients();
    // 确保临时目录存在
    this.ensureTempDir();
    // 初始化一些示例数据
    this.initMockData();
  }

  /**
   * 上传文件到去中心化存储
   */
  async uploadFile(
    file: Express.Multer.File,
    metadata?: Record<string, any>,
    category: FileCategory = FileCategory.OTHER,
    description?: string,
    uploaderDid?: string
  ): Promise<UploadFileResponseDto> {
    try {
      if (!file) {
        throw new BadRequestException('未提供文件');
      }

      const { originalname: filename, mimetype: mimeType, size, buffer } = file;

      // 根据文件类型选择存储方式
      let cid: string;
      let storageType: 'IPFS' | 'Ceramic';

      if (mimeType === 'application/json') {
        // JSON 数据可以存储到 Ceramic
        const jsonData = JSON.parse(buffer.toString('utf-8'));
        const result = await this.ceramicClient.store(jsonData);
        cid = result.streamId;
        storageType = 'Ceramic';
      } else {
        // 其他文件存储到 IPFS
        const result = await this.ipfsClient.add(buffer);
        cid = result.cid;
        storageType = 'IPFS';
      }

      const timestamp = new Date().toISOString();
      const accessUrl = this.generateAccessUrl(cid, storageType);

      // 创建存储索引记录
      const indexId = `idx-${uuidv4()}`;
      const storageIndex: StorageIndexItemDto = {
        id: indexId,
        cid,
        filename,
        mimeType,
        size,
        category,
        uploaderDid: uploaderDid || 'did:atom:unknown',
        uploadedAt: timestamp,
        lastAccessedAt: timestamp,
        accessCount: 0,
        storageType,
        accessUrl,
        description,
        metadata,
      };

      // 保存索引记录
      this.storageIndexes.set(cid, storageIndex);

      // 返回上传结果
      return {
        cid,
        timestamp,
        size,
        mimeType,
        filename,
        storageType,
        accessUrl,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`文件上传失败: ${error.message}`);
    }
  }

  /**
   * 根据CID获取文件数据
   */
  async getFileByCid(cid: string): Promise<FileDataDto> {
    try {
      // 检查索引是否存在
      const index = this.storageIndexes.get(cid);
      if (!index) {
        throw new NotFoundException(`未找到CID为 ${cid} 的文件`);
      }

      // 更新访问记录
      index.accessCount += 1;
      index.lastAccessedAt = new Date().toISOString();

      // 根据存储类型获取文件内容
      let content: string | Record<string, any> | Buffer;
      if (index.storageType === 'IPFS') {
        const buffer = await this.ipfsClient.get(cid);
        content = buffer;

        // 如果是JSON文件，尝试解析
        if (index.mimeType === 'application/json') {
          try {
            content = JSON.parse(buffer.toString('utf-8'));
          } catch (error) {
            // 如果解析失败，保持二进制格式
          }
        }
      } else {
        // Ceramic存储的是JSON数据
        content = await this.ceramicClient.load(cid);
      }

      // 返回文件数据
      return {
        cid,
        content,
        mimeType: index.mimeType,
        size: index.size,
        created: index.uploadedAt,
        storageType: index.storageType,
        originalFilename: index.filename,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`获取文件失败: ${error.message}`);
    }
  }

  /**
   * 获取存储索引列表
   */
  async getStorageIndexes(): Promise<StorageIndexResponseDto> {
    // 转换Map为数组
    const indexes = Array.from(this.storageIndexes.values());

    // 计算统计信息
    const totalSize = indexes.reduce((sum, index) => sum + index.size, 0);
    const categoryDistribution = this.calculateCategoryDistribution(indexes);

    return {
      indexes,
      total: indexes.length,
      statistics: {
        totalSize,
        categoryDistribution,
      },
    };
  }

  /**
   * 初始化存储客户端
   */
  private initStorageClients(): void {
    // 模拟IPFS客户端实现
    this.ipfsClient = {
      add: async (data: Buffer) => {
        // 使用文件内容的哈希作为模拟CID
        const cid = `bafybeig${this.generateHash(data)}`;
        // 保存到临时目录（实际环境中会调用IPFS API）
        const filePath = path.join(this.tempStorageDir, cid);
        fs.writeFileSync(filePath, data);
        return { cid, size: data.length };
      },
      get: async (cid: string) => {
        // 从临时目录获取文件（实际环境中会调用IPFS API）
        const filePath = path.join(this.tempStorageDir, cid);
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath);
        }
        throw new NotFoundException(`未找到CID为 ${cid} 的文件`);
      },
    };

    // 模拟Ceramic客户端实现
    this.ceramicClient = {
      store: async (data: Record<string, any>) => {
        // 使用JSON的哈希作为模拟StreamID
        const dataBuffer = Buffer.from(JSON.stringify(data), 'utf-8');
        const streamId = `ceramic://${this.generateHash(dataBuffer)}`;
        // 保存到临时目录（实际环境中会调用Ceramic API）
        const filePath = path.join(this.tempStorageDir, streamId);
        fs.writeFileSync(filePath, dataBuffer);
        return { streamId, size: dataBuffer.length };
      },
      load: async (streamId: string) => {
        // 从临时目录获取文件（实际环境中会调用Ceramic API）
        const filePath = path.join(this.tempStorageDir, streamId);
        if (fs.existsSync(filePath)) {
          const data = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(data);
        }
        throw new NotFoundException(`未找到StreamID为 ${streamId} 的数据`);
      },
    };
  }

  /**
   * 确保临时目录存在
   */
  private ensureTempDir(): void {
    if (!fs.existsSync(this.tempStorageDir)) {
      fs.mkdirSync(this.tempStorageDir, { recursive: true });
    }
  }

  /**
   * 生成文件哈希
   */
  private generateHash(data: Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
  }

  /**
   * 生成访问URL
   */
  private generateAccessUrl(cid: string, storageType: 'IPFS' | 'Ceramic'): string {
    if (storageType === 'IPFS') {
      return `https://ipfs.example.com/ipfs/${cid}`;
    } else {
      return `https://ceramic.example.com/stream/${cid}`;
    }
  }

  /**
   * 计算文件分类分布
   */
  private calculateCategoryDistribution(indexes: StorageIndexItemDto[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    // 初始化所有分类为0
    Object.values(FileCategory).forEach((category) => {
      distribution[category] = 0;
    });

    // 计算每个分类的文件数量
    indexes.forEach((index) => {
      distribution[index.category] = (distribution[index.category] || 0) + 1;
    });

    return distribution;
  }

  /**
   * 初始化模拟数据
   */
  private initMockData(): void {
    // 创建一些示例存储索引数据
    const mockIndexes: StorageIndexItemDto[] = [
      {
        id: `idx-${uuidv4()}`,
        cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        filename: 'identity_credential.json',
        mimeType: 'application/json',
        size: 2048,
        category: FileCategory.CREDENTIAL,
        uploaderDid: 'did:atom:12345',
        uploadedAt: '2023-08-10T09:15:30Z',
        lastAccessedAt: '2023-08-15T14:20:45Z',
        accessCount: 12,
        storageType: 'IPFS',
        accessUrl:
          'https://ipfs.example.com/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        description: '用户身份凭证',
        metadata: {
          credentialType: 'identity',
          issuer: 'did:atom:issuer123',
          issuanceDate: '2023-08-05T00:00:00Z',
        },
      },
      {
        id: `idx-${uuidv4()}`,
        cid: 'bafybeibnsoufr2renruhpu5yls57jtuphgmgcm3qjmv3qfpxz3vqi5b6gu',
        filename: 'education_credential.json',
        mimeType: 'application/json',
        size: 1536,
        category: FileCategory.CREDENTIAL,
        uploaderDid: 'did:atom:67890',
        uploadedAt: '2023-08-12T11:30:20Z',
        lastAccessedAt: '2023-08-14T10:15:30Z',
        accessCount: 5,
        storageType: 'Ceramic',
        accessUrl:
          'https://ceramic.example.com/stream/bafybeibnsoufr2renruhpu5yls57jtuphgmgcm3qjmv3qfpxz3vqi5b6gu',
        description: '教育经历凭证',
        metadata: {
          credentialType: 'education',
          issuer: 'did:atom:university123',
          issuanceDate: '2023-08-11T00:00:00Z',
        },
      },
      {
        id: `idx-${uuidv4()}`,
        cid: 'bafybeihbmin5hq6suohrxbf7dctxaek5xscfelyvsesmjcq7vau5m635i4',
        filename: 'user_profile.json',
        mimeType: 'application/json',
        size: 1024,
        category: FileCategory.IDENTITY,
        uploaderDid: 'did:atom:12345',
        uploadedAt: '2023-08-08T15:45:10Z',
        lastAccessedAt: '2023-08-15T16:30:20Z',
        accessCount: 20,
        storageType: 'Ceramic',
        accessUrl:
          'https://ceramic.example.com/stream/bafybeihbmin5hq6suohrxbf7dctxaek5xscfelyvsesmjcq7vau5m635i4',
        description: '用户个人资料',
        metadata: {
          profileType: 'public',
          updatedAt: '2023-08-08T15:45:10Z',
        },
      },
      {
        id: `idx-${uuidv4()}`,
        cid: 'bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354',
        filename: 'profile_photo.jpg',
        mimeType: 'image/jpeg',
        size: 1048576, // 1MB
        category: FileCategory.IDENTITY,
        uploaderDid: 'did:atom:12345',
        uploadedAt: '2023-08-05T10:20:15Z',
        lastAccessedAt: '2023-08-15T14:10:30Z',
        accessCount: 35,
        storageType: 'IPFS',
        accessUrl:
          'https://ipfs.example.com/ipfs/bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354',
        description: '用户头像照片',
      },
      {
        id: `idx-${uuidv4()}`,
        cid: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
        filename: 'contract_document.pdf',
        mimeType: 'application/pdf',
        size: 2097152, // 2MB
        category: FileCategory.DOCUMENT,
        uploaderDid: 'did:atom:67890',
        uploadedAt: '2023-08-14T09:00:00Z',
        lastAccessedAt: '2023-08-14T09:05:30Z',
        accessCount: 2,
        storageType: 'IPFS',
        accessUrl:
          'https://ipfs.example.com/ipfs/bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
        description: '合同文档',
        metadata: {
          documentType: 'contract',
          parties: ['did:atom:12345', 'did:atom:67890'],
          validUntil: '2024-08-14T00:00:00Z',
        },
      },
    ];

    // 将示例数据添加到存储索引
    mockIndexes.forEach((index) => {
      this.storageIndexes.set(index.cid, index);
    });
  }
}
