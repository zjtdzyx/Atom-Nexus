<template>
  <div class="user-table">
    <!-- 表格头部搜索和过滤 -->
    <div class="flex justify-between items-center mb-4">
      <div class="relative w-72">
        <input type="text" v-model="searchQuery"
          class="w-full pl-10 pr-4 py-2 bg-zinc-100/10 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
          placeholder="搜索用户..." />
        <div class="absolute left-3 top-2.5 text-zinc-400">
          <div class="i-carbon-search text-lg"></div>
        </div>
      </div>

      <div class="flex space-x-2">
        <select v-model="statusFilter"
          class="px-4 py-2 bg-zinc-100/10 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-400/40">
          <option value="all">全部状态</option>
          <option value="active">活跃</option>
          <option value="inactive">非活跃</option>
          <option value="suspended">已暂停</option>
        </select>
      </div>
    </div>

    <!-- 表格 -->
    <div class="overflow-x-auto bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-lg">
      <table class="w-full">
        <thead>
          <tr class="border-b border-zinc-800 bg-zinc-900/80">
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">用户名</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">DID</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">注册时间</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">状态</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-zinc-300 tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id"
            class="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-medium mr-3">
                  {{ getInitials(user.username) }}
                </div>
                <div class="text-zinc-100">{{ user.username }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-zinc-300 font-mono text-sm">{{ truncateDid(user.did) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-zinc-300 text-sm">{{ formatDate(user.registeredAt) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                statusClass(user.status)
              ]">
                {{ translateStatus(user.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button class="text-violet-400 hover:text-violet-300 mr-3" title="查看详情">
                <div class="i-carbon-view"></div>
              </button>
              <button class="text-violet-400 hover:text-violet-300 mr-3" title="编辑">
                <div class="i-carbon-edit"></div>
              </button>
              <button class="text-red-400 hover:text-red-300" title="禁用账户">
                <div class="i-carbon-stop"></div>
              </button>
            </td>
          </tr>

          <!-- 无数据显示 -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-zinc-400">
              <div class="i-carbon-no-image text-5xl mx-auto mb-3"></div>
              <p>没有找到匹配的用户</p>
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
        <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1"
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
  import type { User } from '../../stores/admin';

  const props = defineProps<{
    initialPage?: number;
    pageSize?: number;
  }>();

  const store = useAdminStore();
  const searchQuery = ref('');
  const statusFilter = ref('all');

  // 获取用户列表
  const users = computed(() => store.getUsers);
  const pagination = computed(() => store.getPagination);
  const loading = computed(() => store.isLoading);

  // 根据搜索和状态过滤用户
  const filteredUsers = computed(() => {
    let filtered = users.value;

    // 按搜索关键字过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.did.toLowerCase().includes(query)
      );
    }

    // 按状态过滤
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter.value);
    }

    return filtered;
  });

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 截断DID显示
  const truncateDid = (did: string): string => {
    if (did.length <= 18) return did;
    return `${did.substring(0, 8)}...${did.substring(did.length - 8)}`;
  };

  // 获取用户名首字母
  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // 状态样式
  const statusClass = (status: string): string => {
    const statusStyles: Record<string, string> = {
      'active': 'bg-green-600/30 text-green-400',
      'inactive': 'bg-gray-600/30 text-gray-400',
      'suspended': 'bg-red-600/30 text-red-400'
    };

    return statusStyles[status] || 'bg-gray-600/30 text-gray-400';
  };

  // 翻译状态
  const translateStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'active': '活跃',
      'inactive': '非活跃',
      'suspended': '已暂停'
    };

    return statusMap[status] || status;
  };

  // 切换页面
  const changePage = (page: number) => {
    if (page < 1) return;
    if (page * pagination.value.pageSize > pagination.value.total) return;

    store.fetchUsers(page, pagination.value.pageSize);
  };

  // 监听过滤器变化，重置到第一页
  watch([searchQuery, statusFilter], () => {
    if (searchQuery.value || statusFilter.value !== 'all') {
      // 本地过滤不需要重新请求
    } else {
      store.fetchUsers(1, pagination.value.pageSize);
    }
  });

  // 组件挂载时加载数据
  onMounted(() => {
    store.fetchUsers(props.initialPage || 1, props.pageSize || 10);
  });
</script>

<style scoped>
  .user-table table {
    border-collapse: separate;
    border-spacing: 0;
  }

  .user-table {
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