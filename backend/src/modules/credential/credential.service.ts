import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IssueCredentialDto, RevokeCredentialDto, CredentialType } from './dto';
import {
  CredentialResponse,
  CredentialDetailResponse,
  CredentialShareResponse,
  RevokeCredentialResponse,
  CredentialStatus,
} from './models/credential.model';
import { Credential } from './entities/credential.entity';
import { CredentialProof } from './entities/credential-proof.entity';
import { CredentialShare } from './entities/credential-share.entity';

@Injectable()
export class CredentialService {
  constructor(
    @InjectRepository(Credential)
    private credentialRepository: Repository<Credential>,
    @InjectRepository(CredentialProof)
    private proofRepository: Repository<CredentialProof>,
    @InjectRepository(CredentialShare)
    private shareRepository: Repository<CredentialShare>
  ) {}

  /**
   * 签发新的凭证
   */
  async issueCredential(dto: IssueCredentialDto): Promise<CredentialResponse> {
    const id = `vc-${uuidv4()}`;
    const issuanceDate = new Date();

    // 创建凭证
    const credential = this.credentialRepository.create({
      id,
      ownerDid: dto.subject.id,
      credentialType: dto.type,
      credentialData: {
        type: dto.type,
        issuer: dto.issuerId,
        subject: dto.subject,
        claims: dto.claims,
      },
      status: CredentialStatus.ACTIVE,
      issuedAt: issuanceDate,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
    } as Partial<Credential>);

    // 保存凭证
    await this.credentialRepository.save(credential);

    // 生成证明
    const proof = this.proofRepository.create({
      credentialId: id,
      type: 'EcdsaSecp256k1Signature2019',
      created: issuanceDate,
      verificationMethod: `${dto.issuerId}#keys-1`,
      proofPurpose: 'assertionMethod',
      signatureValue: this.generateSignature(id, dto),
    });

    // 保存证明
    await this.proofRepository.save(proof);

    // 如果需要链上存证
    if (dto.storeOnChain !== false) {
      const transactionHash = await this.storeCredentialOnChain(credential);
      credential.transactionHash = transactionHash;
      await this.credentialRepository.save(credential);
    }

    // 返回基本信息
    return await this.toCredentialResponse(credential);
  }

  /**
   * 查询凭证详情
   */
  async getCredentialDetails(id: string): Promise<CredentialDetailResponse> {
    const credential = await this.credentialRepository.findOne({
      where: { id },
      relations: ['proof'],
    });

    if (!credential) {
      throw new NotFoundException(`凭证ID ${id} 不存在`);
    }

    // 检查凭证是否过期
    if (credential.expirationDate && credential.expirationDate < new Date()) {
      credential.status = CredentialStatus.REVOKED;
      await this.credentialRepository.save(credential);
    }

    const proof = await this.proofRepository.findOne({
      where: { credentialId: id },
    });

    // 将数据库实体转换为详细响应
    const credentialData = credential.credentialData as any;

    const detailResponse: CredentialDetailResponse = {
      id: credential.id,
      type: credentialData.type as CredentialType,
      issuerId: credentialData.issuer,
      subjectId: credential.ownerDid,
      subject: credentialData.subject,
      issuanceDate: credential.issuedAt.toISOString(),
      expirationDate: credential.expirationDate
        ? credential.expirationDate.toISOString()
        : undefined,
      status: credential.status,
      claims: credentialData.claims,
      transactionHash: credential.transactionHash,
      proof: proof
        ? {
            type: proof.type,
            created: proof.created.toISOString(),
            verificationMethod: proof.verificationMethod,
            proofPurpose: proof.proofPurpose,
            signatureValue: proof.signatureValue,
          }
        : null,
    };

    return detailResponse;
  }

