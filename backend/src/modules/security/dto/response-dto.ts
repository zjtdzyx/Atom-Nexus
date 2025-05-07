import { ApiProperty } from '@nestjs/swagger';
import { ProofType } from './proof-data.dto';

export class EncryptResponseDto {
  @ApiProperty({
    description: '加密后的数据',
    example: 'U2FsdGVkX1+A2KAIw9vXqc7oQT...（加密后的数据）',
  })
  encryptedData: string;

  @ApiProperty({
    description: '加密使用的算法',
    example: 'AES-256-CBC',
  })
  algorithm: string;

  @ApiProperty({
    description: '加密时间',
    example: '2023-09-15T10:30:45Z',
  })
  timestamp: string;

  @ApiProperty({
    description: '是否成功',
    example: true,
  })
  success: boolean;
}

export class DecryptResponseDto {
  @ApiProperty({
    description: '解密后的数据',
    example: { username: '张三', id: '12345', email: 'zhangsan@example.com' },
  })
  decryptedData: string | Record<string, any>;

  @ApiProperty({
    description: '解密使用的算法',
    example: 'AES-256-CBC',
  })
  algorithm: string;

  @ApiProperty({
    description: '解密时间',
    example: '2023-09-15T10:31:15Z',
  })
  timestamp: string;

  @ApiProperty({
    description: '是否成功',
    example: true,
  })
  success: boolean;
}

export class ProofResponseDto {
  @ApiProperty({
    description: '生成的证明',
    example: {
      proof: 'abcde12345...',
      publicSignals: ['123', '456', '789'],
    },
  })
  proof: Record<string, any>;

  @ApiProperty({
    description: '证明类型',
    enum: ProofType,
    example: ProofType.IDENTITY,
  })
  proofType: ProofType;

  @ApiProperty({
    description: '证明生成时间',
    example: '2023-09-15T10:32:30Z',
  })
  timestamp: string;

  @ApiProperty({
    description: '验证密钥哈希',
    example: 'sha256:fde456...',
  })
  verificationKeyHash: string;

  @ApiProperty({
    description: '是否成功',
    example: true,
  })
  success: boolean;
}
