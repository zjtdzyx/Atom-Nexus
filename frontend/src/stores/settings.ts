import { defineStore } from 'pinia';
import {
  fetchSystemSettings,
  updateSystemSettings,
  fetchUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
} from '@/services/settings';
import type { SystemSettings, UserPreferences } from '@/services/settings';
import { logger } from '@/utils/logger';

interface SettingsState {
  systemSettings: SystemSettings | null;
  userPreferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    systemSettings: null,
    userPreferences: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 获取系统设置
    async fetchSystemSettings() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Settings', '开始获取系统设置');

      try {
        const { data } = await fetchSystemSettings();
        this.systemSettings = data;
        logger.info('Store:Settings', '获取系统设置成功');
      } catch (error: any) {
        this.error = error.message || '获取系统设置失败';
        logger.error('Store:Settings', '获取系统设置失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    // 更新系统设置
    async updateSystemSettings(settings: Partial<SystemSettings>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Settings', '开始更新系统设置');

      try {
        const { data } = await updateSystemSettings(settings);
        this.systemSettings = data;
        logger.info('Store:Settings', '更新系统设置成功');
      } catch (error: any) {
        this.error = error.message || '更新系统设置失败';
        logger.error('Store:Settings', '更新系统设置失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取用户偏好设置
    async fetchUserPreferences() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Settings', '开始获取用户偏好设置');

      try {
        const { data } = await fetchUserPreferences();
        this.userPreferences = data;
        logger.info('Store:Settings', '获取用户偏好设置成功');
      } catch (error: any) {
        this.error = error.message || '获取用户偏好设置失败';
        logger.error('Store:Settings', '获取用户偏好设置失败', { error: error.message });
      } finally {
        this.loading = false;
      }
    },

    // 更新用户偏好设置
    async updateUserPreferences(preferences: Partial<UserPreferences>) {
      this.loading = true;
      this.error = null;

      logger.info('Store:Settings', '开始更新用户偏好设置');

      try {
        const { data } = await updateUserPreferences(preferences);
        this.userPreferences = data;
        logger.info('Store:Settings', '更新用户偏好设置成功');
      } catch (error: any) {
        this.error = error.message || '更新用户偏好设置失败';
        logger.error('Store:Settings', '更新用户偏好设置失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 重置用户偏好设置
    async resetUserPreferences() {
      this.loading = true;
      this.error = null;

      logger.info('Store:Settings', '开始重置用户偏好设置');

      try {
        const { data } = await resetUserPreferences();
        this.userPreferences = data;
        logger.info('Store:Settings', '重置用户偏好设置成功');
      } catch (error: any) {
        this.error = error.message || '重置用户偏好设置失败';
        logger.error('Store:Settings', '重置用户偏好设置失败', { error: error.message });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 重置状态
    resetState() {
      logger.info('Store:Settings', '重置设置状态');
      this.systemSettings = null;
      this.userPreferences = null;
      this.loading = false;
      this.error = null;
    },
  },
});
