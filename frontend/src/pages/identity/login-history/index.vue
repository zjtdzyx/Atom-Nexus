<template>
  <div class="login-history-page">
    <h1 class="text-2xl font-bold mb-6">登录历史</h1>
    <p class="mb-4">查看您的身份登录历史记录和活动日志。</p>

    <!-- 登录历史内容将根据业务需求实现 -->
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useIdentityStore } from '@/stores/identity';

  const identityStore = useIdentityStore();

  onMounted(() => {
    // 加载登录历史数据
    identityStore.fetchLoginHistory();
  });
</script>

<style scoped>
  .login-history-page {
    padding: 1.5rem;
  }
</style>