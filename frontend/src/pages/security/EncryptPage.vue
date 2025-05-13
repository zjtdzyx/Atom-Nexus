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
        <EncryptForm />
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
  import { onMounted } from 'vue';
  import { logger } from '../../utils/logger';
  import EncryptForm from '../../components/security/EncryptForm.vue';

  onMounted(() => {
    logger.info('Page:Security:Encrypt', '数据加密页面已加载');
  });
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
    border-radius: 12px;
    background: linear-gradient(45deg, transparent, rgba(34, 211, 238, 0.1), transparent);
    z-index: -1;
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

  .shadow-glow {
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.15);
  }
</style>