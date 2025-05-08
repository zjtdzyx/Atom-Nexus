<template>
  <div class="container mx-auto py-10 px-4">
    <div class="flex items-center mb-8">
      <router-link to="/identity" class="text-metal hover:text-textlight mr-4">
        <div class="i-carbon-arrow-left text-2xl"></div>
      </router-link>
      <h1 class="text-3xl font-bold text-textlight">创建新身份</h1>
    </div>

    <div class="bg-primary/50 rounded-lg p-8 max-w-3xl mx-auto">
      <h2 class="text-xl font-medium text-textlight mb-6">选择身份创建方式</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 生成新DID -->
        <div @click="createMethod = 'generate'"
          class="p-6 border border-metal/30 rounded-lg cursor-pointer transition-all"
          :class="{ 'border-neon shadow-lg': createMethod === 'generate' }">
          <div class="rounded-full w-12 h-12 flex items-center justify-center bg-neon/20 mb-4">
            <div class="i-carbon-cube text-neon text-2xl"></div>
          </div>
          <h3 class="text-lg font-medium text-textlight mb-2">生成新DID</h3>
          <p class="text-sm text-textgray">系统将为您创建一个全新的去中心化身份标识符</p>
        </div>

        <!-- 导入已有DID -->
        <div @click="createMethod = 'import'"
          class="p-6 border border-metal/30 rounded-lg cursor-pointer transition-all"
          :class="{ 'border-neon shadow-lg': createMethod === 'import' }">
          <div class="rounded-full w-12 h-12 flex items-center justify-center bg-neon/20 mb-4">
            <div class="i-carbon-document-import text-neon text-2xl"></div>
          </div>
          <h3 class="text-lg font-medium text-textlight mb-2">导入已有DID</h3>
          <p class="text-sm text-textgray">导入您已有的DID密钥，将其绑定到当前账户</p>
        </div>
      </div>

      <!-- 身份信息表单 -->
      <div v-if="createMethod">
        <h3 class="text-lg font-medium text-textlight mb-4">基本信息</h3>
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-textgray mb-2">身份名称</label>
            <input v-model="formData.name" placeholder="输入身份名称"
              class="input w-full bg-darkbg text-textlight border-metal/20" />
          </div>

          <div>
            <label class="block text-textgray mb-2">身份类型</label>
            <select v-model="formData.type" class="input w-full bg-darkbg text-textlight border-metal/20">
              <option value="person">个人身份</option>
              <option value="organization">组织身份</option>
              <option value="device">设备身份</option>
              <option value="software">软件身份</option>
              <option value="other">其他</option>
            </select>
          </div>

          <!-- 导入DID表单 -->
          <div v-if="createMethod === 'import'">
            <label class="block text-textgray mb-2">DID标识符</label>
            <input v-model="formData.did" placeholder="输入以did:开头的身份标识符"
              class="input w-full bg-darkbg text-textlight border-metal/20" />
            <p class="text-xs text-textgray mt-1">例如: did:key:z6MkvTPicF..., did:ethr:0x...</p>
            <div v-if="importError" class="text-red-400 text-sm mt-2">{{ importError }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-between items-center">
        <button @click="router.push('/identity')" class="btn-secondary">取消</button>
        <button v-if="createMethod" @click="createIdentity" class="btn-primary"
          :class="{ 'opacity-50 cursor-not-allowed': isLoading }" :disabled="isLoading || !isFormValid">
          <span v-if="isLoading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          创建身份
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIdentityStore } from '@/stores/identity';

  const router = useRouter();
  const identityStore = useIdentityStore();

  const createMethod = ref<'generate' | 'import' | null>(null);
  const isLoading = ref(false);
  const importError = ref('');

  const formData = ref({
    name: '',
    type: 'person',
    did: ''
  });

  const isFormValid = computed(() => {
    if (!formData.value.name) return false;

    if (createMethod.value === 'import') {
      return formData.value.did && formData.value.did.startsWith('did:');
    }

    return true;
  });

  const createIdentity = async () => {
    if (!isFormValid.value) return;

    importError.value = '';
    isLoading.value = true;

    try {
      if (createMethod.value === 'generate') {
        // 生成新DID
        const newIdentity = await identityStore.createIdentity({
          name: formData.value.name,
          type: formData.value.type,
          status: 'active'
        });

        router.push(`/identity/${newIdentity.id}`);
      } else if (createMethod.value === 'import') {
        // 导入已有DID
        if (!formData.value.did.startsWith('did:')) {
          importError.value = 'DID必须以did:开头';
          isLoading.value = false;
          return;
        }

        await identityStore.bindIdentity(formData.value.did);
        router.push('/identity');
      }
    } catch (err: any) {
      importError.value = err.message || '创建身份失败，请稍后重试';
    } finally {
      isLoading.value = false;
    }
  };
</script>