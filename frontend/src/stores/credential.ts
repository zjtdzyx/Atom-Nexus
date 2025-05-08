import { defineStore } from 'pinia';
import { credentialService } from '@/services/credential';
import type { VerificationResult, CredentialTemplate, Credential } from '@/types/credential';
import { CredentialStatus } from '@/types/credential';
import { logger } from '@/utils/logger';

// 凭证类型接口
export interface CredentialType {
  id: string;
  name: string;
  description?: string;
}

// 凭证证明接口
export interface CredentialProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  signatureValue: string;
  signature?: string;
}

// 凭证详情接口
export interface CredentialDetail extends Credential {
  subject: {
    id: string;
    name?: string;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
}

// 授权设置接口
export interface PermissionSetting {
  credentialId: string;
  targetDid: string;
  action: string;
  resource: string;
  expirationDate?: string;
}

interface CredentialState {
  credentials: Credential[];
  currentCredential: Credential | null;
  templates: CredentialTemplate[];
  verificationResult: VerificationResult | null;
  loading: boolean;
  error: string | null;
}

export const useCredentialStore = defineStore('credential', {
  state: (): CredentialState => ({
    credentials: [],
    currentCredential: null,
    templates: [],
    verificationResult: null,
    loading: false,
    error: null,
  }),

  getters: {
    getCredentialById: (state) => (id: string) => {
      return state.credentials.find((credential) => credential.id === id) || null;
    },

    getActiveCredentials: (state) => {
      return state.credentials.filter(
        (credential) => credential.status === CredentialStatus.ACTIVE
      );
    },

    getRevokedCredentials: (state) => {
      return state.credentials.filter(
        (credential) => credential.status === CredentialStatus.REVOKED
      );
    },

    getExpiredCredentials: (state) => {
      return state.credentials.filter(
        (credential) => credential.status === CredentialStatus.EXPIRED
      );
    },
  },

  actions: {
    async fetchCredentials(page = 1, limit = 10) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始获取凭证列表', { page, limit });

      try {
        const { data } = await credentialService.getCredentials(page, limit);
        this.credentials = data;
        logger.info('Store:Credential', '获取凭证列表成功', { count: data.length });
      } catch (error: any) {
        this.error = error.message || '获取凭证列表失败';
        logger.error('Store:Credential', '获取凭证列表失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async fetchCredentialById(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始获取凭证详情', { id });

      try {
        const { data } = await credentialService.getCredentialById(id);
        this.currentCredential = data;
        logger.info('Store:Credential', '获取凭证详情成功');
      } catch (error: any) {
        this.error = error.message || '获取凭证详情失败';
        logger.error('Store:Credential', '获取凭证详情失败', { id, error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async issueCredential(credentialData: Partial<Credential>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始颁发凭证');

      try {
        const { data } = await credentialService.issueCredential(credentialData);
        this.credentials.push(data);
        logger.info('Store:Credential', '颁发凭证成功', { id: data.id });
        return data;
      } catch (error: any) {
        this.error = error.message || '颁发凭证失败';
        logger.error('Store:Credential', '颁发凭证失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async verifyCredential(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始验证凭证', { id });

      try {
        const { data } = await credentialService.verifyCredential(id);
        this.verificationResult = data;
        logger.info('Store:Credential', '验证凭证成功', { result: data.isValid });
        return data;
      } catch (error: any) {
        this.error = error.message || '验证凭证失败';
        logger.error('Store:Credential', '验证凭证失败', { id, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async revokeCredential(id: string, reason?: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始撤销凭证', { id, reason });

      try {
        await credentialService.revokeCredential(id, reason);

        // 更新状态
        const index = this.credentials.findIndex((credential) => credential.id === id);
        if (index !== -1) {
          this.credentials[index] = {
            ...this.credentials[index],
            status: CredentialStatus.REVOKED,
          };
        }

        if (this.currentCredential?.id === id) {
          this.currentCredential = {
            ...this.currentCredential,
            status: CredentialStatus.REVOKED,
          };
        }

        logger.info('Store:Credential', '撤销凭证成功');
      } catch (error: any) {
        this.error = error.message || '撤销凭证失败';
        logger.error('Store:Credential', '撤销凭证失败', { id, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCredentialTemplates() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始获取凭证模板列表');

      try {
        const { data } = await credentialService.getCredentialTemplates();
        this.templates = data;
        logger.info('Store:Credential', '获取凭证模板列表成功', { count: data.length });
      } catch (error: any) {
        this.error = error.message || '获取凭证模板失败';
        logger.error('Store:Credential', '获取凭证模板列表失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async createCredentialFromTemplate(templateId: string, data: any) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Credential', '开始基于模板创建凭证', { templateId });

      try {
        const response = await credentialService.createCredentialFromTemplate(templateId, data);
        this.credentials.push(response.data);
        logger.info('Store:Credential', '基于模板创建凭证成功', { id: response.data.id });
        return response.data;
      } catch (error: any) {
        this.error = error.message || '基于模板创建凭证失败';
        logger.error('Store:Credential', '基于模板创建凭证失败', {
          templateId,
          error: error.message,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      logger.info('Store:Credential', '重置凭证状态');
      this.credentials = [];
      this.currentCredential = null;
      this.templates = [];
      this.verificationResult = null;
      this.loading = false;
      this.error = null;
    },
  },
});
