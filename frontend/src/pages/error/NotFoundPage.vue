<template>
  <div class="container mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[70vh]">
    <div class="text-9xl font-bold text-neon/30 mb-6">404</div>
    <h1 class="text-3xl font-bold text-textlight mb-4">页面未找到</h1>
    <p class="text-textgray mb-8 text-center max-w-lg">
      您访问的页面不存在或已被移动。请检查URL是否正确，或返回首页。
    </p>
    <router-link to="/" class="btn-primary">
      返回首页
    </router-link>
  </div>
</template>

<script setup lang="ts">
  // 404页面逻辑
</script>