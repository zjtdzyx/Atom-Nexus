<template>
  <div class="register-page">
    <h1 class="text-2xl font-bold mb-6 text-center">创建账号</h1>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-textlight mb-2">电子邮箱</label>
        <input v-model="form.email" type="email" id="email"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请输入您的电子邮箱" required>
      </div>

      <div class="form-group">
        <label for="username" class="block text-sm font-medium text-textlight mb-2">用户名</label>
        <input v-model="form.username" type="text" id="username"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请设置您的用户名" required>
      </div>

      <div class="form-group">
        <label for="password" class="block text-sm font-medium text-textlight mb-2">密码</label>
        <input v-model="form.password" type="password" id="password"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请设置您的密码" required>
        <p class="mt-1 text-xs text-textgray">密码长度至少8位，包含字母和数字</p>
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="block text-sm font-medium text-textlight mb-2">确认密码</label>
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

      <div class="form-group">
        <button type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-neon to-violet text-black font-medium rounded-lg transition-all hover:shadow-neon"
          :disabled="isLoading || !isFormValid">
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

    <div v-if="error" class="mt-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const error = ref('');
  const isLoading = ref(false);

  const form = reactive({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
    if (!isFormValid.value) {
      error.value = '请检查表单填写是否正确';
      return;
    }

    try {
      isLoading.value = true;
      error.value = '';

      // 这里应该调用实际的注册API
      console.log('注册表单提交', form);

      // 模拟注册延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟注册成功，重定向到登录页
      router.push('/auth/login');
    } catch (err: any) {
      error.value = err.message || '注册失败，请重试';
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style scoped>
  .register-page {
    width: 100%;
  }
</style>