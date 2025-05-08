import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login, logout, refreshToken, register } from '../services/auth';
import type { LoginResponse } from '../services/auth';
import router from '../router';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string | null;
  role: 'admin' | 'user' | 'developer';
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refreshToken'));
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const twoFactorRequired = ref(false);
  const twoFactorToken = ref<string | null>(null);

  // 初始化时从本地存储加载用户数据
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (err) {
      console.error('无法解析存储的用户数据', err);
      localStorage.removeItem('user');
    }
  }

  // 计算属性
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isDeveloper = computed(() => user.value?.role === 'developer');

  // 方法
  const loginUser = async (username: string, password: string, rememberMe: boolean = false) => {
    loading.value = true;
    error.value = null;
    twoFactorRequired.value = false;
    twoFactorToken.value = null;

    try {
      const { data } = await login({ username, password, rememberMe });

      // 检查是否需要两步验证
      if (data.accessToken) {
        // 正常登录成功
        setAuthData(data);
        router.push('/');
      } else if (data.requireTwoFactor) {
        // 需要两步验证
        twoFactorRequired.value = true;
        twoFactorToken.value = data.twoFactorToken;
      }

      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败，请检查用户名和密码';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const verifyTwoFactor = async (code: string) => {
    if (!twoFactorToken.value) {
      error.value = '验证会话已过期，请重新登录';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data } = await verifyTwoFactor(code, twoFactorToken.value);
      setAuthData(data);
      twoFactorRequired.value = false;
      twoFactorToken.value = null;
      router.push('/');
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || '验证码无效';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const registerUser = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    fullName?: string,
    agreeTerms: boolean = false
  ) => {
    if (!agreeTerms) {
      error.value = '请同意服务条款和隐私政策';
      return;
    }

    if (password !== confirmPassword) {
      error.value = '两次输入的密码不一致';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data } = await register({
        username,
        email,
        password,
        confirmPassword,
        fullName,
        agreeTerms,
      });

      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || '注册失败，请稍后重试';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('登出时发生错误', err);
    } finally {
      // 无论API调用是否成功，都清除本地认证数据
      clearAuthData();
      router.push('/auth/login');
    }
  };

  const refreshAuthToken = async () => {
    if (!refreshTokenValue.value) {
      clearAuthData();
      return false;
    }

    try {
      const { data } = await refreshToken(refreshTokenValue.value);
      accessToken.value = data.accessToken;
      localStorage.setItem('accessToken', data.accessToken);

      return true;
    } catch (err) {
      clearAuthData();
      return false;
    }
  };

  // 设置认证数据
  const setAuthData = (data: LoginResponse) => {
    accessToken.value = data.accessToken;
    refreshTokenValue.value = data.refreshToken;
    user.value = data.user;

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  // 清除认证数据
  const clearAuthData = () => {
    accessToken.value = null;
    refreshTokenValue.value = null;
    user.value = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return {
    // 状态
    accessToken,
    user,
    loading,
    error,
    twoFactorRequired,

    // 计算属性
    isAuthenticated,
    isAdmin,
    isDeveloper,

    // 方法
    loginUser,
    logoutUser,
    registerUser,
    refreshAuthToken,
    verifyTwoFactor,
  };
});
