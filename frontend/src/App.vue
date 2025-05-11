<template>
  <div class="app-wrapper">
    <!-- 背景效果 -->
    <div class="atom-nexus-bg">
      <!-- 动态原子轨道 -->
      <div class="atom-core-large"></div>
      <div class="atom-orbit-large atom-orbit-1"></div>
      <div class="atom-orbit-large atom-orbit-2"></div>

      <!-- 粒子元素 -->
      <div class="atom-particle particle-1"></div>
      <div class="atom-particle particle-2"></div>
      <div class="atom-particle particle-3"></div>

      <!-- 网络连接线 -->
      <div class="network-line line-1"></div>
      <div class="network-line line-2"></div>
      <div class="network-line line-3"></div>
    </div>

    <!-- 应用内容 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { logger } from './utils/logger';

  onMounted(() => {
    logger.info('App:Root', 'Atom Nexus应用已加载');
  });
</script>

<style>
  @import '@/styles/global.css';

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Inter', sans-serif;
  }

  .app-container {
    width: 100%;
    height: 100vh;
  }

  .app-wrapper {
    width: 100%;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  /* 背景效果 */
  .atom-nexus-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }

  /* 主原子核心 */
  .atom-core-large {
    position: fixed;
    top: 50%;
    left: -15%;
    width: 4px;
    height: 4px;
    background-color: var(--color-neon);
    border-radius: 50%;
    box-shadow: 0 0 15px var(--color-neon), 0 0 30px var(--color-neon);
    opacity: 0.5;
  }

  /* 大轨道 */
  .atom-orbit-large {
    position: fixed;
    top: 50%;
    left: -15%;
    border-radius: 50%;
    border: 1px solid rgba(12, 255, 225, 0.1);
    transform: translate(-50%, -50%);
  }

  .atom-orbit-1 {
    width: 400px;
    height: 400px;
    animation: orbit 40s linear infinite;
  }

  .atom-orbit-2 {
    width: 600px;
    height: 600px;
    animation: orbit 60s linear infinite reverse;
  }

  /* 粒子元素 */
  .atom-particle {
    position: fixed;
    width: 2px;
    height: 2px;
    background-color: var(--color-neon);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--color-neon);
    opacity: 0.8;
  }

  .particle-1 {
    top: 20%;
    right: 10%;
    animation: pulse-slow 3s infinite;
  }

  .particle-2 {
    top: 70%;
    right: 20%;
    animation: pulse-slow 5s infinite 1s;
  }

  .particle-3 {
    top: 40%;
    right: 40%;
    animation: pulse-slow 4s infinite 2s;
  }

  /* 网络连接线 */
  .network-line {
    position: fixed;
    height: 1px;
    background: linear-gradient(90deg, var(--color-neon), transparent);
    opacity: 0.2;
    animation: line-flash 5s infinite ease-in-out;
  }

  .line-1 {
    top: 30%;
    left: 0;
    width: 30%;
    transform: rotate(15deg);
    animation-delay: 0s;
  }

  .line-2 {
    top: 60%;
    right: 0;
    width: 20%;
    transform: rotate(-10deg);
    animation-delay: 2s;
  }

  .line-3 {
    top: 80%;
    left: 20%;
    width: 40%;
    transform: rotate(5deg);
    animation-delay: 4s;
  }

  /* 页面过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .atom-orbit-1 {
      width: 300px;
      height: 300px;
    }

    .atom-orbit-2 {
      width: 450px;
      height: 450px;
    }

    .network-line {
      opacity: 0.1;
      /* 移动端降低可视复杂度 */
    }
  }
</style>