<template>
  <div class="registration-form">
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- 个人信息 -->
      <div class="form-section p-5 bg-primary/40 border border-gray-800 rounded-xl mb-6">
        <h3 class="text-lg font-semibold text-textlight mb-4 flex items-center">
          <span class="i-carbon-user-profile text-cyan-400 mr-2"></span>
          个人信息
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 姓名 -->
          <div class="form-group">
            <label for="name" class="block text-sm font-medium text-textgray mb-1">
              姓名 <span class="text-red-400">*</span>
            </label>
            <input id="name" v-model="form.name" type="text"
              class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              :class="{ 'border-red-500 focus:ring-red-500/50': errors.name }" placeholder="输入您的真实姓名" required />
            <p v-if="errors.name" class="mt-1 text-sm text-red-400">{{ errors.name }}</p>
          </div>

          <!-- 邮箱 -->
          <div class="form-group">
            <label for="email" class="block text-sm font-medium text-textgray mb-1">
              邮箱 <span class="text-red-400">*</span>
            </label>
            <input id="email" v-model="form.email" type="email"
              class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              :class="{ 'border-red-500 focus:ring-red-500/50': errors.email }" placeholder="example@domain.com"
              required />
            <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
          </div>
        </div>

        <!-- 组织 -->
        <div class="form-group mt-4">
          <label for="organization" class="block text-sm font-medium text-textgray mb-1">
            组织/公司
            <span class="text-xs text-textgray/70 ml-1">(可选)</span>
          </label>
          <input id="organization" v-model="form.organization" type="text"
            class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            placeholder="输入您的组织或公司名称" />
        </div>
      </div>

      <!-- 应用信息 -->
      <div class="form-section p-5 bg-primary/40 border border-gray-800 rounded-xl mb-6">
        <h3 class="text-lg font-semibold text-textlight mb-4 flex items-center">
          <span class="i-carbon-application text-cyan-400 mr-2"></span>
          应用信息
        </h3>

        <!-- 使用目的 -->
        <div class="form-group mb-4">
          <label for="purpose" class="block text-sm font-medium text-textgray mb-1">
            使用目的 <span class="text-red-400">*</span>
          </label>
          <select id="purpose" v-model="form.purpose"
            class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            :class="{ 'border-red-500 focus:ring-red-500/50': errors.purpose }" required>
            <option value="" disabled>选择使用目的</option>
            <option value="personal">个人项目</option>
            <option value="commercial">商业应用</option>
            <option value="academic">学术研究</option>
            <option value="nonprofit">非营利组织</option>
            <option value="other">其他</option>
          </select>
          <p v-if="errors.purpose" class="mt-1 text-sm text-red-400">{{ errors.purpose }}</p>
        </div>

        <!-- 应用描述 -->
        <div class="form-group">
          <label for="applicationDescription" class="block text-sm font-medium text-textgray mb-1">
            应用描述 <span class="text-red-400">*</span>
          </label>
          <textarea id="applicationDescription" v-model="form.applicationDescription" rows="4"
            class="w-full px-4 py-2 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            :class="{ 'border-red-500 focus:ring-red-500/50': errors.applicationDescription }"
            placeholder="请详细描述您的应用计划和API使用场景..." required></textarea>
          <p v-if="errors.applicationDescription" class="mt-1 text-sm text-red-400">{{ errors.applicationDescription }}
          </p>
        </div>
      </div>

      <!-- 服务条款 -->
      <div class="form-section p-5 bg-primary/40 border border-gray-800 rounded-xl mb-6">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="agreeToTerms" v-model="form.agreeToTerms" type="checkbox"
              class="w-4 h-4 accent-cyan-500 rounded focus:ring-cyan-400/50"
              :class="{ 'border-red-500': errors.agreeToTerms }" required />
          </div>
          <label for="agreeToTerms" class="ml-2 text-sm text-textgray">
            我已阅读并同意 <a href="#" class="text-cyan-400 hover:underline">服务条款</a> 和
            <a href="#" class="text-cyan-400 hover:underline">隐私政策</a>
            <span class="text-red-400">*</span>
          </label>
        </div>
        <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-red-400">{{ errors.agreeToTerms }}</p>
      </div>

      <!-- 错误信息 -->
      <div v-if="formError" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300">
        <div class="flex items-center">
          <span class="i-carbon-warning-filled text-xl mr-2"></span>
          <span>{{ formError }}</span>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end">
        <button type="submit" class="submit-btn bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg
                 flex items-center font-medium hover:from-cyan-500 hover:to-blue-500 transition-all duration-300
                 shadow-lg shadow-cyan-700/20" :disabled="loading || !isFormValid">
          <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          <span v-else class="i-carbon-send mr-2"></span>
          {{ loading ? '提交中...' : '注册开发者' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive } from 'vue';
  import { useDeveloperStore } from '../../stores/developer';
  import type { DeveloperRegistration } from '../../stores/developer';

  const emit = defineEmits<{
    (e: 'success', data: any): void;
    (e: 'error', message: string): void;
  }>();

  const developStore = useDeveloperStore();
  const loading = ref(false);
  const formError = ref('');

  // 表单数据
  const form = reactive<DeveloperRegistration>({
    name: '',
    email: '',
    organization: '',
    purpose: '',
    applicationDescription: '',
    agreeToTerms: false,
  });

  // 表单错误
  const errors = reactive({
    name: '',
    email: '',
    purpose: '',
    applicationDescription: '',
    agreeToTerms: '',
  });

  // 验证表单
  const validateForm = (): boolean => {
    let isValid = true;

    // 重置错误
    Object.keys(errors).forEach(key => {
      // @ts-ignore
      errors[key] = '';
    });

    // 验证姓名
    if (!form.name.trim()) {
      errors.name = '请输入您的姓名';
      isValid = false;
    } else if (form.name.trim().length < 2) {
      errors.name = '姓名至少2个字符';
      isValid = false;
    }

    // 验证邮箱
    if (!form.email.trim()) {
      errors.email = '请输入您的邮箱';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = '请输入有效的邮箱地址';
      isValid = false;
    }

    // 验证使用目的
    if (!form.purpose) {
      errors.purpose = '请选择使用目的';
      isValid = false;
    }

    // 验证应用描述
    if (!form.applicationDescription.trim()) {
      errors.applicationDescription = '请描述您的应用';
      isValid = false;
    } else if (form.applicationDescription.trim().length < 20) {
      errors.applicationDescription = '应用描述至少20个字符';
      isValid = false;
    }

    // 验证条款同意
    if (!form.agreeToTerms) {
      errors.agreeToTerms = '您必须同意服务条款和隐私政策';
      isValid = false;
    }

    return isValid;
  };

  // 表单是否有效
  const isFormValid = computed(() => {
    return form.name.trim() !== '' &&
      form.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.purpose !== '' &&
      form.applicationDescription.trim().length >= 20 &&
      form.agreeToTerms === true;
  });

  // 提交表单
  const submitForm = async () => {
    if (!validateForm()) return;

    formError.value = '';
    loading.value = true;

    try {
      const result = await developStore.registerDeveloper({
        name: form.name,
        email: form.email,
        organization: form.organization || undefined,
        purpose: form.purpose,
        applicationDescription: form.applicationDescription,
        agreeToTerms: form.agreeToTerms,
      });

      if (result.success) {
        emit('success', result);
        // 重置表单
        Object.keys(form).forEach(key => {
          // @ts-ignore
          form[key] = key === 'agreeToTerms' ? false : '';
        });
      } else {
        formError.value = result.message || '注册失败，请稍后重试';
        emit('error', formError.value);
      }
    } catch (error) {
      formError.value = error instanceof Error ? error.message : '注册过程中发生错误';
      emit('error', formError.value);
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped>
  .form-section {
    transition: all 0.3s ease;
  }

  .form-section:hover {
    border-color: rgba(124, 230, 233, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .submit-btn {
    position: relative;
    overflow: hidden;
  }

  .submit-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  .submit-btn:hover::after {
    left: 100%;
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
