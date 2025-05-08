import { defineStore } from 'pinia';
import { accountService } from '@/services/account';
import type { UserProfile, SecuritySettings } from '@/types/account';
import { logger } from '@/utils/logger';

interface AccountState {
  userProfile: UserProfile | null;
  securitySettings: SecuritySettings | null;
  settings: any;
  loading: boolean;
  error: string | null;
}

export const useAccountStore = defineStore('account', {
  state: (): AccountState => ({
    userProfile: null,
    securitySettings: null,
    settings: null,
    loading: false,
    error: null,
  }),

  getters: {
    isProfileLoaded: (state) => !!state.userProfile,
    isSecurityLoaded: (state) => !!state.securitySettings,
  },

  actions: {
    async fetchUserProfile() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始获取用户资料');

      try {
        this.userProfile = await accountService.getUserProfile();
        logger.info('Store:Account', '获取用户资料成功');
      } catch (error: any) {
        this.error = error.message || '获取用户资料失败';
        logger.error('Store:Account', '获取用户资料失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async updateUserProfile(profileData: Partial<UserProfile>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始更新用户资料');

      try {
        this.userProfile = await accountService.updateUserProfile(profileData);
        logger.info('Store:Account', '更新用户资料成功');
        return this.userProfile;
      } catch (error: any) {
        this.error = error.message || '更新用户资料失败';
        logger.error('Store:Account', '更新用户资料失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAvatar(formData: FormData) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始更新用户头像');

      try {
        const { avatarUrl } = await accountService.updateAvatar(formData);

        if (this.userProfile) {
          this.userProfile = {
            ...this.userProfile,
            avatar: avatarUrl,
          };
        }

        logger.info('Store:Account', '更新用户头像成功', { avatarUrl });
        return avatarUrl;
      } catch (error: any) {
        this.error = error.message || '更新头像失败';
        logger.error('Store:Account', '更新用户头像失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSecuritySettings() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始获取安全设置');

      try {
        this.securitySettings = await accountService.getSecuritySettings();
        logger.info('Store:Account', '获取安全设置成功');
      } catch (error: any) {
        this.error = error.message || '获取安全设置失败';
        logger.error('Store:Account', '获取安全设置失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async updateSecuritySettings(securityData: Partial<SecuritySettings>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始更新安全设置');

      try {
        this.securitySettings = await accountService.updateSecuritySettings(securityData);
        logger.info('Store:Account', '更新安全设置成功');
        return this.securitySettings;
      } catch (error: any) {
        this.error = error.message || '更新安全设置失败';
        logger.error('Store:Account', '更新安全设置失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始修改密码');

      try {
        await accountService.changePassword(currentPassword, newPassword);

        // 如果成功，更新最后修改密码时间
        if (this.securitySettings) {
          this.securitySettings = {
            ...this.securitySettings,
            lastPasswordChange: new Date().toISOString(),
          };
        }

        logger.info('Store:Account', '修改密码成功');
      } catch (error: any) {
        this.error = error.message || '修改密码失败';
        logger.error('Store:Account', '修改密码失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async enableTwoFactor() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始启用两因素认证');

      try {
        const result = await accountService.enableTwoFactor();
        logger.info('Store:Account', '启用两因素认证成功');
        return result;
      } catch (error: any) {
        this.error = error.message || '启用两因素认证失败';
        logger.error('Store:Account', '启用两因素认证失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async verifyTwoFactor(code: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始验证两因素认证', { code: code.substring(0, 2) + '***' });

      try {
        const result = await accountService.verifyTwoFactor(code);

        if (result.success && this.securitySettings) {
          this.securitySettings = {
            ...this.securitySettings,
            twoFactorEnabled: true,
          };
          logger.info('Store:Account', '验证两因素认证成功');
        } else {
          logger.warn('Store:Account', '验证两因素认证不成功', { success: result.success });
        }

        return result;
      } catch (error: any) {
        this.error = error.message || '验证两因素认证失败';
        logger.error('Store:Account', '验证两因素认证失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async disableTwoFactor(code: string) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始禁用两因素认证');

      try {
        await accountService.disableTwoFactor(code);

        if (this.securitySettings) {
          this.securitySettings = {
            ...this.securitySettings,
            twoFactorEnabled: false,
          };
        }

        logger.info('Store:Account', '禁用两因素认证成功');
      } catch (error: any) {
        this.error = error.message || '禁用两因素认证失败';
        logger.error('Store:Account', '禁用两因素认证失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserSettings() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始获取用户设置');

      try {
        this.settings = await accountService.getUserSettings();
        logger.info('Store:Account', '获取用户设置成功');
      } catch (error: any) {
        this.error = error.message || '获取用户设置失败';
        logger.error('Store:Account', '获取用户设置失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    async updateUserSettings(settings: any) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Account', '开始更新用户设置');

      try {
        this.settings = await accountService.updateUserSettings(settings);
        logger.info('Store:Account', '更新用户设置成功');
        return this.settings;
      } catch (error: any) {
        this.error = error.message || '更新用户设置失败';
        logger.error('Store:Account', '更新用户设置失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      logger.info('Store:Account', '重置账户状态');
      this.userProfile = null;
      this.securitySettings = null;
      this.settings = null;
      this.loading = false;
      this.error = null;
    },
  },
});
