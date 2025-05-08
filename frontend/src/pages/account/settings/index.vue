<template>
  <div class="account-settings-page">
    <h1 class="text-2xl font-bold mb-6">账户设置</h1>
    <p class="mb-4">管理您的个人偏好和系统设置。</p>

    <!-- 账户设置表单将根据业务需求实现 -->
    <div class="settings-form mt-8" v-if="accountStore.settings">
      <!-- 设置表单内容将在此显示 -->
    </div>

    <div class="loading-state" v-else-if="accountStore.loading">
      正在加载设置...
    </div>

    <div class="error-state" v-else-if="accountStore.error">
      加载设置失败: {{ accountStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAccountStore } from '@/stores/account';

  const accountStore = useAccountStore();

  onMounted(() => {
    // 加载用户设置
    accountStore.fetchUserSettings();
  });
</script>

<style scoped>
  .account-settings-page {
    padding: 1.5rem;
  }
</style>