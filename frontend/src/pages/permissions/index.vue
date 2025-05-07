<template>
  <div class="permissions-home-page">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-textlight">权限管理</h1>
      <p class="text-textgray mt-2">管理您的凭证授权和DID权限设置</p>
    </div>

    <!-- 功能卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 设置权限卡片 -->
      <div class="feature-card hover:transform hover:-translate-y-2 transition-all duration-300"
        @click="router.push('/permissions/set')">
        <div class="rounded-full w-12 h-12 flex items-center justify-center bg-neon/20 mb-4">
          <div class="i-carbon-security text-neon text-2xl"></div>
        </div>
        <h2 class="text-xl font-semibold text-textlight mb-2">权限设置</h2>
        <p class="text-textgray mb-4">为您的凭证设置访问权限，管理授权类型和范围</p>
        <button class="btn-primary text-sm px-4 py-2 w-full">
          <span class="i-carbon-arrow-right mr-1"></span>进入设置
        </button>
      </div>

      <!-- 审计日志卡片 -->
      <div class="feature-card hover:transform hover:-translate-y-2 transition-all duration-300"
        @click="router.push('/permissions/audit')">
        <div class="rounded-full w-12 h-12 flex items-center justify-center bg-neon/20 mb-4">
          <div class="i-carbon-activity text-neon text-2xl"></div>
        </div>
        <h2 class="text-xl font-semibold text-textlight mb-2">权限审计</h2>
        <p class="text-textgray mb-4">查看权限变更历史和操作日志，监控权限使用情况</p>
        <button class="btn-primary text-sm px-4 py-2 w-full">
          <span class="i-carbon-arrow-right mr-1"></span>查看日志
        </button>
      </div>

      <!-- DID权限卡片 -->
      <div class="feature-card hover:transform hover:-translate-y-2 transition-all duration-300">
        <div class="rounded-full w-12 h-12 flex items-center justify-center bg-neon/20 mb-4">
          <div class="i-carbon-user-profile text-neon text-2xl"></div>
        </div>
        <h2 class="text-xl font-semibold text-textlight mb-2">DID权限管理</h2>
        <p class="text-textgray mb-4">搜索并管理特定DID的权限设置和授权记录</p>

        <!-- DID搜索表单 -->
        <div class="relative mb-4">
          <input v-model="searchDid" type="text" placeholder="输入需要查询的DID..."
            class="w-full px-4 py-2 pr-10 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50 text-sm"
            @keyup.enter="searchDidPermissions" />
          <div class="absolute right-3 top-2.5 text-textgray cursor-pointer" @click="searchDidPermissions">
            <div class="i-carbon-search text-lg"></div>
          </div>
        </div>

        <button class="btn-primary text-sm px-4 py-2 w-full" @click="searchDidPermissions" :disabled="!isValidDid">
          <span class="i-carbon-arrow-right mr-1"></span>查询DID权限
        </button>
      </div>
    </div>

    <!-- 最近授权记录 -->
    <div class="mt-10">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-textlight">最近授权记录</h2>
        <button class="btn-secondary text-xs px-3 py-1.5" @click="refreshRecentLogs">
          <span class="i-carbon-refresh mr-1"></span>刷新
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="i-carbon-circle-dash animate-spin text-3xl text-neon"></div>
      </div>

      <!-- 最近日志列表 -->
      <div v-else-if="recentLogs.length > 0" class="space-y-4">
        <div v-for="log in recentLogs" :key="log.id"
          class="log-item p-4 bg-primary/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all">

          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="rounded-full p-2 bg-neon/20 text-neon mr-3">
                <div class="i-carbon-activity text-lg"></div>
              </div>
              <div>
                <h4 class="font-medium text-textlight">{{ formatAction(log.action) }}</h4>
                <p class="text-sm text-textgray">{{ formatTimestamp(log.timestamp) }}</p>
              </div>
            </div>
            <button class="text-neon text-sm hover:underline" @click="router.push(`/permissions/${log.targetDid}`)">
              查看详情
            </button>
          </div>

          <div class="mt-3 ml-11 text-sm">
            <p>
              <span class="text-textgray">目标DID：</span>
              <span class="text-textlight">{{ formatDid(log.targetDid) }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else
        class="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-dashed border-gray-700">
        <div class="i-carbon-document-blank text-4xl text-textgray mb-4"></div>
        <p class="text-textgray text-center">暂无授权记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePermissionStore } from '../../stores/permission';
  import type { AuditLog } from '../../stores/permission';

  const router = useRouter();
  const permissionStore = usePermissionStore();

  // 搜索DID
  const searchDid = ref('');
  const isValidDid = computed(() => {
    return searchDid.value && searchDid.value.startsWith('did:');
  });

  // 最近日志
  const recentLogs = ref<AuditLog[]>([]);
  const loading = ref(false);

  // 搜索DID权限
  const searchDidPermissions = () => {
    if (!isValidDid.value) return;

    router.push(`/permissions/${searchDid.value}`);
  };

  // 获取最近日志
  const fetchRecentLogs = async () => {
    loading.value = true;

    try {
      await permissionStore.fetchAuditLogs(1, 5);
      recentLogs.value = permissionStore.getAuditLogs;
    } catch (error) {
      console.error('获取最近日志失败', error);
    } finally {
      loading.value = false;
    }
  };

  // 刷新最近日志
  const refreshRecentLogs = () => {
    fetchRecentLogs();
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

  // 格式化时间戳
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
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

  onMounted(() => {
    fetchRecentLogs();
  });
</script>

<style scoped>
  .permissions-home-page {
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

  .feature-card {
    background-color: rgba(30, 30, 47, 0.5);
    backdrop-filter: blur(8px);
    border-radius: 1rem;
    border: 1px solid rgba(60, 60, 80, 0.5);
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  .feature-card:hover {
    border-color: rgba(100, 100, 120, 0.5);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }

  .log-item {
    transition: transform 0.2s ease-out;
  }

  .log-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
</style>