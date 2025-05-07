import { defineStore } from 'pinia';
import axios from 'axios';

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

// 验证结果接口
export interface VerificationResult {
  isValid: boolean;
  status: string;
  message: string;
  verifiedAt: string;
  verifierDid?: string;
}

// 授权设置接口
export interface PermissionSetting {
  credentialId: string;
  targetDid: string;
  action: string;
  resource: string;
  expirationDate?: string;
}

// Store状态接口
interface CredentialState {
  credentials: Credential[];
  currentCredential: CredentialDetail | null;
  verificationResult: VerificationResult | null;
  loading: boolean;
  error: string | null;
  qrCodeUrl: string | null;
}

export const useCredentialStore = defineStore('credential', {
  state: (): CredentialState => ({
    credentials: [],
    currentCredential: null,
    verificationResult: null,
    loading: false,
    error: null,
    qrCodeUrl: null,
  }),

  getters: {
    getCredentials: (state) => state.credentials,
    getCurrentCredential: (state) => state.currentCredential,
    getVerificationResult: (state) => state.verificationResult,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
    getQRCodeUrl: (state) => state.qrCodeUrl,
  },

  actions: {
    // 获取凭证列表
    async fetchCredentials() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/credential/list');
        this.credentials = response.data.data || [];
      } catch (error) {
        console.error('获取凭证列表失败:', error);
        this.error = error instanceof Error ? error.message : '获取凭证列表失败';
      } finally {
        this.loading = false;
      }
    },

    // 获取凭证详情
    async fetchCredentialDetail(id: string) {
      this.loading = true;
      this.error = null;
      this.currentCredential = null;

      try {
        const response = await axios.get(`/credential/${id}`);
        this.currentCredential = response.data.data;

        // 获取凭证二维码
        await this.fetchQRCode(id);
      } catch (error) {
        console.error('获取凭证详情失败:', error);
        this.error = error instanceof Error ? error.message : '获取凭证详情失败';
      } finally {
        this.loading = false;
      }
    },

    // 获取凭证二维码
    async fetchQRCode(id: string) {
      try {
        const response = await axios.get(`/credential/qrcode?id=${id}`);
        this.qrCodeUrl = response.data.qrCodeUrl;
      } catch (error) {
        console.error('获取凭证二维码失败:', error);
        this.qrCodeUrl = null;
      }
    },

    // 验证凭证
    async verifyCredential(id: string) {
      this.loading = true;
      this.error = null;
      this.verificationResult = null;

      try {
        const response = await axios.post('/auth/verify-credential', { credentialId: id });
        this.verificationResult = response.data.data;
        return this.verificationResult;
      } catch (error) {
        console.error('验证凭证失败:', error);
        this.error = error instanceof Error ? error.message : '验证凭证失败';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 设置凭证授权
    async setPermission(settings: PermissionSetting) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/permissions/set', settings);
        return {
          success: true,
          message: '授权设置成功',
          data: response.data.data,
        };
      } catch (error) {
        console.error('设置授权失败:', error);
        this.error = error instanceof Error ? error.message : '设置授权失败';
        return {
          success: false,
          message: this.error,
        };
      } finally {
        this.loading = false;
      }
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },

    // 重置当前凭证
    resetCurrentCredential() {
      this.currentCredential = null;
      this.verificationResult = null;
      this.qrCodeUrl = null;
    },
  },
});
