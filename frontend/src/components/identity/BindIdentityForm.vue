<template>
  <div class="bind-identity-form">
    <h2 class="text-xl font-semibold mb-4 text-textlight">添加/绑定身份</h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="form-group">
        <label for="did" class="block text-sm font-medium text-textgray mb-1">DID 标识</label>
        <div class="relative">
          <input id="did" v-model="did" type="text"
            class="w-full px-4 py-2 bg-primary/50 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50"
            placeholder="输入要绑定的DID (以 did: 开头)" @input="validateDid" />
          <div v-if="did" class="absolute top-1/2 right-3 transform -translate-y-1/2 text-lg"
            :class="isValid ? 'i-carbon-checkmark-filled text-neon' : 'i-carbon-close-filled text-red-500'">
          </div>
        </div>
        <p v-if="didError" class="mt-1 text-sm text-red-500">{{ didError }}</p>
        <p class="mt-1 text-xs text-textgray/70">DID格式示例: did:example:123456789abcdefghi</p>
      </div>

      <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300">
        {{ error }}
      </div>

      <div v-if="successMessage"
        class="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-sm text-green-300">
        {{ successMessage }}
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn-primary" :disabled="!isValid || loading"
          :class="{ 'opacity-50 cursor-not-allowed': !isValid || loading }">
          <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          {{ loading ? '处理中...' : '绑定身份' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useIdentityStore } from '../../stores/identity';

  const identityStore = useIdentityStore();

  // 表单状态
  const did = ref('');
  const didError = ref('');
  const loading = ref(false);
  const error = ref('');
  const successMessage = ref('');

  // 验证DID是否有效
  const isValid = computed(() => {
    return did.value.trim() !== '' && did.value.startsWith('did:') && !didError.value;
  });

  // 输入时验证DID格式
  const validateDid = () => {
    didError.value = '';

    if (did.value && !did.value.startsWith('did:')) {
      didError.value = 'DID必须以 did: 开头';
      return;
    }

    if (did.value && did.value.length < 10) {
      didError.value = 'DID长度不足，请输入有效的DID';
      return;
    }
  };

  // 提交表单
  const submitForm = async () => {
    // 清除之前的消息
    error.value = '';
    successMessage.value = '';

    if (!isValid.value) {
      return;
    }

    loading.value = true;

    try {
      const result = await identityStore.bindIdentity(did.value);

      if (result.success) {
        successMessage.value = result.message;
        did.value = ''; // 清空输入框
      } else {
        error.value = result.message;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '绑定身份时发生错误';
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped>
  .bind-identity-form {
    background-color: rgba(30, 30, 47, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
</style>