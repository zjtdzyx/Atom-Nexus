<template>
  <nav class="navbar">
    <div class="container flex items-center justify-between py-4">
      <!-- Logo -->
      <div class="logo-container flex items-center">
        <router-link to="/" class="flex items-center">
          <img src="../../../public/atom-nexus-logo.png" alt="Atom Nexus" class="h-8 w-auto" />
          <span class="ml-2 text-xl font-bold text-textlight">Atom Nexus</span>
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
        <button class="btn-secondary" @click="openLoginModal">登录</button>
        <button class="btn-primary" @click="openRegisterModal">注册</button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-textlight p-2" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
        <div class="w-6 h-5 relative flex flex-col justify-between">
          <span class="w-full h-0.5 bg-textlight transition-all duration-300"
            :class="{ 'rotate-45 translate-y-2': isMenuOpen }"></span>
          <span class="w-full h-0.5 bg-textlight transition-all duration-300"
            :class="{ 'opacity-0': isMenuOpen }"></span>
          <span class="w-full h-0.5 bg-textlight transition-all duration-300"
            :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"></span>
        </div>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div class="md:hidden absolute w-full bg-primary/95 backdrop-blur-md transition-all duration-300"
      :class="isMenuOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'">
      <div class="container flex flex-col space-y-4">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
          class="nav-link py-3 border-b border-gray-700/50" @click="isMenuOpen = false">
          {{ item.title }}
        </router-link>
        <div class="flex flex-col space-y-3 pt-4">
          <button class="btn-secondary" @click="openLoginModal">登录</button>
          <button class="btn-primary" @click="openRegisterModal">注册</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  // 菜单项
  const menuItems = [
    { title: '首页', path: '/' },
    { title: '身份管理', path: '/identity' },
    { title: '凭证管理', path: '/credentials' },
    { title: '开发者工具', path: '/developer' },
    { title: '关于我们', path: '/about' },
  ];

  // 移动端菜单状态
  const isMenuOpen = ref(false);

  // 登录/注册模态框
  const openLoginModal = () => {
    // 实现登录模态框逻辑
    console.log('打开登录模态框');
  };

  const openRegisterModal = () => {
    // 实现注册模态框逻辑
    console.log('打开注册模态框');
  };
</script>

<style scoped>
  .navbar {
    transition: all 0.3s ease;
  }

  /* 滚动时的样式变化 */
  .navbar-scrolled {
    @apply bg-primary/90 shadow-md;
  }
</style>