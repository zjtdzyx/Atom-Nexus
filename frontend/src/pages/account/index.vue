<template>
  <div class="account-page">
    <h1 class="text-2xl font-bold mb-6">个人中心</h1>
    <p class="mb-4">管理您的账户资料、安全设置和个人偏好。</p>

    <!-- 个人中心内容 -->
    <div class="account-profile mt-8" v-if="accountStore.userProfile">
      <!-- 用户资料卡片 -->
      <div class="profile-card p-6 rounded-lg shadow-md">
        <div class="flex items-start">
          <div class="avatar-container mr-6">
            <img v-if="accountStore.userProfile.avatar" :src="accountStore.userProfile.avatar" alt="用户头像"
              class="rounded-full w-24 h-24 object-cover" />
            <div v-else
              class="avatar-placeholder rounded-full w-24 h-24 flex items-center justify-center bg-primary text-2xl">
              {{ accountStore.userProfile.displayName?.charAt(0) || accountStore.userProfile.username.charAt(0) }}
            </div>
          </div>

          <div class="profile-info flex-1">
            <h2 class="text-xl font-bold">
              {{ accountStore.userProfile.displayName || accountStore.userProfile.username }}
            </h2>
            <p class="text-textgray mt-1">{{ accountStore.userProfile.email }}</p>

            <div class="mt-4 flex space-x-4">
              <router-link to="/account/settings" class="btn-secondary px-4 py-2">编辑资料</router-link>
              <router-link to="/account/security" class="btn-outline px-4 py-2">安全设置</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading-state" v-else-if="accountStore.loading">
      正在加载用户资料...
    </div>

    <div class="error-state" v-else-if="accountStore.error">
      加载用户资料失败: {{ accountStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAccountStore } from '@/stores/account';

  const accountStore = useAccountStore();

  onMounted(() => {
    // 加载用户资料
    accountStore.fetchUserProfile();
  });
</script>

<style scoped>
  .account-page {
    padding: 1.5rem;
  }

  .profile-card {
    background-color: var(--color-primary);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .avatar-placeholder {
    color: var(--color-textlight);
    background-color: var(--color-secondary);
  }
</style>