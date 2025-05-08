import axios from 'axios';
import type { UserProfile, SecuritySettings } from '@/types/account';
import { logger } from '@/utils/logger';

const API_BASE_URL = '/api/account';

/**
 * 账户管理API服务
 */
export const accountService = {
  /**
   * 获取当前用户资料
   */
  async getUserProfile(): Promise<UserProfile> {
    logger.info('API:Account', '开始请求用户资料');
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`);
      logger.info('API:Account', '请求用户资料成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '请求用户资料失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 更新用户资料
   * @param profileData 用户资料数据
   */
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    logger.info('API:Account', '开始更新用户资料');
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData);
      logger.info('API:Account', '更新用户资料成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '更新用户资料失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 更新用户头像
   * @param formData 包含头像文件的表单数据
   */
  async updateAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    logger.info('API:Account', '开始更新用户头像');
    try {
      const response = await axios.post(`${API_BASE_URL}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      logger.info('API:Account', '更新用户头像成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '更新用户头像失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取安全设置
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    logger.info('API:Account', '开始请求安全设置');
    try {
      const response = await axios.get(`${API_BASE_URL}/security`);
      logger.info('API:Account', '请求安全设置成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '请求安全设置失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 更新安全设置
   * @param securityData 安全设置数据
   */
  async updateSecuritySettings(securityData: Partial<SecuritySettings>): Promise<SecuritySettings> {
    logger.info('API:Account', '开始更新安全设置');
    try {
      const response = await axios.put(`${API_BASE_URL}/security`, securityData);
      logger.info('API:Account', '更新安全设置成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '更新安全设置失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 更改密码
   * @param currentPassword 当前密码
   * @param newPassword 新密码
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    logger.info('API:Account', '开始更改密码');
    try {
      await axios.post(`${API_BASE_URL}/change-password`, {
        currentPassword,
        newPassword,
      });
      logger.info('API:Account', '更改密码成功');
    } catch (error: any) {
      logger.error('API:Account', '更改密码失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 启用两因素认证
   */
  async enableTwoFactor(): Promise<{ qrCode: string; backupCodes: string[] }> {
    logger.info('API:Account', '开始启用两因素认证');
    try {
      const response = await axios.post(`${API_BASE_URL}/security/two-factor/enable`);
      logger.info('API:Account', '启用两因素认证成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '启用两因素认证失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 验证两因素认证
   * @param code 验证码
   */
  async verifyTwoFactor(code: string): Promise<{ success: boolean }> {
    logger.info('API:Account', '开始验证两因素认证');
    try {
      const response = await axios.post(`${API_BASE_URL}/security/two-factor/verify`, { code });
      logger.info('API:Account', '验证两因素认证成功', { success: response.data.success });
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '验证两因素认证失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 禁用两因素认证
   * @param code 验证码
   */
  async disableTwoFactor(code: string): Promise<void> {
    logger.info('API:Account', '开始禁用两因素认证');
    try {
      await axios.post(`${API_BASE_URL}/security/two-factor/disable`, { code });
      logger.info('API:Account', '禁用两因素认证成功');
    } catch (error: any) {
      logger.error('API:Account', '禁用两因素认证失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 获取用户设置
   */
  async getUserSettings(): Promise<any> {
    logger.info('API:Account', '开始请求用户设置');
    try {
      const response = await axios.get(`${API_BASE_URL}/settings`);
      logger.info('API:Account', '请求用户设置成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '请求用户设置失败', { error: error.message });
      throw error;
    }
  },

  /**
   * 更新用户设置
   * @param settings 设置数据
   */
  async updateUserSettings(settings: any): Promise<any> {
    logger.info('API:Account', '开始更新用户设置');
    try {
      const response = await axios.put(`${API_BASE_URL}/settings`, settings);
      logger.info('API:Account', '更新用户设置成功');
      return response.data;
    } catch (error: any) {
      logger.error('API:Account', '更新用户设置失败', { error: error.message });
      throw error;
    }
  },
};
