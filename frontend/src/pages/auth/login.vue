<template>
  <div class="login-page">
    <h1 class="text-2xl font-bold mb-6 text-center">用户登录</h1>

    <!-- 使用登录表单组件 -->
    <LoginForm :loading="authStore.loading" :error="error || (authStore.error as string | null)" @login="handleLogin"
      @show-register="navigateToRegister" @forgot-password="navigateToForgotPassword" />

    <!-- 成功消息 -->
    <div v-if="successMessage"
      class="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
      {{ successMessage }}
    </div>

    <!-- 调试信息区域 -->
    <div v-if="showDebugInfo"
      class="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
      <h3 class="font-bold">调试信息:</h3>
      <p>登录状态: {{ authStore.isAuthenticated ? '已登录' : '未登录' }}</p>
      <p v-if="authStore.isAuthenticated">用户: {{ authStore.user?.username }}</p>
      <p v-if="loginAttemptCount > 0">登录尝试次数: {{ loginAttemptCount }}</p>
      <p v-if="lastLoginError">最近错误: {{ lastLoginError }}</p>
      <button @click="showDebugInfo = false" class="mt-2 px-2 py-1 text-xs bg-blue-500/30 rounded">
        关闭调试信息
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '../../stores/auth';
  import { logger } from '../../utils/logger';
  import LoginForm from '../../components/auth/LoginForm.vue';

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const loginAttemptCount = ref(0);
  const lastLoginError = ref('');
  const error = ref('');
  const successMessage = ref('');
  const showDebugInfo = ref(import.meta.env.DEV || false); // 在开发环境自动显示调试信息

  // 检查用户是否已登录
  if (authStore.isAuthenticated && route.path === '/auth/login') {
    logger.info('Page:Login', '用户已登录，跳转到首页');
    router.replace('/');
  }

  interface LoginFormData {
    username: string;
    password: string;
    remember: boolean;
  }

  const handleLogin = async (formData: LoginFormData) => {
    // 验证表单
    if (!formData.username) {
      error.value = '请输入用户名';
      return;
    }
    if (!formData.password) {
      error.value = '请输入密码';
      return;
    }

    loginAttemptCount.value++;
    lastLoginError.value = '';
    error.value = '';

    try {
      logger.info('Page:Login', '尝试登录', { username: formData.username, attempt: loginAttemptCount.value });

      // 调用认证存储的登录方法
      await authStore.loginUser(formData.username, formData.password, formData.remember);

      // 记录登录成功
      logger.info('Page:Login', '用户登录成功', { username: formData.username });
      successMessage.value = '登录成功，正在跳转...';

      // 获取重定向地址并记录
      const redirectPath = route.query.redirect?.toString() || '/';
      logger.info('Page:Login', '准备跳转到', { redirectPath });

      // 使用Vue Router进行跳转，避免刷新页面
      setTimeout(() => {
        if (redirectPath === '/') {
          // 使用replace而非push，防止用户返回到登录页
          router.replace('/');
        } else {
          router.push(redirectPath);
        }
      }, 1000); // 短暂延迟，让用户看到成功消息
    } catch (err: any) {
      lastLoginError.value = err.message || '登录失败';
      error.value = lastLoginError.value;

      logger.error('Page:Login', '登录失败', {
        error: err.message,
        username: formData.username,
        attempt: loginAttemptCount.value
      });

      // 显示调试信息帮助排查问题
      showDebugInfo.value = true;
    }
  };

  // 导航到注册页面
  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  // 导航到忘记密码页面
  const navigateToForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  onMounted(() => {
    logger.info('Page:Login', '登录页面已加载');

    // 处理从注册页面转过来的消息
    if (route.query.registered) {
      authStore.error = null;
      lastLoginError.value = '';
      error.value = '';
      successMessage.value = '注册成功，请使用您的账号登录';
    }

    // 如果有错误查询参数，显示错误信息
    if (route.query.error) {
      const errorMsg = route.query.error as string;
      authStore.error = null;

      if (errorMsg === 'unauthorized') {
        error.value = '您需要登录后才能访问该页面';
      } else if (errorMsg === 'token_refresh_failed') {
        error.value = '登录已过期，请重新登录';
      } else if (errorMsg === 'forbidden') {
        error.value = '您没有权限访问该页面';
      } else {
        error.value = errorMsg;
      }

      showDebugInfo.value = true;
    }
  });
</script>

<style scoped>
  .login-page {
    width: 100%;
  }
</style>