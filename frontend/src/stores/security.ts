import { defineStore } from 'pinia';
import axios from 'axios';

// 加密参数接口
export interface EncryptParams {
  data: string;
  publicKey?: string;
}

// 解密参数接口
export interface DecryptParams {
  encryptedData: string;
  privateKey?: string;
}

// 零知识证明参数接口
export interface ProofParams {
  did: string;
  statement?: string;
  attributes?: string[];
}

// 操作响应接口
export interface SecurityResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Store状态接口
interface SecurityState {
  encryptedData: string | null;
  decryptedData: string | null;
  proofData: any | null;
  loading: boolean;
  error: string | null;
}

export const useSecurityStore = defineStore('security', {
  state: (): SecurityState => ({
    encryptedData: null,
    decryptedData: null,
    proofData: null,
    loading: false,
    error: null,
  }),

  getters: {
    getEncryptedData: (state) => state.encryptedData,
    getDecryptedData: (state) => state.decryptedData,
    getProofData: (state) => state.proofData,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
  },

  actions: {
    // 加密数据
    async encryptData(params: EncryptParams): Promise<SecurityResponse<string>> {
      this.loading = true;
      this.error = null;
      this.encryptedData = null;

      try {
        const response = await axios.post('/security/encrypt', params);
        
        if (response.data.success) {
          this.encryptedData = response.data.data;
          
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || '加密成功',
          };
        } else {
          this.error = response.data.error || '加密失败';
          
          return {
            success: false,
            error: this.error,
            message: response.data.message || '加密失败',
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '加密过程中发生错误';
        this.error = errorMessage;
        console.error('加密失败:', error);
        
        return {
          success: false,
          error: errorMessage,
          message: '加密失败，请稍后重试',
        };
      } finally {
        this.loading = false;
      }
    },

    // 解密数据
    async decryptData(params: DecryptParams): Promise<SecurityResponse<string>> {
      this.loading = true;
      this.error = null;
      this.decryptedData = null;

      try {
        const response = await axios.post('/security/decrypt', params);
        
        if (response.data.success) {
          this.decryptedData = response.data.data;
          
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || '解密成功',
          };
        } else {
          this.error = response.data.error || '解密失败';
          
          return {
            success: false,
            error: this.error,
            message: response.data.message || '解密失败',
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '解密过程中发生错误';
        this.error = errorMessage;
        console.error('解密失败:', error);
        
        return {
          success: false,
          error: errorMessage,
          message: '解密失败，请稍后重试',
        };
      } finally {
        this.loading = false;
      }
    },

    // 生成零知识证明
    async generateProof(params: ProofParams): Promise<SecurityResponse<any>> {
      this.loading = true;
      this.error = null;
      this.proofData = null;

      try {
        const response = await axios.post('/security/proof', params);
        
        if (response.data.success) {
          this.proofData = response.data.data;
          
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || '生成证明成功',
          };
        } else {
          this.error = response.data.error || '生成证明失败';
          
          return {
            success: false,
            error: this.error,
            message: response.data.message || '生成证明失败',
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '生成证明过程中发生错误';
        this.error = errorMessage;
        console.error('生成证明失败:', error);
        
        return {
          success: false,
          error: errorMessage,
          message: '生成证明失败，请稍后重试',
        };
      } finally {
        this.loading = false;
      }
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },

    // 清除所有数据
    clearData() {
      this.encryptedData = null;
      this.decryptedData = null;
      this.proofData = null;
      this.error = null;
    },
  },
}); 