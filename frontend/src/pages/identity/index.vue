<template>
  <div class="container mx-auto py-10 px-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-textlight">我的身份列表</h1>

      <button @click="showBindForm = true" class="btn-primary flex items-center">
        <div class="i-carbon-add mr-2"></div>
        绑定新身份
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="identityStore.loading" class="flex justify-center py-10">
      <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
    </div>

    <!-- 错误消息 -->
    <div v-else-if="identityStore.error" class="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
      <div class="flex items-center">
        <div class="i-carbon-warning-filled text-xl mr-2"></div>
        <p>{{ identityStore.error }}</p>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="identityStore.identities.length === 0" class="card p-8 text-center">
      <div class="i-carbon-user-profile text-5xl mx-auto mb-4 text-metal"></div>
      <h3 class="text-xl font-medium text-textlight mb-2">您还没有绑定任何身份</h3>
      <p class="text-textgray mb-6">通过创建或绑定DID开始使用Atom Nexus的身份管理功能</p>
      <div class="flex gap-4 justify-center">
        <button @click="showBindForm = true" class="btn-primary">绑定已有DID</button>
        <button @click="navigateToCreate" class="btn-secondary">创建新身份</button>
      </div>
    </div>

    <!-- 身份列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="identity in identityStore.identities" :key="identity.id"
        class="card p-5 hover:shadow-neon/20 hover:shadow-lg transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center">
            <div class="i-carbon-user-profile text-2xl text-neon mr-2"></div>
            <h3 class="text-lg font-medium text-textlight">{{ identity.type || '主要身份' }}</h3>
          </div>
          <div :class="{
            'bg-neon/20 text-neon': identity.status === 'active',
            'bg-orange-500/20 text-orange-400': identity.status === 'inactive',
            'bg-red-500/20 text-red-400': identity.status === 'revoked'
          }" class="px-2 py-1 text-xs rounded-full">
            {{
              identity.status === 'active' ? '活跃' :
                identity.status === 'inactive' ? '未激活' : '已撤销'
            }}
          </div>
        </div>

        <div class="text-xs font-mono bg-darkbg p-2 rounded mb-4 overflow-hidden text-textgray">
          {{ identity.did }}
        </div>

        <div class="flex justify-between items-center text-sm">
          <span class="text-textgray">创建于 {{ formatDate(identity.createdAt) }}</span>
          <div class="flex gap-2">
            <router-link :to="`/identity/${identity.id}`" class="text-neon hover:underline" @click="viewDetails(identity.id)">
              管理
            </router-link>
            <button @click="confirmDelete(identity)" class="text-red-400 hover:underline"
              v-if="identity.status !== 'revoked'">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 绑定DID表单对话框 -->
    <div v-if="showBindForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-primary p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-textlight">绑定已有DID</h3>
          <button @click="showBindForm = false" class="text-metal hover:text-textlight">
            <div class="i-carbon-close text-xl"></div>
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-textgray mb-2">DID 标识符</label>
          <input v-model="bindForm.did" placeholder="输入以did:开头的身份标识符"
            class="input w-full bg-darkbg text-textlight border-metal/20" />
          <p class="text-xs text-textgray mt-1">例如: did:key:z6MkvTPicF..., did:ethr:0x...</p>
          <div v-if="bindError" class="text-red-400 text-sm mt-2">{{ bindError }}</div>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showBindForm = false" class="btn-secondary">取消</button>
          <button @click="bindIdentity" class="btn-primary" :class="{ 'opacity-50 cursor-not-allowed': bindLoading }"
            :disabled="bindLoading">
            <span v-if="bindLoading" class="i-carbon-circle-dash animate-spin mr-2"></span>
            绑定
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-primary p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-textlight">确认删除</h3>
          <button @click="showDeleteConfirm = false" class="text-metal hover:text-textlight">
            <div class="i-carbon-close text-xl"></div>
          </button>
        </div>

        <p class="text-textgray mb-6">您确定要删除此身份吗？此操作无法撤销。</p>

        <div class="text-xs font-mono bg-darkbg p-2 rounded mb-6 overflow-hidden text-textgray">
          {{ identityToDelete?.did }}
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showDeleteConfirm = false" class="btn-secondary">取消</button>
          <button @click="deleteIdentity" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            :class="{ 'opacity-50 cursor-not-allowed': deleteLoading }" :disabled="deleteLoading">
            <span v-if="deleteLoading" class="i-carbon-circle-dash animate-spin mr-2"></span>
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIdentityStore } from '@/stores/identity';
  import type { Identity } from '@/types/identity';
  import { logger } from '@/utils/logger';

  const router = useRouter();
  const identityStore = useIdentityStore();

  // 绑定表单
  const showBindForm = ref(false);
  const bindForm = ref({ did: '' });
  const bindLoading = ref(false);
  const bindError = ref('');

  // 删除确认
  const showDeleteConfirm = ref(false);
  const identityToDelete = ref<Identity | null>(null);
  const deleteLoading = ref(false);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 导航到创建页面
  const navigateToCreate = () => {
    logger.info('Component:IdentityList', '点击创建新身份按钮');
    router.push('/identity/create');
  };
  
  // 查看身份详情
  const viewDetails = (id: string) => {
    logger.info('Component:IdentityList', '查看身份详情', { id });
  };

  // 绑定身份
  const bindIdentity = async () => {
    bindError.value = '';

    if (!bindForm.value.did) {
      bindError.value = 'DID不能为空';
      return;
    }

    if (!bindForm.value.did.startsWith('did:')) {
      bindError.value = 'DID必须以did:开头';
      return;
    }

    bindLoading.value = true;
    logger.info('Component:IdentityList', '开始绑定身份', { did: bindForm.value.did });

    try {
      await identityStore.bindIdentity(bindForm.value.did);
      showBindForm.value = false;
      bindForm.value.did = '';
      logger.info('Component:IdentityList', '身份绑定成功');
    } catch (err: any) {
      bindError.value = err.message || '绑定失败，请稍后重试';
      logger.error('Component:IdentityList', '身份绑定失败', { error: err.message });
    } finally {
      bindLoading.value = false;
    }
  };

  // 确认删除
  const confirmDelete = (identity: Identity) => {
    logger.info('Component:IdentityList', '打开删除确认框', { id: identity.id });
    identityToDelete.value = identity;
    showDeleteConfirm.value = true;
  };

  // 删除身份
  const deleteIdentity = async () => {
    if (!identityToDelete.value) return;

    deleteLoading.value = true;
    logger.info('Component:IdentityList', '确认删除身份', { id: identityToDelete.value.id });

    try {
      await identityStore.deleteIdentity(identityToDelete.value.id);
      showDeleteConfirm.value = false;
      identityToDelete.value = null;
      logger.info('Component:IdentityList', '身份删除成功');
    } catch (err: any) {
      // 错误已在store中处理
      logger.error('Component:IdentityList', '身份删除失败', { error: err.message });
    } finally {
      deleteLoading.value = false;
    }
  };

  // 组件挂载时获取身份列表
  onMounted(async () => {
    logger.info('Page:Identity', '页面已加载');
    if (identityStore.identities.length === 0) {
      logger.info('API:Identity', '开始请求身份列表');
      await identityStore.fetchIdentities();
      logger.info('API:Identity', '身份列表请求完成');
    }
  });
</script>

<style scoped>
  .card {
    @apply bg-primary/40 rounded-lg;
  }
</style>