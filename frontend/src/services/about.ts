import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 关于我们页面的数据类型
export interface AboutInfo {
  version: string;
  releaseDate: string;
  description: string;
  features: string[];
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    bio: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
    github: string;
  };
  license: string;
}

// 系统更新日志类型
export interface UpdateLog {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  description: string;
  changes: Array<{
    type: 'feature' | 'fix' | 'improvement' | 'security';
    description: string;
  }>;
}

// 获取关于我们页面的信息
export async function fetchAboutInfo(): Promise<AxiosResponse<AboutInfo>> {
  return http.get('/api/about');
}

// 获取系统更新日志
export async function fetchUpdateLogs(
  params: { page?: number; pageSize?: number } = {}
): Promise<AxiosResponse<{ total: number; items: UpdateLog[] }>> {
  return http.get('/api/about/update-logs', { params });
}

// 获取单个版本的更新日志
export async function fetchUpdateLogByVersion(version: string): Promise<AxiosResponse<UpdateLog>> {
  return http.get(`/api/about/update-logs/${version}`);
}

// 获取项目合作伙伴信息
export async function fetchPartners(): Promise<
  AxiosResponse<
    Array<{
      id: string;
      name: string;
      logo: string;
      description: string;
      website: string;
    }>
  >
> {
  return http.get('/api/about/partners');
}

// 提交用户反馈
export async function submitFeedback(data: {
  email: string;
  type: 'suggestion' | 'bug' | 'question' | 'other';
  content: string;
}): Promise<AxiosResponse<void>> {
  return http.post('/api/about/feedback', data);
}
