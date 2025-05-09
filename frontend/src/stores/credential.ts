import { defineStore } from 'pinia';
import { logger } from '../utils/logger';

// 凭证状态枚举
export enum CredentialStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

// 凭证基本信息接口
export interface Credential {
  id: string;
  issuer: string;
  holder: string;
  type: string[];
  issuanceDate: string;
  expirationDate?: string;
  status: CredentialStatus;
  proof?: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    signature: string;
  };
  credentialSubject: Record<string, any>;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    [key: string]: any;
  };
}

// 验证结果接口
export interface VerifyResult {
  isValid: boolean;
  checks: {
    format: boolean;
    signature: boolean;
    expired: boolean;
    revoked: boolean;
  };
  errors?: string[];
}

// 筛选条件接口
export interface CredentialFilter {
  type?: string;
  issuer?: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery: string;
}

// 凭证状态接口
interface CredentialState {
  credentials: Credential[];
  currentCredential: Credential | null;
  loading: boolean;
  error: string | null;
  filter: CredentialFilter;
}

// 创建凭证存储
export const useCredentialStore = defineStore('credential', {
  state: (): CredentialState => ({
    credentials: [],
    currentCredential: null,
    loading: false,
    error: null,
    filter: {
      status: 'all',
      searchQuery: '',
    },
  }),

  getters: {
    // 有效凭证
    validCredentials: (state) =>
      state.credentials.filter((cred) => cred.status === CredentialStatus.VALID),

    // 过期凭证
    expiredCredentials: (state) =>
      state.credentials.filter((cred) => cred.status === CredentialStatus.EXPIRED),

    // 已撤销凭证
    revokedCredentials: (state) =>
      state.credentials.filter((cred) => cred.status === CredentialStatus.REVOKED),

    // 按类型分组
    credentialsByType: (state) => {
      const grouped: Record<string, Credential[]> = {};

      state.credentials.forEach((cred) => {
        const mainType = cred.type[cred.type.length - 1];
        if (!grouped[mainType]) {
          grouped[mainType] = [];
        }
        grouped[mainType].push(cred);
      });

      return grouped;
    },

    // 根据过滤条件筛选
    filteredCredentials: (state) => {
      return state.credentials.filter((cred) => {
        // 状态筛选
        if (state.filter.status !== 'all' && cred.status !== state.filter.status) {
          return false;
        }

        // 类型筛选
        if (state.filter.type && !cred.type.includes(state.filter.type)) {
          return false;
        }

        // 发行者筛选
        if (state.filter.issuer && cred.issuer !== state.filter.issuer) {
          return false;
        }

        // 日期筛选
        if (state.filter.dateFrom) {
          const fromDate = new Date(state.filter.dateFrom);
          const issueDate = new Date(cred.issuanceDate);
          if (issueDate < fromDate) {
            return false;
          }
        }

        if (state.filter.dateTo) {
          const toDate = new Date(state.filter.dateTo);
          const issueDate = new Date(cred.issuanceDate);
          if (issueDate > toDate) {
            return false;
          }
        }

        // 搜索查询
        if (state.filter.searchQuery) {
          const query = state.filter.searchQuery.toLowerCase();
          const matchesName = cred.metadata?.name?.toLowerCase().includes(query);
          const matchesType = cred.type.some((t) => t.toLowerCase().includes(query));
          const matchesIssuer = cred.issuer.toLowerCase().includes(query);
          const matchesId = cred.id.toLowerCase().includes(query);

          return matchesName || matchesType || matchesIssuer || matchesId;
        }

        return true;
      });
    },
  },

  actions: {
    // 获取所有凭证
    async fetchCredentials() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始获取凭证列表');

      try {
        // 模拟API调用，实际项目中应从服务端获取
        // const { data } = await credentialService.getCredentials();
        // this.credentials = data;

        // 临时使用模拟数据
        this.credentials = [
          {
            id: 'vc-1',
            issuer: 'did:example:issuer123',
            holder: 'did:example:holder456',
            type: ['VerifiableCredential', 'EducationalCredential'],
            issuanceDate: '2023-01-15T10:00:00Z',
            expirationDate: '2025-01-15T10:00:00Z',
            status: CredentialStatus.VALID,
            credentialSubject: {
              id: 'did:example:holder456',
              name: '李明',
              degree: '计算机科学学士',
              university: '北京大学',
            },
            metadata: {
              name: '学历证书',
              description: '北京大学计算机科学学士学位证书',
              image: '/images/degree-icon.png',
            },
          },
          {
            id: 'vc-2',
            issuer: 'did:example:issuer789',
            holder: 'did:example:holder456',
            type: ['VerifiableCredential', 'EmploymentCredential'],
            issuanceDate: '2023-03-20T14:30:00Z',
            status: CredentialStatus.VALID,
            credentialSubject: {
              id: 'did:example:holder456',
              name: '李明',
              position: '软件工程师',
              company: '科技有限公司',
              startDate: '2023-03-20',
            },
            metadata: {
              name: '就业证明',
              description: '科技有限公司就业证明',
            },
          },
          {
            id: 'vc-3',
            issuer: 'did:example:issuer456',
            holder: 'did:example:holder456',
            type: ['VerifiableCredential', 'MembershipCredential'],
            issuanceDate: '2022-11-05T09:15:00Z',
            expirationDate: '2023-11-05T09:15:00Z',
            status: CredentialStatus.EXPIRED,
            credentialSubject: {
              id: 'did:example:holder456',
              name: '李明',
              membershipId: 'M12345',
              level: '黄金会员',
            },
            metadata: {
              name: '会员卡',
              description: '黄金会员资格证明',
            },
          },
        ];

        logger.info('Store:Credential', '获取凭证列表成功', {
          count: this.credentials.length,
        });
      } catch (error: any) {
        this.error = error.message || '获取凭证列表失败';
        logger.error('Store:Credential', '获取凭证列表失败', {
          error: error.message,
        });
      } finally {
        this.loading = false;
      }
    },

    // 获取凭证详情
    async fetchCredentialById(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始获取凭证详情', { id });

      try {
        // 模拟API调用，实际项目中应从服务端获取
        // const { data } = await credentialService.getCredentialById(id);
        // this.currentCredential = data;

        // 临时从本地凭证列表中查找
        if (this.credentials.length === 0) {
          await this.fetchCredentials();
        }

        const credential = this.credentials.find((c) => c.id === id);
        if (credential) {
          this.currentCredential = credential;
        } else {
          throw new Error('凭证不存在');
        }

        logger.info('Store:Credential', '获取凭证详情成功');
      } catch (error: any) {
        this.error = error.message || '获取凭证详情失败';
        logger.error('Store:Credential', '获取凭证详情失败', {
          id,
          error: error.message,
        });
      } finally {
        this.loading = false;
      }
    },

    // 验证凭证
    async verifyCredential(id: string) {
      logger.info('Store:Credential', '开始验证凭证', { id });

      try {
        // 模拟API调用，实际项目中应调用验证服务
        // const { data } = await credentialService.verifyCredential(id);
        // return data;

        // 模拟验证结果
        const result: VerifyResult = {
          isValid: true,
          checks: {
            format: true,
            signature: true,
            expired: false,
            revoked: false,
          },
        };

        // 如果是已过期凭证，返回相应结果
        if (this.currentCredential && this.currentCredential.status === CredentialStatus.EXPIRED) {
          result.isValid = false;
          result.checks.expired = true;
          result.errors = ['凭证已过期'];
        }

        // 如果是已撤销凭证，返回相应结果
        if (this.currentCredential && this.currentCredential.status === CredentialStatus.REVOKED) {
          result.isValid = false;
          result.checks.revoked = true;
          result.errors = ['凭证已被撤销'];
        }

        logger.info('Store:Credential', '验证凭证完成', {
          id,
          isValid: result.isValid,
        });

        return result;
      } catch (error: any) {
        logger.error('Store:Credential', '验证凭证失败', {
          id,
          error: error.message,
        });
        throw error;
      }
    },

    // 验证凭证JSON
    async verifyCredentialJson(credentialData: any) {
      logger.info('Store:Credential', '开始验证凭证JSON');

      try {
        // 模拟API调用，实际项目中应调用验证服务
        // const { data } = await credentialService.verifyCredentialJson(credentialData);
        // return data;

        // 模拟验证结果
        const result: VerifyResult = {
          isValid: true,
          checks: {
            format: true,
            signature: true,
            expired: false,
            revoked: false,
          },
        };

        // 如果是已过期凭证
        if (credentialData.expirationDate && new Date(credentialData.expirationDate) < new Date()) {
          result.isValid = false;
          result.checks.expired = true;
          result.errors = ['凭证已过期'];
        }

        // 如果是已撤销凭证
        if (credentialData.status === CredentialStatus.REVOKED) {
          result.isValid = false;
          result.checks.revoked = true;
          result.errors = ['凭证已被撤销'];
        }

        logger.info('Store:Credential', '验证凭证JSON完成', {
          isValid: result.isValid,
        });

        return result;
      } catch (error: any) {
        logger.error('Store:Credential', '验证凭证JSON失败', {
          error: error.message,
        });
        throw error;
      }
    },

    // 撤销凭证
    async revokeCredential(id: string, reason?: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始撤销凭证', {
        id,
        reason,
      });

      try {
        // 模拟API调用，实际项目中应调用撤销服务
        // await credentialService.revokeCredential(id, reason);

        // 在本地更新状态
        const credential = this.credentials.find((c) => c.id === id);
        if (credential) {
          credential.status = CredentialStatus.REVOKED;

          if (this.currentCredential && this.currentCredential.id === id) {
            this.currentCredential.status = CredentialStatus.REVOKED;
          }
        }

        logger.info('Store:Credential', '撤销凭证成功', { id });
      } catch (error: any) {
        this.error = error.message || '撤销凭证失败';
        logger.error('Store:Credential', '撤销凭证失败', {
          id,
          error: error.message,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新筛选条件
    updateFilter(filter: Partial<CredentialFilter>) {
      this.filter = {
        ...this.filter,
        ...filter,
      };

      logger.info('Store:Credential', '更新凭证筛选条件', this.filter);
    },

    // 重置筛选条件
    resetFilter() {
      this.filter = {
        status: 'all',
        searchQuery: '',
      };

      logger.info('Store:Credential', '重置凭证筛选条件');
    },
  },
});
