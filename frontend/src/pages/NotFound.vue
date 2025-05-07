<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div class="text-8xl font-bold text-primary/20">404</div>
    <h1 class="text-2xl font-semibold mt-4">页面不存在</h1>
    <p class="text-gray-500 mt-2">抱歉，您访问的页面不存在或已被移除</p>
    <RouterLink to="/" class="btn-primary mt-6">
      返回首页
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
  // 404页面逻辑
</script>