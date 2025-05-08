<template>
  <div class="layout-wrapper">
    <!-- 导航栏 -->
    <Navbar :scrolled="isScrolled" />

    <!-- 主要内容 -->
    <main class="main-content">
      <slot></slot>
    </main>

    <!-- 页脚 -->
    <footer class="footer py-12 bg-primary/90">
      <div class="container">
        <!-- Logo & 简介 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center mb-4">
              <img src="/atom-nexus-logo.png" alt="Atom Nexus" class="h-8 w-auto" />
              <span class="ml-2 text-xl font-bold text-textlight">Atom Nexus</span>
            </div>
            <p class="text-textgray text-sm mb-4">
              重新定义数字身份和数据主权，为去中心化世界提供安全、自主的身份解决方案
            </p>
            <div class="social-links flex space-x-3">
              <a href="#" class="text-metal hover:text-neon">
                <div class="i-carbon-logo-github text-2xl"></div>
              </a>
              <a href="#" class="text-metal hover:text-neon">
                <div class="i-carbon-logo-twitter text-2xl"></div>
              </a>
              <a href="#" class="text-metal hover:text-neon">
                <div class="i-carbon-logo-discord text-2xl"></div>
              </a>
              <a href="#" class="text-metal hover:text-neon">
                <div class="i-carbon-logo-linkedin text-2xl"></div>
              </a>
            </div>
          </div>

          <!-- 链接 -->
          <div class="col-span-1">
            <h3 class="text-lg font-semibold text-textlight mb-4">产品</h3>
            <ul class="space-y-2">
              <li><router-link to="/identity" class="text-textgray hover:text-neon text-sm">身份管理</router-link></li>
              <li><router-link to="/credentials" class="text-textgray hover:text-neon text-sm">凭证管理</router-link></li>
              <li><router-link to="/storage" class="text-textgray hover:text-neon text-sm">数据存储</router-link></li>
              <li><router-link to="/security" class="text-textgray hover:text-neon text-sm">安全与隐私</router-link></li>
            </ul>
          </div>

          <div class="col-span-1">
            <h3 class="text-lg font-semibold text-textlight mb-4">开发者</h3>
            <ul class="space-y-2">
              <li><router-link to="/developer" class="text-textgray hover:text-neon text-sm">开发者中心</router-link></li>
              <li><a href="#" class="text-textgray hover:text-neon text-sm">API 文档</a></li>
              <li><a href="#" class="text-textgray hover:text-neon text-sm">SDK 下载</a></li>
              <li><a href="#" class="text-textgray hover:text-neon text-sm">示例项目</a></li>
            </ul>
          </div>

          <div class="col-span-1">
            <h3 class="text-lg font-semibold text-textlight mb-4">公司</h3>
            <ul class="space-y-2">
              <li><router-link to="/about" class="text-textgray hover:text-neon text-sm">关于我们</router-link></li>
              <li><router-link to="/contact" class="text-textgray hover:text-neon text-sm">联系我们</router-link></li>
              <li><router-link to="/privacy" class="text-textgray hover:text-neon text-sm">隐私政策</router-link></li>
              <li><router-link to="/terms" class="text-textgray hover:text-neon text-sm">服务条款</router-link></li>
            </ul>
          </div>
        </div>

        <!-- 版权 -->
        <div class="border-t border-gray-800 pt-6 mt-6 text-sm text-textgray text-center">
          <p>© {{ new Date().getFullYear() }} Atom Nexus. 保留所有权利。</p>
        </div>
      </div>
    </footer>
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
  }

  .main-content {
    flex: 1;
  }

  .footer {
    background-color: var(--color-primary);
  }
</style>