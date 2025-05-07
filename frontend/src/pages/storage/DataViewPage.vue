<template>
  <div class="data-view-page">
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-green-400 flex items-center">
          <div class="i-carbon-view text-3xl mr-2"></div>
          数据访问
        </h1>
        <p class="text-gray-400 mt-2">
          通过内容标识符(CID)查看和访问去中心化存储网络中的数据
        </p>
      </div>

      <!-- 查询表单 -->
      <div class="bg-white/5 border border-green-800/30 rounded-xl p-6 shadow-lg mb-8">
        <div class="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="cidInput" class="block text-sm font-medium text-gray-400 mb-1">内容标识符 (CID)</label>
            <input type="text" id="cidInput" v-model="cidInput"
              placeholder="输入数据的CID，例如: QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx"
              class="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <button @click="fetchData" :disabled="!cidInput || loading"
              class="w-full md:w-auto py-2 px-6 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center"
              :class="{ 'opacity-50 cursor-not-allowed': !cidInput || loading }">
              <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
              <span v-else class="i-carbon-search mr-2"></span>
              查询数据
            </button>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
        <div class="flex items-center text-red-400">
          <span class="i-carbon-warning-filled text-xl mr-2"></span>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- 数据显示区域 -->
      <div v-if="storageData" class="data-container bg-white/5 border border-green-800/30 rounded-xl p-6 shadow-lg">
        <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <h2 class="text-xl font-semibold text-green-400 flex items-center mb-4 md:mb-0">
            <div class="i-carbon-document text-2xl mr-2"></div>
            {{ storageData.name }}
          </h2>
          <div class="flex space-x-2">
            <button @click="downloadData"
              class="py-1.5 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors flex items-center"
              title="下载数据">
              <span class="i-carbon-download mr-1"></span>
              下载
            </button>
            <button @click="copyDataCid"
              class="py-1.5 px-4 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg transition-colors flex items-center"
              title="复制CID">
              <span class="i-carbon-copy mr-1"></span>
              复制CID
            </button>
          </div>
        </div>

        <!-- 数据信息 -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="info-card p-3 rounded-lg bg-black/30 border border-gray-800">
            <div class="text-xs text-gray-500 mb-1">存储类型</div>
            <div class="flex items-center text-gray-300">
              <span class="i-carbon-network-4 mr-1.5 text-green-500" v-if="storageData.storageType === 'ipfs'"></span>
              <span class="i-carbon-ibm-cloud-direct-link mr-1.5 text-green-500" v-else></span>
              {{ storageData.storageType === 'ipfs' ? 'IPFS (星际文件系统)' : 'Ceramic (陶瓷网络)' }}
            </div>
          </div>
          <div class="info-card p-3 rounded-lg bg-black/30 border border-gray-800">
            <div class="text-xs text-gray-500 mb-1">文件大小</div>
            <div class="flex items-center text-gray-300">
              <span class="i-carbon-chart-bar mr-1.5 text-green-500"></span>
              {{ formatFileSize(storageData.size) }}
            </div>
          </div>
          <div class="info-card p-3 rounded-lg bg-black/30 border border-gray-800">
            <div class="text-xs text-gray-500 mb-1">上传时间</div>
            <div class="flex items-center text-gray-300">
              <span class="i-carbon-time mr-1.5 text-green-500"></span>
              {{ formatDate(storageData.createdAt) }}
            </div>
          </div>
        </div>

        <!-- 数据预览 -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-green-400 mb-4">数据预览</h3>

          <!-- 图片预览 -->
          <div v-if="isImage" class="text-center mb-4">
            <img :src="storageData.previewUrl" :alt="storageData.name"
              class="max-w-full max-h-[500px] mx-auto rounded-lg border border-gray-700" />
          </div>

          <!-- JSON预览 -->
          <div v-else-if="isJson" class="bg-black/40 p-4 rounded-lg border border-gray-800 overflow-auto max-h-[400px]">
            <pre class="text-green-300 text-sm"><code>{{ formatJsonForDisplay }}</code></pre>
          </div>

          <!-- 文本预览 -->
          <div v-else-if="isText" class="bg-black/40 p-4 rounded-lg border border-gray-800 overflow-auto max-h-[400px]">
            <pre class="text-gray-300 text-sm"><code>{{ textContent }}</code></pre>
          </div>

          <!-- 其他文件类型 -->
          <div v-else class="text-center p-8 bg-black/40 rounded-lg border border-gray-800">
            <div class="i-carbon-document-unknown text-5xl mx-auto mb-4 text-green-500/50"></div>
            <p class="text-gray-400">此文件类型不支持预览，请下载后查看</p>
            <button @click="downloadData"
              class="mt-4 py-2 px-6 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors flex items-center mx-auto">
              <span class="i-carbon-download mr-2"></span>
              下载文件
            </button>
          </div>
        </div>

        <!-- 元数据 -->
        <div v-if="storageData.metadata">
          <h3 class="text-lg font-medium text-green-400 mb-4">元数据</h3>
          <div class="bg-black/40 p-4 rounded-lg border border-gray-800">
            <div v-for="(value, key) in storageData.metadata" :key="key"
              class="flex py-1 border-b border-gray-800 last:border-b-0">
              <div class="w-1/3 text-gray-500 font-medium">{{ key }}</div>
              <div class="w-2/3 text-gray-300">{{ value }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!storageData && !loading && !error"
        class="text-center py-16 bg-white/5 border border-green-800/30 rounded-xl">
        <div class="i-carbon-search text-6xl mx-auto mb-4 text-green-500/50"></div>
        <h3 class="text-xl font-medium text-gray-300 mb-2">输入CID查询数据</h3>
        <p class="text-gray-500 max-w-md mx-auto">
          输入完整的内容标识符(CID)以访问存储在去中心化网络中的数据
        </p>
        <div class="mt-6">
          <router-link to="/storage/upload"
            class="py-2 px-6 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors inline-flex items-center">
            <span class="i-carbon-cloud-upload mr-2"></span>
            上传新数据
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useStorageStore, StorageData } from '../../stores/storage';

  const store = useStorageStore();
  const route = useRoute();

  // 响应式状态
  const cidInput = ref('');
  const loading = ref(false);
  const error = ref('');
  const textContent = ref('');
  const storageData = computed(() => store.getCurrentData);

  // 根据路由参数初始化
  if (route.params.cid) {
    cidInput.value = route.params.cid as string;
    fetchData();
  }

  // 计算属性
  const isImage = computed(() => {
    return storageData.value?.mimeType?.startsWith('image/');
  });

  const isJson = computed(() => {
    return storageData.value?.mimeType === 'application/json' ||
      storageData.value?.name?.endsWith('.json');
  });

  const isText = computed(() => {
    return storageData.value?.mimeType?.startsWith('text/') ||
      textContent.value !== '';
  });

  const formatJsonForDisplay = computed(() => {
    if (!isJson.value || !storageData.value?.previewUrl) return '';
    try {
      // 假设previewUrl包含JSON字符串或者对象
      const content = typeof storageData.value.previewUrl === 'string'
        ? JSON.parse(storageData.value.previewUrl)
        : storageData.value.previewUrl;
      return JSON.stringify(content, null, 2);
    } catch (err) {
      return storageData.value.previewUrl;
    }
  });

  // 方法
  async function fetchData() {
    if (!cidInput.value) return;

    loading.value = true;
    error.value = '';

    try {
      await store.fetchDataByCid(cidInput.value);

      if (!store.getCurrentData) {
        error.value = '未找到相关数据，请检查CID是否正确';
      }

      // 如果是文本类型，获取内容
      if (store.getCurrentData?.previewUrl && isText.value) {
        try {
          const response = await fetch(store.getCurrentData.previewUrl);
          textContent.value = await response.text();
        } catch (err) {
          console.error('获取文本内容失败:', err);
        }
      }
    } catch (err) {
      error.value = '获取数据失败，请稍后重试';
      console.error('获取数据错误:', err);
    } finally {
      loading.value = false;
    }
  }

  function copyDataCid() {
    if (storageData.value?.cid) {
      navigator.clipboard.writeText(storageData.value.cid)
        .then(() => {
          alert('CID已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制CID失败', err);
        });
    }
  }

  async function downloadData() {
    if (!storageData.value?.previewUrl) return;

    try {
      // 创建一个临时a标签进行下载
      const link = document.createElement('a');
      link.href = storageData.value.previewUrl;
      link.download = storageData.value.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('下载文件失败:', err);
      error.value = '下载文件失败，请稍后重试';
    }
  }

  // 格式化文件大小
  function formatFileSize(size: number): string {
    if (!size) return '0 B';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  // 格式化日期
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<style scoped>
  .data-container {
    background-image: radial-gradient(circle at center, rgba(52, 211, 153, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
    backdrop-filter: blur(2px);
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>