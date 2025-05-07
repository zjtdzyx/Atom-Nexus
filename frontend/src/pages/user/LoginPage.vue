<template>
  <div class="login-page min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-cyan-400">用户登录</h2>
        <p class="mt-2 text-sm text-gray-400">
          欢迎回来，请输入您的账号信息
        </p>
      </div>

      <!-- 登录表单 -->
      <div class="mt-8 login-card bg-black/30 border border-cyan-800/30 rounded-xl p-8 shadow-glow">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 错误提示 -->
          <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-400">
            <div class="flex items-center">
              <span class="i-carbon-warning-filled text-xl mr-2"></span>
              <span>{{ error }}</span>
            </div>
          </div>

          <!-- 用户名 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-1">用户名</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="i-carbon-user text-gray-500"></span>
              </div>
              <input type="text" id="username" v-model="formData.username" required
                class="w-full py-2 pl-10 pr-3 bg-black/30 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="输入用户名" />
            </div>
          </div>

          <!-- 密码 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="i-carbon-password text-gray-500"></span>
              </div>
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" required
                class="w-full py-2 pl-10 pr-10 bg-black/30 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="输入密码" />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" @click="showPassword = !showPassword" class="text-gray-500 hover:text-gray-300">
                  <span v-if="showPassword" class="i-carbon-view"></span>
                  <span v-else class="i-carbon-view-off"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- 记住我 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember" type="checkbox" v-model="formData.remember"
                class="h-4 w-4 accent-cyan-500 rounded focus:ring-cyan-500" />
              <label for="remember" class="ml-2 block text-sm text-gray-400">
                记住我
              </label>
            </div>
            <div>
              <a href="#" class="text-sm text-cyan-500 hover:text-cyan-400">
                忘记密码?
              </a>
            </div>
          </div>

          <!-- 登录按钮 -->
          <div>
            <button type="submit" :disabled="loading"
              class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 flex justify-center items-center btn-glow">
              <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
              <span>{{ loading ? '登录中...' : '登 录' }}</span>
            </button>
          </div>

          <!-- 其他登录方式 -->
          <div class="text-center pt-4 border-t border-gray-800">
            <p class="text-xs text-gray-500 mb-4">其他登录方式</p>
            <div class="flex justify-center space-x-4">
              <button type="button"
                class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors">
                <span class="i-carbon-logo-github text-xl"></span>
              </button>
              <button type="button"
                class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors">
                <span class="i-carbon-logo-google text-xl"></span>
              </button>
              <button type="button"
                class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors">
                <span class="i-carbon-wallet text-xl"></span>
              </button>
            </div>
          </div>
        </form>

        <!-- 注册引导 -->
        <div class="text-center mt-6">
          <p class="text-sm text-gray-500">
            还没有账号?
            <a href="#" class="text-cyan-500 hover:text-cyan-400">
              立即注册
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore, LoginParams } from '../../stores/user';

  const router = useRouter();
  const userStore = useUserStore();

  // 状态
  const loading = ref(false);
  const error = ref('');
  const showPassword = ref(false);

  // 表单数据
  const formData = reactive<LoginParams>({
    username: '',
    password: '',
    remember: false
  });

  // 登录处理
  const handleLogin = async () => {
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

  .btn-glow {
    position: relative;
    overflow: hidden;
  }

  .btn-glow::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(34, 211, 238, 0.3), transparent);
    transform: rotate(45deg);
    animation: glowButton 2s linear infinite;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes glowBorder {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 300% 0;
    }
  }

  @keyframes glowButton {
    0% {
      left: -100%;
    }

    100% {
      left: 100%;
    }
  }
</style>