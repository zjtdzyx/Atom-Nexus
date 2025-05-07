import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateDidDto, RecoverDidDto } from './dto';
import { DIDDocument, DIDInfo } from './interfaces/did.interface';
import { ApiResponse } from '../../common/interfaces/response.interface';
import * as crypto from 'crypto';

@Injectable()
export class DidService {
  // 模拟数据存储
  private didStore: Map<string, DIDInfo> = new Map();
  private didDocuments: Map<string, DIDDocument> = new Map();
  private identifierToDid: Map<string, string> = new Map();

  /**
   * 注册新的去中心化身份
   */
  async registerDid(createDidDto: CreateDidDto): Promise<ApiResponse<{ did: string, didDocument: DIDDocument }>> {
    try {
      const { walletAddress, email, socialAccount, provider, recoveryEmail, recoveryOptions } = createDidDto;
      
      // 验证至少有一种身份标识方式
      if (!walletAddress && !email && !socialAccount) {
        throw new BadRequestException('必须提供钱包地址、邮箱或社交账号中的至少一种');
      }
      
      // 检查标识符是否已注册
      const identifier = this.getIdentifier(createDidDto);
      if (this.identifierToDid.has(identifier)) {
        throw new BadRequestException('该标识符已关联DID');
      }

      // 确定DID方法
      let method: string;
      if (walletAddress) {
        method = 'ethr';
      } else if (email) {
        method = 'email';
      } else {
        method = 'web';
      }
      
      // 生成DID和密钥对
      const { did, didDocument } = this.generateDid(method, identifier);
      
      // 存储DID信息
      const didInfo: DIDInfo = {
        did,
        method,
        identifier,
        recoveryEmail,
        recoveryOptions,
        createdAt: new Date().toISOString(),
      };
      
      this.didStore.set(did, didInfo);
      this.didDocuments.set(did, didDocument);
      this.identifierToDid.set(identifier, did);
      
      return {
        success: true,
        data: { did, didDocument },
        message: 'DID创建成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `DID创建失败: ${error.message}`
      };
    }
  }

  /**
   * 恢复DID
   */
  async recoverDid(recoverDidDto: RecoverDidDto): Promise<ApiResponse<{ did: string, didDocument: DIDDocument }>> {
    try {
      const { did, email, verificationCode, recoveryEmail, securityAnswers, additionalRecoveryInfo } = recoverDidDto;
      
      // 检查DID是否存在
      if (!this.didStore.has(did)) {
        throw new NotFoundException('DID不存在');
      }
      
      const didInfo = this.didStore.get(did);
      
      // 简单恢复验证逻辑（实际应用需要更复杂的验证）
      let isVerified = false;
      
      // 验证邮箱
      if (email && didInfo.identifier === email) {
        isVerified = true;
      }
      
      // 验证恢复邮箱
      if (recoveryEmail && didInfo.recoveryEmail === recoveryEmail) {
        isVerified = true;
      }
      
      // 验证安全问题答案
      if (securityAnswers && didInfo.recoveryOptions?.securityQuestions) {
        const questions = didInfo.recoveryOptions.securityQuestions as string[];
        const correctAnswers = didInfo.recoveryOptions.securityAnswers as Record<string, string>;
        
        let answeredCorrectly = true;
        for (const question of questions) {
          if (securityAnswers[question] !== correctAnswers?.[question]) {
            answeredCorrectly = false;
            break;
          }
        }
        
        if (answeredCorrectly) {
          isVerified = true;
        }
      }
      
      if (!isVerified) {
        throw new UnauthorizedException('恢复验证失败，提供的信息不正确');
      }
      
      // 获取DID文档
      const didDocument = this.didDocuments.get(did);
      
      // 在实际应用中，这里可能会重新生成密钥对并更新DID文档
      
      return {
        success: true,
        data: { did, didDocument },
        message: 'DID恢复成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `DID恢复失败: ${error.message}`
      };
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(did: string): Promise<ApiResponse<{ didInfo: DIDInfo, didDocument: DIDDocument }>> {
    try {
      if (!this.didStore.has(did)) {
        throw new NotFoundException('DID不存在');
      }
      
      const didInfo = this.didStore.get(did);
      const didDocument = this.didDocuments.get(did);
      
      // 移除敏感信息
      const safeDidInfo = { ...didInfo };
      delete safeDidInfo.recoveryOptions;
      
      return {
        success: true,
        data: { 
          didInfo: safeDidInfo, 
          didDocument 
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `获取用户信息失败: ${error.message}`
      };
    }
  }
  
  /**
   * 从DTO中获取唯一标识符
   */
  private getIdentifier(createDidDto: CreateDidDto): string {
    if (createDidDto.walletAddress) {
      return `wallet:${createDidDto.walletAddress.toLowerCase()}`;
    } else if (createDidDto.email) {
      return `email:${createDidDto.email.toLowerCase()}`;
    } else if (createDidDto.socialAccount && createDidDto.provider) {
      return `social:${createDidDto.provider.toLowerCase()}:${createDidDto.socialAccount.toLowerCase()}`;
    } else {
      throw new BadRequestException('无法确定身份标识符');
    }
  }
  
  /**
   * 生成DID和DID文档
   */
  private generateDid(method: string, identifier: string): { did: string; didDocument: DIDDocument } {
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
    const { publicKey } = this.generateKeyPair();
    
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
          publicKeyHex: publicKey
        }
      ],
      authentication: [
        `${did}#keys-1`
      ]
    };
    
    return { did, didDocument };
  }
  
  /**
   * 生成密钥对
   */
  private generateKeyPair(): { publicKey: string; privateKey: string } {
    // 实际应用中应使用更安全的密钥对生成方法
    // 这里使用简化的示例
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'der' },
      privateKeyEncoding: { type: 'pkcs8', format: 'der' }
    });
    
    return {
      publicKey: Buffer.from(publicKey).toString('hex'),
      privateKey: Buffer.from(privateKey).toString('hex')
    };
  }
} 