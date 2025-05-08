<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-2xl font-bold mb-6">登录历史</h1>
    <p class="mb-6">查看您的身份登录历史记录和活动日志，以保障账户安全。</p>

    <div v-if="identityStore.loading" class="flex justify-center py-10">
      <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
    </div>

    <div v-else-if="identityStore.error" class="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
      <div class="flex items-center">
        <div class="i-carbon-warning-filled text-xl mr-2"></div>
        <p>{{ identityStore.error }}</p>
      </div>
    </div>

    <div v-else-if="identityStore.loginHistory.length === 0" class="card p-8 text-center">
      <div class="i-carbon-login text-5xl mx-auto mb-4 text-metal"></div>
      <h3 class="text-xl font-medium text-textlight mb-2">暂无登录记录</h3>
      <p class="text-textgray">此身份尚未有任何登录活动记录</p>
    </div>

    <template v-else>
      <div class="card overflow-hidden mb-6">
        <table class="w-full">
          <thead class="bg-primary/40">
            <tr>
              <th class="py-3 px-4 text-left text-textgray font-medium">时间</th>
              <th class="py-3 px-4 text-left text-textgray font-medium">IP地址</th>
              <th class="py-3 px-4 text-left text-textgray font-medium">位置</th>
              <th class="py-3 px-4 text-left text-textgray font-medium">设备</th>
              <th class="py-3 px-4 text-left text-textgray font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in identityStore.loginHistory" :key="record.id"
              class="border-t border-metal/10 hover:bg-primary/20">
              <td class="py-3 px-4 text-textlight">{{ formatDate(record.loginTime) }}</td>
              <td class="py-3 px-4 text-textlight font-mono text-sm">{{ record.ipAddress }}</td>
              <td class="py-3 px-4 text-textlight">{{ record.location || '未知位置' }}</td>
              <td class="py-3 px-4 text-textlight text-sm truncate max-w-xs">{{ formatUserAgent(record.userAgent) }}
              </td>
              <td class="py-3 px-4">
                <span :class="{
                  'bg-neon/20 text-neon': record.status === 'success',
                  'bg-red-500/20 text-red-400': record.status === 'failed'
                }" class="px-2 py-1 text-xs rounded-full">
                  {{ record.status === 'success' ? '成功' : '失败' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center">
        <div class="text-sm text-textgray">
          共 {{ identityStore.loginHistory.length }} 条记录
        </div>

        <div class="flex items-center gap-2">
          <button @click="refreshHistory" class="btn-secondary flex items-center">
            <div class="i-carbon-refresh mr-2"></div>
            刷新
          </button>

          <button @click="exportHistory" class="btn-secondary flex items-center">
            <div class="i-carbon-export mr-2"></div>
            导出
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useIdentityStore } from '@/stores/identity';

  const route = useRoute();
  const identityStore = useIdentityStore();

  const identityId = computed(() => route.query.id as string || identityStore.currentIdentity?.id);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 格式化UserAgent
  const formatUserAgent = (ua: string) => {
    // 简单格式化，实际项目中可能需要更复杂的解析
    if (!ua) return '未知设备';

    const isMobile = /mobile/i.test(ua);
    const isChrome = /chrome/i.test(ua);
    const isFirefox = /firefox/i.test(ua);
    const isSafari = /safari/i.test(ua);
    const isEdge = /edge/i.test(ua);

    let browser = '未知浏览器';
    if (isEdge) browser = 'Edge';
    else if (isChrome) browser = 'Chrome';
    else if (isFirefox) browser = 'Firefox';
    else if (isSafari) browser = 'Safari';

    return `${isMobile ? '移动端' : '桌面端'} ${browser}`;
  };

  // 刷新历史记录
  const refreshHistory = async () => {
    if (!identityId.value) return;
    await identityStore.fetchLoginHistory(identityId.value);
  };

  // 导出历史记录
  const exportHistory = () => {
    if (identityStore.loginHistory.length === 0) return;

    const data = JSON.stringify(identityStore.loginHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `login-history-${identityId.value}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  // 加载登录历史数据
  onMounted(async () => {
    if (identityId.value) {
      await identityStore.fetchLoginHistory(identityId.value);
    }
  });
</script>

<style scoped>
  .login-history-page {
    padding: 1.5rem;
  }
</style>