import { defineStore } from 'pinia';
import { logger } from '../utils/logger';
import { credentialService } from '../services/credential';

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
    // 是否正在加载
    isLoading: (state) => state.loading,

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
        const response = await credentialService.getCredentials();
        this.credentials = response.data;

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
        const response = await credentialService.getCredentialById(id);
        this.currentCredential = response.data;

        logger.info('Store:Credential', '获取凭证详情成功', { id });
        return response.data;
      } catch (error: any) {
        this.error = error.message || '获取凭证详情失败';
        logger.error('Store:Credential', '获取凭证详情失败', {
          error: error.message,
          id,
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 验证凭证有效性
    async verifyCredential(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始验证凭证', { id });

      try {
        const response = await credentialService.verifyCredentialById(id);
        logger.info('Store:Credential', '验证凭证成功', {
          id,
          isValid: response.data.isValid,
        });
        return response.data;
      } catch (error: any) {
        this.error = error.message || '验证凭证失败';
        logger.error('Store:Credential', '验证凭证失败', {
          error: error.message,
          id,
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 验证凭证JSON
    async verifyCredentialJson(credentialData: any) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始验证凭证JSON');

      try {
        const response = await credentialService.verifyCredentialJson(credentialData);
        logger.info('Store:Credential', '验证凭证JSON成功', {
          isValid: response.data.isValid,
        });
        return response.data;
      } catch (error: any) {
        this.error = error.message || '验证凭证JSON失败';
        logger.error('Store:Credential', '验证凭证JSON失败', {
          error: error.message,
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 撤销凭证
    async revokeCredential(id: string, reason?: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始撤销凭证', { id, reason });

      try {
        const response = await credentialService.revokeCredential(id, reason);

        // 更新本地凭证状态
        const index = this.credentials.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.credentials[index].status = CredentialStatus.REVOKED;
        }

        if (this.currentCredential?.id === id) {
          this.currentCredential.status = CredentialStatus.REVOKED;
        }

        logger.info('Store:Credential', '撤销凭证成功', { id });
        return response.data;
      } catch (error: any) {
        this.error = error.message || '撤销凭证失败';
        logger.error('Store:Credential', '撤销凭证失败', {
          error: error.message,
          id,
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 设置过滤条件
    setFilter(filter: Partial<CredentialFilter>) {
      this.filter = {
        ...this.filter,
        ...filter,
      };

      logger.info('Store:Credential', '设置凭证过滤条件', { filter: this.filter });
    },

    // 重置过滤条件
    resetFilters() {
      this.filter = {
        status: 'all',
        searchQuery: '',
      };

      logger.info('Store:Credential', '重置凭证过滤条件');
    },
  },
});
