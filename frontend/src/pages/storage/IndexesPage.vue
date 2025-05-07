<template>
  <div class="indexes-page">
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-green-400 flex items-center">
          <div class="i-carbon-list text-3xl mr-2"></div>
          存储索引记录
        </h1>
        <p class="text-gray-400 mt-2">
          查看和管理您上传到去中心化网络的所有数据记录
        </p>
      </div>

      <!-- 筛选和搜索工具栏 -->
      <div class="bg-white/5 border border-green-800/30 rounded-xl p-6 shadow-lg mb-8">
        <div class="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="searchInput" class="block text-sm font-medium text-gray-400 mb-1">搜索</label>
            <input type="text" id="searchInput" v-model="searchQuery" placeholder="搜索文件名、CID或标签..."
              class="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div class="w-full md:w-auto">
            <label for="storageTypeFilter" class="block text-sm font-medium text-gray-400 mb-1">存储类型</label>
            <select id="storageTypeFilter" v-model="filters.storageType"
              class="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500">
              <option value="">全部</option>
              <option :value="StorageType.IPFS">IPFS</option>
              <option :value="StorageType.CERAMIC">Ceramic</option>
            </select>
          </div>
          <div>
            <button @click="fetchIndexes"
              class="w-full md:w-auto py-2 px-6 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center">
              <span class="i-carbon-search mr-2"></span>
              筛选
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

      <!-- 加载中状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="i-carbon-circle-dash text-5xl mx-auto animate-spin text-green-500"></div>
        <p class="text-gray-400 mt-4">加载索引记录中...</p>
      </div>

      <!-- 索引列表 -->
      <div v-else-if="indexes.length > 0"
        class="index-container bg-white/5 border border-green-800/30 rounded-xl shadow-lg">
        <!-- 表格头部 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-800">
            <thead class="bg-black/30">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  文件名</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  存储类型</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  大小</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  上传时间</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  访问次数</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="item in indexes" :key="item.id" class="hover:bg-green-900/10 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="i-carbon-document text-xl text-green-500 mr-2"></div>
                    <div class="truncate max-w-[200px]" :title="item.name">{{ item.name }}</div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1 truncate max-w-[220px]" :title="item.cid">CID: {{ item.cid }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="item.storageType === 'ipfs' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'">
                    <span class="i-carbon-network-4 mr-1" v-if="item.storageType === 'ipfs'"></span>
                    <span class="i-carbon-ibm-cloud-direct-link mr-1" v-else></span>
                    {{ item.storageType === 'ipfs' ? 'IPFS' : 'Ceramic' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-300">
                  {{ formatFileSize(item.size) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-300">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center text-gray-300">
                    <span class="i-carbon-view mr-1 text-green-500"></span>
                    {{ item.accessCount }}
                  </div>
                  <div v-if="item.lastAccessedAt" class="text-xs text-gray-500 mt-1">
                    最近: {{ formatDateShort(item.lastAccessedAt) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div class="flex space-x-2">
                    <router-link :to="`/storage/${item.cid}`" class="text-green-400 hover:text-green-300" title="查看">
                      <span class="i-carbon-view"></span>
                    </router-link>
                    <button @click="copyCid(item.cid)" class="text-gray-400 hover:text-gray-300" title="复制CID">
                      <span class="i-carbon-copy"></span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页控件 -->
        <div class="px-6 py-4 bg-black/20 border-t border-gray-800 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            共 {{ pagination.total }} 条记录
          </div>
          <div class="flex space-x-2">
            <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage <= 1"
              class="px-3 py-1 rounded border border-gray-700 text-gray-400 hover:border-green-500 hover:text-green-400 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage <= 1 }">
              上一页
            </button>
            <div class="px-3 py-1 text-gray-300">
              {{ pagination.currentPage }} / {{ Math.ceil(pagination.total / pagination.pageSize) }}
            </div>
            <button @click="changePage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= Math.ceil(pagination.total / pagination.pageSize)"
              class="px-3 py-1 rounded border border-gray-700 text-gray-400 hover:border-green-500 hover:text-green-400 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.currentPage >= Math.ceil(pagination.total / pagination.pageSize) }">
              下一页
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && !error" class="text-center py-16 bg-white/5 border border-green-800/30 rounded-xl">
        <div class="i-carbon-folder text-6xl mx-auto mb-4 text-green-500/50"></div>
        <h3 class="text-xl font-medium text-gray-300 mb-2">暂无索引记录</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">
          您尚未上传任何数据到去中心化存储网络，或者没有符合筛选条件的记录
        </p>
        <router-link to="/storage/upload"
          class="py-2 px-6 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors inline-flex items-center">
          <span class="i-carbon-cloud-upload mr-2"></span>
          上传新数据
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useStorageStore, StorageType, StorageIndex } from '../../stores/storage';

  const store = useStorageStore();

  // 响应式状态
  const loading = ref(false);
  const error = ref('');
  const searchQuery = ref('');
  const indexes = computed(() => store.getIndexes);
  const pagination = computed(() => store.getPagination);

  // 筛选条件
  const filters = reactive({
    storageType: '',
    startDate: '',
    endDate: '',
  });

  // 初始化加载
  onMounted(() => {
    fetchIndexes();
  });

  // 获取索引记录
  async function fetchIndexes() {
    loading.value = true;
    error.value = '';

    try {
      const filterParams: Record<string, any> = {};

      if (filters.storageType) {
        filterParams.storageType = filters.storageType;
      }

      if (searchQuery.value) {
        filterParams.search = searchQuery.value;
      }

      if (filters.startDate) {
        filterParams.startDate = filters.startDate;
      }

      if (filters.endDate) {
        filterParams.endDate = filters.endDate;
      }

      await store.fetchIndexes(pagination.value.currentPage, pagination.value.pageSize, filterParams);
    } catch (err) {
      error.value = '获取索引记录失败，请稍后重试';
      console.error('获取索引记录错误:', err);
    } finally {
      loading.value = false;
    }
  }

  // 分页
  function changePage(page: number) {
    store.pagination.currentPage = page;
    fetchIndexes();
  }

  // 复制CID到剪贴板
  function copyCid(cid: string) {
    if (cid) {
      navigator.clipboard.writeText(cid)
        .then(() => {
          alert('CID已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制CID失败', err);
        });
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

  // 格式化简短日期（只显示日期）
  function formatDateShort(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<style scoped>
  .index-container {
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