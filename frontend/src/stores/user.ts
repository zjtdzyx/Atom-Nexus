import { defineStore } from 'pinia';
import axios from 'axios';

// 用户信息接口
export interface UserProfile {
  username: string;
  did: string;
  registeredAt: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  email?: string;
}

// 登录参数接口
export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

// 登录响应接口
export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
}

// Store状态接口
interface UserState {
  profile: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    token: localStorage.getItem('token'),
  }),

  getters: {
    getProfile: (state) => state.profile,
    isAuthenticated: (state) => state.isLoggedIn,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
  },

  actions: {
    // 获取用户资料
    async fetchProfile() {
      this.loading = true;
      this.error = null;

      try {
        // 从本地存储获取令牌
        const token = localStorage.getItem('token');

        // 如果存在令牌，设置为已登录状态
        if (token) {
          this.token = token;
          this.isLoggedIn = true;

          // 获取用户资料
          const response = await axios.get('/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          this.profile = response.data.data;
        } else {
          this.isLoggedIn = false;
          this.profile = null;
        }
      } catch (error) {
        console.error('获取用户资料失败:', error);
        this.error = error instanceof Error ? error.message : '获取用户资料失败';
        this.isLoggedIn = false;
        this.profile = null;
        localStorage.removeItem('token');
        this.token = null;
      } finally {
        this.loading = false;
      }
    },

    // 用户登录
    async login(params: LoginParams): Promise<LoginResponse> {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/auth/login', params);

        if (response.data.success && response.data.token) {
          const token = response.data.token;
          // 存储令牌到本地
          localStorage.setItem('token', token);
          this.token = token;
          this.isLoggedIn = true;

          // 获取用户资料
          await this.fetchProfile();

          return {
            success: true,
            token: token,
            message: response.data.message || '登录成功',
          };
        } else {
          return {
            success: false,
            message: response.data.message,
            error: response.data.error || '登录失败',
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '登录失败';
        this.error = errorMessage;
        console.error('登录失败:', error);

        return {
          success: false,
          error: errorMessage,
          message: '登录失败，请稍后重试',
        };
      } finally {
        this.loading = false;
      }
    },

    // 用户登出
    async logout() {
      this.loading = true;
      this.error = null;

      try {
        // 调用登出API
        await axios.post('/auth/logout');
      } catch (error) {
        console.error('登出API调用失败:', error);
        // 即使API调用失败，也继续进行本地登出操作
      } finally {
        // 清除本地存储的令牌
        localStorage.removeItem('token');
        // 重置状态
        this.token = null;
        this.isLoggedIn = false;
        this.profile = null;
        this.loading = false;
      }
    },

    // 检查登录状态
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.isLoggedIn = true;
        this.fetchProfile(); // 自动获取用户资料
      } else {
        this.isLoggedIn = false;
        this.profile = null;
      }
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },
  },
});
