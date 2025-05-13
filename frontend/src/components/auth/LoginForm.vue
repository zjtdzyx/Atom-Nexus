<template>
  <div class="auth-login-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="form-group">
        <label for="username" class="block text-sm font-medium text-textlight mb-2">用户名/邮箱</label>
        <input v-model="form.username" type="text" id="username"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请输入用户名或邮箱" required>
      </div>

      <div class="form-group">
        <div class="flex items-center justify-between mb-2">
          <label for="password" class="text-sm font-medium text-textlight">密码</label>
          <a href="#" class="text-xs text-neon hover:text-neon/80 transition-colors"
            @click.prevent="$emit('forgot-password')">忘记密码?</a>
        </div>
        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="请输入密码" required>

        <!-- 密码显示切换 -->
        <div class="flex justify-end mt-1">
          <button type="button" @click="showPassword = !showPassword" class="text-xs text-textgray hover:text-neon">
            {{ showPassword ? '隐藏密码' : '显示密码' }}
          </button>
        </div>
      </div>

      <div class="flex items-center">
        <input v-model="form.remember" type="checkbox" id="remember"
          class="w-4 h-4 border-neon/30 rounded focus:ring-neon text-neon">
        <label for="remember" class="ml-2 text-sm text-textgray">记住我</label>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {{ error }}
      </div>

      <div class="form-group">
        <button type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-neon to-violet text-black font-medium rounded-lg transition-all hover:shadow-neon"
          :disabled="loading">
          <span v-if="loading" class="inline-block animate-spin mr-2">⟳</span>
          登录
        </button>
      </div>
    </form>

    <div class="mt-6 text-center">
      <p class="text-textgray text-sm">
        还没有账号?
        <a href="#" class="text-neon hover:underline" @click.prevent="$emit('show-register')">立即注册</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';

  // 定义事件
  const emit = defineEmits(['login', 'show-register', 'forgot-password']);

  // 定义属性
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  });

  // 状态管理
  const showPassword = ref(false);
  const form = reactive({
    username: '',
    password: '',
    remember: false
  });

  // 提交表单
  const handleSubmit = () => {
    emit('login', { ...form });
  };
</script>

<style scoped>
  .auth-login-form {
    animation: fadeIn 0.3s ease-out;
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