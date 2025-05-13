<template>
  <div class="login-page">
    <h1 class="text-2xl font-bold mb-6 text-center">用户登录</h1>

    <!-- 使用登录表单组件 -->
    <LoginForm :loading="authStore.loading" :error="authStore.error" @login="handleLogin"
      @show-register="navigateToRegister" @forgot-password="navigateToForgotPassword" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAuthStore } from '../../stores/auth';
  import { logger } from '../../utils/logger';
  import LoginForm from '../../components/auth/LoginForm.vue';

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  // 如果用户已登录，直接跳转到首页
  if (authStore.isAuthenticated) {
    router.push('/');
  }

  interface LoginFormData {
    username: string;
    password: string;
    remember: boolean;
  }

  const handleLogin = async (formData: LoginFormData) => {
    try {
      // 调用认证存储的登录方法
      await authStore.loginUser(formData.username, formData.password, formData.remember);

      // 记录登录成功
      logger.info('Page:Login', '用户登录成功', { username: formData.username });

      // 获取重定向地址
      const redirectPath = route.query.redirect?.toString() || '/';

      // 登录成功后跳转到重定向页面或首页
      router.push(redirectPath);
    } catch (err: any) {
      logger.error('Page:Login', '登录失败', err);
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
  });
</script>

<style scoped>
  .login-page {
    width: 100%;
  }
</style>