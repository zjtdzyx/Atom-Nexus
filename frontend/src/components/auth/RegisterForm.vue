<template>
  <div class="auth-register-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 用户名/邮箱字段 -->
      <div class="form-group">
        <label for="username" class="block text-sm font-medium text-textlight mb-2">用户名 <span
            class="text-red-500">*</span></label>
        <input v-model="form.username" type="text" id="username"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="选择一个唯一的用户名" required>
        <p v-if="validationErrors.username" class="mt-1 text-xs text-red-400">{{ validationErrors.username }}</p>
      </div>

      <!-- 邮箱 -->
      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-textlight mb-2">邮箱 <span
            class="text-red-500">*</span></label>
        <input v-model="form.email" type="email" id="email"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="您的电子邮箱地址" required>
        <p v-if="validationErrors.email" class="mt-1 text-xs text-red-400">{{ validationErrors.email }}</p>
      </div>

      <!-- 密码 -->
      <div class="form-group">
        <label for="password" class="block text-sm font-medium text-textlight mb-2">密码 <span
            class="text-red-500">*</span></label>
        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="设置一个安全的密码" required>
        <p v-if="validationErrors.password" class="mt-1 text-xs text-red-400">{{ validationErrors.password }}</p>

        <!-- 密码强度指示器 -->
        <div v-if="form.password" class="mt-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-textgray">密码强度:</span>
            <span class="text-xs" :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
          </div>
          <div class="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300" :class="passwordStrengthBarClass"
              :style="{ width: `${passwordStrength * 25}%` }"></div>
          </div>
        </div>

        <!-- 密码显示切换 -->
        <div class="flex justify-end mt-1">
          <button type="button" @click="showPassword = !showPassword" class="text-xs text-textgray hover:text-neon">
            {{ showPassword ? '隐藏密码' : '显示密码' }}
          </button>
        </div>
      </div>

      <!-- 确认密码 -->
      <div class="form-group">
        <label for="confirmPassword" class="block text-sm font-medium text-textlight mb-2">确认密码 <span
            class="text-red-500">*</span></label>
        <input v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'" id="confirmPassword"
          class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
          placeholder="再次输入密码" required>
        <p v-if="validationErrors.confirmPassword" class="mt-1 text-xs text-red-400">{{ validationErrors.confirmPassword
        }}</p>
      </div>

      <!-- 服务条款 -->
      <div class="form-group">
        <div class="flex items-start">
          <input v-model="form.agreeTerms" type="checkbox" id="agreeTerms"
            class="mt-1 w-4 h-4 border-neon/30 rounded focus:ring-neon text-neon">
          <label for="agreeTerms" class="ml-2 text-sm text-textgray">
            我已阅读并同意
            <a href="#" class="text-neon hover:underline" @click.prevent="$emit('show-terms')">服务条款</a>
            和
            <a href="#" class="text-neon hover:underline" @click.prevent="$emit('show-privacy')">隐私政策</a>
          </label>
        </div>
        <p v-if="validationErrors.agreeTerms" class="mt-1 text-xs text-red-400">{{ validationErrors.agreeTerms }}</p>
      </div>

      <!-- 通用错误提示 -->
      <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {{ error }}
      </div>

      <!-- 注册按钮 -->
      <div class="form-group">
        <button type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-violet to-neon text-black font-medium rounded-lg transition-all hover:shadow-neon"
          :disabled="loading || !formIsValid">
          <span v-if="loading" class="inline-block animate-spin mr-2">⟳</span>
          创建账号
        </button>
      </div>
    </form>

    <!-- 登录引导 -->
    <div class="mt-6 text-center">
      <p class="text-textgray text-sm">
        已有账号?
        <a href="#" class="text-neon hover:underline" @click.prevent="$emit('show-login')">立即登录</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue';

  // 定义事件
  const emit = defineEmits(['register', 'show-login', 'show-terms', 'show-privacy']);

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
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // 表单验证错误
  const validationErrors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  });

  // 计算密码强度
  const passwordStrength = computed(() => {
    const password = form.password;
    if (!password) return 0;

    let strength = 0;

    // 长度检查
    if (password.length >= 8) strength += 1;

    // 字符类型检查
    if (/[A-Z]/.test(password)) strength += 1; // 大写字母
    if (/[a-z]/.test(password)) strength += 1; // 小写字母
    if (/[0-9]/.test(password)) strength += 1; // 数字
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // 特殊字符

    return Math.min(strength, 4);
  });

  // 密码强度文本
  const passwordStrengthText = computed(() => {
    const strength = passwordStrength.value;
    switch (strength) {
      case 0: return '非常弱';
      case 1: return '弱';
      case 2: return '中等';
      case 3: return '强';
      case 4: return '非常强';
      default: return '';
    }
  });

  // 密码强度文本类
  const passwordStrengthClass = computed(() => {
    const strength = passwordStrength.value;
    switch (strength) {
      case 0: return 'text-red-500';
      case 1: return 'text-red-400';
      case 2: return 'text-yellow-500';
      case 3: return 'text-green-400';
      case 4: return 'text-green-300';
      default: return '';
    }
  });

  // 密码强度进度条类
  const passwordStrengthBarClass = computed(() => {
    const strength = passwordStrength.value;
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-300';
      default: return '';
    }
  });

  // 表单是否有效
  const formIsValid = computed(() => {
    return (
      form.username.trim() !== '' &&
      form.email.trim() !== '' &&
      form.password.trim() !== '' &&
      form.password === form.confirmPassword &&
      form.agreeTerms
    );
  });

  // 验证表单
  const validateForm = () => {
    // 重置错误
    Object.keys(validationErrors).forEach(key => {
      validationErrors[key as keyof typeof validationErrors] = '';
    });

    let isValid = true;

    // 验证用户名
    if (form.username.trim().length < 3) {
      validationErrors.username = '用户名至少需要3个字符';
      isValid = false;
    }

    // 验证邮箱
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = '请输入有效的邮箱地址';
      isValid = false;
    }

    // 验证密码
    if (form.password.length < 8) {
      validationErrors.password = '密码至少需要8个字符';
      isValid = false;
    } else if (passwordStrength.value < 2) {
      validationErrors.password = '密码太弱，请包含大小写字母、数字和特殊字符';
      isValid = false;
    }

    // 验证确认密码
    if (form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }

    // 验证服务条款
    if (!form.agreeTerms) {
      validationErrors.agreeTerms = '请同意服务条款和隐私政策';
      isValid = false;
    }

    return isValid;
  };

  // 提交表单
  const handleSubmit = () => {
    if (!validateForm()) return;

    // 提交数据
    emit('register', {
      username: form.username,
      email: form.email,
      password: form.password
    });
  };

  // 密码变更时清除确认密码错误
  watch(() => form.password, () => {
    validationErrors.password = '';
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = '两次输入的密码不一致';
    } else {
      validationErrors.confirmPassword = '';
    }
  });

  // 确认密码变更时验证匹配
  watch(() => form.confirmPassword, () => {
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = '两次输入的密码不一致';
    } else {
      validationErrors.confirmPassword = '';
    }
  });
</script>

<style scoped>
  .auth-register-form {
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