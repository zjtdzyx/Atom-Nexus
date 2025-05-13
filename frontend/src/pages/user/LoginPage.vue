<template>
  <div class="login-page min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-cyan-400">用户登录</h2>
        <p class="mt-2 text-sm text-gray-400">
          欢迎回来，请输入您的账号信息
        </p>
      </div>

      <!-- 登录表单组件 -->
      <div class="mt-8 login-card bg-black/30 border border-cyan-800/30 rounded-xl p-8 shadow-glow">
        <LoginForm @login-success="handleLogin" @show-register="navigateToRegister" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../../stores/user';
  import LoginForm from '../../components/user/LoginForm.vue';

  const router = useRouter(); 
  const userStore = useUserStore();

  // 状态
  const loading = ref(false);
  const error = ref('');

  // 登录处理
  const handleLogin = async (formData) => {
    if (!formData.username || !formData.password) {
      error.value = '请输入用户名和密码';
      return;
    }

    loading.value = true;
    error.value = '';

    try {
      const result = await userStore.login(formData);

      if (result.success) {
        // 跳转到个人资料页
        router.push('/user/profile');
      } else {
        error.value = result.error || '登录失败，请检查用户名和密码';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '登录过程中发生错误';
    } finally {
      loading.value = false;
    }
  };

  // 导航到注册页面
  const navigateToRegister = () => {
    router.push('/user/register');
  };
</script>

<style scoped>
  .login-page {
    background-image: radial-gradient(circle at center, rgba(34, 211, 238, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
    animation: fadeIn 0.5s ease-out;
  }

  .login-card {
    background-image: radial-gradient(circle at top right, rgba(34, 211, 238, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
    position: relative;
    overflow: hidden;
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    background: linear-gradient(45deg, #0e7490, transparent, #0e7490, transparent);
    animation: glowBorder 3s linear infinite;
    border-radius: 12px;
    opacity: 0.3;
  }

  .shadow-glow {
    box-shadow: 0 0 25px rgba(34, 211, 238, 0.1);
  }

  @keyframes glowBorder {
    0% {
      background-position: 0% 0%;
    }

    100% {
      background-position: 300% 300%;
    }
  }

  @keyframes fadeIn {
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