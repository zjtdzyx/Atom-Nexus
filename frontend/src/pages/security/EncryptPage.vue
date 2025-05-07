<template>
  <div class="encrypt-page min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-cyan-400 flex items-center justify-center">
          <span class="i-carbon-data-encryption text-4xl mr-3"></span>
          数据加密
        </h1>
        <p class="mt-2 text-sm text-gray-400">
          对您的敏感数据进行安全加密，防止未授权访问
        </p>
      </div>

      <!-- 数据加密表单 -->
      <div class="encrypt-card bg-black/30 border border-cyan-800/30 rounded-xl p-8 shadow-glow">
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

      <!-- 提示卡片 -->
      <div class="mt-8 bg-black/20 border border-cyan-800/30 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-cyan-400 mb-4 flex items-center">
          <span class="i-carbon-information text-xl mr-2"></span>
          安全提示
        </h3>
        <ul class="space-y-2 text-sm text-gray-400">
          <li class="flex items-start">
            <span class="i-carbon-checkmark text-cyan-500 mr-2 mt-0.5"></span>
            加密后的数据只能使用对应的私钥或解密密钥解密
          </li>
          <li class="flex items-start">
            <span class="i-carbon-checkmark text-cyan-500 mr-2 mt-0.5"></span>
            请安全保存加密后的数据和解密密钥，一旦丢失将无法恢复
          </li>
          <li class="flex items-start">
            <span class="i-carbon-checkmark text-cyan-500 mr-2 mt-0.5"></span>
            使用公钥加密的数据只能由对应的私钥持有者解密，确保安全传输
          </li>
        </ul>
        <div class="mt-4 flex justify-end">
          <router-link to="/security/decrypt" class="text-cyan-500 hover:text-cyan-400 flex items-center text-sm">
            <span class="i-carbon-arrow-right mr-1"></span>
            前往解密页面
          </router-link>
        </div>
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
  .encrypt-page {
    background-image: radial-gradient(circle at center, rgba(34, 211, 238, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
    animation: fadeIn 0.5s ease-out;
  }

  .encrypt-card {
    background-image: radial-gradient(circle at top right, rgba(34, 211, 238, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
    position: relative;
    overflow: hidden;
  }

  .encrypt-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    background: linear-gradient(45deg, #0e7490, transparent, #0e7490, transparent);
    animation: glowBorder 3s linear infinite;
    border-radius: 12px;
    opacity: 0.3;
  }

  .shadow-glow {
    box-shadow: 0 0 25px rgba(34, 211, 238, 0.1);
  }

  .btn-glow {
    position: relative;
    overflow: hidden;
  }

  .btn-glow::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(34, 211, 238, 0.3), transparent);
    transform: rotate(45deg);
    animation: glowButton 2s linear infinite;
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

  @keyframes glowBorder {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 300% 0;
    }
  }

  @keyframes glowButton {
    0% {
      left: -100%;
    }

    100% {
      left: 100%;
    }
  }
</style>