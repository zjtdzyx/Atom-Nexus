import axios from 'axios';
import type { UserProfile, SecuritySettings } from '@/types/account';

const API_BASE_URL = '/api/account';

/**
 * 账户管理API服务
 */
export const accountService = {
  /**
   * 获取当前用户资料
   */
  async getUserProfile(): Promise<UserProfile> {
    const response = await axios.get(`${API_BASE_URL}/profile`);
    return response.data;
  },

  /**
   * 更新用户资料
   * @param profileData 用户资料数据
   */
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axios.put(`${API_BASE_URL}/profile`, profileData);
    return response.data;
  },

  /**
   * 更新用户头像
   * @param formData 包含头像文件的表单数据
   */
  async updateAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    const response = await axios.post(`${API_BASE_URL}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 获取安全设置
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await axios.get(`${API_BASE_URL}/security`);
    return response.data;
  },

  /**
   * 更新安全设置
   * @param securityData 安全设置数据
   */
  async updateSecuritySettings(securityData: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const response = await axios.put(`${API_BASE_URL}/security`, securityData);
    return response.data;
  },

  /**
   * 更改密码
   * @param currentPassword 当前密码
   * @param newPassword 新密码
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/change-password`, {
      currentPassword,
      newPassword,
    });
  },

  /**
   * 启用两因素认证
   */
  async enableTwoFactor(): Promise<{ qrCode: string; backupCodes: string[] }> {
    const response = await axios.post(`${API_BASE_URL}/security/two-factor/enable`);
    return response.data;
  },

  /**
   * 验证两因素认证
   * @param code 验证码
   */
  async verifyTwoFactor(code: string): Promise<{ success: boolean }> {
    const response = await axios.post(`${API_BASE_URL}/security/two-factor/verify`, { code });
    return response.data;
  },

  /**
   * 禁用两因素认证
   * @param code 验证码
   */
  async disableTwoFactor(code: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/security/two-factor/disable`, { code });
  },

  /**
   * 获取用户设置
   */
  async getUserSettings(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    return response.data;
  },

  /**
   * 更新用户设置
   * @param settings 设置数据
   */
  async updateUserSettings(settings: any): Promise<any> {
    const response = await axios.put(`${API_BASE_URL}/settings`, settings);
    return response.data;
  },
};
