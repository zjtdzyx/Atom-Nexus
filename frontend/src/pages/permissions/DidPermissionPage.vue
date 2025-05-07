<template>
  <div class="did-permission-page">
    <div class="page-header mb-6">
      <div class="flex items-center">
        <button @click="goBack" class="mr-3 text-textgray hover:text-textlight">
          <div class="i-carbon-arrow-left text-xl"></div>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-textlight">DID 权限详情</h1>
          <p class="text-textgray mt-1">查看与管理指定DID的权限配置</p>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 my-4">
      <div class="flex items-center">
        <span class="i-carbon-warning-filled text-2xl mr-3"></span>
        <div>
          <h3 class="font-medium text-red-300">加载失败</h3>
          <p>{{ error }}</p>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- DID信息卡片 -->
      <div class="did-info bg-primary/50 p-5 rounded-xl border border-gray-800 shadow-lg mb-6">
        <div class="flex items-center mb-4">
          <div class="rounded-full w-12 h-12 flex items-center justify-center bg-neon/20 mr-4">
            <div class="i-carbon-user-profile text-neon text-2xl"></div>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl font-semibold text-textlight">{{ formatDidName(didId) }}</h2>
            <p class="text-sm text-textgray break-all">{{ didId }}</p>
          </div>
          <div>
            <button class="btn-primary text-sm px-4 py-2" @click="addPermission">
              <span class="i-carbon-add mr-1"></span>添加权限
            </button>
          </div>
        </div>

        <!-- DID 标签和属性 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div class="bg-gray-800/50 p-3 rounded-lg">
            <div class="text-textgray">活跃权限</div>
            <div class="text-textlight text-lg font-medium">{{ activePermissions.length }}</div>
          </div>
          <div class="bg-gray-800/50 p-3 rounded-lg">
            <div class="text-textgray">已撤销权限</div>
            <div class="text-textlight text-lg font-medium">{{ revokedPermissions.length }}</div>
          </div>
          <div class="bg-gray-800/50 p-3 rounded-lg">
            <div class="text-textgray">已过期权限</div>
            <div class="text-textlight text-lg font-medium">{{ expiredPermissions.length }}</div>
          </div>
          <div class="bg-gray-800/50 p-3 rounded-lg">
            <div class="text-textgray">上次访问</div>
            <div class="text-textlight text-lg font-medium">{{ lastAccess || '无记录' }}</div>
          </div>
        </div>
      </div>

      <!-- 权限列表 -->
      <div v-if="didPermissions.length > 0" class="permissions-container">
        <!-- 标签页 -->
        <div class="flex border-b border-gray-800 mb-6">
          <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
            class="px-4 py-2 text-sm font-medium relative transition-colors"
            :class="activeTab === tab.value ? 'text-textlight' : 'text-textgray hover:text-textlight/80'">
            {{ tab.label }} {{ getTabCount(tab.value) }}
            <div v-if="activeTab === tab.value" class="absolute bottom-0 left-0 w-full h-0.5 bg-neon"></div>
          </button>
        </div>

        <!-- 权限卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="permission in filteredPermissions" :key="permission.id">
            <PermissionCard :permission="permission" @revoke="handleRevoke" />
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredPermissions.length === 0"
          class="empty-state flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-dashed border-gray-700">
          <div class="i-carbon-document-blank text-4xl text-textgray mb-4"></div>
          <p class="text-textgray text-center">当前状态下没有权限记录</p>
        </div>
      </div>

      <!-- 无权限状态 -->
      <div v-else
        class="empty-state flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-gray-700 bg-primary/50">
        <div class="i-carbon-security text-6xl text-textgray mb-6"></div>
        <h3 class="text-xl font-medium text-textlight mb-2">暂无权限配置</h3>
        <p class="text-textgray text-center max-w-md mb-6">该DID目前没有任何权限配置。您可以通过添加新权限来授予该DID访问您凭证的权限。</p>
        <button class="btn-primary px-6 py-2" @click="addPermission">
          <span class="i-carbon-add mr-2"></span>添加权限
        </button>
      </div>

      <!-- 确认撤销对话框 -->
      <div v-if="showRevokeDialog"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
        @click.self="showRevokeDialog = false">
        <div class="bg-primary p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
          <h3 class="text-xl font-semibold text-textlight mb-3">确认撤销权限</h3>
          <p class="text-textgray mb-4">您确定要撤销此权限吗？撤销后将无法恢复，需要重新授权。</p>

          <div class="flex justify-end space-x-3 pt-2">
            <button class="btn-secondary" @click="showRevokeDialog = false">
              取消
            </button>
            <button class="btn-danger" @click="confirmRevoke" :disabled="revokeLoading">
              <span v-if="revokeLoading" class="i-carbon-circle-dash animate-spin mr-2"></span>
              {{ revokeLoading ? '处理中...' : '确认撤销' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { usePermissionStore } from '../../stores/permission';
  import PermissionCard from '../../components/permission/PermissionCard.vue';
  import type { DidPermission } from '../../stores/permission';

  const router = useRouter();
  const route = useRoute();
  const permissionStore = usePermissionStore();

  // 获取DID参数
  const didId = computed(() => route.params.did as string);

  // 状态
  const loading = computed(() => permissionStore.isLoading);
  const error = computed(() => permissionStore.getError);
  const didPermissions = computed(() => permissionStore.getDidPermissions);
  const activeTab = ref('active');
  const lastAccess = ref<string | null>(null);

  // 撤销对话框
  const showRevokeDialog = ref(false);
  const permissionToRevoke = ref<string | null>(null);
  const revokeLoading = ref(false);

  // 标签页
  const tabs = [
    { label: '活跃', value: 'active' },
    { label: '已撤销', value: 'revoked' },
    { label: '已过期', value: 'expired' },
    { label: '全部', value: 'all' },
  ];

  // 过滤的权限
  const filteredPermissions = computed(() => {
    if (activeTab.value === 'all') {
      return didPermissions.value;
    }
    return didPermissions.value.filter(permission => permission.status === activeTab.value);
  });

  // 按状态分类的权限
  const activePermissions = computed(() => {
    return didPermissions.value.filter(permission => permission.status === 'active');
  });

  const revokedPermissions = computed(() => {
    return didPermissions.value.filter(permission => permission.status === 'revoked');
  });

  const expiredPermissions = computed(() => {
    return didPermissions.value.filter(permission => permission.status === 'expired');
  });

  // 获取标签数量
  const getTabCount = (tab: string): string => {
    if (tab === 'active') return `(${activePermissions.value.length})`;
    if (tab === 'revoked') return `(${revokedPermissions.value.length})`;
    if (tab === 'expired') return `(${expiredPermissions.value.length})`;
    if (tab === 'all') return `(${didPermissions.value.length})`;
    return '';
  };

  // 格式化DID显示名称
  const formatDidName = (did: string): string => {
    if (!did) return '未知DID';

    // 示例：从did:example:123456789abcdef提取123456789abcdef部分作为名称
    const parts = did.split(':');
    if (parts.length >= 3) {
      const id = parts[parts.length - 1];
      return `DID ${id.substring(0, 8)}...`;
    }

    return `DID ${did.substring(0, 10)}...`;
  };

  // 返回上一页
  const goBack = () => {
    router.back();
  };

  // 添加权限
  const addPermission = () => {
    router.push(`/permissions/set?targetDid=${encodeURIComponent(didId.value)}`);
  };

  // 处理撤销
  const handleRevoke = (permissionId: string) => {
    permissionToRevoke.value = permissionId;
    showRevokeDialog.value = true;
  };

  // 确认撤销
  const confirmRevoke = async () => {
    if (!permissionToRevoke.value) return;

    revokeLoading.value = true;

    try {
      await permissionStore.revokePermission(permissionToRevoke.value);
      showRevokeDialog.value = false;

      // 刷新权限列表
      await permissionStore.fetchDidPermissions(didId.value);
    } catch (error) {
      console.error('撤销权限失败', error);
    } finally {
      revokeLoading.value = false;
    }
  };

  // 获取最后访问时间
  const fetchLastAccess = async () => {
    // 这里应该调用API获取最后访问时间
    // 暂时使用模拟数据
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() - 2);
    lastAccess.value = mockDate.toLocaleDateString('zh-CN');
  };

  // 监听DID变化
  watch(didId, () => {
    if (didId.value) {
      permissionStore.fetchDidPermissions(didId.value);
      fetchLastAccess();
    }
  });

  onMounted(() => {
    if (didId.value) {
      permissionStore.fetchDidPermissions(didId.value);
      fetchLastAccess();
    }
  });
</script>

<style scoped>
  .did-permission-page {
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

  .btn-danger {
    @apply bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 rounded-lg transition-colors;
  }
</style>