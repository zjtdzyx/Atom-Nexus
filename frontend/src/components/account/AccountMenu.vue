<template>
  <div class="account-menu rounded-lg overflow-hidden bg-primary/40 border border-gray-800/50">
    <div class="p-4 bg-neon/10 border-b border-gray-800/50">
      <h3 class="text-lg font-medium text-textlight">账户管理</h3>
    </div>

    <nav class="account-nav">
      <ul class="py-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path"
            class="flex items-center px-4 py-3 text-textgray hover:bg-neon/5 hover:text-textlight transition-colors"
            :class="{ 'bg-neon/10 text-neon border-l-2 border-neon': isActivePath(item.path) }">
            <span :class="item.icon + ' text-xl mr-3 opacity-80'"></span>
            {{ item.label }}
          </router-link>
        </li>
      </ul>

      <div class="border-t border-gray-800/50 mt-2 pt-2">
        <ul>
          <li>
            <button @click="$emit('logout')"
              class="w-full flex items-center px-4 py-3 text-textgray hover:bg-red-900/10 hover:text-red-400 transition-colors">
              <span class="i-carbon-logout text-xl mr-3 opacity-80"></span>
              退出登录
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineEmits } from 'vue';
  import { useRoute } from 'vue-router';

  // 定义事件
  const emit = defineEmits(['logout']);

  // 获取当前路由
  const route = useRoute();

  // 菜单项
  const menuItems = ref([
    {
      label: '账户概览',
      path: '/account',
      icon: 'i-carbon-dashboard'
    },
    {
      label: '个人资料',
      path: '/account/profile',
      icon: 'i-carbon-user-profile'
    },
    {
      label: '安全设置',
      path: '/account/security',
      icon: 'i-carbon-security'
    },
    {
      label: '通知管理',
      path: '/account/notifications',
      icon: 'i-carbon-notification'
    },
    {
      label: '隐私设置',
      path: '/account/privacy',
      icon: 'i-carbon-privacy'
    },
    {
      label: '连接应用',
      path: '/account/connections',
      icon: 'i-carbon-connect'
    }
  ]);

  // 检查当前路由是否匹配菜单项
  const isActivePath = (path: string): boolean => {
    if (path === '/account') {
      return route.path === path;
    }
    return route.path.startsWith(path);
  };
</script>

<style scoped>
  .account-menu {
    animation: fadeIn 0.3s ease-out;
    transition: all 0.3s ease;
  }

  .account-menu:hover {
    box-shadow: 0 4px 20px rgba(12, 255, 225, 0.05);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>