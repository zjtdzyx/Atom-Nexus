<template>
  <div class="credential-issue-page">
    <h1 class="text-2xl font-bold mb-6">颁发凭证</h1>
    <p class="mb-4">为用户颁发新的去中心化身份凭证。</p>

    <!-- 颁发凭证表单将根据业务需求实现 -->
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useCredentialStore } from '@/stores/credential';

  const credentialStore = useCredentialStore();

  onMounted(() => {
    // 加载凭证模板
    credentialStore.fetchCredentialTemplates();
  });
</script>

<style scoped>
  .credential-issue-page {
    padding: 1.5rem;
  }
</style>