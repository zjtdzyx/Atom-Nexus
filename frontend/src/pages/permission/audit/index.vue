<template>
  <div class="container mx-auto py-10 px-4">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center">
        <router-link to="/permission" class="text-metal hover:text-textlight mr-4">
          <div class="i-carbon-arrow-left text-2xl"></div>
        </router-link>
        <h1 class="text-3xl font-bold text-textlight">权限审计</h1>
      </div>
      <div>
        <button class="btn-primary" @click="refreshAuditLogs">
          <span class="i-carbon-refresh mr-2"></span>刷新
        </button>
      </div>
    </div>

    <!-- 使用审计日志列表组件 -->
    <AuditLogList :logs="auditLogs" :loading="loading" :error="error" @refresh="refreshAuditLogs" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { logger } from '../../../utils/logger';
  import AuditLogList from '../../../components/permission/AuditLogList.vue';
  import { fetchAuditLogs } from '../../../services/permission';

  const auditLogs = ref([]);
  const loading = ref(false);
  const error = ref('');

  // 页面加载时获取审计日志
  onMounted(() => {
    logger.info('Page:Permission:Audit', '权限审计页面已加载');
    refreshAuditLogs();
  });

  // 刷新审计日志
  const refreshAuditLogs = async () => {
    loading.value = true;
    error.value = '';

    try {
      const response = await fetchAuditLogs();
      auditLogs.value = response.data;
    } catch (err) {
      error.value = '获取审计日志失败，请稍后重试';
      logger.error('Page:Permission:Audit', '获取审计日志失败', err);
    } finally {
      loading.value = false;
    }
  };
</script>