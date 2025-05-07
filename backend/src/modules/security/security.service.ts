import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  EncryptDataDto,
  DecryptDataDto,
  ProofDataDto,
  EncryptResponseDto,
  DecryptResponseDto,
  ProofResponseDto,
  ProofType,
} from './dto';

@Injectable()
export class SecurityService {
  /**
   * 加密数据
   */
  async encryptData(encryptDto: EncryptDataDto): Promise<EncryptResponseDto> {
    try {
      const { data, key, algorithm = 'AES-256-CBC' } = encryptDto;

      // 将数据转换为字符串
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

      // 生成初始化向量
      const iv = crypto.randomBytes(16);

      // 创建cipher
      const cipher = crypto.createCipheriv(algorithm, this.deriveKey(key), iv);

      // 加密数据
      let encrypted = cipher.update(dataStr, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // 将IV与加密数据拼接（前16字节为IV）
      const result = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');

      return {
        encryptedData: result,
        algorithm,
        timestamp: new Date().toISOString(),
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(`加密失败: ${error.message}`);
    }
  }

  /**
   * 解密数据
   */
  async decryptData(decryptDto: DecryptDataDto): Promise<DecryptResponseDto> {
    try {
      const { encryptedData, key, algorithm = 'AES-256-CBC' } = decryptDto;

      // 解码Base64
      const encryptedBuffer = Buffer.from(encryptedData, 'base64');

      // 提取IV（前16字节）
      const iv = encryptedBuffer.slice(0, 16);
      const encryptedContent = encryptedBuffer.slice(16).toString('base64');

      // 创建decipher
      const decipher = crypto.createDecipheriv(algorithm, this.deriveKey(key), iv);

      // 解密数据
      let decrypted = decipher.update(encryptedContent, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      // 尝试将结果解析为JSON
      let result: string | Record<string, any>;
      try {
        result = JSON.parse(decrypted);
      } catch (e) {
        result = decrypted;
      }

      return {
        decryptedData: result,
        algorithm,
        timestamp: new Date().toISOString(),
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(`解密失败: ${error.message}`);
    }
  }

  /**
   * 生成零知识证明
   */
  async generateProof(proofDto: ProofDataDto): Promise<ProofResponseDto> {
    try {
      const { data, proofType, params = {} } = proofDto;

      // 模拟零知识证明生成
      // 在实际实现中，应使用适当的零知识证明库，如snarkjs
      const proof = this.mockGenerateProof(data, proofType, params);

      return {
        proof,
        proofType,
        timestamp: new Date().toISOString(),
        verificationKeyHash: `sha256:${this.generateHash(JSON.stringify(proof))}`,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(`生成证明失败: ${error.message}`);
    }
  }

  /**
   * 模拟零知识证明生成
   * 注意：这是一个模拟实现，实际使用中应该使用真实的ZK证明库
   */
  private mockGenerateProof(
    data: Record<string, any>,
    proofType: ProofType,
    params: Record<string, any>
  ): Record<string, any> {
    // 基于证明类型选择不同的模拟方法
    switch (proofType) {
      case ProofType.IDENTITY:
        return this.mockIdentityProof(data);
      case ProofType.AGE:
        return this.mockAgeProof(data);
      case ProofType.CREDENTIAL:
        return this.mockCredentialProof(data);
      case ProofType.MEMBERSHIP:
        return this.mockMembershipProof(data);
      case ProofType.OWNERSHIP:
        return this.mockOwnershipProof(data);
      default:
        throw new BadRequestException(`不支持的证明类型: ${proofType}`);
    }
  }

  /**
   * 生成密钥派生密钥
   */
  private deriveKey(key: string): Buffer {
    // 确保密钥长度为32字节（256位）
    if (key.length < 32) {
      // 如果密钥太短，使用PBKDF2派生
      return crypto.pbkdf2Sync(key, 'salt', 1000, 32, 'sha256');
    } else if (key.length > 32) {
      // 如果密钥太长，截取或哈希
      return Buffer.from(this.generateHash(key), 'hex').slice(0, 32);
    }
    // 密钥长度正好
    return Buffer.from(key);
  }

  /**
   * 生成哈希
   */
  private generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * 模拟身份证明
   */
  private mockIdentityProof(data: Record<string, any>): Record<string, any> {
    const { did, claims } = data;
    const timestamp = Date.now().toString();
    const randomValue = crypto.randomBytes(16).toString('hex');

    return {
      proof: `identity-proof-${randomValue}`,
      publicSignals: [
        this.generateHash(did + timestamp),
        this.generateHash(JSON.stringify(claims) + timestamp),
      ],
      circuit: 'identity-circuit-v1',
      protocol: 'groth16',
    };
  }

  /**
   * 模拟年龄证明
   */
  private mockAgeProof(data: Record<string, any>): Record<string, any> {
    const { claims } = data;
    const randomValue = crypto.randomBytes(16).toString('hex');

    return {
      proof: `age-proof-${randomValue}`,
      publicSignals: [
        claims.age >= 18 ? '1' : '0', // 模拟年龄阈值检查
        this.generateHash(claims.age.toString()),
      ],
      circuit: 'age-verification-circuit-v1',
      protocol: 'groth16',
    };
  }

  /**
   * 模拟凭证证明
   */
  private mockCredentialProof(data: Record<string, any>): Record<string, any> {
    const { credential, holder } = data;
    const randomValue = crypto.randomBytes(16).toString('hex');

    return {
      proof: `credential-proof-${randomValue}`,
      publicSignals: [
        this.generateHash(credential.id + holder),
        this.generateHash(JSON.stringify(credential.claims)),
      ],
      circuit: 'credential-verification-circuit-v1',
      protocol: 'groth16',
    };
  }

  /**
   * 模拟会员资格证明
   */
  private mockMembershipProof(data: Record<string, any>): Record<string, any> {
    const { membership, user } = data;
    const randomValue = crypto.randomBytes(16).toString('hex');

    return {
      proof: `membership-proof-${randomValue}`,
      publicSignals: [
        this.generateHash(user + membership.id),
        this.generateHash(membership.level),
        membership.active ? '1' : '0',
      ],
      circuit: 'membership-verification-circuit-v1',
      protocol: 'groth16',
    };
  }

  /**
   * 模拟所有权证明
   */
  private mockOwnershipProof(data: Record<string, any>): Record<string, any> {
    const { asset, owner } = data;
    const randomValue = crypto.randomBytes(16).toString('hex');

    return {
      proof: `ownership-proof-${randomValue}`,
      publicSignals: [this.generateHash(asset.id + owner), this.generateHash(asset.type)],
      circuit: 'ownership-verification-circuit-v1',
      protocol: 'groth16',
    };
  }
}
