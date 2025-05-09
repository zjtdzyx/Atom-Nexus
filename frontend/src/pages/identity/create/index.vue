<template>
  <div class="identity-create-page">
    <!-- 页面标题和导航 -->
    <div class="page-header py-6">
      <div class="container">
        <div class="flex items-center mb-4">
          <router-link to="/identity" class="btn-secondary mr-4">
            <span class="i-carbon-arrow-left mr-1"></span>返回
          </router-link>
          <h1 class="text-2xl font-bold text-textlight">创建新身份</h1>
        </div>
      </div>
    </div>

    <div class="container py-6">
      <!-- 步骤导航 -->
      <div class="steps-nav mb-8">
        <div class="flex justify-between items-center">
          <div v-for="(step, index) in steps" :key="index" class="step-item flex-1 flex flex-col items-center"
            :class="{ 'active': currentStep >= index, 'completed': currentStep > index }">
            <div class="step-number w-10 h-10 rounded-full flex items-center justify-center text-textlight mb-2"
              :class="currentStep === index ? 'bg-neon' : currentStep > index ? 'bg-green-500' : 'bg-gray-700'">
              <span v-if="currentStep > index" class="i-carbon-checkmark"></span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-title text-sm" :class="currentStep >= index ? 'text-textlight' : 'text-textgray'">
              {{ step.title }}
            </div>
          </div>
        </div>
        <div class="step-progress mt-4 h-1 bg-gray-700 rounded-full">
          <div class="h-full bg-neon rounded-full transition-all duration-300" :style="`width: ${progressPercentage}%`">
          </div>
        </div>
      </div>

      <!-- 步骤内容 -->
      <div class="steps-content">
        <!-- 选择身份类型 -->
        <div v-if="currentStep === 0" class="step-1">
          <div class="card p-6 mb-6">
            <h2 class="text-xl font-semibold text-textlight mb-4">选择身份类型</h2>
            <p class="text-textgray mb-6">请选择您想要创建的DID方法类型，不同的方法适用于不同的场景。</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="method in didMethods" :key="method.id"
                class="did-method-card p-4 rounded-lg border border-gray-700 cursor-pointer transition-all duration-200"
                :class="{ 'border-neon bg-neon/10': selectedMethod === method.id }" @click="selectMethod(method.id)">
                <div class="flex flex-col items-center">
                  <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
                    <span
                      :class="method.icon + ' text-3xl ' + (selectedMethod === method.id ? 'text-neon' : 'text-textgray')"></span>
                  </div>
                  <h3 class="text-center font-medium text-textlight mb-1">{{ method.name }}</h3>
                  <p class="text-center text-sm text-textgray">{{ method.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button class="btn-primary py-3 px-6" :disabled="!selectedMethod"
              :class="{ 'opacity-50 cursor-not-allowed': !selectedMethod }" @click="nextStep">
              下一步
            </button>
          </div>
        </div>

        <!-- 配置身份信息 -->
        <div v-else-if="currentStep === 1" class="step-2">
          <div class="card p-6 mb-6">
            <h2 class="text-xl font-semibold text-textlight mb-4">配置身份信息</h2>
            <p class="text-textgray mb-6">请填写您的身份信息，带 * 的为必填项。</p>

            <form @submit.prevent="nextStep">
              <!-- 身份别名 -->
              <div class="mb-4">
                <label class="block text-textlight mb-2">身份别名 *</label>
                <input v-model="identityForm.alias" type="text" placeholder="例如：个人主身份、工作身份" class="input w-full"
                  :class="{ 'border-red-500': formErrors.alias }">
                <p v-if="formErrors.alias" class="text-red-500 text-xs mt-1">{{ formErrors.alias }}</p>
              </div>

              <!-- 身份描述 -->
              <div class="mb-4">
                <label class="block text-textlight mb-2">身份描述</label>
                <textarea v-model="identityForm.description" placeholder="可选的身份描述..."
                  class="input w-full h-24 resize-none"></textarea>
              </div>

              <!-- 高级选项（根据选定的方法类型显示不同选项） -->
              <div v-if="selectedMethod === 'key'" class="advanced-options mb-4">
                <h3 class="text-lg font-medium text-textlight mb-2">高级选项</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-textlight mb-2">密钥类型</label>
                    <select v-model="identityForm.keyType" class="input w-full">
                      <option value="Ed25519">Ed25519 (推荐)</option>
                      <option value="secp256k1">secp256k1</option>
                      <option value="RSA">RSA</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-textlight mb-2">设为默认身份</label>
                    <div class="flex items-center mt-3">
                      <input type="checkbox" id="isDefaultCheckbox" v-model="identityForm.isDefault"
                        class="h-5 w-5 rounded border-gray-500 text-neon focus:ring-neon">
                      <label for="isDefaultCheckbox" class="ml-2 text-textgray">将此身份设为默认身份</label>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="selectedMethod === 'ethr'" class="advanced-options mb-4">
                <h3 class="text-lg font-medium text-textlight mb-2">高级选项</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-textlight mb-2">区块链网络</label>
                    <select v-model="identityForm.network" class="input w-full">
                      <option value="mainnet">以太坊主网</option>
                      <option value="goerli">Goerli 测试网</option>
                      <option value="polygon">Polygon</option>
                      <option value="arbitrum">Arbitrum</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-textlight mb-2">设为默认身份</label>
                    <div class="flex items-center mt-3">
                      <input type="checkbox" id="isDefaultCheckbox" v-model="identityForm.isDefault"
                        class="h-5 w-5 rounded border-gray-500 text-neon focus:ring-neon">
                      <label for="isDefaultCheckbox" class="ml-2 text-textgray">将此身份设为默认身份</label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div class="flex justify-between">
            <button class="btn-secondary py-3 px-6" @click="prevStep">
              上一步
            </button>
            <button class="btn-primary py-3 px-6" @click="validateAndProceed">
              下一步
            </button>
          </div>
        </div>

        <!-- 确认创建 -->
        <div v-else-if="currentStep === 2" class="step-3">
          <div class="card p-6 mb-6">
            <h2 class="text-xl font-semibold text-textlight mb-4">确认创建</h2>
            <p class="text-textgray mb-6">请确认以下信息无误，点击"创建"按钮完成身份创建。</p>

            <div class="summary bg-darkbg/50 p-4 rounded-lg mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 class="text-lg font-medium text-textlight mb-2">身份类型</h3>
                  <p class="text-textgray">{{ getMethodName(selectedMethod) }}</p>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-textlight mb-2">身份别名</h3>
                  <p class="text-textgray">{{ identityForm.alias }}</p>
                </div>
                <div v-if="identityForm.description">
                  <h3 class="text-lg font-medium text-textlight mb-2">身份描述</h3>
                  <p class="text-textgray">{{ identityForm.description }}</p>
                </div>
                <div v-if="selectedMethod === 'key'">
                  <h3 class="text-lg font-medium text-textlight mb-2">密钥类型</h3>
                  <p class="text-textgray">{{ identityForm.keyType }}</p>
                </div>
                <div v-if="selectedMethod === 'ethr'">
                  <h3 class="text-lg font-medium text-textlight mb-2">区块链网络</h3>
                  <p class="text-textgray">{{ getNetworkName(identityForm.network) }}</p>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-textlight mb-2">默认身份</h3>
                  <p class="text-textgray">{{ identityForm.isDefault ? '是' : '否' }}</p>
                </div>
              </div>
            </div>

            <div class="notice bg-yellow-500/10 p-4 border border-yellow-500/20 rounded-lg mb-6">
              <div class="flex items-start">
                <span class="i-carbon-warning text-yellow-500 text-xl mr-3 mt-0.5"></span>
                <div>
                  <h3 class="text-textlight font-medium mb-1">重要提示</h3>
                  <p class="text-textgray text-sm">创建身份后，系统将为您生成密钥对。请确保安全保存您的私钥，一旦丢失将无法恢复。</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between">
            <button class="btn-secondary py-3 px-6" @click="prevStep">
              上一步
            </button>
            <button class="btn-primary py-3 px-6" :disabled="isCreating" @click="createIdentity">
              <span v-if="isCreating" class="i-carbon-circle-dash animate-spin mr-2"></span>
              创建身份
            </button>
          </div>
        </div>

        <!-- 创建完成 -->
        <div v-else-if="currentStep === 3" class="step-4">
          <div class="card p-6 mb-6">
            <div class="text-center py-6">
              <div class="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <span class="i-carbon-checkmark-filled text-green-500 text-4xl"></span>
              </div>
              <h2 class="text-2xl font-semibold text-textlight mb-2">身份创建成功</h2>
              <p class="text-textgray mb-8">您的新身份已创建成功，可以开始使用了</p>

              <div class="did-info mb-6 mx-auto max-w-2xl">
                <h3 class="text-lg font-medium text-textlight mb-2">您的DID</h3>
                <div class="relative">
                  <pre
                    class="text-sm font-mono bg-darkbg rounded p-3 text-textgray overflow-x-auto">{{ createdIdentity?.did }}</pre>
                  <button @click="copyDid" class="absolute top-2 right-2 p-1 bg-primary/60 rounded hover:bg-primary">
                    <span class="i-carbon-copy text-textgray"></span>
                  </button>
                </div>
              </div>

              <div class="notice bg-red-500/10 p-4 border border-red-500/20 rounded-lg mx-auto max-w-2xl mb-8">
                <div class="flex items-start">
                  <span class="i-carbon-warning-alt text-red-500 text-xl mr-3 mt-0.5"></span>
                  <div class="text-left">
                    <h3 class="text-textlight font-medium mb-1">安全警告</h3>
                    <p class="text-textgray text-sm">请务必备份您的身份恢复文件，一旦丢失将无法找回。</p>
                  </div>
                </div>
              </div>

              <div class="buttons space-x-4">
                <button class="btn-secondary py-3 px-6" @click="downloadBackup">
                  <span class="i-carbon-document-download mr-2"></span>
                  下载备份
                </button>
                <router-link :to="`/identity/${createdIdentity?.id}`" class="btn-primary py-3 px-6">
                  <span class="i-carbon-view mr-2"></span>
                  查看身份
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIdentityStore, type Identity } from '../../../stores/identity';
  import { logger } from '../../../utils/logger';

  // 初始化路由和存储
  const router = useRouter();
  const identityStore = useIdentityStore();

  // 步骤状态
  const steps = [
    { title: '选择类型' },
    { title: '基本信息' },
    { title: '确认创建' },
    { title: '创建完成' }
  ];
  const currentStep = ref(0);
  const progressPercentage = computed(() => (currentStep.value / (steps.length - 1)) * 100);

  // DID方法选择
  const didMethods = [
    {
      id: 'key',
      name: 'did:key',
      description: '基于密钥生成的DID，适合本地使用',
      icon: 'i-carbon-key'
    },
    {
      id: 'ethr',
      name: 'did:ethr',
      description: '基于以太坊地址的DID，区块链存证',
      icon: 'i-carbon-logo-ethereum'
    },
    {
      id: 'web',
      name: 'did:web',
      description: '基于网站域名的DID，适合组织使用',
      icon: 'i-carbon-globe'
    },
    {
      id: 'email',
      name: 'did:email',
      description: '基于邮箱的DID，方便日常使用',
      icon: 'i-carbon-email'
    }
  ];
  const selectedMethod = ref('');

  // 身份表单
  const identityForm = ref({
    alias: '',
    description: '',
    keyType: 'Ed25519',
    network: 'mainnet',
    isDefault: false
  });
  const formErrors = ref({
    alias: ''
  });

  // 创建状态
  const isCreating = ref(false);
  const createdIdentity = ref<Identity | null>(null);

  // 页面加载日志
  onMounted(() => {
    logger.info('Page:IdentityCreate', '创建身份页面已加载');
  });

  // 选择DID方法
  const selectMethod = (methodId: string) => {
    selectedMethod.value = methodId;
    logger.info('Page:IdentityCreate', '选择身份类型', { method: methodId });
  };

  // 获取方法名称
  const getMethodName = (methodId: string): string => {
    const method = didMethods.find(m => m.id === methodId);
    return method?.name || '';
  };

  // 获取网络名称
  const getNetworkName = (networkId: string): string => {
    const networks: Record<string, string> = {
      'mainnet': '以太坊主网',
      'goerli': 'Goerli 测试网',
      'polygon': 'Polygon',
      'arbitrum': 'Arbitrum'
    };
    return networks[networkId] || networkId;
  };

  // 下一步
  const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
      logger.info('Page:IdentityCreate', '进入下一步', { step: currentStep.value + 1 });
    }
  };

  // 上一步
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
      logger.info('Page:IdentityCreate', '返回上一步', { step: currentStep.value + 1 });
    }
  };

  // 验证并继续
  const validateAndProceed = () => {
    // 重置错误
    formErrors.value = {
      alias: ''
    };

    // 验证别名
    if (!identityForm.value.alias) {
      formErrors.value.alias = '身份别名不能为空';
      return;
    }

    nextStep();
  };

  // 创建身份
  const createIdentity = async () => {
    isCreating.value = true;
    logger.info('Page:IdentityCreate', '开始创建身份', {
      method: selectedMethod.value,
      alias: identityForm.value.alias
    });

    try {
      // 构建创建参数
      const createParams: Partial<Identity> = {
        method: selectedMethod.value as 'key' | 'web' | 'ethr' | 'email',
        alias: identityForm.value.alias,
        status: 'active',
        isDefault: identityForm.value.isDefault,
        metadata: {
          description: identityForm.value.description
        }
      };

      // 根据不同方法添加额外参数
      if (selectedMethod.value === 'key') {
        createParams.metadata = {
          ...createParams.metadata,
          keyType: identityForm.value.keyType
        };
      } else if (selectedMethod.value === 'ethr') {
        createParams.metadata = {
          ...createParams.metadata,
          network: identityForm.value.network
        };
      }

      // 调用创建API
      const newIdentity = await identityStore.createIdentity(createParams);
      createdIdentity.value = newIdentity;
      logger.info('Page:IdentityCreate', '身份创建成功', { id: newIdentity.id });

      // 进入完成步骤
      nextStep();
    } catch (error: any) {
      logger.error('Page:IdentityCreate', '身份创建失败', { error: error.message });
      alert(`创建失败：${error.message || '未知错误'}`);
    } finally {
      isCreating.value = false;
    }
  };

  // 复制DID到剪贴板
  const copyDid = () => {
    if (createdIdentity.value) {
      navigator.clipboard.writeText(createdIdentity.value.did)
        .then(() => {
          alert('DID已复制到剪贴板');
        })
        .catch(error => {
          console.error('复制失败', error);
        });
    }
  };

  // 下载身份备份
  const downloadBackup = () => {
    if (!createdIdentity.value) return;

    logger.info('Page:IdentityCreate', '下载身份备份', { id: createdIdentity.value.id });
    alert('备份下载功能开发中...');

    // 实际实现应该调用API获取备份数据，然后创建下载
    // const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `identity-backup-${createdIdentity.value.id}.json`;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };
</script>

<style scoped>
  .steps-nav .step-item {
    position: relative;
  }

  .steps-nav .step-item:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 1.25rem;
    left: 50%;
    width: 100%;
    height: 1px;
    transform: translateY(-50%);
    background-color: theme('colors.gray.700');
    z-index: -1;
  }

  .steps-nav .step-item.active:not(:last-child)::after {
    background-color: theme('colors.neon');
  }
</style>