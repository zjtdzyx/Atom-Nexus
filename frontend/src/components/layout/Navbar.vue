<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': scrolled }">
    <div class="container flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="logo-container flex items-center space-x-2">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="atom-logo relative w-8 h-8">
            <div class="atom-core"></div>
            <div class="atom-orbit-1"></div>
            <div class="atom-orbit-2"></div>
            <div class="atom-particle" style="top: 3px; left: 50%;"></div>
            <div class="atom-particle" style="bottom: 3px; right: 50%;"></div>
          </div>
          <span class="text-xl font-bold gradient-text">Atom Nexus</span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-link">
          {{ item.title }}
        </router-link>
      </div>

      <!-- Auth Buttons -->
      <div class="hidden md:flex items-center space-x-4">
        <button class="btn-connect text-sm px-4 py-1.5 rounded-full border border-neon/30 text-neon hover:bg-neon/10 transition-all" @click="openLoginModal">登录</button>
        <button class="btn-register text-sm px-4 py-1.5 rounded-full bg-neon text-primary hover:bg-neon/90 transition-all" @click="openRegisterModal">注册</button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-textlight p-2" @click="isMenuOpen = !isMenuOpen" aria-label="切换菜单">
        <div class="w-6 h-5 relative flex flex-col justify-between">
          <span class="w-full h-0.5 bg-neon transition-all duration-300"
            :class="{ 'rotate-45 translate-y-2': isMenuOpen }"></span>
          <span class="w-full h-0.5 bg-neon transition-all duration-300" :class="{ 'opacity-0': isMenuOpen }"></span>
          <span class="w-full h-0.5 bg-neon transition-all duration-300"
            :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"></span>
        </div>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div class="md:hidden absolute w-full bg-primary/95 backdrop-blur-md transition-all duration-300"
      :class="isMenuOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'">
      <div class="container flex flex-col space-y-4">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
          class="nav-link py-3 border-b border-neon/10" @click="isMenuOpen = false">
          {{ item.title }}
        </router-link>
        <div class="flex flex-col space-y-3 pt-4">
          <button class="btn-connect" @click="openLoginModal">登录</button>
          <button class="btn-register" @click="openRegisterModal">注册</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref, defineProps } from 'vue';

  const props = defineProps({
    scrolled: {
      type: Boolean,
      default: false
    }
  });

  // 菜单项
  const menuItems = [
    { title: '首页', path: '/' },
    { title: '身份管理', path: '/identity' },
    { title: '凭证管理', path: '/credential' },
    { title: '权限中心', path: '/permission' },
    { title: '开发者工具', path: '/developer' },
  ];

  // 移动端菜单状态
  const isMenuOpen = ref(false);

  // 登录/注册模态框
  const openLoginModal = () => {
    console.log('打开登录模态框');
  };

  const openRegisterModal = () => {
    console.log('打开注册模态框');
  };
</script>

<style scoped>
  .navbar {
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(12, 255, 225, 0.05);
  }

  /* 滚动时的样式变化 */
  .navbar-scrolled {
    @apply bg-primary/90 shadow-md;
    border-bottom: 1px solid rgba(12, 255, 225, 0.1);
  }

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

  .atom-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: var(--color-violet);
    box-shadow: 0 0 4px var(--color-violet);
  }

  .gradient-text {
    background: linear-gradient(to right, var(--color-neon), var(--color-violet));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .btn-connect {
    @apply px-4 py-1.5 rounded-full border border-neon/30 text-neon hover:bg-neon/10 transition-all;
  }
  
  .btn-register {
    @apply px-4 py-1.5 rounded-full bg-neon text-primary hover:bg-neon/90 transition-all;
  }
</style>