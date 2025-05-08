<template>
  <div class="auth-layout min-h-screen flex items-center justify-center bg-primary">
    <div class="auth-container bg-darken p-6 rounded-lg shadow-xl w-full max-w-md">
      <div class="mb-6 text-center">
        <img src="/atom-nexus-logo.png" alt="Atom Nexus" class="h-12 w-auto mx-auto" />
        <h1 class="mt-4 text-xl font-bold text-textlight">Atom Nexus</h1>
      </div>

      <router-view />

      <div class="mt-6 text-center text-textgray text-sm">
        <p>© {{ new Date().getFullYear() }} Atom Nexus. 保留所有权利。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 认证布局相关逻辑
</script>

<style scoped>
  .auth-layout {
    background: linear-gradient(135deg, #1e1e2f 0%, #121212 100%);
  }

  .auth-container {
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
</style>