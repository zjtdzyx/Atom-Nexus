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

    defaultIdentity: (state) => state.identities.find((id) => id.isDefault),

    sortedIdentities: (state) =>
      [...state.identities].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),

    activeIdentitiesCount: (state) =>
      state.identities.filter((id) => id.status === 'active').length,
  },

  actions: {
    async fetchIdentities() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始获取身份列表');

      try {
        const response = await identityService.getIdentities();
        this.identities = response.data;
        logger.info('Store:Identity', '获取身份列表成功', { count: response.data.length });
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
        const response = await identityService.getIdentityById(id);
        this.currentIdentity = response.data;
        logger.info('Store:Identity', '获取身份详情成功', { id });
        return response.data;
      } catch (error: any) {
        this.error = error.message || '获取身份详情失败';
        logger.error('Store:Identity', '获取身份详情失败', { id, error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createIdentity(identityData: Partial<Identity>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始创建新身份', { data: identityData });

      try {
        const response = await identityService.createIdentity(identityData);
        this.identities.push(response.data);
        logger.info('Store:Identity', '新身份创建成功', { id: response.data.id });
        return response.data;
      } catch (error: any) {
        this.error = error.message || '创建身份失败';
        logger.error('Store:Identity', '创建身份失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateIdentity(id: string, updateData: Partial<Identity>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Identity', '开始更新身份', { id, data: updateData });

      try {
        const response = await identityService.updateIdentity(id, updateData);

        // 更新状态中的身份信息
        const index = this.identities.findIndex((identity) => identity.id === id);
        if (index !== -1) {
          this.identities[index] = { ...this.identities[index], ...response.data };
        }

        // 如果是当前选中的身份，也更新currentIdentity
        if (this.currentIdentity && this.currentIdentity.id === id) {
          this.currentIdentity = { ...this.currentIdentity, ...response.data };
        }

        logger.info('Store:Identity', '身份更新成功', { id });
        return response.data;
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

        // 从状态中移除身份
        this.identities = this.identities.filter((identity) => identity.id !== id);

        // 如果删除的是当前选中的身份，清除currentIdentity
        if (this.currentIdentity && this.currentIdentity.id === id) {
          this.currentIdentity = null;
        }

        logger.info('Store:Identity', '身份删除成功', { id });
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

    async setDefaultIdentity(id: string) {
      logger.info('Store:Identity', '开始设置默认身份', { id });

      try {
        await identityService.setDefaultIdentity(id);

        // 更新状态中的默认身份标记
        this.identities.forEach((identity) => {
          identity.isDefault = identity.id === id;
        });

        logger.info('Store:Identity', '默认身份设置成功', { id });
      } catch (err: any) {
        logger.error('Store:Identity', '设置默认身份失败', { id, error: err });
        throw err;
      }
    },

    async bindIdentity(did: string, alias: string) {
      logger.info('Store:Identity', '开始绑定DID', { did, alias });

      try {
        const response = await identityService.bindIdentity({ did, alias });
        this.identities.push(response.data);
        logger.info('Store:Identity', 'DID绑定成功', { id: response.data.id });
        return response.data;
      } catch (err: any) {
        logger.error('Store:Identity', '绑定DID失败', { error: err });
        throw err;
      }
    },
  },
});
