import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { VerifyDidDto, VerifyCredentialDto } from './dto';
import { 
  DidVerificationResult, 
  CredentialVerificationResult, 
  VerificationStatus 
} from './models/auth.model';
import { CredentialService } from '../credential/credential.service';

@Injectable()
export class AuthService {
  constructor(
    // 可以注入CredentialService来验证凭证
    private readonly credentialService: CredentialService,
  ) {}

  /**
   * 验证DID标识符
   */
  async verifyDid(dto: VerifyDidDto): Promise<DidVerificationResult> {
    try {
      // 检查DID格式是否有效
      if (!this.isValidDidFormat(dto.did)) {
        return {
          status: VerificationStatus.FAILED,
          message: 'DID格式无效',
          did: dto.did
        };
      }

      // 解析DID方法
      const didMethod = this.extractDidMethod(dto.did);

      // 确认是否支持该DID方法
      if (!this.isSupportedDidMethod(didMethod)) {
        return {
          status: VerificationStatus.FAILED,
          message: `不支持的DID方法: ${didMethod}`,
          did: dto.did
        };
      }

      // 从区块链或解析器获取DID文档
      const didDocument = await this.resolveDid(dto.did);
      
      if (!didDocument) {
        return {
          status: VerificationStatus.FAILED,
          message: '无法解析DID文档',
          did: dto.did
        };
      }

      // 提取控制者和公钥信息
      const controller = didDocument.controller || dto.did;
      const publicKeys = this.extractPublicKeys(didDocument);

      // 如果验证方法是'authenticate'或'full'，则需要验证控制权
      let authenticationResult = null;
      if (dto.method === 'authenticate' || dto.method === 'full') {
        // 身份验证逻辑（实际实现会更复杂）
        authenticationResult = {
          verified: true,
          timestamp: new Date().toISOString()
        };
      }

      // 创建成功响应
      return {
        status: VerificationStatus.SUCCESS,
        message: 'DID验证成功',
        did: dto.did,
        didDocument,
        controller,
        publicKeys,
        details: {
          method: didMethod,
          authentication: authenticationResult,
          verificationType: dto.method || 'resolve'
        }
      };
    } catch (error) {
      // 处理错误情况
      return {
        status: VerificationStatus.FAILED,
        message: `DID验证失败: ${error.message}`,
        did: dto.did,
        details: {
          error: error.message
        }
      };
    }
  }

