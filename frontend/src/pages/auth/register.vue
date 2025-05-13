<template>
  <div class="register-page">
    <h1 class="text-2xl font-bold mb-6 text-center">创建账号</h1>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <div class="form-group">
        <label for="username" class="block text-sm font-medium text-textlight mb-2">用户名 *</label>
        <input v-model="form.username" type="text" id="username"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请设置您的用户名" required>
      </div>

      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-textlight mb-2">电子邮箱 *</label>
        <input v-model="form.email" type="email" id="email"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请输入您的电子邮箱" required>
      </div>

      <div class="form-group">
        <label for="password" class="block text-sm font-medium text-textlight mb-2">密码 *</label>
        <input v-model="form.password" type="password" id="password"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请设置您的密码" required>
        <p class="mt-1 text-xs text-textgray">密码长度至少8位，包含字母和数字</p>
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="block text-sm font-medium text-textlight mb-2">确认密码 *</label>
        <input v-model="form.confirmPassword" type="password" id="confirmPassword"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请再次输入密码" required>
      </div>

      <div class="flex items-center">
        <input v-model="form.agreeTerms" type="checkbox" id="agreeTerms"
          class="w-4 h-4 border-neon/30 rounded focus:ring-neon text-neon" required>
        <label for="agreeTerms" class="ml-2 text-sm text-textgray">
          我已阅读并同意
          <router-link to="/terms" class="text-neon hover:underline">服务条款</router-link>
          和
          <router-link to="/privacy" class="text-neon hover:underline">隐私政策</router-link>
        </label>
      </div>

      <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {{ error }}
      </div>

      <div v-if="successMessage"
        class="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
        {{ successMessage }}
      </div>

      <div v-if="showDebugInfo" class="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
        <h3 class="font-bold">调试信息:</h3>
        <p>表单状态: {{ isFormValid ? '有效' : '无效' }}</p>
        <p>提交状态: {{ isLoading ? '提交中...' : '准备提交' }}</p>
        <button @click="showDebugInfo = false" class="mt-2 px-2 py-1 text-xs bg-blue-500/30 rounded">
          关闭调试信息
        </button>
      </div>

      <div class="form-group">
        <button type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-neon to-violet text-black font-medium rounded-lg transition-all hover:shadow-neon"
          :disabled="isLoading">
          <span v-if="isLoading" class="inline-block animate-spin mr-2">⟳</span>
          注册
        </button>
      </div>
    </form>

    <div class="mt-6 text-center">
      <p class="text-textgray text-sm">
        已有账号?
        <router-link to="/auth/login" class="text-neon hover:underline">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { register } from '../../services/auth';
  import { logger } from '../../utils/logger';

  const router = useRouter();
  const error = ref('');
  const isLoading = ref(false);
  const successMessage = ref('');
  const showDebugInfo = ref(import.meta.env.DEV || false);

  const form = reactive({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    fullName: ''
  });

  const isFormValid = computed(() => {
    return form.email &&
      form.username &&
      form.password &&
      form.password === form.confirmPassword &&
      form.password.length >= 8 &&
      /[a-zA-Z]/.test(form.password) &&
      /[0-9]/.test(form.password) &&
      form.agreeTerms;
  });

  const handleRegister = async () => {
    if (!form.username) {
      error.value = '请输入用户名';
      return;
    }
    if (!form.email) {
      error.value = '请输入电子邮箱';
      return;
    }
    if (!form.password) {
      error.value = '请输入密码';
      return;
    }
    if (form.password !== form.confirmPassword) {
      error.value = '两次输入的密码不一致';
      return;
    }
    if (form.password.length < 8) {
      error.value = '密码长度至少8位';
      return;
    }
    if (!(/[a-zA-Z]/.test(form.password) && /[0-9]/.test(form.password))) {
      error.value = '密码必须包含字母和数字';
      return;
    }
    if (!form.agreeTerms) {
      error.value = '请同意服务条款和隐私政策';
      return;
    }

    try {
      error.value = '';
      successMessage.value = '';
      isLoading.value = true;

      logger.info('Page:Register', '开始注册', { username: form.username, email: form.email });

      const result = await register({
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        agreeTerms: form.agreeTerms,
        fullName: form.fullName || undefined
      });

      logger.info('Page:Register', '注册请求成功', { result });

      successMessage.value = result.message || '注册成功，请登录您的账户';

      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 3000);

    } catch (err: any) {
      logger.error('Page:Register', '注册失败', err);

      // 尝试从错误对象中获取错误消息
      if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else if (err.message) {
        error.value = err.message;
      } else {
        error.value = '注册失败，请稍后重试';
      }

      showDebugInfo.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    logger.info('Page:Register', '注册页面已加载');
  });
</script>

<style scoped>
  .register-page {
    width: 100%;
  }
</style>