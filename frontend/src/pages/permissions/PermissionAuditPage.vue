<template>
  <div class="permission-audit-page">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-textlight">权限审计</h1>
      <p class="text-textgray mt-2">查看权限操作的审计日志记录，监控权限变更和使用情况</p>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="filter-area bg-primary/50 p-4 rounded-xl border border-gray-800 shadow-lg mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 日期范围 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-textgray mb-1">日期范围</label>
          <div class="flex space-x-2">
            <input type="date" v-model="filters.startDate"
              class="w-full px-3 py-1.5 bg-primary/70 border border-gray-700 rounded-lg text-textlight text-sm focus:outline-none focus:ring-1 focus:ring-neon/50" />
            <span class="text-textgray self-center">至</span>
            <input type="date" v-model="filters.endDate"
              class="w-full px-3 py-1.5 bg-primary/70 border border-gray-700 rounded-lg text-textlight text-sm focus:outline-none focus:ring-1 focus:ring-neon/50" />
          </div>
        </div>

        <!-- 操作类型 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-textgray mb-1">操作类型</label>
          <select v-model="filters.action"
            class="w-full px-3 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight text-sm focus:outline-none focus:ring-1 focus:ring-neon/50">
            <option value="">全部</option>
            <option value="create">创建权限</option>
            <option value="update">更新权限</option>
            <option value="revoke">撤销权限</option>
            <option value="grant">授予权限</option>
            <option value="view">查看权限</option>
          </select>
        </div>

        <!-- 搜索 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-textgray mb-1">搜索 DID 或资源</label>
          <div class="relative">
            <input type="text" v-model="filters.search" placeholder="输入DID或资源ID..."
              class="w-full pl-9 pr-3 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight text-sm focus:outline-none focus:ring-1 focus:ring-neon/50" />
            <div class="absolute left-3 top-2.5 text-textgray">
              <div class="i-carbon-search text-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选按钮 -->
      <div class="flex justify-end mt-4">
        <button class="btn-secondary text-sm px-3 py-1.5 mr-2" @click="resetFilters">
          <span class="i-carbon-reset mr-1"></span>重置
        </button>
        <button class="btn-primary text-sm px-3 py-1.5" @click="applyFilters">
          <span class="i-carbon-filter mr-1"></span>筛选
        </button>
      </div>
    </div>

    <!-- 审计日志列表 -->
    <div class="audit-logs-list bg-primary/50 p-5 rounded-xl border border-gray-800 shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-textlight">审计日志</h3>
        <button class="btn-secondary text-xs px-3 py-1.5" @click="refreshLogs">
          <span class="i-carbon-refresh mr-1"></span>刷新
        </button>
      </div>

      <!-- 审计日志组件 -->
      <AuditLogList :initial-page="currentPage" :page-size="pageSize" @page-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import AuditLogList from '../../components/permission/AuditLogList.vue';
  import { usePermissionStore } from '../../stores/permission';

  const router = useRouter();
  const route = useRoute();
  const permissionStore = usePermissionStore();

  // 分页设置
  const currentPage = ref(1);
  const pageSize = ref(10);

  // 筛选条件
  const filters = ref({
    startDate: '',
    endDate: '',
    action: '',
    search: '',
  });

  // 页面切换处理
  const handlePageChange = (page: number) => {
    currentPage.value = page;

    // 更新URL查询参数
    router.replace({
      query: {
        ...route.query,
        page: page.toString()
      }
    });
  };

  // 应用筛选条件
  const applyFilters = () => {
    // 实际应用中应该调用API进行筛选
    // 这里仅模拟更新URL参数
    const query: Record<string, string> = { page: '1' };

    if (filters.value.startDate) query.start = filters.value.startDate;
    if (filters.value.endDate) query.end = filters.value.endDate;
    if (filters.value.action) query.action = filters.value.action;
    if (filters.value.search) query.search = filters.value.search;

    router.replace({ query });

    // 刷新日志
    refreshLogs();
  };

  // 重置筛选条件
  const resetFilters = () => {
    filters.value = {
      startDate: '',
      endDate: '',
      action: '',
      search: '',
    };

    router.replace({ query: { page: '1' } });
    refreshLogs();
  };

  // 刷新日志
  const refreshLogs = () => {
    // 这里应该应用筛选条件调用API
    // 目前先简单实现为刷新当前页面数据
    permissionStore.fetchAuditLogs(currentPage.value, pageSize.value);
  };

  onMounted(() => {
    // 从URL读取分页信息
    if (route.query.page) {
      currentPage.value = parseInt(route.query.page as string) || 1;
    }

    // 从URL读取筛选条件
    if (route.query.start) filters.value.startDate = route.query.start as string;
    if (route.query.end) filters.value.endDate = route.query.end as string;
    if (route.query.action) filters.value.action = route.query.action as string;
    if (route.query.search) filters.value.search = route.query.search as string;
  });
</script>

<style scoped>
  .permission-audit-page {
    animation: fade-in 0.4s ease-out;
  }

  @keyframes fade-in {
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