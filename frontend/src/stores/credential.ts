import { defineStore } from 'pinia';
import { credentialService } from '@/services/credential';
import type { Credential, VerificationResult, CredentialTemplate } from '@/types/credential';

// 凭证状态枚举
export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

// 凭证类型接口
export interface CredentialType {
  id: string;
  name: string;
  description?: string;
}

// 单个凭证接口
export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  issuerId: string;
  issuerName?: string;
  status: CredentialStatus;
  issuedAt: string;
  expirationDate?: string;
  revocationDate?: string;
  claims?: Record<string, any>;
  transactionHash?: string;
}

// 凭证详情接口
export interface CredentialDetail extends Credential {
  subject: {
    id: string;
    name?: string;
    [key: string]: any;
  };
  proof?: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    signatureValue: string;
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
  },

  actions: {
    async fetchCredentials(page = 1, limit = 10) {
      this.loading = true;
      this.error = null;

      try {
        this.credentials = await credentialService.getCredentials(page, limit);
      } catch (error: any) {
        this.error = error.message || '获取凭证列表失败';
        console.error('获取凭证列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCredentialById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        this.currentCredential = await credentialService.getCredentialById(id);
      } catch (error: any) {
        this.error = error.message || '获取凭证详情失败';
        console.error('获取凭证详情失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async issueCredential(credentialData: Partial<Credential>) {
      this.loading = true;
      this.error = null;

      try {
        const credential = await credentialService.issueCredential(credentialData);
        this.credentials.push(credential);
        return credential;
      } catch (error: any) {
        this.error = error.message || '颁发凭证失败';
        console.error('颁发凭证失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async verifyCredential(id: string) {
      this.loading = true;
      this.error = null;

      try {
        this.verificationResult = await credentialService.verifyCredential(id);
        return this.verificationResult;
      } catch (error: any) {
        this.error = error.message || '验证凭证失败';
        console.error('验证凭证失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async revokeCredential(id: string, reason?: string) {
      this.loading = true;
      this.error = null;

      try {
        await credentialService.revokeCredential(id, reason);

        // 更新状态
        const index = this.credentials.findIndex((credential) => credential.id === id);
        if (index !== -1) {
          this.credentials[index] = {
            ...this.credentials[index],
            status: 'revoked',
          };
        }

        if (this.currentCredential?.id === id) {
          this.currentCredential = {
            ...this.currentCredential,
            status: 'revoked',
          };
        }
      } catch (error: any) {
        this.error = error.message || '撤销凭证失败';
        console.error('撤销凭证失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCredentialTemplates() {
      this.loading = true;
      this.error = null;

      try {
        this.templates = await credentialService.getCredentialTemplates();
      } catch (error: any) {
        this.error = error.message || '获取凭证模板失败';
        console.error('获取凭证模板失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async createCredentialFromTemplate(templateId: string, data: any) {
      this.loading = true;
      this.error = null;

      try {
        const credential = await credentialService.createCredentialFromTemplate(templateId, data);
        this.credentials.push(credential);
        return credential;
      } catch (error: any) {
        this.error = error.message || '基于模板创建凭证失败';
        console.error('基于模板创建凭证失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      this.credentials = [];
      this.currentCredential = null;
      this.templates = [];
      this.verificationResult = null;
      this.loading = false;
      this.error = null;
    },
  },
});
