<template>
  <div class="profile-page min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-cyan-400 flex items-center justify-center">
          <span class="i-carbon-user-profile text-4xl mr-3"></span>
          用户中心
        </h1>
        <p class="mt-2 text-sm text-gray-400">
          管理您的个人资料和身份信息
        </p>
      </div>

      <!-- 加载中状态 -->
      <div v-if="loading" class="text-center py-16">
        <div class="i-carbon-circle-dash text-5xl mx-auto animate-spin text-cyan-500"></div>
        <p class="text-gray-400 mt-4">加载用户资料中...</p>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="p-6 bg-red-500/20 border border-red-500/50 rounded-lg">
        <div class="flex items-center text-red-400">
          <span class="i-carbon-warning-filled text-xl mr-2"></span>
          <span>{{ error }}</span>
          <button @click="fetchProfile" class="ml-auto text-cyan-500 hover:text-cyan-400 flex items-center">
            <span class="i-carbon-rotate text-lg mr-1"></span>
            重试
          </button>
        </div>
      </div>

      <!-- 用户资料卡片 -->
      <div v-else-if="profile" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 左侧：头像和基本信息 -->
        <div
          class="profile-card bg-black/30 border border-cyan-800/30 rounded-xl p-6 shadow-glow col-span-1 flex flex-col items-center">
          <div class="avatar-container relative mb-6">
            <div
              class="avatar bg-cyan-900/30 h-32 w-32 rounded-full flex items-center justify-center border-2 border-cyan-500/30 overflow-hidden">
              <img v-if="profile.avatar" :src="profile.avatar" :alt="profile.username"
                class="h-full w-full object-cover" />
              <span v-else class="i-carbon-user-avatar text-7xl text-cyan-500/70"></span>
            </div>
            <div
              class="status-badge absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-black flex items-center justify-center"
              :class="statusClass">
              <span class="i-carbon-checkmark-filled" v-if="profile.status === 'active'"></span>
              <span class="i-carbon-time" v-else-if="profile.status === 'pending'"></span>
              <span class="i-carbon-close-filled" v-else></span>
            </div>
          </div>

          <h2 class="text-xl font-bold text-gray-200">{{ profile.username }}</h2>
          <p class="text-sm text-cyan-500 mb-4">{{ formatStatus(profile.status) }}</p>

          <div class="status-card p-3 rounded-lg bg-black/20 border border-gray-800 w-full mb-6">
            <div class="text-xs text-gray-500 mb-1">注册时间</div>
            <div class="flex items-center text-gray-300">
              <span class="i-carbon-time mr-1.5 text-cyan-500"></span>
              {{ formatDate(profile.registeredAt) }}
            </div>
          </div>

          <button @click="handleLogout" :disabled="loggingOut"
            class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 flex justify-center items-center">
            <span v-if="loggingOut" class="i-carbon-circle-dash animate-spin mr-2"></span>
            <span v-else class="i-carbon-logout mr-2"></span>
            {{ loggingOut ? '退出中...' : '退出登录' }}
          </button>
        </div>

        <!-- 右侧：详细信息和身份信息 -->
        <div class="col-span-1 md:col-span-2 space-y-6">
          <!-- 身份信息 -->
          <div class="profile-card bg-black/30 border border-cyan-800/30 rounded-xl p-6 shadow-glow">
            <h3 class="text-xl font-semibold text-cyan-400 mb-4 flex items-center">
              <span class="i-carbon-fingerprint text-2xl mr-2"></span>
              身份信息
            </h3>

            <div class="space-y-4">
              <div class="did-card p-4 bg-black/40 rounded-lg border border-gray-800">
                <div class="text-sm text-gray-500 mb-1">去中心化身份标识符 (DID)</div>
                <div class="flex items-center justify-between">
                  <div class="text-cyan-400 font-mono text-sm truncate max-w-[280px] md:max-w-md" :title="profile.did">
                    {{ profile.did }}
                  </div>
                  <button @click="copyDid(profile.did)" class="text-gray-400 hover:text-cyan-400">
                    <span class="i-carbon-copy"></span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="info-card p-3 rounded-lg bg-black/30 border border-gray-800">
                  <div class="text-xs text-gray-500 mb-1">安全级别</div>
                  <div class="flex items-center text-gray-300">
                    <span class="i-carbon-security text-cyan-500 mr-1.5"></span>
                    高
                  </div>
                </div>
                <div class="info-card p-3 rounded-lg bg-black/30 border border-gray-800">
                  <div class="text-xs text-gray-500 mb-1">身份类型</div>
                  <div class="flex items-center text-gray-300">
                    <span class="i-carbon-user-role text-cyan-500 mr-1.5"></span>
                    个人用户
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 账户信息 -->
          <div class="profile-card bg-black/30 border border-cyan-800/30 rounded-xl p-6 shadow-glow">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold text-cyan-400 flex items-center">
                <span class="i-carbon-user-settings text-2xl mr-2"></span>
                账户信息
              </h3>
              <button
                class="py-1 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors flex items-center text-sm">
                <span class="i-carbon-edit mr-1"></span>
                编辑资料
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="info-card p-3 rounded-lg bg-black/30 border border-gray-800">
                <div class="text-xs text-gray-500 mb-1">用户名</div>
                <div class="flex items-center text-gray-300">
                  <span class="i-carbon-user text-cyan-500 mr-1.5"></span>
                  {{ profile.username }}
                </div>
              </div>
              <div class="info-card p-3 rounded-lg bg-black/30 border border-gray-800">
                <div class="text-xs text-gray-500 mb-1">电子邮箱</div>
                <div class="flex items-center text-gray-300">
                  <span class="i-carbon-email text-cyan-500 mr-1.5"></span>
                  {{ profile.email || '未设置' }}
                </div>
              </div>
            </div>

            <div class="mt-4 info-card p-3 rounded-lg bg-black/30 border border-gray-800">
              <div class="text-xs text-gray-500 mb-1">账户安全</div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                <div class="security-item flex items-center text-gray-300 text-sm">
                  <span class="i-carbon-password text-cyan-500 mr-1.5"></span>
                  密码已设置
                </div>
                <div class="security-item flex items-center text-gray-300 text-sm">
                  <span class="i-carbon-two-factor-authentication text-cyan-500 mr-1.5"></span>
                  两步验证已启用
                </div>
                <div class="security-item flex items-center text-red-400 text-sm">
                  <span class="i-carbon-mobile text-red-500 mr-1.5"></span>
                  手机未绑定
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 未登录状态 -->
      <div v-else class="text-center py-16 bg-black/20 border border-cyan-800/30 rounded-xl">
        <div class="i-carbon-user-offline text-6xl mx-auto mb-4 text-cyan-500/50"></div>
        <h3 class="text-xl font-medium text-gray-300 mb-2">您尚未登录</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">
          请先登录以查看和管理您的个人资料信息
        </p>
        <router-link to="/user/login"
          class="py-2 px-6 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors inline-flex items-center">
          <span class="i-carbon-login mr-2"></span>
          去登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../../stores/user';

  const router = useRouter();
  const userStore = useUserStore();

  // 状态
  const loading = ref(false);
  const error = ref('');
  const loggingOut = ref(false);

  // 从store获取用户信息
  const profile = computed(() => userStore.getProfile);

  // 获取用户资料
  const fetchProfile = async () => {
    loading.value = true;
    error.value = '';

    try {
      await userStore.fetchProfile();

      // 如果不是登录状态，重定向到登录页
      if (!userStore.isAuthenticated) {
        router.push('/user/login');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户资料失败';
    } finally {
      loading.value = false;
    }
  };

  // 登出处理
  const handleLogout = async () => {
    loggingOut.value = true;

    try {
      await userStore.logout();
      router.push('/user/login');
    } catch (err) {
      console.error('登出失败:', err);
    } finally {
      loggingOut.value = false;
    }
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化状态
  const formatStatus = (status: string): string => {
    switch (status) {
      case 'active':
        return '已激活';
      case 'pending':
        return '待验证';
      case 'inactive':
        return '已禁用';
      default:
        return '未知状态';
    }
  };

  // 复制DID到剪贴板
  const copyDid = (did: string) => {
    navigator.clipboard.writeText(did)
      .then(() => {
        alert('DID已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制DID失败', err);
      });
  };

  // 根据状态获取样式类
  const statusClass = computed(() => {
    switch (profile.value?.status) {
      case 'active':
        return 'bg-emerald-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  });

  // 页面加载时获取用户资料
  onMounted(() => {
    fetchProfile();
  });
</script>

<style scoped>
  .profile-page {
    background-image: radial-gradient(circle at center, rgba(34, 211, 238, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
    animation: fadeIn 0.5s ease-out;
  }

  .profile-card {
    background-image: radial-gradient(circle at top right, rgba(34, 211, 238, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
    backdrop-filter: blur(3px);
    position: relative;
    overflow: hidden;
  }

  .profile-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    background: linear-gradient(45deg, #0e7490, transparent, #0e7490, transparent);
    animation: glowBorder 3s linear infinite;
    border-radius: 12px;
    opacity: 0.2;
  }

  .shadow-glow {
    box-shadow: 0 0 25px rgba(34, 211, 238, 0.08);
  }

  .avatar-container {
    animation: float 6s ease-in-out infinite;
  }

  .avatar {
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.3);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes glowBorder {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 300% 0;
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-5px);
    }

    100% {
      transform: translateY(0px);
    }
  }
</style>