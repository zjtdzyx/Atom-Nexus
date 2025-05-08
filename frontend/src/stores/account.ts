import { defineStore } from 'pinia';
import { accountService } from '@/services/account';
import type { UserProfile, SecuritySettings } from '@/types/account';

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

      try {
        this.userProfile = await accountService.getUserProfile();
      } catch (error: any) {
        this.error = error.message || '获取用户资料失败';
        console.error('获取用户资料失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateUserProfile(profileData: Partial<UserProfile>) {
      this.loading = true;
      this.error = null;

      try {
        this.userProfile = await accountService.updateUserProfile(profileData);
        return this.userProfile;
      } catch (error: any) {
        this.error = error.message || '更新用户资料失败';
        console.error('更新用户资料失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAvatar(formData: FormData) {
      this.loading = true;
      this.error = null;

      try {
        const { avatarUrl } = await accountService.updateAvatar(formData);

        if (this.userProfile) {
          this.userProfile = {
            ...this.userProfile,
            avatar: avatarUrl,
          };
        }

        return avatarUrl;
      } catch (error: any) {
        this.error = error.message || '更新头像失败';
        console.error('更新头像失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSecuritySettings() {
      this.loading = true;
      this.error = null;

      try {
        this.securitySettings = await accountService.getSecuritySettings();
      } catch (error: any) {
        this.error = error.message || '获取安全设置失败';
        console.error('获取安全设置失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateSecuritySettings(securityData: Partial<SecuritySettings>) {
      this.loading = true;
      this.error = null;

      try {
        this.securitySettings = await accountService.updateSecuritySettings(securityData);
        return this.securitySettings;
      } catch (error: any) {
        this.error = error.message || '更新安全设置失败';
        console.error('更新安全设置失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.loading = true;
      this.error = null;

      try {
        await accountService.changePassword(currentPassword, newPassword);

        // 如果成功，更新最后修改密码时间
        if (this.securitySettings) {
          this.securitySettings = {
            ...this.securitySettings,
            lastPasswordChange: new Date().toISOString(),
          };
        }
      } catch (error: any) {
        this.error = error.message || '修改密码失败';
        console.error('修改密码失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async enableTwoFactor() {
      this.loading = true;
      this.error = null;

      try {
        return await accountService.enableTwoFactor();
      } catch (error: any) {
        this.error = error.message || '启用两因素认证失败';
        console.error('启用两因素认证失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async verifyTwoFactor(code: string) {
      this.loading = true;
      this.error = null;

      try {
        const result = await accountService.verifyTwoFactor(code);

        if (result.success && this.securitySettings) {
          this.securitySettings = {
            ...this.securitySettings,
            twoFactorEnabled: true,
          };
        }

        return result;
      } catch (error: any) {
        this.error = error.message || '验证两因素认证失败';
        console.error('验证两因素认证失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async disableTwoFactor(code: string) {
      this.loading = true;
      this.error = null;

      try {
        await accountService.disableTwoFactor(code);

        if (this.securitySettings) {
          this.securitySettings = {
            ...this.securitySettings,
            twoFactorEnabled: false,
          };
        }
      } catch (error: any) {
        this.error = error.message || '禁用两因素认证失败';
        console.error('禁用两因素认证失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserSettings() {
      this.loading = true;
      this.error = null;

      try {
        this.settings = await accountService.getUserSettings();
      } catch (error: any) {
        this.error = error.message || '获取用户设置失败';
        console.error('获取用户设置失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateUserSettings(settings: any) {
      this.loading = true;
      this.error = null;

      try {
        this.settings = await accountService.updateUserSettings(settings);
        return this.settings;
      } catch (error: any) {
        this.error = error.message || '更新用户设置失败';
        console.error('更新用户设置失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清空状态
    resetState() {
      this.userProfile = null;
      this.securitySettings = null;
      this.settings = null;
      this.loading = false;
      this.error = null;
    },
  },
});
