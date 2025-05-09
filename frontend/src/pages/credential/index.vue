<template>
  <div class="credential-manager">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header py-8">
      <div class="container">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-textlight mb-2">凭证管理</h1>
            <p class="text-textgray">管理您的可验证凭证（VC）</p>
          </div>
          <div class="flex space-x-4">
            <button class="btn-secondary" @click="navigateToVerify">
              <span class="i-carbon-certificate-check mr-1"></span>验证凭证
            </button>
            <button class="btn-primary" @click="navigateToIssue">
              <span class="i-carbon-add mr-1"></span>颁发凭证
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container py-6">
      <!-- 加载状态 -->
      <div v-if="credentialStore.isLoading" class="flex justify-center py-12">
        <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="credentialStore.error" class="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
        <p>{{ credentialStore.error }}</p>
        <button class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" @click="fetchCredentials">
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="credentialStore.credentials.length === 0" class="empty-state text-center py-16">
        <div class="i-carbon-certificate text-6xl text-textgray mx-auto mb-4"></div>
        <h3 class="text-xl font-medium text-textlight mb-2">您还没有凭证</h3>
        <p class="text-textgray mb-6">颁发或接收凭证以开始使用</p>
        <div class="flex justify-center space-x-4">
          <button class="btn-secondary" @click="navigateToVerify">
            验证凭证
          </button>
          <button class="btn-primary" @click="navigateToIssue">
            颁发凭证
          </button>
        </div>
      </div>

      <!-- 凭证列表 -->
      <template v-else>
        <!-- 过滤器 -->
        <div class="filters mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="search-box relative col-span-2">
              <input v-model="searchQuery" type="text" placeholder="搜索凭证..." class="input pr-10 w-full"
                @input="updateSearchFilter">
              <span class="i-carbon-search absolute right-3 top-1/2 transform -translate-y-1/2 text-textgray"></span>
            </div>
            <div class="status-filter">
              <select v-model="statusFilter" class="input w-full" @change="updateStatusFilter">
                <option value="all">所有状态</option>
                <option value="valid">有效</option>
                <option value="expired">已过期</option>
                <option value="revoked">已撤销</option>
              </select>
            </div>
            <div class="type-filter">
              <select v-model="typeFilter" class="input w-full" @change="updateTypeFilter">
                <option value="">所有类型</option>
                <option v-for="type in credentialTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 当前过滤器标签 -->
        <div v-if="hasActiveFilters" class="active-filters mb-4 flex flex-wrap gap-2">
          <div v-if="searchQuery"
            class="filter-tag bg-primary/60 text-textlight text-sm px-3 py-1 rounded-full flex items-center">
            搜索: {{ searchQuery }}
            <button @click="clearSearchFilter" class="ml-2 text-textgray hover:text-white">
              <span class="i-carbon-close"></span>
            </button>
          </div>
          <div v-if="statusFilter !== 'all'"
            class="filter-tag bg-primary/60 text-textlight text-sm px-3 py-1 rounded-full flex items-center">
            状态: {{ getStatusLabel(statusFilter) }}
            <button @click="clearStatusFilter" class="ml-2 text-textgray hover:text-white">
              <span class="i-carbon-close"></span>
            </button>
          </div>
          <div v-if="typeFilter"
            class="filter-tag bg-primary/60 text-textlight text-sm px-3 py-1 rounded-full flex items-center">
            类型: {{ typeFilter }}
            <button @click="clearTypeFilter" class="ml-2 text-textgray hover:text-white">
              <span class="i-carbon-close"></span>
            </button>
          </div>
          <button v-if="hasActiveFilters" @click="clearAllFilters" class="text-neon text-sm hover:underline ml-2">
            清除所有
          </button>
        </div>

        <!-- 凭证卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="credential in credentialStore.filteredCredentials" :key="credential.id"
            class="credential-card card hover:bg-primary/30 hover:border-neon/50 transition-all duration-200 overflow-hidden">
            <!-- 凭证卡片头部 -->
            <div class="card-header relative">
              <div class="credential-banner h-24 w-full bg-gradient-to-r from-violet/50 to-neon/50" :class="{
                'from-green-500/30 to-green-500/10': credential.status === 'valid',
                'from-yellow-500/30 to-yellow-500/10': credential.status === 'expired',
                'from-red-500/30 to-red-500/10': credential.status === 'revoked'
              }">
                <div class="absolute top-3 right-3">
                  <span class="px-2 py-1 text-xs rounded-full bg-primary/80" :class="{
                    'text-green-500': credential.status === 'valid',
                    'text-yellow-500': credential.status === 'expired',
                    'text-red-500': credential.status === 'revoked'
                  }">
                    {{ credential.status === 'valid' ? '有效' : credential.status === 'expired' ? '已过期' : '已撤销' }}
                  </span>
                </div>
              </div>

              <!-- 凭证图标/图片 -->
              <div class="credential-icon absolute -bottom-8 left-6">
                <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-primary">
                  <span v-if="!credential.metadata?.image" class="i-carbon-certificate text-3xl text-neon"></span>
                  <img v-else :src="credential.metadata.image" class="w-full h-full object-cover rounded-full"
                    alt="凭证图标" />
                </div>
              </div>
            </div>

            <!-- 凭证内容 -->
            <div class="card-content p-6 pt-10">
              <h3 class="text-lg font-semibold text-textlight mb-1">
                {{ credential.metadata?.name || getCredentialTypeName(credential) }}
              </h3>
              <p class="text-textgray text-sm mb-4">
                由 {{ formatIssuer(credential.issuer) }} 颁发
              </p>

              <!-- 凭证详情 -->
              <div class="mb-4">
                <div class="text-xs text-textgray mb-1">凭证类型</div>
                <div class="text-sm text-textlight">{{ getCredentialTypeName(credential) }}</div>
              </div>

              <div class="mb-4">
                <div class="text-xs text-textgray mb-1">颁发日期</div>
                <div class="text-sm text-textlight">{{ formatDate(credential.issuanceDate) }}</div>
              </div>

              <div v-if="credential.expirationDate" class="mb-4">
                <div class="text-xs text-textgray mb-1">到期日期</div>
                <div class="text-sm" :class="{
                  'text-textlight': credential.status === 'valid',
                  'text-yellow-500': credential.status === 'expired'
                }">
                  {{ formatDate(credential.expirationDate) }}
                </div>
              </div>

              <!-- 凭证操作 -->
              <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                <router-link :to="`/credential/${credential.id}`" class="text-neon hover:underline text-sm">
                  查看详情
                </router-link>
                <div class="flex gap-2">
                  <button @click="shareCredential(credential)" class="text-textgray hover:text-neon p-1">
                    <span class="i-carbon-share"></span>
                  </button>
                  <button @click="verifyCredential(credential)" class="text-textgray hover:text-neon p-1">
                    <span class="i-carbon-certificate-check"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCredentialStore, type Credential } from '../../stores/credential';
  import { logger } from '../../utils/logger';

  // 初始化路由和存储
  const router = useRouter();
  const credentialStore = useCredentialStore();

  // 本地状态（过滤器）
  const searchQuery = ref('');
  const statusFilter = ref('all');
  const typeFilter = ref('');

  // 计算属性
  const hasActiveFilters = computed(() => {
    return searchQuery.value || statusFilter.value !== 'all' || typeFilter.value;
  });

  // 从凭证中提取所有可用的类型
  const credentialTypes = computed(() => {
    const types = new Set<string>();

    credentialStore.credentials.forEach(cred => {
      cred.type.forEach(type => {
        // 从完整类型URI中提取最后一部分作为类型名
        const typeName = type.split('/').pop()?.split('#').pop() || type;
        if (typeName !== 'VerifiableCredential') { // 排除通用类型
          types.add(typeName);
        }
      });
    });

    return Array.from(types).sort();
  });

  // 页面加载时获取凭证列表
  onMounted(() => {
    logger.info('Page:Credential', '凭证管理页面已加载');
    fetchCredentials();
  });

  // 获取凭证列表
  const fetchCredentials = async () => {
    await credentialStore.fetchCredentials();
  };

  // 更新搜索过滤器
  const updateSearchFilter = () => {
    credentialStore.setFilter({ searchQuery: searchQuery.value });
  };

  // 更新状态过滤器
  const updateStatusFilter = () => {
    credentialStore.setFilter({
      status: statusFilter.value === 'all' ? 'all' : statusFilter.value as any
    });
  };

  // 更新类型过滤器
  const updateTypeFilter = () => {
    credentialStore.setFilter({ type: typeFilter.value });
  };

  // 清除搜索过滤器
  const clearSearchFilter = () => {
    searchQuery.value = '';
    credentialStore.setFilter({ searchQuery: '' });
  };

  // 清除状态过滤器
  const clearStatusFilter = () => {
    statusFilter.value = 'all';
    credentialStore.setFilter({ status: 'all' });
  };

  // 清除类型过滤器
  const clearTypeFilter = () => {
    typeFilter.value = '';
    credentialStore.setFilter({ type: undefined });
  };

  // 清除所有过滤器
  const clearAllFilters = () => {
    searchQuery.value = '';
    statusFilter.value = 'all';
    typeFilter.value = '';
    credentialStore.resetFilters();
  };

  // 获取状态显示名称
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'valid': '有效',
      'expired': '已过期',
      'revoked': '已撤销',
    };
    return statusMap[status] || status;
  };

  // 分享凭证
  const shareCredential = (credential: Credential) => {
    logger.info('Page:Credential', '分享凭证', { id: credential.id });
    // 实现分享逻辑（将在后续开发）
    alert('分享功能开发中...');
  };

  // 验证凭证
  const verifyCredential = (credential: Credential) => {
    logger.info('Page:Credential', '验证凭证', { id: credential.id });
    router.push(`/credential/verify?id=${credential.id}`);
  };

  // 导航到颁发页面
  const navigateToIssue = () => {
    logger.info('Page:Credential', '导航到颁发凭证页面');
    router.push('/credential/issue');
  };

  // 导航到验证页面
  const navigateToVerify = () => {
    logger.info('Page:Credential', '导航到验证凭证页面');
    router.push('/credential/verify');
  };

  // 格式化日期
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '永久有效';

    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 格式化发行者
  const formatIssuer = (issuer: string): string => {
    // 如果是DID，提取最后一部分
    if (issuer.startsWith('did:')) {
      const parts = issuer.split(':');
      // 返回前10个字符+...
      return `${parts[0]}:${parts[1]}:${parts[2].substring(0, 10)}...`;
    }
    return issuer;
  };

  // 获取凭证类型名称
  const getCredentialTypeName = (credential: Credential): string => {
    // 取最后一个类型作为主类型（跳过 VerifiableCredential）
    const types = credential.type.filter(t => t !== 'VerifiableCredential');
    if (types.length === 0) return 'VerifiableCredential';

    // 从完整类型URI中提取类型名
    const lastType = types[types.length - 1];
    return lastType.split('/').pop()?.split('#').pop() || lastType;
  };
</script>

<style scoped>
  .credential-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
