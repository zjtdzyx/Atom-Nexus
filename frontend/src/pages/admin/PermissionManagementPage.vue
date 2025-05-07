<template>
  <div class="permission-management-page p-6">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-zinc-100 flex items-center">
        <span class="i-carbon-security text-violet-400 mr-2 text-3xl"></span>
        权限管理
      </h1>
      <p class="text-zinc-400 mt-1">
        查看和调整系统内权限设置，管理凭证访问权限。
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

      <!-- 权限表格 -->
      <PermissionTable v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAdminStore } from '../../stores/admin';
  import PermissionTable from '../../components/admin/PermissionTable.vue';

  const store = useAdminStore();

  // 加载状态
  const loading = computed(() => store.isLoading);
  const error = computed(() => store.getError);

  // 页面加载时获取权限数据
  onMounted(() => {
    store.fetchPermissions();
  });
</script>

<style scoped>
  .permission-management-page {
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
