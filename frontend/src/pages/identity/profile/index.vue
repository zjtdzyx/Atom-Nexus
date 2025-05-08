<template>
  <div class="identity-profile-page">
    <h1 class="text-2xl font-bold mb-6">身份资料</h1>
    <p class="mb-4">管理您的去中心化身份资料和个人信息。</p>

    <!-- 身份资料内容将根据业务需求实现 -->
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useIdentityStore } from '@/stores/identity';

  const identityStore = useIdentityStore();

  onMounted(() => {
    // 加载身份资料数据
    identityStore.fetchProfile();
  });
</script>

<style scoped>
  .identity-profile-page {
    padding: 1.5rem;
  }
</style>