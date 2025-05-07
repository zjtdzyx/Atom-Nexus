<template>
  <div class="user-management-page p-6">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-zinc-100 flex items-center">
        <span class="i-carbon-user-admin text-violet-400 mr-2 text-3xl"></span>
        用户管理
      </h1>
      <p class="text-zinc-400 mt-1">
        管理系统用户，查看用户信息和状态。
      </p>
    </div>

    <div class="page-content">
      <!-- 错误提示 -->
      <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 mb-6">
        <div class="flex items-center">
          <span class="i-carbon-warning-filled text-xl mr-2"></span>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-10">
        <div class="i-carbon-circle-dash animate-spin text-4xl text-violet-400"></div>
      </div>

      <!-- 用户表格 -->
      <UserTable v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAdminStore } from '../../stores/admin';
  import UserTable from '../../components/admin/UserTable.vue';

  const store = useAdminStore();

  // 加载状态
  const loading = computed(() => store.isLoading);
  const error = computed(() => store.getError);

  // 页面加载时获取用户数据
  onMounted(() => {
    store.fetchUsers();
  });
</script>

<style scoped>
  .user-management-page {
    min-height: calc(100vh - 64px);
    animation: fadeIn 0.3s ease-out;
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