<template>
  <div class="not-found-page flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-6xl font-bold text-neon mb-4">404</h1>
    <h2 class="text-2xl text-textlight mb-6">页面未找到</h2>
    <p class="text-textgray mb-8">您访问的页面不存在或已被移动</p>
    <router-link to="/" class="btn-primary px-8 py-3">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
  // 404页面相关逻辑
</script>

<style scoped>
  .not-found-page {
    background-color: var(--color-primary);
  }
</style>