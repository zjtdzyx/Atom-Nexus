import { defineStore } from 'pinia';
import { identityService } from '@/services/identity';
import type { Identity, LoginHistory, IdentityProfile } from '@/types/identity';
import { logger } from '@/utils/logger';

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

      logger.info('Store:Identity', '开始获取身份列表');

      try {
        this.identities = await identityService.getIdentities();
        logger.info('Store:Identity', '获取身份列表成功', { count: this.identities.length });
      } catch (error: any) {
        this.error = error.message || '获取身份列表失败';
        logger.error('Store:Identity', '获取身份列表失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async fetchIdentityById(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始获取身份详情', { id });

      try {
        this.currentIdentity = await identityService.getIdentityById(id);
        logger.info('Store:Identity', '获取身份详情成功');
      } catch (error: any) {
        this.error = error.message || '获取身份详情失败';
        logger.error('Store:Identity', '获取身份详情失败', { id, error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async createIdentity(identity: Partial<Identity>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始创建身份');

      try {
        const newIdentity = await identityService.createIdentity(identity);
        this.identities.push(newIdentity);
        logger.info('Store:Identity', '创建身份成功', { id: newIdentity.id });
        return newIdentity;
      } catch (error: any) {
        this.error = error.message || '创建身份失败';
        logger.error('Store:Identity', '创建身份失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async bindIdentity(did: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始绑定身份', { did });

      try {
        const newIdentity = await identityService.createIdentity({
          did,
          name: `身份 ${this.identities.length + 1}`,
          status: 'active',
        });
        this.identities.push(newIdentity);
        logger.info('Store:Identity', '绑定身份成功', { id: newIdentity.id });
        return newIdentity;
      } catch (error: any) {
        this.error = error.message || '绑定身份失败';
        logger.error('Store:Identity', '绑定身份失败', { did, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateIdentity(id: string, identity: Partial<Identity>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始更新身份', { id });

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

        logger.info('Store:Identity', '更新身份成功');
        return updatedIdentity;
      } catch (error: any) {
        this.error = error.message || '更新身份失败';
        logger.error('Store:Identity', '更新身份失败', { id, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteIdentity(id: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始删除身份', { id });

      try {
        await identityService.deleteIdentity(id);

        // 从状态中移除
        this.identities = this.identities.filter((identity: Identity) => identity.id !== id);

        if (this.currentIdentity?.id === id) {
          this.currentIdentity = null;
        }

        logger.info('Store:Identity', '删除身份成功');
      } catch (error: any) {
        this.error = error.message || '删除身份失败';
        logger.error('Store:Identity', '删除身份失败', { id, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLoginHistory(identityId?: string) {
      this.loading = true;
      this.error = null;

      const id = identityId || this.currentIdentity?.id;
      logger.info('Store:Identity', '开始获取登录历史', { identityId: id });

      try {
        if (!id) {
          throw new Error('未指定身份ID');
        }

        this.loginHistory = await identityService.getLoginHistory(id);
        logger.info('Store:Identity', '获取登录历史成功', { count: this.loginHistory.length });
      } catch (error: any) {
        this.error = error.message || '获取登录历史失败';
        logger.error('Store:Identity', '获取登录历史失败', {
          identityId: id,
          error: error.message,
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile(identityId?: string) {
      this.loading = true;
      this.error = null;

      const id = identityId || this.currentIdentity?.id;
      logger.info('Store:Identity', '开始获取身份资料', { identityId: id });

      try {
        if (!id) {
          throw new Error('未指定身份ID');
        }

        this.profile = await identityService.getProfile(id);
        logger.info('Store:Identity', '获取身份资料成功');
      } catch (error: any) {
        this.error = error.message || '获取身份资料失败';
        logger.error('Store:Identity', '获取身份资料失败', {
          identityId: id,
          error: error.message,
        });
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData: any, identityId?: string) {
      this.loading = true;
      this.error = null;

      const id = identityId || this.currentIdentity?.id;
      logger.info('Store:Identity', '开始更新身份资料', { identityId: id });

      try {
        if (!id) {
          throw new Error('未指定身份ID');
        }

        this.profile = await identityService.updateProfile(id, profileData);
        logger.info('Store:Identity', '更新身份资料成功');
        return this.profile;
      } catch (error: any) {
        this.error = error.message || '更新身份资料失败';
        logger.error('Store:Identity', '更新身份资料失败', {
          identityId: id,
          error: error.message,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      logger.info('Store:Identity', '重置身份状态');
      this.identities = [];
      this.currentIdentity = null;
      this.loginHistory = [];
      this.profile = null;
      this.loading = false;
      this.error = null;
    },
  },
});
