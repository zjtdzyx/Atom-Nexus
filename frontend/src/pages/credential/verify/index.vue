<template>
  <div class="credential-verify-page">
    <!-- 页面标题和导航 -->
    <div class="page-header py-6">
      <div class="container">
        <div class="flex items-center mb-4">
          <router-link to="/credential" class="btn-secondary mr-4">
            <span class="i-carbon-arrow-left mr-1"></span>返回
          </router-link>
          <h1 class="text-2xl font-bold text-textlight">验证凭证</h1>
        </div>
      </div>
    </div>

    <div class="container py-6">
      <div class="max-w-3xl mx-auto">
        <div class="card p-6 mb-8">
          <h2 class="text-xl font-semibold text-textlight mb-4">验证可验证凭证</h2>
          <p class="text-textgray mb-6">请上传、粘贴凭证JSON数据或输入凭证ID进行验证</p>

          <!-- 验证方式选择 -->
          <div class="mb-6">
            <div class="flex space-x-4 bg-darkbg rounded-lg p-1 mb-6">
              <button @click="verifyMethod = 'upload'" class="flex-1 py-2 rounded-md text-center transition-colors"
                :class="verifyMethod === 'upload' ? 'bg-primary text-textlight' : 'text-textgray hover:text-textlight'">
                <span class="i-carbon-document-add mr-1"></span>上传凭证
              </button>
              <button @click="verifyMethod = 'paste'" class="flex-1 py-2 rounded-md text-center transition-colors"
                :class="verifyMethod === 'paste' ? 'bg-primary text-textlight' : 'text-textgray hover:text-textlight'">
                <span class="i-carbon-paste mr-1"></span>粘贴JSON
              </button>
              <button @click="verifyMethod = 'id'" class="flex-1 py-2 rounded-md text-center transition-colors"
                :class="verifyMethod === 'id' ? 'bg-primary text-textlight' : 'text-textgray hover:text-textlight'">
                <span class="i-carbon-search mr-1"></span>输入ID
              </button>
              <button @click="verifyMethod = 'qrcode'" class="flex-1 py-2 rounded-md text-center transition-colors"
                :class="verifyMethod === 'qrcode' ? 'bg-primary text-textlight' : 'text-textgray hover:text-textlight'">
                <span class="i-carbon-qr-code mr-1"></span>扫码验证
              </button>
            </div>

            <!-- 文件上传区域 -->
            <div v-if="verifyMethod === 'upload'" class="verify-upload">
              <div
                class="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-neon/50 transition-colors"
                @click="triggerFileUpload" @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false"
                @drop.prevent="onFileDrop" :class="{ 'border-neon bg-neon/10': dragOver }">
                <input ref="fileInput" type="file" class="hidden" accept="application/json" @change="onFileSelected" />
                <div v-if="!selectedFile" class="py-8">
                  <span class="i-carbon-document-add text-5xl text-textgray mb-4 block mx-auto"></span>
                  <p class="text-textlight mb-2">拖放凭证文件到此处或点击上传</p>
                  <p class="text-textgray text-sm">支持JSON格式的凭证文件</p>
                </div>
                <div v-else class="py-4">
                  <span class="i-carbon-document-verified text-4xl text-neon mb-3 block mx-auto"></span>
                  <p class="text-textlight mb-1">{{ selectedFile.name }}</p>
                  <p class="text-textgray text-sm mb-3">{{ formatFileSize(selectedFile.size) }}</p>
                  <button class="btn-secondary text-sm py-1" @click.stop="selectedFile = null">
                    <span class="i-carbon-close mr-1"></span>移除
                  </button>
                </div>
              </div>
              <div class="mt-6 flex justify-center">
                <button class="btn-primary py-2 px-8" :disabled="!selectedFile || isVerifying"
                  @click="verifyUploadedFile">
                  <span v-if="isVerifying" class="i-carbon-circle-dash animate-spin mr-2"></span>
                  验证凭证
                </button>
              </div>
            </div>

            <!-- JSON粘贴区域 -->
            <div v-if="verifyMethod === 'paste'" class="verify-paste">
              <div class="mb-4">
                <textarea v-model="credentialJson" rows="10" placeholder="在此粘贴凭证JSON数据..."
                  class="input w-full font-mono text-sm"></textarea>
              </div>
              <div class="flex justify-center">
                <button class="btn-primary py-2 px-8" :disabled="!credentialJson || isVerifying"
                  @click="verifyPastedJson">
                  <span v-if="isVerifying" class="i-carbon-circle-dash animate-spin mr-2"></span>
                  验证凭证
                </button>
              </div>
            </div>

            <!-- ID输入区域 -->
            <div v-if="verifyMethod === 'id'" class="verify-id">
              <div class="mb-4">
                <label class="block text-textlight mb-2">凭证ID</label>
                <input v-model="credentialId" type="text" placeholder="输入凭证ID..." class="input w-full">
                <p class="text-xs text-textgray mt-1">输入您想要验证的凭证ID</p>
              </div>
              <div class="flex justify-center">
                <button class="btn-primary py-2 px-8" :disabled="!credentialId || isVerifying"
                  @click="verifyCredentialById">
                  <span v-if="isVerifying" class="i-carbon-circle-dash animate-spin mr-2"></span>
                  验证凭证
                </button>
              </div>
            </div>

            <!-- 二维码扫描区域 -->
            <div v-if="verifyMethod === 'qrcode'" class="verify-qrcode">
              <VerifyQrCode @code-detected="handleQrCodeDetected" />
            </div>

            <!-- 高级验证选项 -->
            <VerifyOptions v-if="verifyMethod !== 'qrcode'" v-model:options="verifyOptions" class="mt-6" />
          </div>
        </div>

        <!-- 验证结果 -->
        <div v-if="verifyResult" class="verify-result">
          <VerifiedCredentialCard :credential="verifiedCredential" :is-valid="verifyResult.isValid"
            :verification-time="new Date().toISOString()" :verification-method="getVerificationMethod()"
            :errors="verifyResult.errors || []" @view-details="viewFullCredential" @verify-again="resetVerification"
            @use-credential="useCredential" @show-errors="showErrors" />

          <div class="mt-6">
            <div class="bg-darkbg/30 rounded-lg p-4 mb-6">
              <h4 class="text-sm font-medium text-textlight mb-3">详细检查结果</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-textlight">格式检查</span>
                    <p class="text-xs text-textgray">验证凭证格式是否符合标准</p>
                  </div>
                  <span :class="verifyResult.checks.format ? 'text-green-500' : 'text-red-500'" class="font-medium">
                    {{ verifyResult.checks.format ? '通过' : '失败' }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-textlight">签名检查</span>
                    <p class="text-xs text-textgray">验证发行者签名是否有效</p>
                  </div>
                  <span :class="verifyResult.checks.signature ? 'text-green-500' : 'text-red-500'" class="font-medium">
                    {{ verifyResult.checks.signature ? '通过' : '失败' }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-textlight">过期检查</span>
                    <p class="text-xs text-textgray">验证凭证是否已过期</p>
                  </div>
                  <span :class="!verifyResult.checks.expired ? 'text-green-500' : 'text-red-500'" class="font-medium">
                    {{ !verifyResult.checks.expired ? '通过' : '已过期' }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-textlight">吊销检查</span>
                    <p class="text-xs text-textgray">验证凭证是否已被撤销</p>
                  </div>
                  <span :class="!verifyResult.checks.revoked ? 'text-green-500' : 'text-red-500'" class="font-medium">
                    {{ !verifyResult.checks.revoked ? '通过' : '已撤销' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-center space-x-4">
              <button class="btn-secondary py-2 px-6" @click="resetVerification">
                <span class="i-carbon-reset mr-1"></span>重新验证
              </button>
              <button v-if="verifyResult.isValid" class="btn-primary py-2 px-6" @click="exportVerifiedCredential">
                <span class="i-carbon-export mr-1"></span>导出凭证
              </button>
            </div>
          </div>
        </div>

        <!-- 验证最佳实践提示 -->
        <div v-if="!verifyResult" class="mt-8 bg-primary/40 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-textlight mb-3">验证最佳实践</h3>
          <ul class="space-y-2 text-textgray">
            <li class="flex items-start">
              <span class="i-carbon-checkmark-filled text-neon mt-1 mr-2"></span>
              <span>确保您从可信来源获取凭证，验证发行者的DID是否可信</span>
            </li>
            <li class="flex items-start">
              <span class="i-carbon-checkmark-filled text-neon mt-1 mr-2"></span>
              <span>检查凭证是否过期或被撤销，尤其是重要的身份或资格凭证</span>
            </li>
            <li class="flex items-start">
              <span class="i-carbon-checkmark-filled text-neon mt-1 mr-2"></span>
              <span>验证后妥善保存验证结果，必要时保留验证记录</span>
            </li>
            <li class="flex items-start">
              <span class="i-carbon-checkmark-filled text-neon mt-1 mr-2"></span>
              <span>对于高敏感度凭证，建议通过多种方式交叉验证其真实性</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 完整凭证查看模态框 -->
    <div v-if="showFullCredentialModal"
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-3xl m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-textlight">完整凭证数据</h3>
          <button @click="showFullCredentialModal = false" class="text-textgray hover:text-neon">
            <span class="i-carbon-close"></span>
          </button>
        </div>
        <div class="modal-body p-6">
          <div class="bg-darkbg/50 p-4 rounded-lg overflow-auto max-h-[70vh]">
            <pre
              class="text-textlight font-mono text-sm whitespace-pre-wrap">{{ JSON.stringify(verifiedCredential, null, 2) }}</pre>
          </div>
          <div class="mt-6 flex justify-end">
            <button class="btn-secondary" @click="showFullCredentialModal = false">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误详情模态框 -->
    <div v-if="showErrorsModal" class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-xl m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-textlight">验证错误详情</h3>
          <button @click="showErrorsModal = false" class="text-textgray hover:text-neon">
            <span class="i-carbon-close"></span>
          </button>
        </div>
        <div class="modal-body p-6">
          <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <span class="i-carbon-warning-filled text-red-500 text-2xl block mx-auto mb-2"></span>
            <h4 class="text-center text-red-500 font-medium mb-4">验证失败</h4>
            <ul class="space-y-2">
              <li v-for="(error, index) in verifyResult?.errors" :key="index" class="text-textlight text-sm">
                <span class="i-carbon-close-filled text-red-500 mr-2"></span>{{ error }}
              </li>
            </ul>
          </div>
          <p class="text-textgray text-sm mb-4">
            以下是一些可能导致验证失败的常见原因：
          </p>
          <ul class="text-textgray text-sm space-y-2 mb-6">
            <li class="flex items-start">
              <span class="i-carbon-dot-mark mr-2 mt-1"></span>
              <span>凭证签名不匹配或已被篡改</span>
            </li>
            <li class="flex items-start">
              <span class="i-carbon-dot-mark mr-2 mt-1"></span>
              <span>发行者DID无法解析或不被信任</span>
            </li>
            <li class="flex items-start">
              <span class="i-carbon-dot-mark mr-2 mt-1"></span>
              <span>凭证已过期或已被撤销</span>
            </li>
            <li class="flex items-start">
              <span class="i-carbon-dot-mark mr-2 mt-1"></span>
              <span>凭证格式无效或不符合标准规范</span>
            </li>
          </ul>
          <div class="flex justify-end">
            <button class="btn-secondary" @click="showErrorsModal = false">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useCredentialStore, type VerifyResult } from '../../../stores/credential';
  import { logger } from '../../../utils/logger';
  import VerifyOptions from '../../../components/credential/VerifyOptions.vue';
  import VerifyQrCode from '../../../components/credential/VerifyQrCode.vue';
  import VerifiedCredentialCard from '../../../components/credential/VerifiedCredentialCard.vue';

  // 初始化路由和存储
  const route = useRoute();
  const router = useRouter();
  const credentialStore = useCredentialStore();

  // 页面状态
  const verifyMethod = ref('upload');
  const isVerifying = ref(false);
  const showFullCredentialModal = ref(false);
  const showErrorsModal = ref(false);

  // 上传文件状态
  const fileInput = ref<HTMLInputElement | null>(null);
  const selectedFile = ref<File | null>(null);
  const dragOver = ref(false);

  // 粘贴JSON状态
  const credentialJson = ref('');

  // ID输入状态
  const credentialId = ref('');

  // 验证选项
  const verifyOptions = reactive({
    trustPolicy: 'medium',
    verifySignature: true,
    verifyStatus: true,
    verifyExpiry: true,
    verifySchema: true,
    offlineVerification: false,
    recordVerification: true
  });

  // 验证结果
  const verifyResult = ref<VerifyResult | null>(null);
  const verifiedCredential = ref<any>(null);

  // 页面加载时检查URL参数
  onMounted(() => {
    logger.info('Page:CredentialVerify', '凭证验证页面已加载');

    // 如果URL中有凭证ID参数，自动填充并选择ID验证模式
    const idParam = route.query.id;
    if (idParam) {
      credentialId.value = idParam as string;
      verifyMethod.value = 'id';
      // 如果有autoVerify参数，则自动验证
      if (route.query.autoVerify === 'true') {
        verifyCredentialById();
      }
    }
  });

  // 触发文件上传对话框
  const triggerFileUpload = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };

  // 文件选择处理
  const onFileSelected = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile.value = input.files[0];
      logger.info('Page:CredentialVerify', '选择文件', { fileName: selectedFile.value.name });
    }
  };

  // 文件拖放处理
  const onFileDrop = (event: DragEvent) => {
    dragOver.value = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        selectedFile.value = file;
        logger.info('Page:CredentialVerify', '拖放文件', { fileName: file.name });
      } else {
        alert('请上传JSON格式的凭证文件');
      }
    }
  };

  // 验证上传的文件
  const verifyUploadedFile = async () => {
    if (!selectedFile.value) return;

    isVerifying.value = true;
    logger.info('Page:CredentialVerify', '开始验证上传的凭证文件', { fileName: selectedFile.value.name });

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          await performVerification(jsonData);
        } catch (error) {
          logger.error('Page:CredentialVerify', '凭证JSON解析失败', { error });
          alert('无效的JSON格式');
          isVerifying.value = false;
        }
      };

      reader.onerror = () => {
        logger.error('Page:CredentialVerify', '文件读取失败');
        alert('文件读取失败');
        isVerifying.value = false;
      };

      reader.readAsText(selectedFile.value);
    } catch (error: any) {
      logger.error('Page:CredentialVerify', '文件处理失败', { error: error.message });
      alert(`验证失败: ${error.message}`);
      isVerifying.value = false;
    }
  };

  // 验证粘贴的JSON
  const verifyPastedJson = async () => {
    if (!credentialJson.value) return;

    isVerifying.value = true;
    logger.info('Page:CredentialVerify', '开始验证粘贴的JSON');

    try {
      const jsonData = JSON.parse(credentialJson.value);
      await performVerification(jsonData);
    } catch (error: any) {
      logger.error('Page:CredentialVerify', 'JSON解析失败', { error: error.message });
      alert(`无效的JSON格式: ${error.message}`);
      isVerifying.value = false;
    }
  };

  // 通过ID验证凭证
  const verifyCredentialById = async () => {
    if (!credentialId.value) return;

    isVerifying.value = true;
    logger.info('Page:CredentialVerify', '开始通过ID验证凭证', { id: credentialId.value });

    try {
      // 调用API验证凭证
      const result = await credentialStore.verifyCredential(credentialId.value);
      verifyResult.value = result;

      // 获取凭证详情
      await credentialStore.fetchCredentialById(credentialId.value);
      verifiedCredential.value = credentialStore.currentCredential;

      logger.info('Page:CredentialVerify', '凭证验证完成', { isValid: result.isValid });
    } catch (error: any) {
      logger.error('Page:CredentialVerify', '凭证验证失败', { error: error.message });
      alert(`验证失败: ${error.message}`);
    } finally {
      isVerifying.value = false;
    }
  };

  // 处理QR码检测
  const handleQrCodeDetected = async (data: string) => {
    logger.info('Page:CredentialVerify', '处理QR码检测到的数据', { data });

    // 检查是否为凭证URL或ID
    if (data.startsWith('http')) {
      // 从URL中提取ID
      const id = data.split('/').pop();
      if (id) {
        credentialId.value = id;
        await verifyCredentialById();
      }
    } else {
      // 直接作为ID使用
      credentialId.value = data;
      await verifyCredentialById();
    }
  };

  // 执行验证逻辑
  const performVerification = async (credentialData: any) => {
    try {
      // 调用API验证凭证
      const result = await credentialStore.verifyCredentialJson(credentialData);
      verifyResult.value = result;
      verifiedCredential.value = credentialData;

      logger.info('Page:CredentialVerify', '凭证验证完成', { isValid: result.isValid });
    } catch (error: any) {
      logger.error('Page:CredentialVerify', '凭证验证失败', { error: error.message });
      alert(`验证失败: ${error.message}`);
    } finally {
      isVerifying.value = false;
    }
  };

  // 重置验证
  const resetVerification = () => {
    logger.info('Page:CredentialVerify', '重置验证');
    verifyResult.value = null;
    verifiedCredential.value = null;
  };

  // 查看完整凭证
  const viewFullCredential = () => {
    showFullCredentialModal.value = true;
    logger.info('Page:CredentialVerify', '查看完整凭证数据');
  };

  // 显示错误详情
  const showErrors = () => {
    showErrorsModal.value = true;
    logger.info('Page:CredentialVerify', '查看验证错误详情');
  };

  // 使用凭证
  const useCredential = () => {
    if (!verifiedCredential.value || !verifiedCredential.value.id) return;

    logger.info('Page:CredentialVerify', '使用验证通过的凭证', { id: verifiedCredential.value.id });
    router.push(`/credential/${verifiedCredential.value.id}`);
  };

  // 导出验证的凭证
  const exportVerifiedCredential = () => {
    if (!verifiedCredential.value) return;

    logger.info('Page:CredentialVerify', '导出验证的凭证');

    const blob = new Blob([JSON.stringify(verifiedCredential.value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verified-credential-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 获取验证方式文本
  const getVerificationMethod = () => {
    switch (verifyMethod.value) {
      case 'upload': return '文件上传验证';
      case 'paste': return 'JSON粘贴验证';
      case 'id': return 'ID验证';
      case 'qrcode': return '二维码/NFC验证';
      default: return '在线验证';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
</script>

<style scoped>
  .input {
    @apply w-full px-4 py-2 bg-darkbg/50 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50;
  }

  .modal-backdrop {
    backdrop-filter: blur(4px);
  }

  .btn-primary {
    @apply bg-neon text-black font-medium rounded-lg hover:bg-neon/90 transition-colors;
  }

  .btn-secondary {
    @apply bg-darkbg border border-gray-700 text-textlight font-medium rounded-lg hover:bg-primary/80 transition-colors;
  }
</style>