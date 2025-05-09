<template>
  <div class="identity-detail-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header py-6">
      <div class="container">
        <div class="flex items-center mb-4">
          <router-link to="/identity" class="btn-secondary mr-4">
            <span class="i-carbon-arrow-left mr-1"></span>返回
          </router-link>
          <h1 class="text-2xl font-bold text-textlight">身份详情</h1>
        </div>
      </div>
    </div>

    <div class="container py-6">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
        <p>{{ error }}</p>
        <button class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" @click="fetchIdentity">
          重试
        </button>
      </div>

      <!-- 身份详情 -->
      <div v-else-if="identity" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 主要信息卡片 -->
        <div class="md:col-span-1">
          <div class="card p-6">
            <div class="flex items-center mb-6">
              <div class="avatar-wrapper mr-4 relative">
                <div
                  class="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center text-neon overflow-hidden">
                  <img v-if="identity.metadata?.avatar" :src="identity.metadata.avatar" alt="Avatar"
                    class="w-full h-full object-cover">
                  <span v-else class="text-3xl">{{ identity.alias?.charAt(0).toUpperCase() }}</span>
                </div>
                <div v-if="identity.isDefault"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-neon rounded-full flex items-center justify-center">
                  <span class="i-carbon-star-filled text-primary"></span>
                </div>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-textlight">{{ identity.alias }}</h3>
                <div class="flex items-center">
                  <span class="text-sm text-textgray">{{ identity.method }}</span>
                  <span class="ml-2 px-2 py-0.5 text-xs rounded-full" :class="{
                    'bg-green-500/20 text-green-500': identity.status === 'active',
                    'bg-yellow-500/20 text-yellow-500': identity.status === 'inactive',
                    'bg-red-500/20 text-red-500': identity.status === 'revoked'
                  }">
                    {{
                      identity.status === 'active' ? '活跃' :
                        identity.status === 'inactive' ? '非活跃' : '已撤销'
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- DID信息 -->
            <div class="mb-6">
              <h4 class="text-sm text-textgray mb-2">DID 标识符</h4>
              <div class="relative">
                <pre
                  class="text-sm font-mono bg-darkbg rounded p-3 text-textgray overflow-x-auto">{{ identity.did }}</pre>
                <button @click="copyDid" class="absolute top-2 right-2 p-1 bg-primary/60 rounded hover:bg-primary">
                  <span class="i-carbon-copy text-textgray"></span>
                </button>
              </div>
              <p class="text-xs text-textgray mt-1">上次使用: {{ formatDate(identity.lastUsed) }}</p>
            </div>

            <!-- 公钥信息 -->
            <div class="mb-6">
              <h4 class="text-sm text-textgray mb-2">公钥</h4>
              <div class="relative">
                <pre
                  class="text-sm font-mono bg-darkbg rounded p-3 text-textgray overflow-x-auto">{{ truncateKey(identity.publicKey) }}</pre>
                <button @click="copyPublicKey"
                  class="absolute top-2 right-2 p-1 bg-primary/60 rounded hover:bg-primary">
                  <span class="i-carbon-copy text-textgray"></span>
                </button>
              </div>
            </div>

            <!-- 身份操作按钮 -->
            <div class="grid grid-cols-2 gap-3">
              <button v-if="!identity.isDefault" class="btn-secondary flex items-center justify-center"
                @click="setAsDefault">
                <span class="i-carbon-star mr-1"></span>设为默认
              </button>
              <button v-if="identity.status === 'active'"
                class="btn-secondary flex items-center justify-center text-yellow-500" @click="deactivateIdentity">
                <span class="i-carbon-pause mr-1"></span>停用
              </button>
              <button v-else class="btn-secondary flex items-center justify-center text-green-500"
                @click="activateIdentity">
                <span class="i-carbon-play mr-1"></span>激活
              </button>
              <button class="btn-primary flex items-center justify-center" @click="exportIdentity">
                <span class="i-carbon-export mr-1"></span>导出
              </button>
              <button class="btn-secondary flex items-center justify-center col-span-2 text-red-500"
                @click="confirmDelete">
                <span class="i-carbon-trash-can mr-1"></span>删除身份
              </button>
            </div>
          </div>
        </div>

        <!-- 详细信息和关联数据 -->
        <div class="md:col-span-2">
          <!-- 活动记录 -->
          <div class="card p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-textlight">最近活动</h3>
              <button class="text-textgray hover:text-neon">
                查看全部
              </button>
            </div>
            <div v-if="activities.length === 0" class="text-center py-6 text-textgray">
              暂无活动记录
            </div>
            <div v-else class="space-y-3">
              <div v-for="(activity, index) in activities" :key="index"
                class="flex items-start p-3 rounded-lg hover:bg-primary/30">
                <div class="mr-3 mt-1">
                  <span class="w-8 h-8 flex items-center justify-center rounded-full" :class="{
                    'bg-green-500/20 text-green-500': activity.type === 'login',
                    'bg-blue-500/20 text-blue-500': activity.type === 'update',
                    'bg-yellow-500/20 text-yellow-500': activity.type === 'credential',
                    'bg-red-500/20 text-red-500': activity.type === 'permission'
                  }">
                    <span :class="{
                      'i-carbon-login': activity.type === 'login',
                      'i-carbon-edit': activity.type === 'update',
                      'i-carbon-certificate': activity.type === 'credential',
                      'i-carbon-security': activity.type === 'permission'
                    }"></span>
                  </span>
                </div>
                <div>
                  <p class="text-textlight">{{ activity.message }}</p>
                  <div class="flex text-xs text-textgray mt-1">
                    <span>{{ formatDate(activity.timestamp) }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ activity.ip }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 关联凭证 -->
          <div class="card p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-textlight">关联凭证</h3>
              <button class="text-textgray hover:text-neon">
                查看全部
              </button>
            </div>
            <div v-if="credentials.length === 0" class="text-center py-6 text-textgray">
              暂无关联凭证
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(credential, index) in credentials" :key="index"
                class="p-4 rounded-lg border border-gray-700 hover:border-neon/50 transition-all">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-textlight">{{ credential.name }}</h4>
                  <span class="px-2 py-0.5 text-xs rounded-full" :class="{
                    'bg-green-500/20 text-green-500': credential.status === 'valid',
                    'bg-red-500/20 text-red-500': credential.status === 'expired',
                    'bg-yellow-500/20 text-yellow-500': credential.status === 'revoked'
                  }">
                    {{
                      credential.status === 'valid' ? '有效' :
                        credential.status === 'expired' ? '已过期' : '已撤销'
                    }}
                  </span>
                </div>
                <p class="text-sm text-textgray mb-3">发行者: {{ credential.issuer }}</p>
                <p class="text-xs text-textgray">
                  有效期: {{ formatDate(credential.issuanceDate) }} - {{ formatDate(credential.expirationDate) }}
                </p>
              </div>
            </div>
          </div>
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
          <p class="text-textgray mb-6">您确定要删除身份 <span class="text-neon">{{ identity?.alias }}</span> 吗？此操作不可撤销。</p>
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
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useIdentityStore, type Identity } from '../../stores/identity';
  import { logger } from '../../utils/logger';

  // 初始化路由和存储
  const route = useRoute();
  const router = useRouter();
  const identityStore = useIdentityStore();

  // 页面状态
  const identity = ref<Identity | null>(null);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const showDeleteConfirm = ref(false);
  const deleteProcessing = ref(false);

  // 模拟数据
  const activities = ref([
    {
      type: 'login',
      message: '使用此身份登录系统',
      timestamp: '2023-06-12T08:45:23Z',
      ip: '192.168.1.1'
    },
    {
      type: 'update',
      message: '更新身份资料',
      timestamp: '2023-06-10T15:32:10Z',
      ip: '192.168.1.1'
    },
    {
      type: 'credential',
      message: '使用此身份签发新凭证',
      timestamp: '2023-06-08T11:23:45Z',
      ip: '192.168.1.1'
    },
    {
      type: 'permission',
      message: '授权第三方应用访问',
      timestamp: '2023-06-05T09:12:33Z',
      ip: '192.168.1.1'
    }
  ]);

  const credentials = ref([
    {
      id: 'cred-1',
      name: '大学学历证明',
      issuer: '清华大学',
      status: 'valid',
      issuanceDate: '2023-01-15T00:00:00Z',
      expirationDate: '2033-01-15T00:00:00Z'
    },
    {
      id: 'cred-2',
      name: '软件工程师资格证',
      issuer: '中国软件协会',
      status: 'valid',
      issuanceDate: '2022-11-05T00:00:00Z',
      expirationDate: '2024-11-05T00:00:00Z'
    },
    {
      id: 'cred-3',
      name: '实习证明',
      issuer: '阿里巴巴集团',
      status: 'expired',
      issuanceDate: '2022-06-01T00:00:00Z',
      expirationDate: '2022-09-01T00:00:00Z'
    }
  ]);

  // 获取身份详情
  const fetchIdentity = async () => {
    const id = route.params.id as string;
    if (!id) {
      error.value = '无效的身份ID';
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const data = await identityStore.fetchIdentityById(id);
      identity.value = data;
      logger.info('Page:IdentityDetail', '身份详情获取成功', { id });
    } catch (err: any) {
      error.value = err.message || '获取身份详情失败';
      logger.error('Page:IdentityDetail', '身份详情获取失败', { id, error: err });
    } finally {
      isLoading.value = false;
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

  // 复制内容到剪贴板
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(message);
      })
      .catch(err => {
        console.error('无法复制到剪贴板', err);
      });
  };

  // 复制DID
  const copyDid = () => {
    if (identity.value) {
      copyToClipboard(identity.value.did, 'DID已复制到剪贴板');
      logger.info('Page:IdentityDetail', '复制DID到剪贴板', { did: identity.value.did });
    }
  };

  // 复制公钥
  const copyPublicKey = () => {
    if (identity.value) {
      copyToClipboard(identity.value.publicKey, '公钥已复制到剪贴板');
      logger.info('Page:IdentityDetail', '复制公钥到剪贴板');
    }
  };

  // 截断公钥显示
  const truncateKey = (key: string): string => {
    if (!key) return '';
    if (key.length <= 40) return key;
    return `${key.substring(0, 20)}...${key.substring(key.length - 20)}`;
  };

  // 设为默认身份
  const setAsDefault = async () => {
    if (!identity.value) return;

    try {
      await identityStore.setDefaultIdentity(identity.value.id);
      identity.value.isDefault = true;
      logger.info('Page:IdentityDetail', '设置默认身份成功', { id: identity.value.id });
    } catch (err: any) {
      console.error('设置默认身份失败', err);
    }
  };

  // 停用身份
  const deactivateIdentity = async () => {
    if (!identity.value) return;

    try {
      await identityStore.updateIdentity(identity.value.id, { status: 'inactive' });
      identity.value.status = 'inactive';
      logger.info('Page:IdentityDetail', '停用身份成功', { id: identity.value.id });
    } catch (err: any) {
      console.error('停用身份失败', err);
    }
  };

  // 激活身份
  const activateIdentity = async () => {
    if (!identity.value) return;

    try {
      await identityStore.updateIdentity(identity.value.id, { status: 'active' });
      identity.value.status = 'active';
      logger.info('Page:IdentityDetail', '激活身份成功', { id: identity.value.id });
    } catch (err: any) {
      console.error('激活身份失败', err);
    }
  };

  // 导出身份
  const exportIdentity = async () => {
    if (!identity.value) return;

    try {
      // 这里应该调用导出API，获取导出数据并下载
      logger.info('Page:IdentityDetail', '导出身份', { id: identity.value.id });
      alert('身份导出功能开发中...');
    } catch (err: any) {
      console.error('导出身份失败', err);
    }
  };

  // 确认删除
  const confirmDelete = () => {
    showDeleteConfirm.value = true;
  };

  // 取消删除
  const cancelDelete = () => {
    showDeleteConfirm.value = false;
  };

  // 执行删除
  const deleteIdentity = async () => {
    if (!identity.value) return;

    deleteProcessing.value = true;

    try {
      await identityStore.deleteIdentity(identity.value.id);
      logger.info('Page:IdentityDetail', '删除身份成功', { id: identity.value.id });
      router.push('/identity');
    } catch (err: any) {
      console.error('删除身份失败', err);
    } finally {
      deleteProcessing.value = false;
      showDeleteConfirm.value = false;
    }
  };

  // 组件挂载时获取身份详情
  onMounted(() => {
    logger.info('Page:IdentityDetail', '身份详情页面已加载');
    fetchIdentity();
  });
</script>

<style scoped>
  .modal-backdrop {
    backdrop-filter: blur(4px);
  }
</style>