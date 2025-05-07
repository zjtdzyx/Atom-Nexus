<template>
  <div class="identity-detail-page">
    <div class="container py-12">
      <div class="flex items-center mb-8">
        <button class="btn-secondary mr-4" @click="goBack">
          <span class="i-carbon-arrow-left mr-2"></span>返回
        </button>
        <h1 class="text-2xl font-bold text-textlight">身份详情</h1>
      </div>

      <div class="card p-6">
        <p class="text-textlight">身份ID: {{ $route.params.id }}</p>
        <p class="text-textgray mt-4">身份详情页面正在开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const goBack = () => {
    router.push('/identities');
  };
</script>

<style scoped>
  .identity-detail-page {
    min-height: calc(100vh - 64px);
    background-color: var(--color-darkbg);
  }
</style>