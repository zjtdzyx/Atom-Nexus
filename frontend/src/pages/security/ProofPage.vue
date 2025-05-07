<template>
  <div class="proof-page min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-cyan-400 flex items-center justify-center">
          <span class="i-carbon-fingerprint text-4xl mr-3"></span>
          零知识证明
        </h1>
        <p class="mt-2 text-sm text-gray-400">
          生成隐私保护的零知识证明，验证身份或属性而不泄露原始数据
        </p>
      </div>

      <!-- 证明生成表单 -->
      <div class="proof-card bg-black/30 border border-cyan-800/30 rounded-xl p-8 shadow-glow">
        <form @submit.prevent="handleGenerateProof" class="space-y-6">
          <!-- 错误提示 -->
          <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-400">
            <div class="flex items-center">
              <span class="i-carbon-warning-filled text-xl mr-2"></span>
              <span>{{ error }}</span>
            </div>
          </div>

          <!-- 输入DID -->
          <div>
            <label for="did" class="block text-sm font-medium text-gray-300 mb-2">去中心化身份标识符 (DID) <span
                class="text-red-500">*</span></label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="i-carbon-id text-gray-500"></span>
              </div>
              <input type="text" id="did" v-model="formData.did" required placeholder="例如: did:ethr:0x1234..."
                class="w-full py-2 pl-10 pr-3 bg-black/30 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all" />
            </div>
          </div>

          <!-- 高级选项 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-300">高级选项</label>
              <button type="button" @click="toggleAdvanced"
                class="text-xs text-cyan-500 hover:text-cyan-400 flex items-center">
                <span v-if="showAdvanced" class="i-carbon-chevron-up text-sm mr-1"></span>
                <span v-else class="i-carbon-chevron-down text-sm mr-1"></span>
                {{ showAdvanced ? '隐藏高级选项' : '显示高级选项' }}
              </button>
            </div>
            <div v-if="showAdvanced" class="space-y-4">
              <!-- 陈述 -->
              <div>
                <label for="statement" class="block text-sm font-medium text-gray-300 mb-1">陈述 (可选)</label>
                <textarea id="statement" v-model="formData.statement" rows="2" placeholder="输入您想证明的陈述..."
                  class="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-y"></textarea>
              </div>

              <!-- 属性 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">证明属性 (可选)</label>
                <div class="space-y-2">
                  <div v-for="(attr, index) in attributes" :key="index" class="flex items-center space-x-2">
                    <input type="text" v-model="attributes[index]" :placeholder="`属性 ${index + 1}`"
                      class="flex-1 py-2 px-4 bg-black/30 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all" />
                    <button type="button" @click="removeAttribute(index)"
                      class="p-2 text-gray-400 hover:text-red-400 transition-colors" title="删除属性">
                      <span class="i-carbon-close"></span>
                    </button>
                  </div>
                  <button type="button" @click="addAttribute"
                    class="text-sm text-cyan-500 hover:text-cyan-400 flex items-center">
                    <span class="i-carbon-add text-lg mr-1"></span>
                    添加属性
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 生成证明按钮 -->
          <div class="flex justify-center">
            <button type="submit" :disabled="loading || !formData.did"
              class="py-2.5 px-8 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 flex items-center btn-glow"
              :class="{ 'opacity-50 cursor-not-allowed': loading || !formData.did }">
              <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
              <span v-else class="i-carbon-security mr-2"></span>
              {{ loading ? '生成中...' : '生成零知识证明' }}
            </button>
          </div>
        </form>

        <!-- 证明结果 -->
        <div v-if="proofData" class="mt-8 pt-6 border-t border-gray-800">
          <h3 class="text-lg font-medium text-cyan-400 mb-3 flex items-center">
            <span class="i-carbon-checkmark-outline text-xl mr-2"></span>
            证明数据
          </h3>
          <div class="bg-black/40 p-4 rounded-lg border border-gray-800 overflow-auto max-h-[250px]">
            <pre class="text-green-300 text-sm whitespace-pre-wrap break-all font-mono">{{ formattedProofData }}</pre>
          </div>

          <!-- 复制按钮 -->
          <div class="flex justify-end mt-3">
            <button @click="copyProofData"
              class="py-1.5 px-4 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors flex items-center text-sm">
              <span class="i-carbon-copy mr-1.5"></span>
              复制证明数据
            </button>
          </div>
        </div>
      </div>

      <!-- 提示卡片 -->
      <div class="mt-8 bg-black/20 border border-cyan-800/30 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-cyan-400 mb-4 flex items-center">
          <span class="i-carbon-information text-xl mr-2"></span>
          零知识证明介绍
        </h3>
        <div class="space-y-4 text-sm text-gray-400">
          <p>
            零知识证明(ZKP)是一种密码学技术，允许一方(证明者)向另一方(验证者)证明某个陈述是真实的，而无需透露除了该陈述为真实外的任何信息。
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 rounded-lg bg-black/30 border border-gray-800">
              <div class="text-sm text-cyan-400 mb-1 font-medium">主要优势</div>
              <ul class="space-y-1 pl-3">
                <li class="text-xs flex items-start">
                  <span class="i-carbon-checkmark text-cyan-500 mr-1 mt-0.5 flex-shrink-0"></span>
                  <span>保护隐私：只证明必要信息，不泄露敏感数据</span>
                </li>
                <li class="text-xs flex items-start">
                  <span class="i-carbon-checkmark text-cyan-500 mr-1 mt-0.5 flex-shrink-0"></span>
                  <span>高效验证：验证过程快速且资源消耗低</span>
                </li>
                <li class="text-xs flex items-start">
                  <span class="i-carbon-checkmark text-cyan-500 mr-1 mt-0.5 flex-shrink-0"></span>
                  <span>不可篡改：基于密码学保证，无法伪造证明</span>
                </li>
              </ul>
            </div>
            <div class="p-3 rounded-lg bg-black/30 border border-gray-800">
              <div class="text-sm text-cyan-400 mb-1 font-medium">应用场景</div>
              <ul class="space-y-1 pl-3">
                <li class="text-xs flex items-start">
                  <span class="i-carbon-checkmark text-cyan-500 mr-1 mt-0.5 flex-shrink-0"></span>
                  <span>身份验证：证明年龄或资格而不泄露个人信息</span>
                </li>
                <li class="text-xs flex items-start">
                  <span class="i-carbon-checkmark text-cyan-500 mr-1 mt-0.5 flex-shrink-0"></span>
                  <span>隐私支付：证明交易有效性而不暴露金额或参与者</span>
                </li>
                <li class="text-xs flex items-start">
                  <span class="i-carbon-checkmark text-cyan-500 mr-1 mt-0.5 flex-shrink-0"></span>
                  <span>隐私投票：证明投票权而不泄露投票内容</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-start">
          <router-link to="/security/decrypt" class="text-cyan-500 hover:text-cyan-400 flex items-center text-sm">
            <span class="i-carbon-arrow-left mr-1"></span>
            返回解密页面
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useSecurityStore, ProofParams } from '../../stores/security';

  const securityStore = useSecurityStore();

  // 状态
  const loading = computed(() => securityStore.isLoading);
  const error = computed(() => securityStore.getError);
  const proofData = computed(() => securityStore.getProofData);
  const showAdvanced = ref(false);
  const attributes = ref<string[]>([]);

  // 表单数据
  const formData = reactive<ProofParams>({
    did: '',
    statement: '',
  });

  // 格式化证明数据
  const formattedProofData = computed(() => {
    if (!proofData.value) return '';
    return JSON.stringify(proofData.value, null, 2);
  });

  // 处理生成证明
  const handleGenerateProof = async () => {
    if (!formData.did) return;

    try {
      // 过滤掉空属性
      const filteredAttributes = attributes.value.filter(attr => attr.trim() !== '');

      await securityStore.generateProof({
        did: formData.did,
        statement: formData.statement || undefined,
        attributes: filteredAttributes.length > 0 ? filteredAttributes : undefined
      });
    } catch (err) {
      console.error('生成证明失败:', err);
    }
  };

  // 复制证明数据
  const copyProofData = () => {
    if (!proofData.value) return;

    navigator.clipboard.writeText(formattedProofData.value)
      .then(() => {
        alert('证明数据已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 添加属性
  const addAttribute = () => {
    attributes.value.push('');
  };

  // 删除属性
  const removeAttribute = (index: number) => {
    attributes.value.splice(index, 1);
  };

  // 切换高级选项显示
  const toggleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value;
    if (showAdvanced.value && attributes.value.length === 0) {
      // 初始添加一个空属性
      addAttribute();
    }
  };
</script>

<style scoped>
  .proof-page {
    background-image: radial-gradient(circle at center, rgba(34, 211, 238, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
    animation: fadeIn 0.5s ease-out;
  }

  .proof-card {
    background-image: radial-gradient(circle at top right, rgba(34, 211, 238, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
    position: relative;
    overflow: hidden;
  }

  .proof-card::before {
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