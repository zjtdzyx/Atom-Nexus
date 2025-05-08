import { defineStore } from 'pinia';
import { identityService } from '@/services/identity';
import type { Identity, LoginHistory, IdentityProfile } from '@/types/identity';

interface IdentityState {
  identities: Identity[];
  currentIdentity: Identity | null;
  loginHistory: LoginHistory[];
  profile: IdentityProfile | null;
  loading: boolean;
  error: string | null;
}

export const useIdentityStore = defineStore('identity', {
  state: (): IdentityState => ({
    identities: [],
    currentIdentity: null,
    loginHistory: [],
    profile: null,
    loading: false,
    error: null,
  }),

  getters: {
    getIdentityById: (state) => (id: string) => {
      return state.identities.find((identity: Identity) => identity.id === id) || null;
    },

    getActiveIdentities: (state) => {
      return state.identities.filter((identity: Identity) => identity.isActive);
    },
  },

  actions: {
    async fetchIdentities() {
      this.loading = true;
      this.error = null;

      try {
        this.identities = await identityService.getIdentities();
      } catch (error: any) {
        this.error = error.message || '获取身份列表失败';
        console.error('获取身份列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchIdentityById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        this.currentIdentity = await identityService.getIdentityById(id);
      } catch (error: any) {
        this.error = error.message || '获取身份详情失败';
        console.error('获取身份详情失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async createIdentity(identity: Partial<Identity>) {
      this.loading = true;
      this.error = null;

      try {
        const newIdentity = await identityService.createIdentity(identity);
        this.identities.push(newIdentity);
        return newIdentity;
      } catch (error: any) {
        this.error = error.message || '创建身份失败';
        console.error('创建身份失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateIdentity(id: string, identity: Partial<Identity>) {
      this.loading = true;
      this.error = null;

      try {
        const updatedIdentity = await identityService.updateIdentity(id, identity);

        // 更新状态
        const index = this.identities.findIndex((item: Identity) => item.id === id);
        if (index !== -1) {
          this.identities[index] = updatedIdentity;
        }

        if (this.currentIdentity?.id === id) {
          this.currentIdentity = updatedIdentity;
        }

        return updatedIdentity;
      } catch (error: any) {
        this.error = error.message || '更新身份失败';
        console.error('更新身份失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteIdentity(id: string) {
      this.loading = true;
      this.error = null;

      try {
        await identityService.deleteIdentity(id);

        // 从状态中移除
        this.identities = this.identities.filter((identity: Identity) => identity.id !== id);

        if (this.currentIdentity?.id === id) {
          this.currentIdentity = null;
        }
      } catch (error: any) {
        this.error = error.message || '删除身份失败';
        console.error('删除身份失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLoginHistory(identityId?: string) {
      this.loading = true;
      this.error = null;

      try {
        const id = identityId || this.currentIdentity?.id;
        if (!id) {
          throw new Error('未指定身份ID');
        }

        this.loginHistory = await identityService.getLoginHistory(id);
      } catch (error: any) {
        this.error = error.message || '获取登录历史失败';
        console.error('获取登录历史失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile(identityId?: string) {
      this.loading = true;
      this.error = null;

      try {
        const id = identityId || this.currentIdentity?.id;
        if (!id) {
          throw new Error('未指定身份ID');
        }

        this.profile = await identityService.getProfile(id);
      } catch (error: any) {
        this.error = error.message || '获取身份资料失败';
        console.error('获取身份资料失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData: any, identityId?: string) {
      this.loading = true;
      this.error = null;

      try {
        const id = identityId || this.currentIdentity?.id;
        if (!id) {
          throw new Error('未指定身份ID');
        }

        this.profile = await identityService.updateProfile(id, profileData);
        return this.profile;
      } catch (error: any) {
        this.error = error.message || '更新身份资料失败';
        console.error('更新身份资料失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      this.identities = [];
      this.currentIdentity = null;
      this.loginHistory = [];
      this.profile = null;
      this.loading = false;
      this.error = null;
    },
  },
});
