<template>
  <div class="container mx-auto py-10 px-4">
    <div class="flex items-center mb-8">
      <router-link to="/permission" class="text-metal hover:text-textlight mr-4">
        <div class="i-carbon-arrow-left text-2xl"></div>
      </router-link>
      <h1 class="text-3xl font-bold text-textlight">权限设置</h1>
    </div>

    <div class="bg-primary/40 p-6 rounded-lg mb-8">
      <p class="text-textgray mb-4">权限设置页面正在建设中，即将上线...</p>
      <p class="text-textgray">您可以先使用<router-link to="/identity" class="text-neon hover:underline">身份管理</router-link>功能
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 权限设置页面逻辑
</script>