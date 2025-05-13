<template>
  <div class="credential-detail-page">
    <!-- 页面标题和导航 -->
    <div class="page-header py-6">
      <div class="container">
        <div class="flex items-center mb-4">
          <router-link to="/credential" class="btn-secondary mr-4">
            <span class="i-carbon-arrow-left mr-1"></span>返回
          </router-link>
          <h1 class="text-2xl font-bold text-textlight">凭证详情</h1>
        </div>
      </div>
    </div>

    <div class="container py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 左侧：凭证卡片 -->
        <div class="md:col-span-1">
          <div v-if="isLoading" class="flex justify-center py-12">
            <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
          </div>
          <div v-else-if="error" class="bg-red-500/20 text-red-500 p-4 rounded-lg">
            <p>{{ error }}</p>
            <button class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" @click="fetchCredential">
              重试
            </button>
          </div>
          <CredentialCard v-else-if="credential" :credential="credential" @view-details="showFullCredentialModal = true"
            @show-qr-code="showQrCodeModal = true" />
        </div>

        <!-- 右侧：凭证详细信息 -->
        <div class="md:col-span-2">
          <div v-if="isLoading" class="flex justify-center py-12">
            <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
          </div>
          <div v-else-if="error" class="bg-red-500/20 text-red-500 p-4 rounded-lg">
            <p>{{ error }}</p>
          </div>
          <div v-else-if="credential" class="space-y-6">
            <!-- 凭证属性 -->
            <div class="card-atom p-6">
              <h3 class="text-lg font-semibold text-textlight mb-4 flex items-center">
                <span class="i-carbon-list text-neon mr-2"></span>凭证属性
              </h3>
              <div class="grid grid-cols-1 gap-4">
                <div v-for="(value, key) in credential.credentialSubject" :key="key" class="credential-property">
                  <div class="text-xs text-textgray mb-1">{{ formatPropertyName(key) }}</div>
                  <div class="text-sm text-textlight p-3 bg-darkbg/50 rounded-lg break-words">
                    {{ formatPropertyValue(value) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 凭证操作 -->
            <div class="card-atom p-6">
              <h3 class="text-lg font-semibold text-textlight mb-4 flex items-center">
                <span class="i-carbon-tools text-neon mr-2"></span>凭证操作
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button class="btn-outline w-full py-3" @click="showQrCodeModal = true">
                  <span class="i-carbon-qr-code mr-2"></span>分享凭证
                </button>
                <button class="btn-outline w-full py-3" @click="verifyCredential">
                  <span class="i-carbon-certificate-check mr-2"></span>验证凭证
                </button>
                <button class="btn-outline w-full py-3" @click="downloadCredential">
                  <span class="i-carbon-download mr-2"></span>下载凭证
                </button>
                <button class="btn-outline w-full py-3 text-red-500" v-if="canRevoke" @click="showRevokeModal = true">
                  <span class="i-carbon-delete mr-2"></span>撤销凭证
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 二维码模态框 -->
    <div v-if="showQrCodeModal" class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary max-w-lg rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-neon/10 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-textlight">分享凭证</h3>
          <button @click="showQrCodeModal = false" class="text-textgray hover:text-neon transition-colors">
            <span class="i-carbon-close text-xl"></span>
          </button>
        </div>
        <div class="modal-body p-6 flex flex-col items-center">
          <div class="bg-white p-4 rounded-lg mb-4">
            <!-- 此处应该是实际生成的二维码 -->
            <div class="w-64 h-64 bg-gray-200 flex items-center justify-center">
              <span class="i-carbon-qr-code text-6xl text-gray-600"></span>
            </div>
          </div>
          <p class="text-textgray text-center mb-6">扫描上方二维码来获取此凭证</p>
          <div class="flex justify-center space-x-4">
            <button class="btn-outline py-2 px-6" @click="showQrCodeModal = false">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 完整凭证查看模态框 -->
    <div v-if="showFullCredentialModal"
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary max-w-3xl m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-neon/10 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-textlight flex items-center">
            <span class="i-carbon-document text-neon mr-2"></span>完整凭证数据
          </h3>
          <button @click="showFullCredentialModal = false" class="text-textgray hover:text-neon transition-colors">
            <span class="i-carbon-close text-xl"></span>
          </button>
        </div>
        <div class="modal-body p-6">
          <div class="bg-darkbg/70 p-4 rounded-lg overflow-auto max-h-[70vh] border border-neon/10">
            <pre
              class="text-textlight font-mono text-sm whitespace-pre-wrap">{{ JSON.stringify(credential, null, 2) }}</pre>
          </div>
          <div class="mt-6 flex justify-end">
            <button class="btn-outline py-2 px-6" @click="showFullCredentialModal = false">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useCredentialStore, type Credential } from '../../stores/credential';
  import { logger } from '../../utils/logger';
  import CredentialCard from '../../components/credential/CredentialCard.vue';

  // 初始化路由和存储
  const route = useRoute();
  const router = useRouter();
  const credentialStore = useCredentialStore();

  // 页面状态
  const credential = ref<Credential | null>(null);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  // 模态框状态
  const showQrCodeModal = ref(false);
  const showFullCredentialModal = ref(false);
  const showRevokeModal = ref(false);

  // 计算是否可以撤销凭证
  const canRevoke = computed(() => {
    if (!credential.value) return false;

    // 判断当前用户是否是凭证的发行者
    // 实际代码中需要与当前登录用户进行比较
    return true; // 简化处理，实际应根据用户权限判断
  });

  // 页面加载时获取凭证详情
  onMounted(() => {
    const id = route.params.id as string;
    logger.info('Page:CredentialDetail', '凭证详情页面已加载', { id });

    // 检查URL参数
    if (route.query.showQr === 'true') {
      showQrCodeModal.value = true;
    }

    fetchCredential();
  });

  // 获取凭证详情
  const fetchCredential = async () => {
    const id = route.params.id as string;
    if (!id) return;

    isLoading.value = true;
    error.value = null;

    try {
      const result = await credentialStore.fetchCredentialById(id);
      credential.value = result as Credential;
      logger.info('Page:CredentialDetail', '凭证详情获取成功', { id });
    } catch (err: any) {
      error.value = err.message || '获取凭证详情失败';
      logger.error('Page:CredentialDetail', '获取凭证详情失败', { id, error: err.message });
    } finally {
      isLoading.value = false;
    }
  };

  // 验证凭证
  const verifyCredential = () => {
    const id = route.params.id as string;
    logger.info('Page:CredentialDetail', '导航到验证页面', { id });
    router.push(`/credential/verify?id=${id}&autoVerify=true`);
  };

  // 下载凭证
  const downloadCredential = () => {
    if (!credential.value) return;

    logger.info('Page:CredentialDetail', '下载凭证', { id: credential.value.id });

    const blob = new Blob([JSON.stringify(credential.value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credential-${credential.value.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 格式化属性名称
  const formatPropertyName = (name: string): string => {
    // 处理camelCase为空格分隔的词组并首字母大写
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // 格式化属性值
  const formatPropertyValue = (value: any): string => {
    if (value === null || value === undefined) return '无';

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  };
</script>

<style scoped>
  .modal-backdrop {
    backdrop-filter: blur(8px);
  }

  .credential-property {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
  }
</style>