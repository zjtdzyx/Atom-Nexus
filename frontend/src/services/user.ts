import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  role: 'admin' | 'user' | 'developer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// 用户详情
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  company: string;
  bio: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  role: 'admin' | 'user' | 'developer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// 获取当前登录用户信息
export async function fetchCurrentUser(): Promise<AxiosResponse<User>> {
  return http.get('/api/users/me');
}

// 获取用户详情
export async function fetchUserProfile(): Promise<AxiosResponse<UserProfile>> {
  return http.get('/api/users/me/profile');
}

// 更新用户详情
export async function updateUserProfile(
  data: Partial<
    Omit<
      UserProfile,
      'id' | 'username' | 'role' | 'status' | 'lastLogin' | 'createdAt' | 'updatedAt'
    >
  >
): Promise<AxiosResponse<UserProfile>> {
  return http.put('/api/users/me/profile', data);
}

// 更改用户头像
export async function updateUserAvatar(
  formData: FormData
): Promise<AxiosResponse<{ avatarUrl: string }>> {
  return http.post('/api/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 获取用户列表（仅管理员可用）
export async function fetchUsers(
  params: {
    page?: number;
    pageSize?: number;
    role?: string;
    status?: string;
    search?: string;
  } = {}
): Promise<AxiosResponse<{ total: number; items: User[] }>> {
  return http.get('/api/users', { params });
}

// 获取指定用户详情（仅管理员可用）
export async function fetchUserById(id: string): Promise<AxiosResponse<UserProfile>> {
  return http.get(`/api/users/${id}`);
}

// 创建用户（仅管理员可用）
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'user' | 'developer';
}): Promise<AxiosResponse<User>> {
  return http.post('/api/users', data);
}

// 更新用户（仅管理员可用）
export async function updateUser(
  id: string,
  data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<AxiosResponse<User>> {
  return http.put(`/api/users/${id}`, data);
}

// 删除用户（仅管理员可用）
export async function deleteUser(id: string): Promise<AxiosResponse<void>> {
  return http.delete(`/api/users/${id}`);
}

// 封禁用户（仅管理员可用）
export async function suspendUser(id: string): Promise<AxiosResponse<User>> {
  return http.post(`/api/users/${id}/suspend`);
}

// 解封用户（仅管理员可用）
export async function activateUser(id: string): Promise<AxiosResponse<User>> {
  return http.post(`/api/users/${id}/activate`);
}

// 重置用户密码（仅管理员可用）
export async function resetUserPassword(
  id: string
): Promise<AxiosResponse<{ temporaryPassword: string }>> {
  return http.post(`/api/users/${id}/reset-password`);
}
