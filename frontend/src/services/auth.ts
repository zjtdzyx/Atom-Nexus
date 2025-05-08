import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 用户登录请求参数
interface LoginParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 用户注册请求参数
interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  agreeTerms: boolean;
}

// 登录响应类型
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string | null;
    role: 'admin' | 'user' | 'developer';
  };
}

// 用户登录
export async function login(params: LoginParams): Promise<AxiosResponse<LoginResponse>> {
  return http.post('/api/auth/login', params);
}

// 用户注册
export async function register(
  params: RegisterParams
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return http.post('/api/auth/register', params);
}

// 用户登出
export async function logout(): Promise<AxiosResponse<void>> {
  return http.post('/api/auth/logout');
}

// 刷新令牌
export async function refreshToken(
  token: string
): Promise<AxiosResponse<{ accessToken: string; expiresIn: number }>> {
  return http.post('/api/auth/refresh-token', { refreshToken: token });
}

// 忘记密码
export async function forgotPassword(
  email: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return http.post('/api/auth/forgot-password', { email });
}

// 重置密码
export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return http.post('/api/auth/reset-password', { token, newPassword, confirmPassword });
}

// 验证邮箱
export async function verifyEmail(
  token: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return http.post('/api/auth/verify-email', { token });
}

// 重新发送验证邮件
export async function resendVerificationEmail(
  email: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> {
  return http.post('/api/auth/resend-verification-email', { email });
}

// 验证两步验证码
export async function verifyTwoFactor(
  code: string,
  token: string
): Promise<AxiosResponse<LoginResponse>> {
  return http.post('/api/auth/verify-2fa', { code, token });
}

// 检查用户名是否可用
export async function checkUsernameAvailability(
  username: string
): Promise<AxiosResponse<{ available: boolean }>> {
  return http.get('/api/auth/check-username', { params: { username } });
}

// 检查邮箱是否可用
export async function checkEmailAvailability(
  email: string
): Promise<AxiosResponse<{ available: boolean }>> {
  return http.get('/api/auth/check-email', { params: { email } });
}
