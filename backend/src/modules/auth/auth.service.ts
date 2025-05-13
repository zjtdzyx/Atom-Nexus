import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { VerifyDidDto, VerifyCredentialDto, LoginDto, RegisterDto } from './dto';
import {
  DidVerificationResult,
  CredentialVerificationResult,
  VerificationStatus,
  LoginResponse,
} from './models/auth.model';
import { CredentialService } from '../credential/credential.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthLog } from './entities/auth-log.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    // 可以注入CredentialService来验证凭证
    private readonly credentialService: CredentialService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthLog)
    private readonly authLogRepository: Repository<AuthLog>
  ) {}

  /**
   * 用户登录 - 完整版本，支持数据库用户
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    try {
      this.logger.log(`尝试登录用户: ${dto.username}, 记住我: ${dto.rememberMe}`);

      // 查找用户 - 从数据库获取
      const user = await this.userRepository.findOne({
        where: { username: dto.username },
      });

      this.logger.debug(`数据库用户查询结果: ${!!user}`);

      // 如果找不到用户，检查是否为测试用户
      if (!user) {
        // 支持测试用户登录
        if (dto.username === 'test' && dto.password === 'password123') {
          this.logger.log('使用测试用户登录');
          const testUser = {
            id: 'test-user-id',
            username: 'test',
            email: 'test@example.com',
            fullName: '测试用户',
            avatar: null,
            role: 'user' as 'admin' | 'user' | 'developer',
          };

          // 生成令牌
          const expiresIn = dto.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60; // 7天或1小时
          const accessToken = this.jwtService.sign(
            { sub: testUser.id, username: testUser.username, role: testUser.role },
            { expiresIn }
          );
          const refreshToken = this.jwtService.sign(
            { sub: testUser.id, type: 'refresh' },
            { expiresIn: 60 * 60 * 24 * 30 } // 30天
          );

          this.logger.debug('为测试用户生成的令牌:', {
            accessToken: accessToken.substring(0, 20) + '...',
          });

          // 记录登录
          await this.logAuthActivity({
            username: testUser.username,
            userId: testUser.id,
            action: 'login',
            success: true,
            details: JSON.stringify({ isTestUser: true, rememberMe: dto.rememberMe }),
          });

          this.logger.log('测试用户登录成功');
          return {
            accessToken,
            refreshToken,
            expiresIn,
            user: testUser,
          };
        }

        this.logger.warn(`登录失败: 用户不存在 ${dto.username}`);
        // 记录登录失败 - 用户不存在
        await this.logAuthActivity({
          username: dto.username,
          action: 'login',
          success: false,
          details: '用户不存在',
        });

        throw new UnauthorizedException('用户名或密码错误');
      }

      this.logger.debug(`找到用户: ${user.username}, 开始验证密码`);
      // 验证密码
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`密码验证失败: ${user.username}`);
        // 记录登录失败 - 密码错误
        await this.logAuthActivity({
          username: user.username,
          userId: user.id,
          action: 'login',
          success: false,
          details: '密码错误',
        });

        throw new UnauthorizedException('用户名或密码错误');
      }

      this.logger.debug('密码验证成功，生成令牌');
      // 生成令牌
      const expiresIn = dto.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60; // 7天或1小时
      const accessToken = this.jwtService.sign(
        { sub: user.id, username: user.username, role: user.role },
        { expiresIn }
      );
      const refreshToken = this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: 60 * 60 * 24 * 30 } // 30天
      );

      this.logger.debug('生成的JWT令牌:', { accessToken: accessToken.substring(0, 20) + '...' });

      // 记录登录成功
      await this.logAuthActivity({
        username: user.username,
        userId: user.id,
        action: 'login',
        success: true,
        details: JSON.stringify({ rememberMe: dto.rememberMe }),
      });

      this.logger.log(`用户 ${user.username} 登录成功`);
      // 返回登录响应
      return {
        accessToken,
        refreshToken,
        expiresIn,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName || '',
          avatar: user.avatar,
          role: user.role as any,
        },
      };
    } catch (error) {
      // 如果是已处理的错误，直接抛出
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(`登录过程中发生未知错误:`, error);
      // 记录未知错误
      await this.logAuthActivity({
        username: dto.username,
        action: 'login',
        success: false,
        details: error.message,
      }).catch(() => {});

      throw new UnauthorizedException('登录失败，请稍后重试');
    }
  }

  /**
   * 用户注册
   */
  async register(dto: RegisterDto): Promise<{ success: boolean; message: string }> {
    // 验证密码是否匹配
    if (dto.password !== dto.confirmPassword) {
      this.logger.warn('注册失败: 两次输入的密码不一致');
      throw new BadRequestException('两次输入的密码不一致');
    }

    try {
      this.logger.log(`尝试注册新用户: ${dto.username}, ${dto.email}`);

      // 验证用户名是否可用
      const existingUsername = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existingUsername) {
        this.logger.warn(`注册失败: 用户名已被使用 ${dto.username}`);
        throw new BadRequestException('用户名已被使用');
      }

      // 验证邮箱是否可用
      const existingEmail = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existingEmail) {
        this.logger.warn(`注册失败: 邮箱已被注册 ${dto.email}`);
        throw new BadRequestException('邮箱已被注册');
      }

      // 验证服务条款
      if (!dto.agreeTerms) {
        this.logger.warn('注册失败: 用户未同意服务条款');
        throw new BadRequestException('必须同意服务条款和隐私政策');
      }

      this.logger.debug('验证通过，开始创建用户');
      // 加密密码
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 创建新用户
      const newUser = this.userRepository.create({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: 'user', // 默认角色
      });

      // 保存到数据库
      const savedUser = await this.userRepository.save(newUser);
      this.logger.debug(`用户已保存到数据库, ID: ${savedUser.id}`);

      // 记录注册成功
      await this.logAuthActivity({
        username: savedUser.username,
        userId: savedUser.id,
        action: 'register',
        success: true,
        details: JSON.stringify({ email: savedUser.email }),
      });

      this.logger.log(`用户注册成功: ${savedUser.username}`);
      return {
        success: true,
        message: '注册成功，请登录您的账户',
      };
    } catch (error) {
      // BadRequestException直接抛出
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error('注册过程中发生错误:', error);
      // 记录注册失败
      await this.logAuthActivity({
        username: dto.username,
        action: 'register',
        success: false,
        details: error.message,
      }).catch(() => {});

      throw new BadRequestException('注册失败，请稍后重试');
    }
  }

  /**
   * 记录认证活动日志
   */
  private async logAuthActivity(data: {
    username: string;
    userId?: string;
    action: string;
    success: boolean;
    details?: string;
  }): Promise<void> {
    try {
      const log = new AuthLog();
      log.username = data.username;
      if (data.userId) log.userId = data.userId;
      log.action = data.action;
      log.success = data.success;
      log.details = data.details || '';
      log.timestamp = new Date();
      await this.authLogRepository.save(log);
    } catch (error) {
      console.error('Failed to log auth activity:', error);
    }
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    // 无状态JWT认证中，服务器端无需特殊处理
    return;
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      // 验证刷新令牌
      const payload = this.jwtService.verify(refreshToken);

      // 检查令牌类型
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('无效的刷新令牌');
      }

      // 查找用户
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 生成新的访问令牌
      const expiresIn = 60 * 60; // 1小时
      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          username: user.username,
          role: user.role,
        },
        {
          expiresIn,
        }
      );

      // 记录令牌刷新
      await this.logAuthActivity({
        username: user.username,
        userId: user.id,
        action: 'refresh-token',
        success: true,
      });

      return {
        accessToken,
        expiresIn,
      };
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  /**
   * 检查用户名是否可用
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    return {
      available: !existingUser,
    };
  }

  /**
   * 检查邮箱是否可用
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    return {
      available: !existingUser,
    };
  }

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
          did: dto.did,
        };
      }

      // 解析DID方法
      const didMethod = this.extractDidMethod(dto.did);

      // 确认是否支持该DID方法
      if (!this.isSupportedDidMethod(didMethod)) {
        return {
          status: VerificationStatus.FAILED,
          message: `不支持的DID方法: ${didMethod}`,
          did: dto.did,
        };
      }

      // 从区块链或解析器获取DID文档
      const didDocument = await this.resolveDid(dto.did);

      if (!didDocument) {
        return {
          status: VerificationStatus.FAILED,
          message: '无法解析DID文档',
          did: dto.did,
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
          timestamp: new Date().toISOString(),
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
          verificationType: dto.method || 'resolve',
        },
      };
    } catch (error) {
      // 处理错误情况
      return {
        status: VerificationStatus.FAILED,
        message: `DID验证失败: ${error.message}`,
        did: dto.did,
        details: {
          error: error.message,
        },
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
              verifiedAt: new Date().toISOString(),
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
          verifiedAt: new Date().toISOString(),
        };
      }

      // 验证签发者（如果需要）
      let issuerVerification = null;
      if (dto.verifyIssuer !== false) {
        // 验证签发者DID
        issuerVerification = await this.verifyDid({
          did: issuer,
          method: 'resolve',
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
              issuerVerification,
            },
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
          verifiedAt: new Date().toISOString(),
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
      const verificationStatus =
        isExpired || isRevoked ? VerificationStatus.PARTIAL : VerificationStatus.SUCCESS;

      const message = isExpired ? '凭证已过期' : isRevoked ? '凭证已被撤销' : '凭证验证成功';

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
          expirationDate: credential.expirationDate,
        },
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
          error: error.message,
        },
      };
    }
  }

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
      authentication: [`${did}#keys-1`],
      verificationMethod: [
        {
          id: `${did}#keys-1`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: did,
          publicKeyHex: '04ab...',
        },
      ],
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
   * 验证凭证签名 (示例实现)
   */
  private async verifyCredentialSignature(
    _credential: Record<string, any>,
    _proof: any
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
