<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-6">
      <router-link to="/credentials" class="text-neon hover:underline flex items-center">
        <div class="i-carbon-arrow-left mr-2"></div>
        返回凭证列表
      </router-link>
    </div>

    <h1 class="text-3xl font-bold text-textlight mb-8">凭证详情</h1>

    <div class="bg-primary/40 p-6 rounded-lg mb-8">
      <p class="text-textgray mb-4">凭证ID: {{ $route.params.id }}</p>
      <p class="text-textgray">凭证详情页面正在建设中，即将上线...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 凭证详情页面逻辑
</script>