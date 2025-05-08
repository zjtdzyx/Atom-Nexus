import http from '../utils/http';
import type { AxiosResponse } from 'axios';

// 仪表盘统计数据
export interface DashboardStats {
  identityCount: number;
  credentialCount: number;
  recentLogins: number;
  storageUsed: {
    used: number;
    total: number;
    percentage: number;
  };
}

// 最近活动类型
export interface RecentActivity {
  id: string;
  type:
    | 'login'
    | 'identity_created'
    | 'credential_issued'
    | 'credential_verified'
    | 'permission_changed'
    | 'file_uploaded';
  title: string;
  description: string;
  timestamp: string;
  metadata: Record<string, any>;
}

// 系统公告类型
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  expiresAt: string | null;
  isRead: boolean;
}

// 获取仪表盘统计数据
export async function fetchDashboardStats(): Promise<AxiosResponse<DashboardStats>> {
  return http.get('/api/home/stats');
}

// 获取最近活动
export async function fetchRecentActivities(
  limit: number = 10
): Promise<AxiosResponse<RecentActivity[]>> {
  return http.get('/api/home/activities', { params: { limit } });
}

// 获取系统公告
export async function fetchAnnouncements(
  params: {
    onlyUnread?: boolean;
    limit?: number;
  } = {}
): Promise<AxiosResponse<Announcement[]>> {
  return http.get('/api/home/announcements', { params });
}

// 标记公告为已读
export async function markAnnouncementAsRead(announcementId: string): Promise<AxiosResponse<void>> {
  return http.post(`/api/home/announcements/${announcementId}/read`);
}

// 标记所有公告为已读
export async function markAllAnnouncementsAsRead(): Promise<AxiosResponse<{ count: number }>> {
  return http.post('/api/home/announcements/read-all');
}

// 获取待办事项
export async function fetchTodos(): Promise<
  AxiosResponse<
    Array<{
      id: string;
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      dueDate: string | null;
      isCompleted: boolean;
      createdAt: string;
    }>
  >
> {
  return http.get('/api/home/todos');
}

// 创建待办事项
export async function createTodo(data: {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string | null;
}): Promise<
  AxiosResponse<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
    isCompleted: boolean;
    createdAt: string;
  }>
> {
  return http.post('/api/home/todos', data);
}

// 更新待办事项
export async function updateTodo(
  id: string,
  data: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string | null;
    isCompleted?: boolean;
  }
): Promise<
  AxiosResponse<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
    isCompleted: boolean;
    createdAt: string;
  }>
> {
  return http.put(`/api/home/todos/${id}`, data);
}

// 删除待办事项
export async function deleteTodo(id: string): Promise<AxiosResponse<void>> {
  return http.delete(`/api/home/todos/${id}`);
}
