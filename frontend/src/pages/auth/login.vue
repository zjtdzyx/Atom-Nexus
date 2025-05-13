<template>
  <div class="login-page">
    <h1 class="text-2xl font-bold mb-6 text-center">用户登录</h1>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="form-group">
        <label for="username" class="block text-sm font-medium text-textlight mb-2">用户名/邮箱</label>
        <input v-model="form.username" type="text" id="username"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请输入用户名或邮箱" required>
      </div>

      <div class="form-group">
        <div class="flex items-center justify-between mb-2">
          <label for="password" class="text-sm font-medium text-textlight">密码</label>
          <a href="#" class="text-xs text-neon hover:text-neon/80 transition-colors">忘记密码?</a>
        </div>
        <input v-model="form.password" type="password" id="password"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请输入密码" required>
      </div>

      <div class="flex items-center">
        <input v-model="form.remember" type="checkbox" id="remember"
          class="w-4 h-4 border-neon/30 rounded focus:ring-neon text-neon">
        <label for="remember" class="ml-2 text-sm text-textgray">记住我</label>
      </div>

      <div class="form-group">
        <button type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-neon to-violet text-black font-medium rounded-lg transition-all hover:shadow-neon"
          :disabled="authStore.loading">
          <span v-if="authStore.loading" class="inline-block animate-spin mr-2">⟳</span>
          登录
        </button>
      </div>
    </form>

    <div class="mt-6 text-center">
      <p class="text-textgray text-sm">
        还没有账号?
        <router-link to="/auth/register" class="text-neon hover:underline">立即注册</router-link>
      </p>
    </div>

    <div v-if="authStore.error" class="mt-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
      {{ authStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '../../stores/auth';
  import { logger } from '../../utils/logger';

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  // 如果用户已登录，直接跳转到首页
  if (authStore.isAuthenticated) {
    router.push('/');
  }

  const form = reactive({
    username: '',
    password: '',
    remember: false
  });

  const handleLogin = async () => {
    try {
      // 调用认证存储的登录方法
      await authStore.loginUser(form.username, form.password, form.remember);

      // 记录登录成功
      logger.info('Page:Login', '用户登录成功', { username: form.username });

      // 获取重定向地址
      const redirectPath = route.query.redirect as string || '/';

      // 登录成功后跳转到重定向页面或首页
      router.push(redirectPath);
    } catch (err: any) {
      logger.error('Page:Login', '登录失败', err);
    }
  };

  onMounted(() => {
    logger.info('Page:Login', '登录页面已加载');
  });
</script>

<style scoped>
  .login-page {
    width: 100%;
  }
</style>