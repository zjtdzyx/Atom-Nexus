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

      <!-- Auth Buttons 或 User Profile -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- 未登录状态 -->
        <template v-if="!isAuthenticated">
          <router-link to="/auth/login"
            class="btn-connect text-sm px-4 py-1.5 rounded-full border border-neon/30 text-neon hover:bg-neon/10 transition-all">登录</router-link>
          <router-link to="/auth/register"
            class="btn-register text-sm px-4 py-1.5 rounded-full bg-neon text-primary hover:bg-neon/90 transition-all">注册</router-link>
        </template>

        <!-- 已登录状态 -->
        <template v-else>
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-2 focus:outline-none">
              <div v-if="user?.avatar" class="w-9 h-9 rounded-full overflow-hidden border-2 border-neon/30">
                <img :src="user.avatar" alt="用户头像" class="w-full h-full object-cover">
              </div>
              <div v-else
                class="w-9 h-9 rounded-full bg-violet/20 border-2 border-neon/30 flex items-center justify-center text-neon">
                {{ userInitials }}
              </div>
              <span class="text-sm text-textlight">{{ user?.username }}</span>
              <span class="i-carbon-chevron-down text-textlight text-xs" :class="{ 'rotate-180': userMenuOpen }"></span>
            </button>

            <!-- 用户菜单 -->
            <div v-show="userMenuOpen"
              class="absolute right-0 mt-2 w-48 py-2 bg-primary/95 backdrop-blur-md rounded-md shadow-lg border border-neon/10 z-50">
              <router-link to="/settings/profile" class="block px-4 py-2 text-sm text-textlight hover:bg-neon/10"
                @click="userMenuOpen = false">
                <span class="i-carbon-user-profile mr-2"></span>个人资料
              </router-link>
              <router-link to="/settings/security" class="block px-4 py-2 text-sm text-textlight hover:bg-neon/10"
                @click="userMenuOpen = false">
                <span class="i-carbon-security mr-2"></span>安全设置
              </router-link>
              <div class="border-t border-neon/10 my-1"></div>
              <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                <span class="i-carbon-logout mr-2"></span>退出登录
              </button>
            </div>
          </div>
        </template>
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
    <div class="md:hidden absolute w-full bg-primary/95 backdrop-blur-md transition-all duration-300 z-50"
      :class="isMenuOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'">
      <div class="container flex flex-col space-y-4">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
          class="nav-link py-3 border-b border-neon/10" @click="isMenuOpen = false">
          {{ item.title }}
        </router-link>

        <!-- 移动端认证按钮 -->
        <div class="flex flex-col space-y-3 pt-4">
          <!-- 未登录状态 -->
          <template v-if="!isAuthenticated">
            <router-link to="/auth/login" @click="isMenuOpen = false" class="btn-connect">登录</router-link>
            <router-link to="/auth/register" @click="isMenuOpen = false" class="btn-register">注册</router-link>
          </template>

          <!-- 已登录状态 -->
          <template v-else>
            <div class="flex items-center space-x-3 px-2 py-2">
              <div v-if="user?.avatar" class="w-10 h-10 rounded-full overflow-hidden border-2 border-neon/30">
                <img :src="user.avatar" alt="用户头像" class="w-full h-full object-cover">
              </div>
              <div v-else
                class="w-10 h-10 rounded-full bg-violet/20 border-2 border-neon/30 flex items-center justify-center text-neon text-lg">
                {{ userInitials }}
              </div>
              <div>
                <p class="text-textlight">{{ user?.username }}</p>
                <p class="text-xs text-textgray">{{ user?.email }}</p>
              </div>
            </div>
            <router-link to="/settings/profile" @click="isMenuOpen = false"
              class="py-3 border-t border-neon/10 text-textlight">
              <span class="i-carbon-user-profile mr-2"></span>个人资料
            </router-link>
            <router-link to="/settings/security" @click="isMenuOpen = false"
              class="py-3 border-t border-neon/10 text-textlight">
              <span class="i-carbon-security mr-2"></span>安全设置
            </router-link>
            <button @click="handleLogout" class="py-3 border-t border-neon/10 text-left text-red-400">
              <span class="i-carbon-logout mr-2"></span>退出登录
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref, defineProps, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../../stores/auth';
  import { logger } from '../../utils/logger';

  const props = defineProps({
    scrolled: {
      type: Boolean,
      default: false
    }
  });

  // 路由
  const router = useRouter();

  // 获取认证状态
  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);

  // 用户头像显示首字母
  const userInitials = computed(() => {
    if (!user.value) return '';

    if (user.value.fullName) {
      // 使用全名的首字母
      const names = user.value.fullName.split(' ');
      if (names.length > 1) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }

    // 使用用户名的首字母
    return user.value.username[0].toUpperCase();
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

  // 用户菜单状态
  const userMenuOpen = ref(false);

  // 切换用户菜单
  const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value;
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      await authStore.logoutUser();
      userMenuOpen.value = false;
      isMenuOpen.value = false;
      logger.info('Navbar', '用户已退出登录');
    } catch (error) {
      logger.error('Navbar', '退出登录失败', error);
    }
  };

  // 点击其他区域关闭用户菜单
  const handleClickOutside = (event: MouseEvent) => {
    if (userMenuOpen.value) {
      userMenuOpen.value = false;
    }
  };

  // 组件挂载时添加事件监听
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    logger.info('Component:Navbar', '导航栏组件已加载');
  });

  // 在路由变化时关闭菜单
  watch(
    () => router.currentRoute.value,
    () => {
      isMenuOpen.value = false;
      userMenuOpen.value = false;
    }
  );
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

  .nav-link {
    @apply text-textlight/80 hover:text-neon transition-colors;
  }
</style>