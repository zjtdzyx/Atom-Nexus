<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-textlight mb-8">凭证管理</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="stats-card">
        <h3 class="text-lg font-medium text-textlight mb-2">我的凭证</h3>
        <p class="text-3xl font-bold text-neon">{{ credentials.length }}</p>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-textlight mb-2">有效凭证</h3>
        <p class="text-3xl font-bold text-green-400">{{ activeCredentialsCount }}</p>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-textlight mb-2">已撤销/过期</h3>
        <p class="text-3xl font-bold text-red-400">{{ revokedOrExpiredCount }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-4">
        <input v-model="searchQuery" type="text" placeholder="搜索凭证..." class="form-input" />
        <select v-model="statusFilter" class="form-select">
          <option value="all">所有状态</option>
          <option value="active">有效</option>
          <option value="revoked">已撤销</option>
          <option value="expired">已过期</option>
        </select>
      </div>

      <div class="flex space-x-4">
        <router-link to="/credential/issue" class="btn-primary">
          <i class="fas fa-plus-circle mr-2"></i>颁发凭证
        </router-link>
        <router-link to="/credential/verify" class="btn-secondary">
          <i class="fas fa-check-circle mr-2"></i>验证凭证
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center my-10">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-500/20 p-4 rounded-lg text-red-400 mb-6">
      {{ error }}
    </div>

    <div v-else-if="filteredCredentials.length === 0" class="bg-primary/40 p-6 rounded-lg mb-8">
      <p class="text-textgray mb-4">暂无凭证记录</p>
      <p class="text-textgray">
        点击"颁发凭证"按钮创建新凭证，或者前往
        <router-link to="/credential/verify" class="text-neon hover:underline">验证凭证</router-link>
        页面验证已有凭证
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="credential in filteredCredentials" :key="credential.id" class="credential-card"
        @click="viewCredentialDetails(credential.id)">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-textlight">{{ credential.credentialSubject.name || "凭证 " +
            credential.id.substring(0, 8) }}</h3>
          <span :class="{
            'status-badge': true,
            'bg-green-500/20 text-green-400': credential.status === 'active',
            'bg-red-500/20 text-red-400': credential.status === 'revoked',
            'bg-yellow-500/20 text-yellow-400': credential.status === 'expired'
          }">
            {{ getStatusText(credential.status) }}
          </span>
        </div>

        <div class="credential-info">
          <p><span class="text-textgray">类型：</span>{{ credential.type.join(', ') }}</p>
          <p><span class="text-textgray">颁发者：</span>{{ credential.issuer }}</p>
          <p><span class="text-textgray">颁发日期：</span>{{ formatDate(credential.issuanceDate) }}</p>
          <p v-if="credential.expirationDate">
            <span class="text-textgray">过期日期：</span>{{ formatDate(credential.expirationDate) }}
          </p>
        </div>

        <div class="flex justify-end mt-4">
          <button class="btn-text">
            <i class="fas fa-arrow-right mr-1"></i>查看详情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCredentialStore } from '@/stores/credential';
  import type { Credential } from '@/types/credential';
  import { CredentialStatus } from '@/types/credential';
  import { logger } from '@/utils/logger';

  const router = useRouter();
  const credentialStore = useCredentialStore();

  // 状态
  const loading = computed(() => credentialStore.loading);
  const error = computed(() => credentialStore.error);
  const credentials = computed(() => credentialStore.credentials);
  const searchQuery = ref('');
  const statusFilter = ref('all');

  // 计算属性
  const activeCredentialsCount = computed(() =>
    credentialStore.getActiveCredentials.length
  );

  const revokedOrExpiredCount = computed(() =>
    credentialStore.getRevokedCredentials.length +
    credentialStore.getExpiredCredentials.length
  );

  const filteredCredentials = computed(() => {
    let result = credentials.value;

    // 按状态筛选
    if (statusFilter.value !== 'all') {
      result = result.filter(cred => cred.status === statusFilter.value);
    }

    // 按搜索关键词筛选
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(cred => {
        const name = cred.credentialSubject.name || '';
        const issuer = cred.issuer || '';
        const typeString = cred.type.join(' ');

        return name.toLowerCase().includes(query) ||
          issuer.toLowerCase().includes(query) ||
          typeString.toLowerCase().includes(query);
      });
    }

    return result;
  });

  // 方法
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case CredentialStatus.ACTIVE: return '有效';
      case CredentialStatus.REVOKED: return '已撤销';
      case CredentialStatus.EXPIRED: return '已过期';
      case CredentialStatus.SUSPENDED: return '已挂起';
      default: return status;
    }
  };

  const viewCredentialDetails = (id: string) => {
    logger.info('Component:CredentialCard', '查看凭证详情', { id });
    router.push(`/credential/${id}`);
  };

  // 生命周期钩子
  onMounted(async () => {
    logger.info('Page:Credential', '页面已加载');
    await credentialStore.fetchCredentials();
  });
</script>

<style scoped>
  .stats-card {
    @apply bg-primary/40 p-6 rounded-lg;
  }

  .credential-card {
    @apply bg-primary/40 p-6 rounded-lg cursor-pointer hover:bg-primary/60 transition-colors;
  }

  .credential-info {
    @apply space-y-2 mt-4;
  }

  .status-badge {
    @apply px-3 py-1 rounded-full text-xs font-medium;
  }

  .loading-spinner {
    @apply w-8 h-8 border-4 border-neon/30 border-t-neon rounded-full animate-spin;
  }

  .btn-text {
    @apply text-neon hover:text-neon/80 text-sm transition-colors;
  }
</style>
