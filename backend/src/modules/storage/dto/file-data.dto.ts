import { ApiProperty } from '@nestjs/swagger';

export class FileDataDto {
  @ApiProperty({
    description: '内容标识符(CID)',
    example: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  })
  cid: string;

  @ApiProperty({
    description: '文件内容',
    example:
      '{"type":"VerifiableCredential","issuer":"did:atom:123456789","subject":"did:atom:987654321"}',
  })
  content: string | Record<string, any> | Buffer;

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
    description: '创建时间',
    example: '2023-08-15T10:30:45Z',
  })
  created: string;

  @ApiProperty({
    description: '存储类型',
    example: 'IPFS',
    enum: ['IPFS', 'Ceramic'],
  })
  storageType: 'IPFS' | 'Ceramic';

  @ApiProperty({
    description: '原始文件名',
    example: 'credential.json',
  })
  originalFilename: string;
}
