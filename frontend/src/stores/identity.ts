import { defineStore } from 'pinia';
import axios from 'axios';

// 定义接口，确保类型安全
interface Identity {
  id: string;
  did: string;
  createdAt: string;
  bindStatus: boolean;
  bindType?: string;
  metadata?: Record<string, any>;
}

interface IdentityState {
  identities: Identity[];
  loading: boolean;
  error: string | null;
}

export const useIdentityStore = defineStore('identity', {
  state: (): IdentityState => ({
    identities: [],
    loading: false,
    error: null,
  }),
  
  getters: {
    getIdentities: (state) => state.identities,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
  },
  
  actions: {
    // 获取所有DID身份列表
    async fetchIdentities() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/identity/list');
        this.identities = response.data.data || [];
      } catch (error) {
        console.error('获取身份列表失败:', error);
        this.error = error instanceof Error ? error.message : '获取身份列表失败';
      } finally {
        this.loading = false;
      }
    },
    
    // 绑定DID身份
    async bindIdentity(did: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // 验证DID格式
        if (!did.startsWith('did:')) {
          throw new Error('DID必须以did:开头');
        }
        
        const response = await axios.post('/identity/bind', { did });
        
        // 如果绑定成功，刷新列表
        if (response.data.success) {
          await this.fetchIdentities();
          return { success: true, message: '身份绑定成功' };
        } else {
          throw new Error(response.data.message || '身份绑定失败');
        }
      } catch (error) {
        console.error('绑定身份失败:', error);
        this.error = error instanceof Error ? error.message : '绑定身份失败';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // 清除错误信息
    clearError() {
      this.error = null;
    }
  }
}); 