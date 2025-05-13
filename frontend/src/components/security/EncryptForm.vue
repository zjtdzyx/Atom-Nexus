<template>
  <div class="encrypt-form">
    <form @submit.prevent="handleEncrypt" class="space-y-6">
      <!-- 错误提示 -->
      <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-400">
        <div class="flex items-center">
          <span class="i-carbon-warning-filled text-xl mr-2"></span>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- 输入数据 -->
      <div>
        <label for="inputData" class="block text-sm font-medium text-gray-300 mb-2">输入数据 <span
            class="text-red-500">*</span></label>
        <textarea id="inputData" v-model="formData.data" rows="6" required placeholder="在此粘贴或输入需要加密的数据..."
          class="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-y"></textarea>
        <div class="flex justify-end mt-1">
          <button type="button" @click="clearInputData" class="text-xs text-gray-500 hover:text-cyan-400">
            清空
          </button>
        </div>
      </div>

      <!-- 公钥（可选） -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="publicKey" class="block text-sm font-medium text-gray-300">公钥 (可选)</label>
          <button type="button" @click="toggleAdvanced"
            class="text-xs text-cyan-500 hover:text-cyan-400 flex items-center">
            <span v-if="showAdvanced" class="i-carbon-chevron-up text-sm mr-1"></span>
            <span v-else class="i-carbon-chevron-down text-sm mr-1"></span>
            {{ showAdvanced ? '隐藏高级选项' : '显示高级选项' }}
          </button>
        </div>
        <div v-if="showAdvanced" class="space-y-4">
          <textarea id="publicKey" v-model="formData.publicKey" rows="3" placeholder="输入接收者的公钥用于端到端加密 (可选)..."
            class="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-y"></textarea>
          <div class="text-xs text-gray-500">
            <p>• 如果不提供公钥，将使用系统默认密钥进行加密</p>
            <p>• 使用自定义公钥时，请确保安全保存，否则将无法解密数据</p>
          </div>
        </div>
      </div>

      <!-- 加密按钮 -->
      <div class="flex justify-center">
        <button type="submit" :disabled="loading || !formData.data"
          class="py-2.5 px-8 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 flex items-center btn-glow"
          :class="{ 'opacity-50 cursor-not-allowed': loading || !formData.data }">
          <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          <span v-else class="i-carbon-lock-closed mr-2"></span>
          {{ loading ? '加密中...' : '加密数据' }}
        </button>
      </div>
    </form>

    <!-- 加密结果 -->
    <div v-if="encryptedData" class="mt-8 pt-6 border-t border-gray-800">
      <h3 class="text-lg font-medium text-cyan-400 mb-3 flex items-center">
        <span class="i-carbon-checkmark-outline text-xl mr-2"></span>
        加密结果
      </h3>
      <div class="bg-black/40 p-4 rounded-lg border border-gray-800 overflow-auto max-h-[200px]">
        <pre class="text-green-300 text-sm whitespace-pre-wrap break-all font-mono">{{ encryptedData }}</pre>
      </div>

      <!-- 复制按钮 -->
      <div class="flex justify-end mt-3">
        <button @click="copyEncryptedData"
          class="py-1.5 px-4 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors flex items-center text-sm">
          <span class="i-carbon-copy mr-1.5"></span>
          复制加密数据
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useSecurityStore, EncryptParams } from '../../stores/security';

  const securityStore = useSecurityStore();

  // 状态
  const loading = computed(() => securityStore.isLoading);
  const error = computed(() => securityStore.getError);
  const encryptedData = computed(() => securityStore.getEncryptedData);
  const showAdvanced = ref(false);

  // 表单数据
  const formData = reactive<EncryptParams>({
    data: '',
    publicKey: '',
  });

  // 处理加密
  const handleEncrypt = async () => {
    if (!formData.data) return;

    try {
      await securityStore.encryptData({
        data: formData.data,
        publicKey: formData.publicKey || undefined
      });
    } catch (err) {
      console.error('加密失败:', err);
    }
  };

  // 复制加密数据
  const copyEncryptedData = () => {
    if (!encryptedData.value) return;

    navigator.clipboard.writeText(encryptedData.value)
      .then(() => {
        alert('加密数据已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 清空输入数据
  const clearInputData = () => {
    formData.data = '';
    formData.publicKey = '';
    securityStore.clearData();
  };

  // 切换高级选项显示
  const toggleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value;
  };
</script>

<style scoped>
  .encrypt-form {
    width: 100%;
  }

  .btn-glow:hover {
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
  }
</style>