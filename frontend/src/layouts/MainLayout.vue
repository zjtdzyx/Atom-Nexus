<template>
  <div class="layout-wrapper bg-darkbg">
    <!-- 背景效果 -->
    <div class="background-effects">
      <!-- 辐射渐变 -->
      <div class="radial-glow-1"></div>
      <div class="radial-glow-2"></div>

      <!-- 网络连接线 -->
      <div class="network-lines">
        <div class="network-line" style="top: 20%; left: 0; width: 30%; transform: rotate(20deg);"></div>
        <div class="network-line" style="top: 40%; right: 0; width: 25%; transform: rotate(-15deg);"></div>
        <div class="network-line" style="top: 70%; left: 20%; width: 40%; transform: rotate(-5deg);"></div>
      </div>
    </div>

    <!-- 导航栏 -->
    <Navbar :scrolled="isScrolled" />

    <!-- 主要内容 -->
    <main class="main-content pt-16">
      <router-view></router-view>
    </main>

  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import Navbar from '../components/layout/Navbar.vue';

  // 监听滚动以改变导航栏样式
  const isScrolled = ref(false);

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped>
  .layout-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .main-content {
    flex: 1;
    position: relative;
    z-index: 2;
  }

  /* 背景效果 */
  .background-effects {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
  }

  .radial-glow-1 {
    position: absolute;
    top: 10%;
    left: 5%;
    width: 40vw;
    height: 40vw;
    background: radial-gradient(circle, rgba(12, 255, 225, 0.05) 0%, transparent 70%);
    opacity: 0.6;
    animation: pulse-slow 8s ease-in-out infinite;
  }

  .radial-glow-2 {
    position: absolute;
    bottom: 10%;
    right: 5%;
    width: 30vw;
    height: 30vw;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.05) 0%, transparent 70%);
    opacity: 0.6;
    animation: pulse-slow 12s ease-in-out infinite reverse;
  }

  .network-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .network-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, var(--color-neon), transparent);
    animation: line-flash 5s infinite ease-in-out;
    opacity: 0.2;
  }

  /* 底部装饰线 */
  .decoration-line {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--color-neon), transparent);
    opacity: 0.3;
  }

  /* Atom Logo */
  .atom-logo {
    position: relative;
  }

  .atom-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-neon);
    box-shadow: 0 0 8px var(--color-neon);
    animation: pulse-glow 3s infinite;
  }

  .atom-orbit-1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgba(12, 255, 225, 0.3);
    animation: orbit 8s linear infinite;
  }

  .atom-orbit-2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid rgba(12, 255, 225, 0.2);
    animation: orbit 12s linear infinite reverse;
  }

  @keyframes pulse-slow {

    0%,
    100% {
      opacity: 0.4;
    }

    50% {
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {

    .radial-glow-1,
    .radial-glow-2 {
      opacity: 0.4;
    }
  }
</style>