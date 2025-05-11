<template>
  <div class="auth-layout min-h-screen flex items-center justify-center bg-primary">
    <!-- 背景装饰元素 -->
    <div class="absolute top-1/4 right-0 w-1/3 h-1/3 bg-neon/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-10 w-1/4 h-1/4 bg-violet/5 rounded-full blur-3xl"></div>

    <!-- 网络连接线 -->
    <div class="network-line absolute top-1/3 right-0 w-1/3 opacity-20" style="transform: rotate(-15deg);"></div>
    <div class="network-line absolute bottom-1/3 left-0 w-1/4 opacity-20" style="transform: rotate(10deg);"></div>

    <div
      class="auth-container bg-primary/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md border border-neon/10 relative z-10">
      <div class="mb-8 text-center">
        <div class="flex justify-center">
          <div class="atom-logo relative w-12 h-12">
            <div class="atom-core"></div>
            <div class="atom-orbit-1"></div>
            <div class="atom-orbit-2"></div>
            <div class="atom-particle" style="top: 3px; left: 50%;"></div>
            <div class="atom-particle" style="bottom: 3px; right: 50%;"></div>
          </div>
        </div>
        <h1 class="mt-4 text-2xl font-bold text-textlight">Atom Nexus</h1>
      </div>

      <router-view />

      <div class="mt-8 text-center text-textgray text-sm">
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
    background-color: var(--color-primary);
    background-image:
      radial-gradient(circle at 20% 30%, rgba(12, 255, 225, 0.03) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(138, 43, 226, 0.03) 0%, transparent 30%);
  }

  .network-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, var(--color-neon), transparent);
    animation: line-flash 5s infinite ease-in-out;
    opacity: 0.2;
  }

  .atom-logo {
    position: relative;
  }

  .atom-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-neon);
    box-shadow: 0 0 10px var(--color-neon);
    animation: pulse-glow 3s infinite;
  }

  .atom-orbit-1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(12, 255, 225, 0.3);
    animation: orbit 8s linear infinite;
  }

  .atom-orbit-2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(12, 255, 225, 0.2);
    animation: orbit 12s linear infinite reverse;
  }

  .atom-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--color-violet);
    box-shadow: 0 0 4px var(--color-violet);
  }
</style>