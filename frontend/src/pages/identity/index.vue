<template>
  <div class="identity-manager">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header py-8">
      <div class="container">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-textlight mb-2">身份管理</h1>
            <p class="text-textgray">管理您的数字身份和DID</p>
          </div>
          <div class="flex space-x-4">
            <button class="btn-secondary" @click="openBindModal">
              <span class="i-carbon-add-alt mr-1"></span>绑定DID
            </button>
            <button class="btn-primary" @click="navigateToCreate">
              <span class="i-carbon-add mr-1"></span>创建新身份
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container py-6">
      <!-- 加载状态 -->
      <div v-if="identityStore.loading" class="flex justify-center py-12">
        <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="identityStore.error" class="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
        <p>{{ identityStore.error }}</p>
        <button class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" @click="identityStore.fetchIdentities">
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="identityStore.identities.length === 0" class="empty-state text-center py-16">
        <div class="i-carbon-identification text-6xl text-textgray mx-auto mb-4"></div>
        <h3 class="text-xl font-medium text-textlight mb-2">您还没有数字身份</h3>
        <p class="text-textgray mb-6">创建或绑定DID以开始使用Atom Nexus</p>
        <div class="flex justify-center space-x-4">
          <button class="btn-secondary" @click="openBindModal">
            绑定DID
          </button>
          <button class="btn-primary" @click="navigateToCreate">
            创建新身份
          </button>
        </div>
      </div>

      <!-- 身份列表 -->
      <div v-else class="identity-list">
        <!-- 列表筛选 -->
        <div class="filters flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <div class="search-box relative">
              <input v-model="searchQuery" type="text" placeholder="搜索身份..." class="input pr-10">
              <span class="i-carbon-search absolute right-3 top-1/2 transform -translate-y-1/2 text-textgray"></span>
            </div>
            <div class="filter-dropdown">
              <select v-model="statusFilter" class="input">
                <option value="all">所有状态</option>
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
                <option value="revoked">已撤销</option>
              </select>
            </div>
          </div>
          <div class="sort-dropdown">
            <select v-model="sortOrder" class="input">
              <option value="newest">最新创建</option>
              <option value="oldest">最早创建</option>
              <option value="az">名称 A-Z</option>
              <option value="za">名称 Z-A</option>
            </select>
          </div>
        </div>

        <!-- 身份列表内容 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="identity in filteredIdentities" :key="identity.id">
            <IdentityCard :identity="identity" :is-default="identity.isDefault" @view="navigateToIdentity(identity.id)"
              @toggle-dropdown="toggleDropdown(identity.id)" @set-default="setAsDefault(identity)"
              @activate="activateIdentity(identity)" @deactivate="deactivateIdentity(identity)"
              @delete="confirmDelete(identity)" />
            <!-- 下拉菜单 -->
            <div v-if="openDropdown === identity.id" class="dropdown absolute z-10 rounded-lg shadow-lg p-2 bg-primary">
              <ul>
                <li>
                  <router-link :to="`/identity/${identity.id}`" class="dropdown-item">
                    <span class="i-carbon-view mr-2"></span>查看详情
                  </router-link>
                </li>
                <li v-if="!identity.isDefault">
                  <button class="dropdown-item" @click="setAsDefault(identity)">
                    <span class="i-carbon-star mr-2"></span>设为默认
                  </button>
                </li>
                <li v-if="identity.status === 'active'">
                  <button class="dropdown-item text-yellow-500" @click="deactivateIdentity(identity)">
                    <span class="i-carbon-pause mr-2"></span>停用
                  </button>
                </li>
                <li v-else-if="identity.status === 'inactive'">
                  <button class="dropdown-item text-green-500" @click="activateIdentity(identity)">
                    <span class="i-carbon-play mr-2"></span>激活
                  </button>
                </li>
                <li>
                  <button class="dropdown-item text-red-500" @click="confirmDelete(identity)">
                    <span class="i-carbon-trash-can mr-2"></span>删除
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 绑定DID Modal -->
    <div v-if="showBindModal" class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-md m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-textlight">绑定DID</h3>
        </div>
        <div class="modal-body p-6">
          <form @submit.prevent="bindDid">
            <div class="mb-4">
              <label class="block text-textlight mb-2">DID标识符</label>
              <input v-model="bindForm.did" type="text" placeholder="did:ethr:0x..." class="input w-full"
                :class="{ 'border-red-500': bindFormErrors.did }">
              <p v-if="bindFormErrors.did" class="text-red-500 text-xs mt-1">{{ bindFormErrors.did }}</p>
            </div>
            <div class="mb-6">
              <label class="block text-textlight mb-2">别名</label>
              <input v-model="bindForm.alias" type="text" placeholder="可选的身份名称" class="input w-full">
            </div>
            <div class="flex justify-end space-x-4">
              <button type="button" class="btn-secondary" @click="closeBindModal">取消</button>
              <button type="submit" class="btn-primary" :disabled="bindFormProcessing">
                <span v-if="bindFormProcessing" class="i-carbon-circle-dash animate-spin mr-2"></span>
                绑定
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm"
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-md m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-textlight">确认删除</h3>
        </div>
        <div class="modal-body p-6">
          <p class="text-textgray mb-6">您确定要删除身份 <span class="text-neon">{{ identityToDelete?.alias }}</span> 吗？此操作不可撤销。
          </p>
          <div class="flex justify-end space-x-4">
            <button class="btn-secondary" @click="cancelDelete">取消</button>
            <button class="btn-primary bg-red-500 hover:bg-red-600" @click="deleteIdentity">
              <span v-if="deleteProcessing" class="i-carbon-circle-dash animate-spin mr-2"></span>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIdentityStore, } from '../../stores/identity';
  import { type Identity, IdentityStatus } from '../../types/identity';
  import { logger } from '../../utils/logger';
  import IdentityCard from '../../components/identity/IdentityCard.vue';

  // 初始化路由和存储
  const router = useRouter();
  const identityStore = useIdentityStore();

  // 页面加载日志
  onMounted(() => {
    logger.info('Page:Identity', '身份管理页面已加载');
    fetchIdentities();
  });

  // 获取身份列表
  const fetchIdentities = async () => {
    await identityStore.fetchIdentities();
  };

  // 搜索和过滤设置
  const searchQuery = ref('');
  const statusFilter = ref('all');
  const sortOrder = ref('newest');
  const openDropdown = ref<string | null>(null);

  // 绑定DID相关状态
  const showBindModal = ref(false);
  const bindForm = ref({
    did: '',
    alias: '',
  });
  const bindFormErrors = ref({
    did: '',
  });
  const bindFormProcessing = ref(false);

  // 删除身份相关状态
  const showDeleteConfirm = ref(false);
  const identityToDelete = ref<Identity | null>(null);
  const deleteProcessing = ref(false);

  // 过滤和排序后的身份列表
  const filteredIdentities = computed(() => {
    let result = [...identityStore.identities];

    // 应用搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(identity =>
        identity.alias.toLowerCase().includes(query) ||
        identity.did.toLowerCase().includes(query)
      );
    }

    // 应用状态过滤
    if (statusFilter.value !== 'all') {
      result = result.filter(identity => identity.status === statusFilter.value);
    }

    // 应用排序
    switch (sortOrder.value) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'az':
        result.sort((a, b) => a.alias.localeCompare(b.alias));
        break;
      case 'za':
        result.sort((a, b) => b.alias.localeCompare(a.alias));
        break;
    }

    return result;
  });

  // 页面点击事件 - 关闭打开的下拉菜单
  watch(() => openDropdown.value, (newVal) => {
    if (newVal) {
      const closeDropdown = (e: MouseEvent) => {
        openDropdown.value = null;
        document.removeEventListener('click', closeDropdown);
      };

      setTimeout(() => {
        document.addEventListener('click', closeDropdown);
      }, 0);
    }
  });

  // 切换下拉菜单
  const toggleDropdown = (id: string) => {
    if (openDropdown.value === id) {
      openDropdown.value = null;
    } else {
      openDropdown.value = id;
    }
  };

  // 导航到创建页面
  const navigateToCreate = () => {
    logger.info('Page:Identity', '导航到创建身份页面');
    router.push('/identity/create');
  };

  // 导航到身份详情页
  const navigateToIdentity = (id: string) => {
    logger.info('Page:Identity', '导航到身份详情页', { id });
    router.push(`/identity/${id}`);
  };

  // 打开绑定DID模态框
  const openBindModal = () => {
    showBindModal.value = true;
    bindForm.value = { did: '', alias: '' };
    bindFormErrors.value = { did: '' };
  };

  // 关闭绑定DID模态框
  const closeBindModal = () => {
    showBindModal.value = false;
  };

  // 绑定DID
  const bindDid = async () => {
    logger.info('Page:Identity', '绑定DID表单提交', { data: bindForm.value });

    // 重置错误
    bindFormErrors.value = { did: '' };

    // 验证DID格式
    if (!bindForm.value.did) {
      bindFormErrors.value.did = 'DID不能为空';
      return;
    }

    if (!bindForm.value.did.startsWith('did:')) {
      bindFormErrors.value.did = 'DID格式不正确，应以"did:"开头';
      return;
    }

    // 设置默认别名（如果用户未提供）
    if (!bindForm.value.alias) {
      bindForm.value.alias = `身份 ${identityStore.identities.length + 1}`;
    }

    // 处理绑定
    bindFormProcessing.value = true;

    try {
      await identityStore.bindIdentity(bindForm.value.did, bindForm.value.alias);
      closeBindModal();
    } catch (error: any) {
      bindFormErrors.value.did = error.message || '绑定失败，请重试';
    } finally {
      bindFormProcessing.value = false;
    }
  };

  // 设为默认身份
  const setAsDefault = async (identity: Identity) => {
    logger.info('Page:Identity', '设置默认身份', { id: identity.id });
    openDropdown.value = null;

    try {
      await identityStore.setDefaultIdentity(identity.id);
    } catch (error: any) {
      // 错误处理
      console.error('设置默认身份失败', error);
    }
  };

  // 停用身份
  const deactivateIdentity = async (identity: Identity) => {
    logger.info('Page:Identity', '开始停用身份', { id: identity.id });
    openDropdown.value = '';

    try {
      await identityStore.updateIdentity(identity.id, {
        status: IdentityStatus.INACTIVE
      });
      logger.info('Page:Identity', '身份停用成功', { id: identity.id });
    } catch (error: any) {
      logger.error('Page:Identity', '身份停用失败', { id: identity.id, error: error.message });
    }
  };

  // 激活身份
  const activateIdentity = async (identity: Identity) => {
    logger.info('Page:Identity', '开始激活身份', { id: identity.id });
    openDropdown.value = '';

    try {
      await identityStore.updateIdentity(identity.id, {
        status: IdentityStatus.ACTIVE
      });
      logger.info('Page:Identity', '身份激活成功', { id: identity.id });
    } catch (error: any) {
      logger.error('Page:Identity', '身份激活失败', { id: identity.id, error: error.message });
    }
  };

  // 确认删除
  const confirmDelete = (identity: Identity) => {
    logger.info('Page:Identity', '打开删除确认框', { id: identity.id });
    identityToDelete.value = identity;
    showDeleteConfirm.value = true;
    openDropdown.value = null;
  };

  // 取消删除
  const cancelDelete = () => {
    showDeleteConfirm.value = false;
    identityToDelete.value = null;
  };

  // 执行删除
  const deleteIdentity = async () => {
    if (!identityToDelete.value) return;

    logger.info('Page:Identity', '执行删除身份', { id: identityToDelete.value.id });
    deleteProcessing.value = true;

    try {
      await identityStore.deleteIdentity(identityToDelete.value.id);
      showDeleteConfirm.value = false;
      identityToDelete.value = null;
    } catch (error: any) {
      // 错误处理
      console.error('删除身份失败', error);
    } finally {
      deleteProcessing.value = false;
    }
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
</script>

<style scoped>
  .dropdown-item {
    @apply block w-full text-left px-3 py-2 text-textgray hover:bg-violet/20 hover:text-textlight rounded-md;
  }

  .modal-backdrop {
    backdrop-filter: blur(4px);
  }
</style>