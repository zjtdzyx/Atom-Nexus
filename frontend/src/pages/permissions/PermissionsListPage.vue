<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-textlight mb-8">权限管理</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div class="card p-6">
        <div class="flex items-center mb-6">
          <div class="i-carbon-settings-adjust text-3xl text-neon mr-3"></div>
          <h2 class="text-xl font-semibold text-textlight">权限设置</h2>
        </div>
        <p class="text-textgray mb-6">管理您的身份和凭证的访问权限，控制谁可以查看您的数据。</p>
        <router-link to="/permissions/set" class="btn-primary block text-center">设置权限</router-link>
      </div>

      <div class="card p-6">
        <div class="flex items-center mb-6">
          <div class="i-carbon-data-view-alt text-3xl text-neon mr-3"></div>
          <h2 class="text-xl font-semibold text-textlight">权限审计</h2>
        </div>
        <p class="text-textgray mb-6">查看谁访问了您的数据，包括访问时间、内容和操作记录。</p>
        <router-link to="/permissions/audit" class="btn-primary block text-center">查看记录</router-link>
      </div>
    </div>

    <div class="bg-primary/40 p-6 rounded-lg">
      <p class="text-textgray">更多权限管理功能正在开发中，敬请期待...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 权限管理页面逻辑
</script>