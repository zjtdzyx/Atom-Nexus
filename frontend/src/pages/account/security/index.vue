<template>
  <div class="account-security-page">
    <h1 class="text-2xl font-bold mb-6">账户安全</h1>
    <p class="mb-4">管理您的账户安全设置、密码和两因素认证。</p>

    <!-- 安全设置内容将根据业务需求实现 -->
    <div class="security-settings mt-8" v-if="accountStore.securitySettings">
      <!-- 安全设置内容将在此显示 -->
    </div>

    <div class="loading-state" v-else-if="accountStore.loading">
      正在加载安全设置...
    </div>

    <div class="error-state" v-else-if="accountStore.error">
      加载安全设置失败: {{ accountStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAccountStore } from '@/stores/account';

  const accountStore = useAccountStore();

  onMounted(() => {
    // 加载安全设置
    accountStore.fetchSecuritySettings();
  });
</script>

<style scoped>
  .account-security-page {
    padding: 1.5rem;
  }
</style>