  /**
   * 撤销凭证
   */
  async revokeCredential(id: string, dto: RevokeCredentialDto): Promise<RevokeCredentialResponse> {
    const credential = await this.credentialRepository.findOne({ where: { id } });

    if (!credential) {
      throw new NotFoundException(`凭证ID ${id} 不存在`);
    }

    // 检查是否已撤销
    if (credential.status === CredentialStatus.REVOKED) {
      throw new NotFoundException(`凭证已被撤销`);
    }

    // 检查撤销者是否是发行者
    const credentialData = credential.credentialData as any;
    if (credentialData.issuer !== dto.revokedBy) {
      throw new NotFoundException(`只有发行者可以撤销凭证`);
    }

    // 更新凭证状态
    credential.status = CredentialStatus.REVOKED;
    credential.revokedAt = new Date();
    await this.credentialRepository.save(credential);

    // 创建撤销响应
    const revokeResponse: RevokeCredentialResponse = {
      credentialId: id,
      status: CredentialStatus.REVOKED,
      revokedAt: credential.revokedAt.toISOString(),
      revokedBy: dto.revokedBy,
      reason: dto.reason,
    };

    // 如果需要链上存证
    if (dto.storeOnChain !== false) {
      const transactionHash = await this.revokeCredentialOnChain(id, dto);
      revokeResponse.transactionHash = transactionHash;
    }

    return revokeResponse;
  }

  /**
   * 分享凭证
   */
  async shareCredential(id: string): Promise<CredentialShareResponse> {
    // 检查凭证是否存在
    const credential = await this.credentialRepository.findOne({ where: { id } });
    if (!credential) {
      throw new NotFoundException(`凭证ID ${id} 不存在`);
    }

    const shareId = `share-${uuidv4()}`;
    const createdAt = new Date();

    // 创建30天有效期的分享链接
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const baseUrl = process.env.APP_URL || 'https://atom-nexus.com';
    const shareUrl = `${baseUrl}/verify/${shareId}`;
    const qrCodeData = await this.generateQRCode(shareUrl);

    // 创建分享记录
    const share = this.shareRepository.create({
      id: shareId,
      credentialId: id,
      shareUrl,
      qrCodeData,
      createdAt,
      expiresAt,
    });

    await this.shareRepository.save(share);

    // 转换为响应格式
    const shareResponse: CredentialShareResponse = {
      shareId,
      credentialId: id,
      shareUrl,
      qrCodeData,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    return shareResponse;
  }

  // 辅助方法

  /**
   * 将详细凭证转换为基本响应
   */
  private async toCredentialResponse(credential: Credential): Promise<CredentialResponse> {
    const credentialData = credential.credentialData as any;

    return {
      id: credential.id,
      type: credentialData.type,
      issuerId: credentialData.issuer,
      subjectId: credential.ownerDid,
      issuanceDate: credential.issuedAt.toISOString(),
      expirationDate: credential.expirationDate
        ? credential.expirationDate.toISOString()
        : undefined,
      status: credential.status,
      transactionHash: credential.transactionHash,
    };
  }

  /**
   * 生成凭证签名
   */
  private generateSignature(id: string, _dto: IssueCredentialDto): string {
    // 这里应该是实际的签名逻辑，使用私钥对凭证内容进行签名
    // 为演示目的，这里仅返回一个模拟的签名
    return `mock-signature-${Date.now()}-${id}`;
  }

  /**
   * 链上存证凭证
   */
  private async storeCredentialOnChain(_credential: Credential): Promise<string> {
    // 这里应该是实际的区块链交互逻辑
    // 为演示目的，这里仅返回一个模拟的交易哈希
    return `0x${Array(64)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')}`;
  }

  /**
   * 链上撤销凭证
   */
  private async revokeCredentialOnChain(_id: string, _dto: RevokeCredentialDto): Promise<string> {
    // 这里应该是实际的区块链交互逻辑
    // 为演示目的，这里仅返回一个模拟的交易哈希
    return `0x${Array(64)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')}`;
  }

  /**
   * 生成QR码数据
   */
  private async generateQRCode(_data: string): Promise<string> {
    // 这里应该是实际的QR码生成逻辑
    // 为演示目的，这里仅返回一个模拟的Base64数据
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;
  }
}
