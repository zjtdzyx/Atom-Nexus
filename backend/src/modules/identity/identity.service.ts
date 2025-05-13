import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Identity } from './entities/identity.entity';
import { IdentityProfile } from './entities/identity-profile.entity';
import { LoginHistory } from './entities/login-history.entity';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { BindIdentityDto } from './dto/bind-identity.dto';
import { DidService } from '../did/did.service';

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(Identity)
    private identityRepository: Repository<Identity>,

    @InjectRepository(IdentityProfile)
    private profileRepository: Repository<IdentityProfile>,

    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,

    private didService: DidService
  ) {}

  // 查找所有身份
  async findAll(): Promise<Identity[]> {
    return this.identityRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // 根据ID查找身份
  async findById(id: string): Promise<Identity> {
    const identity = await this.identityRepository.findOne({ where: { id } });
    if (!identity) {
      throw new NotFoundException(`身份ID ${id} 不存在`);
    }
    return identity;
  }

  // 创建新身份
  async create(createIdentityDto: CreateIdentityDto): Promise<Identity> {
    // 检查DID是否已存在
    const existing = await this.identityRepository.findOne({
      where: { did: createIdentityDto.did },
    });

    if (existing) {
      throw new BadRequestException(`DID ${createIdentityDto.did} 已被绑定`);
    }

    const identity = this.identityRepository.create(createIdentityDto);
    await this.identityRepository.save(identity);

    // 创建默认资料
    await this.profileRepository.save({
      identityId: identity.id,
    });

    return identity;
  }

  // 更新身份
  async update(id: string, updateIdentityDto: UpdateIdentityDto): Promise<Identity> {
    const identity = await this.findById(id);

    // 如果设置为默认身份，需要将其他身份设置为非默认
    if (updateIdentityDto.isDefault) {
      await this.identityRepository.update({ isDefault: true }, { isDefault: false });
    }

    const updated = Object.assign(identity, updateIdentityDto);
    return this.identityRepository.save(updated);
  }

  // 删除身份
  async remove(id: string): Promise<void> {
    const identity = await this.findById(id);
    await this.identityRepository.remove(identity);
  }

  // 绑定DID到身份
  async bindDid(bindIdentityDto: BindIdentityDto): Promise<Identity> {
    // 检查DID是否已绑定
    const existing = await this.identityRepository.findOne({
      where: { did: bindIdentityDto.did },
    });

    if (existing) {
      throw new BadRequestException(`DID ${bindIdentityDto.did} 已被绑定`);
    }

    // 创建并保存身份
    return this.create({
      did: bindIdentityDto.did,
      alias: bindIdentityDto.alias,
      type: 'personal', // 默认类型
      publicKey: '', // 应该从DID文档中获取
      metadata: {},
    });
  }

  // 解绑DID
  async unbindDid(id: string): Promise<void> {
    await this.findById(id);
    await this.remove(id);
  }

  // 设置默认身份
  async setDefault(id: string): Promise<void> {
    await this.findById(id);

    // 将所有身份设置为非默认
    await this.identityRepository.update({}, { isDefault: false });

    // 将指定身份设置为默认
    await this.identityRepository.update(id, { isDefault: true });
  }

  // 获取身份关联凭证
  async getCredentials(id: string): Promise<any[]> {
    await this.findById(id);

    // 这里应该查询凭证模块获取关联凭证
    // 暂时返回一个空数组
    return [];
  }

  // 获取登录历史
  async getLoginHistory(id: string): Promise<LoginHistory[]> {
    await this.findById(id);

    return this.loginHistoryRepository.find({
      where: { identityId: id },
      order: { timestamp: 'DESC' },
    });
  }

  // 获取身份资料
  async getProfile(id: string): Promise<IdentityProfile> {
    // 查询身份是否存在，但不使用返回结果
    await this.findById(id);

    let profile = await this.profileRepository.findOne({
      where: { identityId: id },
    });

    if (!profile) {
      // 如果资料不存在，创建一个空的
      const newProfile = this.profileRepository.create({
        identityId: id,
      });
      // 确保返回的是单个对象
      const saved = await this.profileRepository.save(newProfile);
      profile = Array.isArray(saved) ? saved[0] : saved;
    }

    return profile;
  }

  // 更新身份资料
  async updateProfile(id: string, profileData: any): Promise<IdentityProfile> {
    // 查询身份是否存在，但不使用返回结果
    await this.findById(id);

    let profile = await this.profileRepository.findOne({
      where: { identityId: id },
    });

    if (!profile) {
      // 如果资料不存在，创建一个新的
      const newProfile = this.profileRepository.create({
        identityId: id,
        ...profileData,
      });
      // 确保返回的是单个对象
      const saved = await this.profileRepository.save(newProfile);
      profile = Array.isArray(saved) ? saved[0] : saved;
    } else {
      // 更新现有资料
      Object.assign(profile, profileData);
      const saved = await this.profileRepository.save(profile);
      profile = Array.isArray(saved) ? saved[0] : saved;
    }

    return profile;
  }
}
