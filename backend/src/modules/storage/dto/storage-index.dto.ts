import { ApiProperty } from '@nestjs/swagger';

export enum FileCategory {
  CREDENTIAL = 'credential',
  IDENTITY = 'identity',
  DOCUMENT = 'document',
  METADATA = 'metadata',
  OTHER = 'other',
}

export class StorageIndexItemDto {
  @ApiProperty({
    description: '索引记录ID',
    example: 'idx-123456',
  })
  id: string;

  @ApiProperty({
    description: '内容标识符(CID)',
    example: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  })
  cid: string;

  @ApiProperty({
    description: '文件名',
    example: 'credential.json',
  })
  filename: string;

  @ApiProperty({
    description: '文件类型',
    example: 'application/json',
  })
  mimeType: string;

  @ApiProperty({
    description: '文件大小(字节)',
    example: 1024,
  })
  size: number;

  @ApiProperty({
    description: '文件分类',
    enum: FileCategory,
    example: FileCategory.CREDENTIAL,
  })
  category: FileCategory;

  @ApiProperty({
    description: '上传者DID',
    example: 'did:atom:123456789abcdefghi',
  })
  uploaderDid: string;

  @ApiProperty({
    description: '上传时间',
    example: '2023-08-15T10:30:45Z',
  })
  uploadedAt: string;

  @ApiProperty({
    description: '最后访问时间',
    example: '2023-08-16T14:25:18Z',
  })
  lastAccessedAt: string;

  @ApiProperty({
    description: '访问次数',
    example: 5,
  })
  accessCount: number;

  @ApiProperty({
    description: '存储类型',
    example: 'IPFS',
    enum: ['IPFS', 'Ceramic'],
  })
  storageType: 'IPFS' | 'Ceramic';

  @ApiProperty({
    description: '访问URL',
    example:
      'https://ipfs.example.com/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  })
  accessUrl: string;

  @ApiProperty({
    description: '文件描述',
    example: '用户身份凭证',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '元数据',
    example: { credentialType: 'identity', issuer: 'did:atom:issuer123456' },
    required: false,
  })
  metadata?: Record<string, any>;
}

export class StorageIndexResponseDto {
  @ApiProperty({
    description: '存储索引列表',
    type: [StorageIndexItemDto],
  })
  indexes: StorageIndexItemDto[];

  @ApiProperty({
    description: '总记录数',
    example: 120,
  })
  total: number;

  @ApiProperty({
    description: '统计信息',
    example: {
      totalSize: 2560000,
      categoryDistribution: {
        credential: 45,
        identity: 35,
        document: 20,
        metadata: 15,
        other: 5,
      },
    },
  })
  statistics: {
    totalSize: number;
    categoryDistribution: Record<string, number>;
  };
}