  /**
   * 验证凭证有效性
   */
  async verifyCredential(dto: VerifyCredentialDto): Promise<CredentialVerificationResult> {
    try {
      // 根据ID或完整凭证内容获取凭证
      let credential;
      if (dto.id) {
        // 如果提供了ID，则从存储中获取凭证
        try {
          credential = await this.credentialService.getCredentialDetails(dto.id);
        } catch (error) {
          if (error instanceof NotFoundException) {
            return {
              status: VerificationStatus.FAILED,
              message: `凭证不存在: ${dto.id}`,
              credentialId: dto.id,
              signatureValid: false,
              verifiedAt: new Date().toISOString()
            };
          }
          throw error;
        }
      } else if (dto.credential) {
        // 如果提供了完整凭证，则直接使用
        credential = dto.credential;
      } else {
        throw new BadRequestException('必须提供凭证ID或完整凭证内容');
      }

      // 获取签发者DID
      const issuer = credential.issuerId || credential.issuer;
      if (!issuer) {
        return {
          status: VerificationStatus.FAILED,
          message: '凭证缺少签发者信息',
          credentialId: credential.id,
          signatureValid: false,
          verifiedAt: new Date().toISOString()
        };
      }

      // 验证签发者（如果需要）
      let issuerVerification = null;
      if (dto.verifyIssuer !== false) {
        // 验证签发者DID
        issuerVerification = await this.verifyDid({
          did: issuer,
          method: 'resolve'
        });

        if (issuerVerification.status !== VerificationStatus.SUCCESS) {
          return {
            status: VerificationStatus.FAILED,
            message: '签发者DID验证失败',
            credentialId: credential.id,
            issuer,
            signatureValid: false,
            verifiedAt: new Date().toISOString(),
            details: {
              issuerVerification
            }
          };
        }
      }

      // 验证签名
      const signatureValid = await this.verifyCredentialSignature(credential, dto.proof);

      if (!signatureValid) {
        return {
          status: VerificationStatus.FAILED,
          message: '凭证签名验证失败',
          credentialId: credential.id,
          issuer,
          signatureValid: false,
          verifiedAt: new Date().toISOString()
        };
      }

      // 检查过期状态
      const isExpired = this.isCredentialExpired(credential);

      // 检查撤销状态（如果需要）
      let isRevoked = false;
      if (dto.checkRevocationStatus !== false) {
        isRevoked = await this.checkCredentialRevocationStatus(credential);
      }

      // 生成验证结果
      const verificationStatus = isExpired || isRevoked 
        ? VerificationStatus.PARTIAL 
        : VerificationStatus.SUCCESS;
      
      const message = isExpired 
        ? '凭证已过期' 
        : isRevoked 
          ? '凭证已被撤销' 
          : '凭证验证成功';

      return {
        status: verificationStatus,
        message,
        credentialId: credential.id,
        issuer,
        signatureValid: true,
        isExpired,
        isRevoked,
        verifiedAt: new Date().toISOString(),
        details: {
          issuerVerification,
          expirationDate: credential.expirationDate
        }
      };
    } catch (error) {
      // 处理错误情况
      return {
        status: VerificationStatus.FAILED,
        message: `凭证验证失败: ${error.message}`,
        credentialId: dto.id,
        signatureValid: false,
        verifiedAt: new Date().toISOString(),
        details: {
          error: error.message
        }
      };
    }
  }

  // 辅助方法

  /**
   * 检查DID格式是否有效
   */
  private isValidDidFormat(did: string): boolean {
    // 简单的DID格式验证，实际实现可能更复杂
    const didRegex = /^did:[a-z0-9]+:[a-zA-Z0-9.%-]+$/;
    return didRegex.test(did);
  }

  /**
   * 提取DID方法
   */
  private extractDidMethod(did: string): string {
    const parts = did.split(':');
    return parts.length >= 2 ? parts[1] : '';
  }

  /**
   * 判断是否支持给定的DID方法
   */
  private isSupportedDidMethod(method: string): boolean {
    // 支持的DID方法列表
    const supportedMethods = ['atom', 'ethr', 'web', 'key', 'ion'];
    return supportedMethods.includes(method);
  }

  /**
   * 解析DID文档
   */
  private async resolveDid(did: string): Promise<Record<string, any>> {
    // 这里应该是实际的DID解析逻辑
    // 可以使用did-resolver或其他库来实现
    // 为了示例，这里返回一个模拟的DID文档
    return {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      controller: did,
      authentication: [
        `${did}#keys-1`
      ],
      verificationMethod: [
        {
          id: `${did}#keys-1`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: did,
          publicKeyHex: '04ab...'
        }
      ]
    };
  }

  /**
   * 提取公钥信息
   */
  private extractPublicKeys(didDocument: Record<string, any>): Array<any> {
    // 从DID文档中提取公钥信息
    return didDocument.verificationMethod || [];
  }

  /**
   * 验证凭证签名
   */
  private async verifyCredentialSignature(
    credential: Record<string, any>, 
    proof: any
  ): Promise<boolean> {
    // 实际签名验证逻辑
    // 为了示例，这里简单返回true
    return true;
  }

  /**
   * 检查凭证是否过期
   */
  private isCredentialExpired(credential: Record<string, any>): boolean {
    if (!credential.expirationDate) {
      return false;
    }

    const expirationDate = new Date(credential.expirationDate);
    const now = new Date();
    return expirationDate < now;
  }

  /**
   * 检查凭证撤销状态
   */
  private async checkCredentialRevocationStatus(credential: Record<string, any>): Promise<boolean> {
    // 实际撤销状态检查逻辑
    // 为了示例，这里简单返回false (未撤销)
    return credential.status === 'revoked';
  }
} 