<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-textlight mb-8">应用管理</h1>

    <div class="bg-primary/40 p-6 rounded-lg mb-8">
      <div class="flex items-center mb-4">
        <div class="i-carbon-application text-3xl text-neon mr-3"></div>
        <h2 class="text-xl font-semibold text-textlight">应用连接</h2>
      </div>
      <p class="text-textgray mb-6">管理与Atom Nexus连接的去中心化应用程序，控制它们的权限。</p>
      <button class="btn-primary">连接新应用</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 示例应用卡片 -->
      <div class="card p-5 hover:shadow-neon/20 hover:shadow-lg transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center">
            <div class="i-carbon-application text-2xl text-neon mr-2"></div>
            <h3 class="text-lg font-medium text-textlight">示例应用</h3>
          </div>
          <div class="px-2 py-1 bg-neon/20 text-neon text-xs rounded-full">已连接</div>
        </div>
        <p class="text-textgray text-sm mb-4">这是一个示例应用，可以访问您的基本身份信息。</p>
        <div class="flex justify-between items-center text-sm">
          <span class="text-textgray">连接于 2023-05-15</span>
          <button class="text-neon hover:underline">管理</button>
        </div>
      </div>

      <!-- 添加新应用卡片 -->
      <div
        class="card p-5 border border-dashed border-metal/30 flex flex-col items-center justify-center cursor-pointer hover:border-neon/50 transition-all duration-300">
        <div class="i-carbon-add-alt text-4xl text-metal mb-3"></div>
        <div class="text-textlight font-medium mb-1">添加应用</div>
        <p class="text-textgray text-sm text-center">连接新的去中心化应用</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 应用管理页面逻辑
</script>
