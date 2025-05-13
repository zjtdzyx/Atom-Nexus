import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { CreateDidDto, RecoverDidDto } from './dto';
import { Did } from './entities/did.entity';
import { DidDocument } from './entities/did-document.entity';
import { ApiResponse } from '../../common/interfaces/response.interface';

// DID文档接口
export interface DIDDocument {
  '@context': string[];
  id: string;
  controller: string;
  verificationMethod: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyHex: string;
  }>;
  authentication: string[];
}

// DID信息接口
export interface DIDInfo {
  did: string;
  method: string;
  identifier: string;
  recoveryEmail?: string;
  createdAt: Date;
}

@Injectable()
export class DidService {
  constructor(
    @InjectRepository(Did)
    private didRepository: Repository<Did>,
    @InjectRepository(DidDocument)
    private didDocumentRepository: Repository<DidDocument>
  ) {}

  /**
   * 注册新的去中心化身份
   */
  async registerDid(
    createDidDto: CreateDidDto
  ): Promise<ApiResponse<{ did: string; didDocument: DIDDocument }>> {
    try {
      const { walletAddress, email, socialAccount, provider, recoveryEmail, recoveryOptions } =
        createDidDto;

      // 验证至少有一种身份标识方式
      if (!walletAddress && !email && !socialAccount) {
        throw new BadRequestException('必须提供钱包地址、邮箱或社交账号中的至少一种');
      }

      // 检查标识符是否已注册
      let existingDid: Did = null;

      if (walletAddress) {
        existingDid = await this.didRepository.findOne({ where: { walletAddress } });
      } else if (email) {
        existingDid = await this.didRepository.findOne({ where: { email } });
      } else if (socialAccount) {
        existingDid = await this.didRepository.findOne({ where: { socialAccount } });
      }

      if (existingDid) {
        throw new BadRequestException('该标识符已关联DID');
      }

      // 确定DID方法和标识符
      let method: string;
      let identifier: string;

      if (walletAddress) {
        method = 'ethr';
        identifier = `wallet:${walletAddress.toLowerCase()}`;
      } else if (email) {
        method = 'email';
        identifier = `email:${email.toLowerCase()}`;
      } else {
        method = 'web';
        identifier = `social:${provider.toLowerCase()}:${socialAccount.toLowerCase()}`;
      }

      // 生成DID和密钥对
      const { did, didDocument, publicKey } = this.generateDid(method, identifier);

      // 存储DID到数据库
      const newDid = this.didRepository.create({
        id: did, // 使用DID作为主键ID
        walletAddress,
        email,
        socialAccount,
        publicKey,
      });

      await this.didRepository.save(newDid);

      // 存储DID文档到数据库
      const didDoc = this.didDocumentRepository.create({
        id: did,
        context: didDocument['@context'] as string[],
        controller: didDocument.controller,
        verificationMethod: didDocument.verificationMethod,
        authentication: didDocument.authentication,
      });

      await this.didDocumentRepository.save(didDoc);

      return {
        success: true,
        data: { did, didDocument },
        message: 'DID创建成功',
      };
    } catch (error) {
      return {
        success: false,
        error: `DID创建失败: ${error.message}`,
      };
    }
  }

