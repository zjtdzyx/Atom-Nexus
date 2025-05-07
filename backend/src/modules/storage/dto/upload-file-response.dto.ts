import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    description: '内容标识符(CID)',
    example: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  })
  cid: string;

  @ApiProperty({
    description: '上传时间戳',
    example: '2023-08-15T10:30:45Z',
  })
  timestamp: string;

  @ApiProperty({
    description: '文件大小(字节)',
    example: 1024,
  })
  size: number;

  @ApiProperty({
    description: '文件类型',
    example: 'application/json',
  })
  mimeType: string;

  @ApiProperty({
    description: '文件名',
    example: 'credential.json',
  })
  filename: string;

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
}
