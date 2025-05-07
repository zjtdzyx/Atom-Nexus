<template>
  <div class="permission-dialog-overlay fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    @click.self="close">
    <div class="permission-dialog w-full max-w-md p-6 bg-primary rounded-xl shadow-2xl" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-textlight">凭证授权设置</h3>
        <button class="text-metal hover:text-textlight p-1" @click="close">
          <div class="i-carbon-close text-xl"></div>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- 目标DID -->
        <div class="form-group">
          <label for="targetDid" class="block text-sm font-medium text-textgray mb-1">目标DID</label>
          <input id="targetDid" v-model="form.targetDid" type="text"
            class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50"
            placeholder="输入要授权的DID (以 did: 开头)" @input="validateDid" required />
          <p v-if="errors.targetDid" class="mt-1 text-sm text-red-500">{{ errors.targetDid }}</p>
        </div>

        <!-- 授权操作 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-textgray mb-1">授权操作</label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" class="text-center py-2 px-3 rounded-lg border transition-all"
              :class="form.action === 'view' ? 'border-neon bg-neon/20 text-textlight' : 'border-gray-700 text-textgray hover:border-metal'"
              @click="form.action = 'view'">
              <div class="i-carbon-view text-xl mx-auto mb-1"></div>
              查看
            </button>
            <button type="button" class="text-center py-2 px-3 rounded-lg border transition-all"
              :class="form.action === 'use' ? 'border-neon bg-neon/20 text-textlight' : 'border-gray-700 text-textgray hover:border-metal'"
              @click="form.action = 'use'">
              <div class="i-carbon-document-signed text-xl mx-auto mb-1"></div>
              使用
            </button>
          </div>
        </div>

        <!-- 授权资源 -->
        <div class="form-group">
          <label class="block text-sm font-medium text-textgray mb-1">授权资源</label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" class="text-center py-2 px-3 rounded-lg border transition-all"
              :class="form.resource === 'data' ? 'border-neon bg-neon/20 text-textlight' : 'border-gray-700 text-textgray hover:border-metal'"
              @click="form.resource = 'data'">
              <div class="i-carbon-data-base text-xl mx-auto mb-1"></div>
              数据
            </button>
            <button type="button" class="text-center py-2 px-3 rounded-lg border transition-all"
              :class="form.resource === 'credential' ? 'border-neon bg-neon/20 text-textlight' : 'border-gray-700 text-textgray hover:border-metal'"
              @click="form.resource = 'credential'">
              <div class="i-carbon-certificate text-xl mx-auto mb-1"></div>
              凭证
            </button>
          </div>
        </div>

        <!-- 过期时间 -->
        <div class="form-group">
          <label for="expirationDate" class="block text-sm font-medium text-textgray mb-1">
            过期时间
            <span class="text-xs text-textgray/70 ml-1">(可选)</span>
          </label>
          <input id="expirationDate" v-model="form.expirationDate" type="date"
            class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50" />
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300">
          {{ error }}
        </div>

        <!-- 按钮 -->
        <div class="flex justify-end space-x-3 pt-2">
          <button type="button" class="btn-secondary" @click="close">
            取消
          </button>
          <button type="submit" class="btn-primary" :disabled="!isFormValid || loading"
            :class="{ 'opacity-50 cursor-not-allowed': !isFormValid || loading }">
            <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
            {{ loading ? '处理中...' : '确认授权' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, defineEmits, defineProps } from 'vue';
  import { useCredentialStore, type PermissionSetting } from '../../stores/credential';

  // 接收凭证ID作为属性
  const props = defineProps<{
    credentialId: string
  }>();

  // 定义事件
  const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'success', data: any): void
  }>();

  const credentialStore = useCredentialStore();

  // 表单数据
  const form = ref({
    targetDid: '',
    action: 'view', // 默认为查看权限
    resource: 'credential', // 默认为凭证资源
    expirationDate: ''
  });

  // 错误信息
  const errors = ref({
    targetDid: ''
  });

  const error = ref('');
  const loading = ref(false);

  // 验证DID格式
  const validateDid = () => {
    errors.value.targetDid = '';

    if (form.value.targetDid && !form.value.targetDid.startsWith('did:')) {
      errors.value.targetDid = 'DID必须以 did: 开头';
    }
  };

  // 判断表单是否有效
  const isFormValid = computed(() => {
    return form.value.targetDid !== '' &&
      form.value.targetDid.startsWith('did:') &&
      !errors.value.targetDid &&
      form.value.action !== '' &&
      form.value.resource !== '';
  });

  // 提交表单
  const submitForm = async () => {
    if (!isFormValid.value) return;

    loading.value = true;
    error.value = '';

    const permissionData: PermissionSetting = {
      credentialId: props.credentialId,
      targetDid: form.value.targetDid,
      action: form.value.action,
      resource: form.value.resource
    };

    // 如果设置了过期时间
    if (form.value.expirationDate) {
      permissionData.expirationDate = new Date(form.value.expirationDate).toISOString();
    }

    try {
      const result = await credentialStore.setPermission(permissionData);

      if (result.success) {
        emit('success', result.data);
        emit('close');
      } else {
        error.value = result.message as string;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '设置授权时发生错误';
    } finally {
      loading.value = false;
    }
  };

  // 关闭对话框
  const close = () => {
    emit('close');
  };
</script>

<style scoped>
  .permission-dialog-overlay {
    backdrop-filter: blur(4px);
  }

  .permission-dialog {
    animation: dialog-in 0.3s ease forwards;
  }

  @keyframes dialog-in {
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