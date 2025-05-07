<template>
  <div class="audit-log-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="i-carbon-circle-dash animate-spin text-3xl text-neon"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 my-4">
      <div class="flex items-center">
        <span class="i-carbon-warning-filled text-xl mr-2"></span>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- 日志列表 -->
    <div v-else-if="auditLogs.length > 0" class="space-y-4">
      <div v-for="log in auditLogs" :key="log.id"
        class="audit-log-item p-4 bg-primary/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all">

        <!-- 日志头部 -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center">
            <div class="rounded-full p-2 bg-neon/20 text-neon mr-3">
              <div class="i-carbon-activity text-lg"></div>
            </div>
            <div>
              <h4 class="font-medium text-textlight">{{ formatAction(log.action) }}</h4>
              <p class="text-sm text-textgray">{{ formatTimestamp(log.timestamp) }}</p>
            </div>
          </div>
          <div class="text-xs bg-gray-800 rounded-full px-2 py-0.5 text-textgray">
            ID: {{ formatId(log.id) }}
          </div>
        </div>

        <!-- 日志内容 -->
        <div class="mb-3 pl-11 space-y-1">
          <p class="text-sm">
            <span class="text-textgray">操作人：</span>
            <span class="text-textlight">{{ log.operatorName || formatDid(log.operator) }}</span>
          </p>
          <p class="text-sm">
            <span class="text-textgray">资源：</span>
            <span class="text-textlight">{{ formatResource(log.resource) }} ({{ formatId(log.resourceId) }})</span>
          </p>
          <p class="text-sm">
            <span class="text-textgray">目标DID：</span>
            <span class="text-textlight">{{ formatDid(log.targetDid) }}</span>
          </p>
        </div>

        <!-- 日志详情（如果有） -->
        <div v-if="log.details" class="text-sm pl-11 pt-2 border-t border-gray-800">
          <button @click="toggleDetails(log.id)" class="text-neon text-xs flex items-center">
            <span class="i-carbon-chevron-right text-sm mr-1"
              :class="{ 'transform rotate-90': expandedLogIds.includes(log.id) }"></span>
            {{ expandedLogIds.includes(log.id) ? '收起详情' : '查看详情' }}
          </button>
          <div v-if="expandedLogIds.includes(log.id)" class="mt-2 bg-gray-900/50 p-2 rounded text-textgray">
            <pre class="text-xs overflow-x-auto">{{ JSON.stringify(log.details, null, 2) }}</pre>
          </div>
        </div>

      </div>
    </div>

    <!-- 空状态 -->
    <div v-else
      class="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-dashed border-gray-700">
      <div class="i-carbon-document-blank text-4xl text-textgray mb-4"></div>
      <p class="text-textgray text-center">暂无审计日志记录</p>
    </div>

    <!-- 分页控件 -->
    <div v-if="total > 0" class="flex justify-between items-center mt-6 pt-4 border-t border-gray-800">
      <div class="text-sm text-textgray">
        总计 {{ total }} 条记录，当前 {{ currentPage }}/{{ Math.ceil(total / pageSize) }} 页
      </div>
      <div class="flex space-x-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"
          class="px-3 py-1 border border-gray-700 rounded-md text-sm text-textlight"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }">
          <span class="i-carbon-chevron-left"></span>
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= Math.ceil(total / pageSize)"
          class="px-3 py-1 border border-gray-700 rounded-md text-sm text-textlight"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage >= Math.ceil(total / pageSize) }">
          <span class="i-carbon-chevron-right"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
  import { usePermissionStore } from '../../stores/permission';
  import type { AuditLog } from '../../stores/permission';

  const props = defineProps<{
    initialPage?: number;
    pageSize?: number;
  }>();

  const emit = defineEmits<{
    (e: 'page-change', page: number): void;
  }>();

  const permissionStore = usePermissionStore();

  // 状态
  const loading = computed(() => permissionStore.isLoading);
  const error = computed(() => permissionStore.getError);
  const auditLogs = computed(() => permissionStore.getAuditLogs);
  const expandedLogIds = ref<string[]>([]);

  // 分页
  const currentPage = computed(() => permissionStore.getPagination.currentPage);
  const pageSize = computed(() => permissionStore.getPagination.pageSize);
  const total = computed(() => permissionStore.getPagination.total);

  // 切换详情显示
  const toggleDetails = (logId: string) => {
    if (expandedLogIds.value.includes(logId)) {
      expandedLogIds.value = expandedLogIds.value.filter(id => id !== logId);
    } else {
      expandedLogIds.value.push(logId);
    }
  };

  // 切换页面
  const changePage = (page: number) => {
    if (page < 1 || page > Math.ceil(total.value / pageSize.value)) {
      return;
    }

    fetchLogs(page);
    emit('page-change', page);
  };

  // 格式化操作类型
  const formatAction = (action: string): string => {
    const actionMap: Record<string, string> = {
      'create': '创建权限',
      'update': '更新权限',
      'revoke': '撤销权限',
      'grant': '授予权限',
      'view': '查看权限',
    };

    return actionMap[action] || action;
  };

  // 格式化资源类型
  const formatResource = (resource: string): string => {
    const resourceMap: Record<string, string> = {
      'credential': '凭证',
      'identity': '身份',
      'permission': '权限',
      'data': '数据',
    };

    return resourceMap[resource] || resource;
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 格式化DID，截断过长的DID
  const formatDid = (did: string): string => {
    if (!did) return '';
    if (did.length <= 25) return did;

    const start = did.substring(0, 15);
    const end = did.substring(did.length - 6);
    return `${start}...${end}`;
  };

  // 格式化ID，截断过长的ID
  const formatId = (id: string): string => {
    if (!id) return '';
    if (id.length <= 10) return id;

    return id.substring(0, 10) + '...';
  };

  // 获取日志数据
  const fetchLogs = async (page = 1) => {
    await permissionStore.fetchAuditLogs(page, props.pageSize || 10);
  };

  // 组件挂载时加载数据
  onMounted(() => {
    fetchLogs(props.initialPage || 1);
  });
</script>

<style scoped>
  .audit-log-item {
    transition: transform 0.2s ease-out;
  }

  .audit-log-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
</style>