  /**
   * 恢复DID
   */
  async recoverDid(
    recoverDidDto: RecoverDidDto
  ): Promise<ApiResponse<{ did: string; didDocument: DIDDocument }>> {
    try {
      const {
        did,
        email,
        verificationCode,
        recoveryEmail,
        securityAnswers,
        additionalRecoveryInfo,
      } = recoverDidDto;

      // 检查DID是否存在
      const didEntity = await this.didRepository.findOne({ where: { id: did } });
      if (!didEntity) {
        throw new NotFoundException('DID不存在');
      }

      // 简单恢复验证逻辑（实际应用需要更复杂的验证）
      let isVerified = false;

      // 验证邮箱
      if (email && didEntity.email === email) {
        isVerified = true;
      }

      // 更多验证逻辑...
      // 实际项目中应该有更复杂的验证流程

      if (!isVerified) {
        throw new UnauthorizedException('恢复验证失败，提供的信息不正确');
      }

      // 获取DID文档
      const didDocEntity = await this.didDocumentRepository.findOne({ where: { id: did } });
      if (!didDocEntity) {
        throw new NotFoundException('DID文档不存在');
      }

      // 将实体转换为标准DID文档格式
      const didDocument: DIDDocument = {
        '@context': didDocEntity.context,
        id: didDocEntity.id,
        controller: didDocEntity.controller,
        verificationMethod: didDocEntity.verificationMethod,
        authentication: didDocEntity.authentication,
      };

      // 在实际应用中，这里可能会重新生成密钥对并更新DID文档

      return {
        success: true,
        data: { did, didDocument },
        message: 'DID恢复成功',
      };
    } catch (error) {
      return {
        success: false,
        error: `DID恢复失败: ${error.message}`,
      };
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(did: string): Promise<ApiResponse<{ didInfo: any; didDocument: DIDDocument }>> {
    try {
      const didEntity = await this.didRepository.findOne({ where: { id: did } });
      if (!didEntity) {
        throw new NotFoundException('DID不存在');
      }

      const didDocEntity = await this.didDocumentRepository.findOne({ where: { id: did } });
      if (!didDocEntity) {
        throw new NotFoundException('DID文档不存在');
      }

      // 将实体转换为标准DID文档格式
      const didDocument: DIDDocument = {
        '@context': didDocEntity.context,
        id: didDocEntity.id,
        controller: didDocEntity.controller,
        verificationMethod: didDocEntity.verificationMethod,
        authentication: didDocEntity.authentication,
      };

      // 将实体转换为前端所需格式
      const didInfo = {
        did: didEntity.id,
        walletAddress: didEntity.walletAddress,
        email: didEntity.email,
        socialAccount: didEntity.socialAccount,
        createdAt: didEntity.createdAt,
      };

      return {
        success: true,
        data: {
          didInfo,
          didDocument,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `获取用户信息失败: ${error.message}`,
      };
    }
  }

  /**
   * 生成DID和DID文档
   */
  private generateDid(
    method: string,
    identifier: string
  ): { did: string; didDocument: DIDDocument; publicKey: string } {
    const uuid = uuidv4();
    let did: string;

    switch (method) {
      case 'ethr':
        // 对于以太坊地址，直接使用地址作为DID的一部分
        const ethAddress = identifier.split(':')[1];
        did = `did:ethr:${ethAddress}`;
        break;
      case 'email':
        // 对于邮箱，生成一个唯一标识符
        did = `did:email:${uuid}`;
        break;
      case 'web':
        // 对于社交账号，使用提供商和UUID
        const provider = identifier.split(':')[1];
        did = `did:web:${provider}.example.com:users:${uuid}`;
        break;
      default:
        did = `did:example:${uuid}`;
    }

    // 生成密钥对
    const { publicKey, privateKey } = this.generateKeyPair();

    // 创建DID文档
    const didDocument: DIDDocument = {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: did,
      controller: did,
      verificationMethod: [
        {
          id: `${did}#keys-1`,
          type: 'Ed25519VerificationKey2020',
          controller: did,
          publicKeyHex: publicKey,
        },
      ],
      authentication: [`${did}#keys-1`],
    };

    return { did, didDocument, publicKey };
  }

  /**
   * 生成密钥对
   */
  private generateKeyPair(): { publicKey: string; privateKey: string } {
    // 实际应用中应使用更安全的密钥对生成方法
    // 这里使用简化的示例
    const keyPair = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    // 转换为十六进制字符串
    const publicKeyHex = Buffer.from(keyPair.publicKey).toString('hex');
    const privateKeyHex = Buffer.from(keyPair.privateKey).toString('hex');

    return {
      publicKey: publicKeyHex,
      privateKey: privateKeyHex,
    };
  }
}
