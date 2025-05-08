<template>
  <div class="credential-verify-page">
    <h1 class="text-2xl font-bold mb-6">验证凭证</h1>
    <p class="mb-4">验证去中心化身份凭证的有效性和真实性。</p>

    <!-- 验证凭证表单将根据业务需求实现 -->
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useCredentialStore } from '@/stores/credential';

  const credentialStore = useCredentialStore();
  const credentialId = ref('');
  const verificationResult = ref(null);

  const verifyCredential = async () => {
    if (!credentialId.value) return;

    try {
      verificationResult.value = await credentialStore.verifyCredential(credentialId.value);
    } catch (error) {
      console.error('验证凭证失败:', error);
    }
  };
</script>

<style scoped>
  .credential-verify-page {
    padding: 1.5rem;
  }
</style>