import { defineStore } from 'pinia';
import axios from 'axios';

// 定义身份数据接口
export interface Identity {
  id: string;
  did: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'revoked';
  type?: string;
  walletAddress?: string;
  email?: string;
}

export const useIdentityStore = defineStore('identity', {
  state: () => ({
    identities: [] as Identity[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // 获取活跃状态的身份
    activeIdentities: (state) => state.identities.filter((id) => id.status === 'active'),

    // 获取身份总数
    totalIdentities: (state) => state.identities.length,
  },

  actions: {
    // 获取身份列表
    async fetchIdentities() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/api/identity/list');
        this.identities = response.data;
      } catch (err: any) {
        this.error = err.message || '获取身份列表失败';
        console.error('获取身份列表错误:', err);
      } finally {
        this.loading = false;
      }
    },

    // 绑定身份
    async bindIdentity(did: string) {
      if (!did.startsWith('did:')) {
        throw new Error('DID必须以did:开头');
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/identity/bind', { did });

        // 添加新身份到列表
        if (response.data) {
          this.identities.push(response.data);
        }

        return response.data;
      } catch (err: any) {
        this.error = err.message || '绑定身份失败';
        console.error('绑定身份错误:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 创建新身份
    async createIdentity(type: string = 'key') {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/identity/create', { type });

        // 添加新身份到列表
        if (response.data) {
          this.identities.push(response.data);
        }

        return response.data;
      } catch (err: any) {
        this.error = err.message || '创建身份失败';
        console.error('创建身份错误:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 删除身份
    async removeIdentity(id: string) {
      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`/api/identity/${id}`);

        // 从列表中移除
        this.identities = this.identities.filter((identity) => identity.id !== id);
      } catch (err: any) {
        this.error = err.message || '删除身份失败';
        console.error('删除身份错误:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
