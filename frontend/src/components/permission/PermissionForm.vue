<template>
  <div class="permission-form">
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- 目标凭证选择 -->
      <div class="form-group">
        <label for="credentialId" class="block text-sm font-medium text-textgray mb-1">目标凭证</label>
        <select id="credentialId" v-model="form.credentialId"
          class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50"
          required>
          <option value="" disabled>请选择要授权的凭证</option>
          <option v-for="credential in credentials" :key="credential.id" :value="credential.id">
            {{ credential.name }}
          </option>
        </select>
      </div>

      <!-- 访问权限类型 -->
      <div class="form-group">
        <label class="block text-sm font-medium text-textgray mb-2">访问权限类型</label>
        <div class="grid grid-cols-3 gap-3">
          <button type="button" class="text-center py-3 px-3 rounded-lg border transition-all"
            :class="form.permissionType === 'one_time' ? 'border-neon bg-neon/20 text-textlight' : 'border-gray-700 text-textgray hover:border-metal'"
            @click="form.permissionType = 'one_time'">
            <div class="i-carbon-time text-2xl mx-auto mb-2"></div>
            一次性
          </button>
          <button type="button" class="text-center py-3 px-3 rounded-lg border transition-all"
            :class="form.permissionType === 'long_term' ? 'border-neon bg-neon/20 text-textlight' : 'border-gray-700 text-textgray hover:border-metal'"
            @click="form.permissionType = 'long_term'">
            <div class="i-carbon-calendar text-2xl mx-auto mb-2"></div>
            长期
          </button>
          <button type="button" class="text-center py-3 px-3 rounded-lg border transition-all"
            :class="form.permissionType === 'partial' ? 'border-neon bg-neon/20 text-textlight' : 'border-gray-700 text-textgray hover:border-metal'"
            @click="form.permissionType = 'partial'">
            <div class="i-carbon-filter text-2xl mx-auto mb-2"></div>
            部分授权
          </button>
        </div>
      </div>

      <!-- 授权对象DID -->
      <div class="form-group">
        <label for="targetDid" class="block text-sm font-medium text-textgray mb-1">授权对象DID</label>
        <input id="targetDid" v-model="form.targetDid" type="text"
          class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50"
          placeholder="输入要授权的DID (以 did: 开头)" @input="validateDid" required />
        <p v-if="errors.targetDid" class="mt-1 text-sm text-red-500">{{ errors.targetDid }}</p>
      </div>

      <!-- 过期时间，仅当选择长期或部分授权时显示 -->
      <div class="form-group" v-if="form.permissionType === 'long_term' || form.permissionType === 'partial'">
        <label for="expirationDate" class="block text-sm font-medium text-textgray mb-1">
          过期时间
          <span class="text-xs text-textgray/70 ml-1" v-if="form.permissionType === 'partial'">(可选)</span>
        </label>
        <input id="expirationDate" v-model="form.expirationDate" type="date"
          class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50"
          :required="form.permissionType === 'long_term'" />
      </div>

      <!-- 允许的声明，仅当选择部分授权时显示 -->
      <div class="form-group" v-if="form.permissionType === 'partial'">
        <label class="block text-sm font-medium text-textgray mb-1">允许的声明</label>
        <div class="bg-primary/70 border border-gray-700 rounded-lg p-3">
          <div v-if="claims.length === 0" class="text-textgray text-sm py-2">
            请先选择凭证以查看可用声明
          </div>
          <div v-else class="space-y-2">
            <div v-for="claim in claims" :key="claim.key" class="flex items-center">
              <input :id="'claim-' + claim.key" type="checkbox" v-model="selectedClaims" :value="claim.key"
                class="mr-2 h-4 w-4 accent-neon" />
              <label :for="'claim-' + claim.key" class="text-sm text-textlight">{{ claim.label }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 备注 -->
      <div class="form-group">
        <label for="note" class="block text-sm font-medium text-textgray mb-1">
          备注
          <span class="text-xs text-textgray/70 ml-1">(可选)</span>
        </label>
        <textarea id="note" v-model="form.note" rows="2"
          class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50"
          placeholder="添加备注信息..."></textarea>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300">
        {{ error }}
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end pt-2">
        <button type="submit" class="btn-primary px-6 py-2" :disabled="!isFormValid || loading"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid || loading }">
          <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          <span class="i-carbon-security text-lg mr-2"></span>
          {{ loading ? '处理中...' : '设置权限' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { useCredentialStore, type Credential } from '../../stores/credential';
  import { usePermissionStore, PermissionType } from '../../stores/permission';
  import type { PermissionSetting } from '../../stores/permission';

  const props = defineProps<{
    preSelectedCredentialId?: string;
    preSelectedDid?: string;
  }>();

  const emit = defineEmits<{
    (e: 'success', data: any): void;
    (e: 'error', message: string): void;
  }>();

  const credentialStore = useCredentialStore();
  const permissionStore = usePermissionStore();

  // 凭证列表
  const credentials = ref<Credential[]>([]);

  // 表单数据
  const form = ref({
    credentialId: props.preSelectedCredentialId || '',
    targetDid: props.preSelectedDid || '',
    permissionType: PermissionType.ONE_TIME,
    expirationDate: '',
    note: '',
  });

  // 声明数据
  const claims = ref<{ key: string; label: string }[]>([]);
  const selectedClaims = ref<string[]>([]);

  // 错误信息
  const errors = ref({
    targetDid: '',
  });

  const error = ref('');
  const loading = ref(false);

  // 表单是否有效
  const isFormValid = computed(() => {
    if (form.value.credentialId === '') return false;
    if (form.value.targetDid === '' || errors.value.targetDid !== '') return false;
    if (form.value.permissionType === PermissionType.LONG_TERM && !form.value.expirationDate) return false;

    return true;
  });

  // 验证DID格式
  const validateDid = () => {
    errors.value.targetDid = '';

    if (form.value.targetDid && !form.value.targetDid.startsWith('did:')) {
      errors.value.targetDid = 'DID必须以 did: 开头';
    }
  };

  // 当选择凭证时，获取其声明
  watch(() => form.value.credentialId, async (newId) => {
    if (newId) {
      try {
        // 假设凭证详情中包含声明信息
        await credentialStore.fetchCredentialDetail(newId);
        const credential = credentialStore.getCurrentCredential;

        if (credential && credential.claims) {
          claims.value = Object.entries(credential.claims).map(([key, value]) => ({
            key,
            label: `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`,
          }));
        } else {
          claims.value = [];
        }
      } catch (err) {
        console.error('获取凭证声明失败', err);
        claims.value = [];
      }
    } else {
      claims.value = [];
    }
    selectedClaims.value = [];
  });

  // 提交表单
  const submitForm = async () => {
    if (!isFormValid.value) return;

    loading.value = true;
    error.value = '';

    const permissionData: PermissionSetting = {
      credentialId: form.value.credentialId,
      targetDid: form.value.targetDid,
      permissionType: form.value.permissionType,
      note: form.value.note || undefined,
    };

    // 如果选择了长期或部分授权，添加过期时间
    if (
      (form.value.permissionType === PermissionType.LONG_TERM ||
        form.value.permissionType === PermissionType.PARTIAL) &&
      form.value.expirationDate
    ) {
      permissionData.expirationDate = new Date(form.value.expirationDate).toISOString();
    }

    // 如果是部分授权且选择了声明，添加声明列表
    if (
      form.value.permissionType === PermissionType.PARTIAL &&
      selectedClaims.value.length > 0
    ) {
      permissionData.allowedClaims = selectedClaims.value;
    }

    try {
      const result = await permissionStore.setPermission(permissionData);

      if (result.success) {
        emit('success', result.data);

        // 重置表单
        form.value = {
          credentialId: '',
          targetDid: '',
          permissionType: PermissionType.ONE_TIME,
          expirationDate: '',
          note: '',
        };
        selectedClaims.value = [];
      } else {
        error.value = result.message as string;
        emit('error', error.value);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '设置权限时发生错误';
      emit('error', error.value);
    } finally {
      loading.value = false;
    }
  };

  // 获取凭证列表
  onMounted(async () => {
    try {
      await credentialStore.fetchCredentials();
      credentials.value = credentialStore.getCredentials;
    } catch (err) {
      console.error('获取凭证列表失败', err);
    }
  });
</script>

<style scoped>
  .permission-form {
    animation: fade-in 0.3s ease-out;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>