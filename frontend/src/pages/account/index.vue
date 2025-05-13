<template>
  <div class="account-page py-10">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6">个人中心</h1>
      <p class="mb-4 text-textgray">管理您的账户资料、安全设置和个人偏好。</p>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <!-- 左侧导航菜单 -->
        <div class="lg:col-span-1">
          <AccountMenu @logout="handleLogout" />
        </div>

        <!-- 右侧内容区域 -->
        <div class="lg:col-span-3">
          <!-- 用户资料卡片 -->
          <ProfileCard :profile="accountStore.userProfile" @edit="navigateToEdit" @view-details="navigateToProfile" />

          <!-- 账户概览卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <!-- 活动统计 -->
            <div class="card bg-primary/40 p-6 rounded-lg border border-gray-800/50">
              <h3 class="text-lg font-medium text-textlight mb-4 flex items-center">
                <span class="i-carbon-activity text-xl text-neon mr-2"></span>
                活动统计
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-textgray">上次登录</span>
                  <span class="text-textlight">{{ formatDate(accountStore.userProfile?.lastLogin) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-textgray">已创建身份</span>
                  <span class="text-textlight">{{ accountStore.userProfile?.identityCount || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-textgray">已创建凭证</span>
                  <span class="text-textlight">{{ accountStore.userProfile?.credentialCount || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- 安全检查 -->
            <div class="card bg-primary/40 p-6 rounded-lg border border-gray-800/50">
              <h3 class="text-lg font-medium text-textlight mb-4 flex items-center">
                <span class="i-carbon-security text-xl text-neon mr-2"></span>
                安全检查
              </h3>
              <ul class="space-y-3">
                <li class="flex items-center">
                  <span class="i-carbon-checkmark-filled text-green-500 mr-2"></span>
                  <span class="text-textgray">已启用密码保护</span>
                </li>
                <li class="flex items-center">
                  <span v-if="accountStore.userProfile?.twoFactorEnabled"
                    class="i-carbon-checkmark-filled text-green-500 mr-2"></span>
                  <span v-else class="i-carbon-warning text-yellow-500 mr-2"></span>
                  <span class="text-textgray">{{ accountStore.userProfile?.twoFactorEnabled ? '已启用' : '未启用'
                  }}双因素认证</span>
                </li>
                <li class="flex items-center">
                  <span v-if="accountStore.userProfile?.recoveryConfigured"
                    class="i-carbon-checkmark-filled text-green-500 mr-2"></span>
                  <span v-else class="i-carbon-warning text-yellow-500 mr-2"></span>
                  <span class="text-textgray">{{ accountStore.userProfile?.recoveryConfigured ? '已设置' : '未设置'
                  }}账户恢复选项</span>
                </li>
              </ul>
              <div class="mt-4">
                <router-link to="/account/security" class="text-neon text-sm hover:underline">查看安全设置</router-link>
              </div>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="mt-8 card bg-primary/40 p-6 rounded-lg border border-gray-800/50">
            <h3 class="text-lg font-medium text-textlight mb-4 flex items-center">
              <span class="i-carbon-recently-viewed text-xl text-neon mr-2"></span>
              最近活动
            </h3>
            <div class="loading-state" v-if="accountStore.loading">
              <div class="flex justify-center py-6">
                <div class="i-carbon-circle-dash animate-spin text-3xl text-neon"></div>
              </div>
            </div>
            <ul v-else-if="accountStore.userProfile?.recentActivities?.length" class="space-y-4">
              <li v-for="(activity, index) in accountStore.userProfile.recentActivities" :key="index"
                class="border-b border-gray-800/50 last:border-0 pb-3 last:pb-0">
                <div class="flex items-start">
                  <div class="activity-icon p-2 rounded-lg mr-3" :class="getActivityIconBg(activity.type)">
                    <span :class="getActivityIcon(activity.type) + ' text-lg'"></span>
                  </div>
                  <div>
                    <p class="text-textlight">{{ activity.description }}</p>
                    <p class="text-xs text-textgray mt-1">{{ formatDate(activity.timestamp) }}</p>
                  </div>
                </div>
              </li>
            </ul>
            <div v-else class="text-center py-6">
              <p class="text-textgray">暂无活动记录</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAccountStore } from '../../stores/account';
  import { useAuthStore } from '../../stores/auth';
  import ProfileCard from '../../components/user/ProfileCard.vue';
  import AccountMenu from '../../components/account/AccountMenu.vue';

  const router = useRouter();
  const accountStore = useAccountStore();
  const authStore = useAuthStore();

  // 页面加载时获取用户资料
  onMounted(() => {
    accountStore.fetchUserProfile();
  });

  // 格式化日期
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 导航到编辑页面
  const navigateToEdit = () => {
    router.push('/account/profile');
  };

  // 导航到详情页面
  const navigateToProfile = () => {
    router.push('/account/profile');
  };

  // 退出登录
  const handleLogout = async () => {
    await authStore.logout();
    router.push('/auth/login');
  };

  // 获取活动图标背景色
  const getActivityIconBg = (type: string): string => {
    const typeMap: Record<string, string> = {
      'login': 'bg-blue-500/20 text-blue-400',
      'identity': 'bg-green-500/20 text-green-400',
      'credential': 'bg-purple-500/20 text-purple-400',
      'permission': 'bg-yellow-500/20 text-yellow-400',
      'security': 'bg-red-500/20 text-red-400'
    };
    return typeMap[type] || 'bg-gray-500/20 text-gray-400';
  };

  // 获取活动图标
  const getActivityIcon = (type: string): string => {
    const typeMap: Record<string, string> = {
      'login': 'i-carbon-login',
      'identity': 'i-carbon-user-profile',
      'credential': 'i-carbon-certificate',
      'permission': 'i-carbon-permission',
      'security': 'i-carbon-security'
    };
    return typeMap[type] || 'i-carbon-activity';
  };
</script>

<style scoped>
  .account-page {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>