import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IssueCredentialDto, RevokeCredentialDto, CredentialType } from './dto';
import { 
  CredentialResponse, 
  CredentialDetailResponse, 
  CredentialShareResponse, 
  RevokeCredentialResponse, 
  CredentialStatus 
} from './models/credential.model';

@Injectable()
export class CredentialService {
  // 模拟数据存储
  private credentials: Map<string, CredentialDetailResponse> = new Map();
  private shares: Map<string, CredentialShareResponse> = new Map();

  /**
   * 签发新的凭证
   */
  async issueCredential(dto: IssueCredentialDto): Promise<CredentialResponse> {
    const id = `vc-${uuidv4()}`;
    const issuanceDate = new Date().toISOString();
    
    // 创建凭证
    const credential: CredentialDetailResponse = {
      id,
      type: dto.type,
      issuerId: dto.issuerId,
      subjectId: dto.subject.id,
      subject: dto.subject,
      issuanceDate,
      expirationDate: dto.expirationDate,
      status: CredentialStatus.ACTIVE,
      claims: dto.claims,
      // 生成证明
      proof: {
        type: 'EcdsaSecp256k1Signature2019',
        created: issuanceDate,
        verificationMethod: `${dto.issuerId}#keys-1`,
        proofPurpose: 'assertionMethod',
        signatureValue: this.generateSignature(id, dto),
      }
    };

    // 如果需要链上存证
    if (dto.storeOnChain !== false) {
      credential.transactionHash = await this.storeCredentialOnChain(credential);
    }

    // 保存凭证
    this.credentials.set(id, credential);

    // 返回基本信息
    return this.toCredentialResponse(credential);
  }

  /**
   * 查询凭证详情
   */
  async getCredentialDetails(id: string): Promise<CredentialDetailResponse> {
    const credential = this.credentials.get(id);
    if (!credential) {
      throw new NotFoundException(`凭证ID ${id} 不存在`);
    }
    
    // 检查凭证是否过期
    if (credential.expirationDate && new Date(credential.expirationDate) < new Date()) {
      credential.status = CredentialStatus.EXPIRED;
    }
    
    return credential;
  }

  /**
   * 撤销凭证
   */
  async revokeCredential(id: string, dto: RevokeCredentialDto): Promise<RevokeCredentialResponse> {
    const credential = await this.getCredentialDetails(id);
    
    // 检查是否已撤销
    if (credential.status === CredentialStatus.REVOKED) {
      throw new NotFoundException(`凭证已被撤销`);
    }
    
    // 检查撤销者是否是发行者
    if (credential.issuerId !== dto.revokedBy) {
      throw new NotFoundException(`只有发行者可以撤销凭证`);
    }

    // 更新凭证状态
    credential.status = CredentialStatus.REVOKED;
    this.credentials.set(id, credential);
    
    // 创建撤销响应
    const revokeResponse: RevokeCredentialResponse = {
      credentialId: id,
      status: CredentialStatus.REVOKED,
      revokedAt: new Date().toISOString(),
      revokedBy: dto.revokedBy,
      reason: dto.reason,
    };
    
    // 如果需要链上存证
    if (dto.storeOnChain !== false) {
      revokeResponse.transactionHash = await this.revokeCredentialOnChain(id, dto);
    }
    
    return revokeResponse;
  }

  /**
   * 分享凭证
   */
  async shareCredential(id: string): Promise<CredentialShareResponse> {
    // 检查凭证是否存在
    await this.getCredentialDetails(id);
    
    const shareId = `share-${uuidv4()}`;
    const createdAt = new Date().toISOString();
    
    // 创建30天有效期的分享链接
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const baseUrl = process.env.APP_URL || 'https://atom-nexus.com';
    const shareUrl = `${baseUrl}/verify/${shareId}`;
    
    // 创建分享响应
    const shareResponse: CredentialShareResponse = {
      shareId,
      credentialId: id,
      shareUrl,
      qrCodeData: await this.generateQRCode(shareUrl),
      createdAt,
      expiresAt: expiresAt.toISOString(),
    };
    
    // 保存分享记录
    this.shares.set(shareId, shareResponse);
    
    return shareResponse;
  }

  // 辅助方法

  /**
   * 将详细凭证转换为基本响应
   */
  private toCredentialResponse(credential: CredentialDetailResponse): CredentialResponse {
    const { id, type, issuerId, subjectId, issuanceDate, expirationDate, status, transactionHash } = credential;
    return { id, type, issuerId, subjectId, issuanceDate, expirationDate, status, transactionHash };
  }

  /**
   * 生成凭证签名
   */
  private generateSignature(id: string, dto: IssueCredentialDto): string {
    // 这里应该是实际的签名逻辑，使用私钥对凭证内容进行签名
    // 为演示目的，这里仅返回一个模拟的签名
    return `mock-signature-${Date.now()}-${id}`;
  }

  /**
   * 链上存证凭证
   */
  private async storeCredentialOnChain(credential: CredentialDetailResponse): Promise<string> {
    // 这里应该是实际的区块链交互逻辑
    // 为演示目的，这里仅返回一个模拟的交易哈希
    return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  /**
   * 链上撤销凭证
   */
  private async revokeCredentialOnChain(id: string, dto: RevokeCredentialDto): Promise<string> {
    // 这里应该是实际的区块链交互逻辑
    // 为演示目的，这里仅返回一个模拟的交易哈希
    return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  /**
   * 生成QR码数据
   */
  private async generateQRCode(data: string): Promise<string> {
    // 这里应该是实际的QR码生成逻辑
    // 为演示目的，这里仅返回一个模拟的Base64数据
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;
  }
} 