import { http } from '../utils/http';

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
export async function login(params: LoginParams): Promise<LoginResponse> {
  return http.post('/api/auth/login', params);
}

// 用户注册
export async function register(
  params: RegisterParams
): Promise<{ success: boolean; message: string }> {
  return http.post('/api/auth/register', params);
}

// 用户登出
export async function logout(): Promise<void> {
  return http.post('/api/auth/logout');
}

// 刷新令牌
export async function refreshToken(
  token: string
): Promise<{ accessToken: string; expiresIn: number }> {
  return http.post('/api/auth/refresh-token', { refreshToken: token });
}

// 忘记密码
export async function forgotPassword(
  email: string
): Promise<{ success: boolean; message: string }> {
  return http.post('/api/auth/forgot-password', { email });
}

// 重置密码
export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> {
  return http.post('/api/auth/reset-password', { token, newPassword, confirmPassword });
}

// 验证邮箱
export async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  return http.post('/api/auth/verify-email', { token });
}

// 重新发送验证邮件
export async function resendVerificationEmail(
  email: string
): Promise<{ success: boolean; message: string }> {
  return http.post('/api/auth/resend-verification-email', { email });
}

// 验证两步验证码
export async function verifyTwoFactor(code: string, token: string): Promise<LoginResponse> {
  return http.post('/api/auth/verify-2fa', { code, token });
}

// 检查用户名是否可用
export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  return http.get('/api/auth/check-username', { params: { username } });
}

// 检查邮箱是否可用
export async function checkEmailAvailability(email: string): Promise<{ available: boolean }> {
  return http.get('/api/auth/check-email', { params: { email } });
}

// DID验证请求参数
interface VerifyDidParams {
  did: string;
  method?: 'resolve' | 'authenticate' | 'full';
  options?: Record<string, any>;
}

// DID验证响应
export interface DidVerificationResult {
  status: 'success' | 'failed' | 'partial';
  message: string;
  did: string;
  didDocument?: Record<string, any>;
  controller?: string;
  publicKeys?: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyHex?: string;
    publicKeyBase58?: string;
  }>;
  details?: Record<string, any>;
}

// 验证DID
export async function verifyDid(params: VerifyDidParams): Promise<DidVerificationResult> {
  return http.post('/api/auth/verify-did', params);
}

// 凭证验证请求参数
interface VerifyCredentialParams {
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
}

// 凭证验证响应
export interface CredentialVerificationResult {
  status: 'success' | 'failed' | 'partial';
  message: string;
  credentialId?: string;
  issuer?: string;
  signatureValid: boolean;
  isExpired?: boolean;
  isRevoked?: boolean;
  verifiedAt: string;
  details?: Record<string, any>;
}

// 验证凭证
export async function verifyCredential(
  params: VerifyCredentialParams
): Promise<CredentialVerificationResult> {
  return http.post('/api/auth/verify-credential', params);
}
