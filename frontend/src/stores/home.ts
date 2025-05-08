import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  fetchDashboardStats,
  fetchRecentActivities,
  fetchAnnouncements,
  markAnnouncementAsRead,
  markAllAnnouncementsAsRead,
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../services/home';
import type { DashboardStats, RecentActivity, Announcement } from '../services/home';

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  isCompleted: boolean;
  createdAt: string;
}

export const useHomeStore = defineStore('home', () => {
  // 状态
  const dashboardStats = ref<DashboardStats>({
    identityCount: 0,
    credentialCount: 0,
    recentLogins: 0,
    storageUsed: {
      used: 0,
      total: 0,
      percentage: 0,
    },
  });

  const recentActivities = ref<RecentActivity[]>([]);
  const announcements = ref<Announcement[]>([]);
  const todos = ref<Todo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const unreadAnnouncementsCount = computed(() => {
    return announcements.value.filter((announcement) => !announcement.isRead).length;
  });

  const incompleteTodosCount = computed(() => {
    return todos.value.filter((todo) => !todo.isCompleted).length;
  });

  const todayTodos = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.value.filter((todo) => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  });

  const upcomingTodos = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.value.filter((todo) => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() > today.getTime();
    });
  });

  const overdueTodos = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.value.filter((todo) => {
      if (!todo.dueDate || todo.isCompleted) return false;
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() < today.getTime();
    });
  });

  // 动作
  const fetchDashboard = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await fetchDashboardStats();
      dashboardStats.value = data;
    } catch (err) {
      error.value = '获取仪表盘数据失败';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchActivities = async (limit: number = 10) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await fetchRecentActivities(limit);
      recentActivities.value = data;
    } catch (err) {
      error.value = '获取最近活动失败';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllAnnouncements = async (onlyUnread: boolean = false) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await fetchAnnouncements({ onlyUnread });
      announcements.value = data;
    } catch (err) {
      error.value = '获取系统公告失败';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const readAnnouncement = async (announcementId: string) => {
    try {
      await markAnnouncementAsRead(announcementId);

      // 更新本地状态
      const announcement = announcements.value.find((a) => a.id === announcementId);
      if (announcement) {
        announcement.isRead = true;
      }
    } catch (err) {
      error.value = '标记公告已读失败';
      console.error(err);
    }
  };

  const readAllAnnouncements = async () => {
    try {
      await markAllAnnouncementsAsRead();

      // 更新本地状态
      announcements.value.forEach((announcement) => {
        announcement.isRead = true;
      });
    } catch (err) {
      error.value = '标记所有公告已读失败';
      console.error(err);
    }
  };

  const fetchAllTodos = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await fetchTodos();
      todos.value = data;
    } catch (err) {
      error.value = '获取待办事项失败';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const addTodo = async (todo: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string | null;
  }) => {
    try {
      const { data } = await createTodo(todo);
      todos.value.push(data);
      return data;
    } catch (err) {
      error.value = '创建待办事项失败';
      console.error(err);
      throw err;
    }
  };

  const toggleTodoComplete = async (id: string, isCompleted: boolean) => {
    try {
      const { data } = await updateTodo(id, { isCompleted });

      // 更新本地状态
      const todoIndex = todos.value.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        todos.value[todoIndex] = data;
      }

      return data;
    } catch (err) {
      error.value = '更新待办事项状态失败';
      console.error(err);
      throw err;
    }
  };

  const updateTodoItem = async (
    id: string,
    updates: {
      title?: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      dueDate?: string | null;
      isCompleted?: boolean;
    }
  ) => {
    try {
      const { data } = await updateTodo(id, updates);

      // 更新本地状态
      const todoIndex = todos.value.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        todos.value[todoIndex] = data;
      }

      return data;
    } catch (err) {
      error.value = '更新待办事项失败';
      console.error(err);
      throw err;
    }
  };

  const removeTodo = async (id: string) => {
    try {
      await deleteTodo(id);

      // 更新本地状态
      todos.value = todos.value.filter((todo) => todo.id !== id);
    } catch (err) {
      error.value = '删除待办事项失败';
      console.error(err);
      throw err;
    }
  };

  // 初始化方法
  const initHomeData = async () => {
    await Promise.all([
      fetchDashboard(),
      fetchActivities(),
      fetchAllAnnouncements(),
      fetchAllTodos(),
    ]);
  };

  return {
    // 状态
    dashboardStats,
    recentActivities,
    announcements,
    todos,
    isLoading,
    error,

    // 计算属性
    unreadAnnouncementsCount,
    incompleteTodosCount,
    todayTodos,
    upcomingTodos,
    overdueTodos,

    // 动作
    fetchDashboard,
    fetchActivities,
    fetchAllAnnouncements,
    readAnnouncement,
    readAllAnnouncements,
    fetchAllTodos,
    addTodo,
    toggleTodoComplete,
    updateTodoItem,
    removeTodo,
    initHomeData,
  };
});
