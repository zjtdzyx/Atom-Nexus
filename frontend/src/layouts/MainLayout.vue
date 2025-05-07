<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <div class="w-64 bg-gray-900 text-white">
      <div class="p-4">
        <div class="flex items-center justify-center mb-6">
          <img src="../../public/atom-nexus-logo.png" alt="Atom Nexus" class="w-10 h-10 mr-2" />
          <div class="text-2xl font-bold">Atom Nexus</div>
        </div>

        <nav class="space-y-2">
          <RouterLink to="/" class="nav-link" :class="{ active: currentRoute === '/' }">
            <div class="i-carbon-dashboard mr-2"></div>仪表盘
          </RouterLink>

          <RouterLink to="/identity" class="nav-link" :class="{ active: currentRoute === '/identity' }">
            <div class="i-carbon-user-profile mr-2"></div>身份管理
          </RouterLink>

          <RouterLink to="/credentials" class="nav-link" :class="{ active: currentRoute === '/credentials' }">
            <div class="i-carbon-certificate mr-2"></div>凭证管理
          </RouterLink>

          <RouterLink to="/permissions" class="nav-link" :class="{ active: currentRoute === '/permissions' }">
            <div class="i-carbon-password mr-2"></div>权限控制
          </RouterLink>

          <RouterLink to="/apps" class="nav-link" :class="{ active: currentRoute === '/apps' }">
            <div class="i-carbon-application mr-2"></div>应用管理
          </RouterLink>

          <RouterLink to="/settings" class="nav-link" :class="{ active: currentRoute === '/settings' }">
            <div class="i-carbon-settings mr-2"></div>设置
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 overflow-auto bg-gray-100">
      <!-- 顶部导航 -->
      <header class="bg-white shadow-sm p-4">
        <div class="flex justify-end items-center">
          <div class="px-4 py-2 rounded-full bg-gray-100 flex items-center">
            <div class="i-carbon-user-avatar text-xl mr-2"></div>
            <span>用户名</span>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, RouterLink, RouterView } from 'vue-router'

  const route = useRoute()
  const currentRoute = computed(() => route.path)
</script>

<style scoped>
  .nav-link {
    @apply flex items-center px-4 py-2 rounded-lg transition-colors duration-200;
  }

  .nav-link:hover {
    @apply bg-gray-800;
  }

  .nav-link.active {
    @apply bg-primary text-white;
  }
</style>