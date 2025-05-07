<template>
  <div class="upload-form">
    <div class="form-container bg-white/5 border border-green-800/30 rounded-xl p-6 shadow-lg">
      <!-- 标题 -->
      <h2 class="text-xl font-semibold text-green-400 mb-6 flex items-center">
        <div class="i-carbon-cloud-upload text-2xl mr-2"></div>
        上传到去中心化存储
      </h2>

      <form @submit.prevent="submitForm">
        <!-- 上传类型选择 -->
        <div class="mb-6">
          <div class="flex justify-center space-x-4">
            <button type="button" @click="activeTab = 'file'"
              class="flex-1 py-3 px-4 rounded-lg border transition-all flex items-center justify-center"
              :class="activeTab === 'file' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-700 text-gray-400 hover:border-green-800'">
              <div class="i-carbon-document text-xl mr-2"></div>
              上传文件
            </button>
            <button type="button" @click="activeTab = 'json'"
              class="flex-1 py-3 px-4 rounded-lg border transition-all flex items-center justify-center"
              :class="activeTab === 'json' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-700 text-gray-400 hover:border-green-800'">
              <div class="i-carbon-code text-xl mr-2"></div>
              粘贴JSON
            </button>
          </div>
        </div>

        <!-- 文件上传区域 -->
        <div v-if="activeTab === 'file'" class="mb-6">
          <div
            class="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-500/50 transition-all"
            :class="{ 'border-green-500/70 bg-green-500/10': isDragging }" @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false" @drop.prevent="onFileDrop" @click="triggerFileInput">
            <input type="file" ref="fileInput" class="hidden" @change="onFileChange" :accept="acceptedFileTypes" />

            <div v-if="!selectedFile" class="py-4">
              <div class="i-carbon-upload text-4xl mx-auto mb-3 text-green-500/70"></div>
              <p class="text-gray-300 font-medium">拖放文件到此处或点击选择文件</p>
              <p class="text-gray-500 text-sm mt-2">支持任何类型的文件</p>
            </div>

            <div v-else class="py-2">
              <div class="flex items-center justify-center mb-2">
                <div class="i-carbon-document-attachment text-2xl text-green-500 mr-2"></div>
                <span class="text-green-400 font-medium">{{ selectedFile.name }}</span>
              </div>
              <p class="text-gray-400 text-sm">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
        </div>

        <!-- JSON 输入区域 -->
        <div v-if="activeTab === 'json'" class="mb-6">
          <textarea v-model="jsonData" placeholder="在此粘贴JSON数据..." rows="8"
            class="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            :class="{ 'border-red-500': jsonError }"></textarea>
          <div v-if="jsonError" class="mt-1 text-red-500 text-sm">{{ jsonError }}</div>
          <div class="flex justify-end mt-1">
            <button type="button" @click="formatJson" class="text-sm text-green-500 hover:text-green-400"
              :disabled="!jsonData">
              格式化JSON
            </button>
          </div>
        </div>

        <!-- 数据名称 -->
        <div class="mb-6">
          <label for="name" class="block text-sm font-medium text-gray-400 mb-1">数据名称 <span
              class="text-red-500">*</span></label>
          <input type="text" id="name" v-model="formData.name" required
            class="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            placeholder="为你的数据命名" />
        </div>

        <!-- 存储类型选择 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-2">存储类型 <span class="text-red-500">*</span></label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="formData.storageType = StorageType.IPFS"
              class="text-center py-3 px-3 rounded-lg border transition-all"
              :class="formData.storageType === StorageType.IPFS ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-700 text-gray-400 hover:border-green-800'">
              <div class="i-carbon-network-4 text-2xl mx-auto mb-2"></div>
              IPFS
              <p class="text-xs mt-1 text-gray-500">星际文件系统</p>
            </button>
            <button type="button" @click="formData.storageType = StorageType.CERAMIC"
              class="text-center py-3 px-3 rounded-lg border transition-all"
              :class="formData.storageType === StorageType.CERAMIC ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-700 text-gray-400 hover:border-green-800'">
              <div class="i-carbon-ibm-cloud-direct-link text-2xl mx-auto mb-2"></div>
              Ceramic
              <p class="text-xs mt-1 text-gray-500">陶瓷网络</p>
            </button>
          </div>
        </div>

        <!-- 公共访问设置 -->
        <div class="mb-6">
          <div class="flex items-center">
            <input id="isPublic" type="checkbox" v-model="formData.isPublic"
              class="w-4 h-4 accent-green-500 rounded focus:ring-green-500" />
            <label for="isPublic" class="ml-2 text-sm text-gray-400">
              允许公开访问此数据
            </label>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-400">
          <div class="flex items-center">
            <span class="i-carbon-warning-filled text-xl mr-2"></span>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="uploadStatus === 'uploading'" class="mb-6">
          <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-green-500 transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <div class="flex justify-between mt-1 text-sm">
            <span class="text-gray-400">上传中...</span>
            <span class="text-green-400">{{ uploadProgress }}%</span>
          </div>
        </div>

        <!-- 上传成功 -->
        <div v-if="uploadStatus === 'success'" class="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
          <div class="flex items-center text-green-400 font-medium mb-2">
            <span class="i-carbon-checkmark-outline text-xl mr-2"></span>
            <span>上传成功！</span>
          </div>
          <div v-if="resultCid" class="mt-2">
            <div class="text-sm text-gray-400 mb-1">内容标识符 (CID):</div>
            <div class="flex items-center bg-black/30 rounded px-3 py-2">
              <code class="text-sm text-green-400 font-mono truncate flex-1">{{ resultCid }}</code>
              <button @click="copyCid" class="ml-2 text-gray-400 hover:text-green-400" title="复制CID">
                <span class="i-carbon-copy"></span>
              </button>
            </div>
            <div class="mt-3 flex justify-end">
              <router-link :to="`/storage/${resultCid}`"
                class="text-green-400 hover:text-green-300 flex items-center text-sm">
                <span class="i-carbon-view text-lg mr-1"></span>
                查看数据
              </router-link>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex justify-end">
          <button type="button" v-if="uploadStatus === 'success'" @click="resetForm"
            class="py-2 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors mr-2">
            重新上传
          </button>
          <button type="submit" :disabled="isSubmitDisabled || uploadStatus === 'uploading'"
            class="py-2 px-6 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-600/20 flex items-center"
            :class="{ 'opacity-50 cursor-not-allowed': isSubmitDisabled || uploadStatus === 'uploading' }">
            <span v-if="uploadStatus === 'uploading'" class="i-carbon-circle-dash animate-spin mr-2"></span>
            <span v-else class="i-carbon-cloud-upload mr-2"></span>
            {{ uploadStatus === 'uploading' ? '上传中...' : '上传数据' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, watch } from 'vue';
  import { useStorageStore, StorageType } from '../../stores/storage';

  const store = useStorageStore();

  // 数据
  const activeTab = ref<'file' | 'json'>('file');
  const isDragging = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const selectedFile = ref<File | null>(null);
  const jsonData = ref('');
  const jsonError = ref('');
  const error = ref('');
  const uploadProgress = computed(() => store.getUploadProgress);
  const uploadStatus = computed(() => store.getUploadStatus);
  const resultCid = ref('');

  // 默认接受所有文件类型
  const acceptedFileTypes = '*/*';

  // 表单数据
  const formData = reactive({
    name: '',
    storageType: StorageType.IPFS,
    isPublic: false,
  });

  // 计算属性：是否禁用提交按钮
  const isSubmitDisabled = computed(() => {
    if (!formData.name || !formData.storageType) return true;
    if (activeTab.value === 'file' && !selectedFile.value) return true;
    if (activeTab.value === 'json' && (!jsonData.value || jsonError.value)) return true;
    return false;
  });

  // 文件选择事件
  const triggerFileInput = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };

  // 文件改变事件
  const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile.value = input.files[0];
      // 如果文件名不存在，则使用文件名作为数据名称
      if (!formData.name) {
        formData.name = selectedFile.value.name.split('.')[0];
      }
    }
  };

  // 文件拖放事件
  const onFileDrop = (event: DragEvent) => {
    isDragging.value = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      selectedFile.value = event.dataTransfer.files[0];
      // 如果文件名不存在，则使用文件名作为数据名称
      if (!formData.name) {
        formData.name = selectedFile.value.name.split('.')[0];
      }
    }
  };

  // 格式化文件大小
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // 格式化JSON
  const formatJson = () => {
    if (!jsonData.value) return;

    try {
      const parsed = JSON.parse(jsonData.value);
      jsonData.value = JSON.stringify(parsed, null, 2);
      jsonError.value = '';
    } catch (err) {
      jsonError.value = '无效的JSON格式';
    }
  };

  // 验证JSON
  const validateJson = () => {
    if (!jsonData.value) {
      jsonError.value = '';
      return false;
    }

    try {
      JSON.parse(jsonData.value);
      jsonError.value = '';
      return true;
    } catch (err) {
      jsonError.value = '无效的JSON格式';
      return false;
    }
  };

  // 监听JSON数据变化，实时验证
  watch(jsonData, () => {
    if (jsonData.value) {
      validateJson();
    } else {
      jsonError.value = '';
    }
  });

  // 提交表单
  const submitForm = async () => {
    error.value = '';

    if (activeTab.value === 'json' && !validateJson()) {
      return;
    }

    try {
      const params = {
        name: formData.name,
        storageType: formData.storageType,
        isPublic: formData.isPublic,
      };

      if (activeTab.value === 'file') {
        if (!selectedFile.value) {
          error.value = '请选择要上传的文件';
          return;
        }
        // 提交文件
        const result = await store.uploadData({
          ...params,
          file: selectedFile.value,
        });

        if (result.success && result.cid) {
          resultCid.value = result.cid;
        } else {
          error.value = result.error || '上传失败';
        }
      } else {
        // 提交JSON数据
        if (!jsonData.value) {
          error.value = '请输入JSON数据';
          return;
        }

        const result = await store.uploadData({
          ...params,
          jsonData: jsonData.value,
        });

        if (result.success && result.cid) {
          resultCid.value = result.cid;
        } else {
          error.value = result.error || '上传失败';
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '上传过程中发生错误';
    }
  };

  // 复制CID到剪贴板
  const copyCid = () => {
    if (resultCid.value) {
      navigator.clipboard.writeText(resultCid.value)
        .then(() => {
          alert('CID已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制CID失败', err);
        });
    }
  };

  // 重置表单
  const resetForm = () => {
    activeTab.value = 'file';
    selectedFile.value = null;
    jsonData.value = '';
    jsonError.value = '';
    error.value = '';
    formData.name = '';
    formData.isPublic = false;
    store.resetUploadState();
    resultCid.value = '';

    // 重置文件输入
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };
</script>

<style scoped>
  .form-container {
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