import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  login,
  logout,
  refreshToken,
  register,
  verifyTwoFactor,
  verifyDid,
  verifyCredential,
  type LoginResponse,
  type DidVerificationResult,
  type CredentialVerificationResult,
} from '../services/auth';
import router from '../router';
import { logger } from '../utils/logger';

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
  const didVerificationResult = ref<DidVerificationResult | null>(null);
  const credentialVerificationResult = ref<CredentialVerificationResult | null>(null);

  // 初始化时从本地存储加载用户数据
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (err) {
      logger.error('Store:Auth', '无法解析存储的用户数据', err);
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
      logger.info('Store:Auth', '开始登录', { username, rememberMe });

      // 尝试登录前先记录状态
      const previousAuthState = isAuthenticated.value;
      logger.debug('Store:Auth', `登录前认证状态: ${previousAuthState ? '已认证' : '未认证'}`);

      // 发送登录请求
      const loginData = await login({ username, password, rememberMe });
      logger.debug('Store:Auth', '登录API响应', {
        accessToken: loginData.accessToken ? '获取成功' : '未获取到',
        user: loginData.user ? '获取成功' : '未获取到',
      });

      if (!loginData || !loginData.accessToken || !loginData.user) {
        logger.error('Store:Auth', '登录响应无效', {
          hasData: !!loginData,
          hasToken: !!(loginData && loginData.accessToken),
          hasUser: !!(loginData && loginData.user),
        });
        throw new Error('登录响应无效，请检查后端API');
      }

      // 设置身份验证数据
      setAuthData(loginData);
      logger.info('Store:Auth', '登录成功', { username });

      return loginData;
    } catch (err: any) {
      logger.error('Store:Auth', '登录失败', {
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      // 设置错误消息
      if (err.response?.status === 404) {
        error.value = '服务器接口未找到，请检查API是否正确配置';
      } else if (err.response?.status === 401) {
        error.value = '用户名或密码错误';
      } else if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else {
        error.value = err.message || '登录失败，请稍后重试';
      }

      throw err;
    } finally {
      loading.value = false;
    }
  };

  const verifyTwoFactorAuth = async (code: string) => {
    if (!twoFactorToken.value) {
      error.value = '验证会话已过期，请重新登录';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      logger.info('Store:Auth', '开始验证两步验证码');
      const result = await verifyTwoFactor(code, twoFactorToken.value);
      setAuthData(result);
      twoFactorRequired.value = false;
      twoFactorToken.value = null;
      logger.info('Store:Auth', '两步验证成功');
      router.push('/');
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || '验证码无效';
      logger.error('Store:Auth', '两步验证失败', err);
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
      logger.info('Store:Auth', '开始注册', { username, email });
      const result = await register({
        username,
        email,
        password,
        confirmPassword,
        fullName,
        agreeTerms,
      });
      logger.info('Store:Auth', '注册成功', { username });
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || '注册失败，请稍后重试';
      logger.error('Store:Auth', '注册失败', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logoutUser = async () => {
    try {
      logger.info('Store:Auth', '开始登出');
      await logout();
      logger.info('Store:Auth', '登出成功');
    } catch (err) {
      logger.error('Store:Auth', '登出时发生错误', err);
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
      logger.info('Store:Auth', '开始刷新令牌');
      const result = await refreshToken(refreshTokenValue.value);
      accessToken.value = result.accessToken;
      localStorage.setItem('accessToken', result.accessToken);
      logger.info('Store:Auth', '令牌刷新成功');

      return true;
    } catch (err) {
      logger.error('Store:Auth', '令牌刷新失败', err);
      clearAuthData();
      return false;
    }
  };

  // 验证DID
  const verifyDidDocument = async (
    did: string,
    method: 'resolve' | 'authenticate' | 'full' = 'resolve',
    options?: Record<string, any>
  ) => {
    loading.value = true;
    error.value = null;
    didVerificationResult.value = null;

    try {
      logger.info('Store:Auth', '开始验证DID', { did, method });
      const result = await verifyDid({ did, method, options });
      didVerificationResult.value = result;
      logger.info('Store:Auth', 'DID验证完成', { status: result.status });
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'DID验证失败';
      logger.error('Store:Auth', 'DID验证失败', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 验证凭证
  const verifyCredentialDocument = async (params: {
    id?: string;
    credential?: Record<string, any>;
    proof: {
      type: string;
      signatureValue: string;
      created?: string;
      verificationMethod?: string;
    };
    checkRevocationStatus?: boolean;
    verifyIssuer?: boolean;
  }) => {
    loading.value = true;
    error.value = null;
    credentialVerificationResult.value = null;

    try {
      logger.info('Store:Auth', '开始验证凭证', { id: params.id });
      const result = await verifyCredential(params);
      credentialVerificationResult.value = result;
      logger.info('Store:Auth', '凭证验证完成', { status: result.status });
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || '凭证验证失败';
      logger.error('Store:Auth', '凭证验证失败', err);
      throw err;
    } finally {
      loading.value = false;
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
    didVerificationResult,
    credentialVerificationResult,

    // 计算属性
    isAuthenticated,
    isAdmin,
    isDeveloper,

    // 方法
    loginUser,
    logoutUser,
    registerUser,
    refreshAuthToken,
    verifyTwoFactorAuth,
    verifyDidDocument,
    verifyCredentialDocument,
  };
});
