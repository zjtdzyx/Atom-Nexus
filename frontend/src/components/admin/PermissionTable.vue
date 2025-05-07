<template>
  <div class="permission-table">
    <!-- 表格头部搜索和过滤 -->
    <div class="flex justify-between items-center mb-4">
      <div class="relative w-72">
        <input type="text" v-model="searchQuery"
          class="w-full pl-10 pr-4 py-2 bg-zinc-100/10 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
          placeholder="搜索权限..." />
        <div class="absolute left-3 top-2.5 text-zinc-400">
          <div class="i-carbon-search text-lg"></div>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <select v-model="statusFilter"
          class="px-4 py-2 bg-zinc-100/10 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-400/40">
          <option value="all">全部状态</option>
          <option value="active">活跃</option>
          <option value="expired">已过期</option>
          <option value="revoked">已撤销</option>
        </select>
      </div>
    </div>
    
    <!-- 表格 -->
    <div class="overflow-x-auto bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-lg">
      <table class="w-full">
        <thead>
          <tr class="border-b border-zinc-800 bg-zinc-900/80">
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">凭证名称</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">授权人</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">被授权人</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">权限类型</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">授权日期</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">状态</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="permission in filteredPermissions" :key="permission.id" class="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-zinc-100">{{ permission.credentialName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-zinc-300">{{ permission.grantorName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-zinc-300">{{ permission.granteeName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                permissionTypeClass(permission.permissionType)
              ]">
                {{ translatePermissionType(permission.permissionType) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-zinc-300 text-sm">{{ formatDate(permission.grantedAt) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                statusClass(permission.status)
              ]">
                {{ translateStatus(permission.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button class="text-violet-400 hover:text-violet-300 mr-3" title="查看详情">
                <div class="i-carbon-view"></div>
              </button>
              <button class="text-red-400 hover:text-red-300" title="撤销权限">
                <div class="i-carbon-close-filled"></div>
              </button>
            </td>
          </tr>

          <!-- 无数据显示 -->
          <tr v-if="filteredPermissions.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-zinc-400">
              <div class="i-carbon-no-image text-5xl mx-auto mb-3"></div>
              <p>没有找到匹配的权限记录</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-zinc-400">
        总计 {{ pagination.total }} 条记录
      </div>
      <div class="flex space-x-2">
        <button @click="changePage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          class="px-4 py-2 bg-zinc-800 rounded-lg text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed">
          上一页
        </button>
        <button class="px-4 py-2 bg-violet-500 rounded-lg text-white">
          {{ pagination.currentPage }}
        </button>
        <button @click="changePage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage * pagination.pageSize >= pagination.total"
          class="px-4 py-2 bg-zinc-800 rounded-lg text-zinc-200 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAdminStore } from '../../stores/admin';
import type { AdminPermission } from '../../stores/admin';

const props = defineProps<{
  initialPage?: number;
  pageSize?: number;
}>();

const store = useAdminStore();
const searchQuery = ref('');
const statusFilter = ref('all');

// 获取权限列表
const permissions = computed(() => store.getPermissions);
const pagination = computed(() => store.getPagination);
const loading = computed(() => store.isLoading);

// 根据搜索和状态过滤权限
const filteredPermissions = computed(() => {
  let filtered = permissions.value;
  
  // 按搜索关键字过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(permission => 
      permission.credentialName.toLowerCase().includes(query) ||
      permission.grantorName.toLowerCase().includes(query) ||
      permission.granteeName.toLowerCase().includes(query)
    );
  }
  
  // 按状态过滤
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(permission => permission.status === statusFilter.value);
  }
  
  return filtered;
});

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 状态样式
const statusClass = (status: string): string => {
  const statusStyles: Record<string, string> = {
    'active': 'bg-green-600/30 text-green-400',
    'expired': 'bg-amber-600/30 text-amber-400',
    'revoked': 'bg-red-600/30 text-red-400'
  };
  
  return statusStyles[status] || 'bg-gray-600/30 text-gray-400';
};

// 权限类型样式
const permissionTypeClass = (type: string): string => {
  const typeStyles: Record<string, string> = {
    'one_time': 'bg-blue-600/30 text-blue-400',
    'long_term': 'bg-purple-600/30 text-purple-400',
    'partial': 'bg-cyan-600/30 text-cyan-400'
  };
  
  return typeStyles[type] || 'bg-gray-600/30 text-gray-400';
};

// 翻译状态
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': '活跃',
    'expired': '已过期',
    'revoked': '已撤销'
  };
  
  return statusMap[status] || status;
};

// 翻译权限类型
const translatePermissionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'one_time': '一次性',
    'long_term': '长期',
    'partial': '部分'
  };
  
  return typeMap[type] || type;
};

// 切换页面
const changePage = (page: number) => {
  if (page < 1) return;
  if (page * pagination.value.pageSize > pagination.value.total) return;
  
  store.fetchPermissions(page, pagination.value.pageSize);
};

// 监听过滤器变化，重置到第一页
watch([searchQuery, statusFilter], () => {
  if (searchQuery.value || statusFilter.value !== 'all') {
    // 本地过滤不需要重新请求
  } else {
    store.fetchPermissions(1, pagination.value.pageSize);
  }
});

// 组件挂载时加载数据
onMounted(() => {
  store.fetchPermissions(props.initialPage || 1, props.pageSize || 10);
});
</script>

<style scoped>
.permission-table table {
  border-collapse: separate;
  border-spacing: 0;
}

.permission-table {
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