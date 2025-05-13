<template>
  <div class="profile-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 错误提示 -->
      <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm mb-6">
        {{ error }}
      </div>

      <!-- 成功提示 -->
      <div v-if="success" class="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm mb-6">
        {{ success }}
      </div>

      <!-- 基本信息 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 头像上传 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-textlight mb-2">头像</label>
          <div class="flex items-center">
            <div class="avatar-preview mr-6">
              <img v-if="previewUrl || formData.avatar" :src="previewUrl || formData.avatar" alt="头像预览"
                class="rounded-full w-20 h-20 object-cover" />
              <div v-else
                class="avatar-placeholder rounded-full w-20 h-20 flex items-center justify-center bg-primary text-neon text-2xl">
                {{ getInitial() }}
              </div>
            </div>
            <div class="upload-controls flex-1">
              <label class="btn-secondary inline-block cursor-pointer">
                <span class="i-carbon-upload mr-1"></span>
                选择图片
                <input type="file" class="hidden" accept="image/*" @change="handleImageChange" ref="fileInput">
              </label>
              <button v-if="previewUrl || formData.avatar" type="button" class="btn-outline ml-3" @click="removeAvatar">
                <span class="i-carbon-trash-can mr-1"></span>
                移除
              </button>
            </div>
          </div>
          <p class="text-xs text-textgray mt-2">支持JPG, PNG, GIF格式，最大5MB</p>
        </div>

        <!-- 显示名称 -->
        <div class="form-group">
          <label for="displayName" class="block text-sm font-medium text-textlight mb-2">显示名称</label>
          <input v-model="formData.displayName" type="text" id="displayName"
            class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
            placeholder="设置您的显示名称">
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-textlight mb-2">邮箱</label>
          <input v-model="formData.email" type="email" id="email"
            class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
            placeholder="您的邮箱地址" :disabled="!canChangeEmail">
          <div v-if="!canChangeEmail" class="text-xs text-textgray mt-2">
            <span class="i-carbon-information mr-1"></span>
            邮箱地址不可更改。请联系管理员进行修改。
          </div>
        </div>

        <!-- 生物介绍 -->
        <div class="form-group md:col-span-2">
          <label for="bio" class="block text-sm font-medium text-textlight mb-2">自我介绍</label>
          <textarea v-model="formData.bio" id="bio" rows="3"
            class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
            placeholder="简单介绍一下您自己"></textarea>
        </div>

        <!-- 个人网站 -->
        <div class="form-group">
          <label for="website" class="block text-sm font-medium text-textlight mb-2">个人网站</label>
          <input v-model="formData.website" type="url" id="website"
            class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
            placeholder="https://yourwebsite.com">
        </div>

        <!-- 所在地 -->
        <div class="form-group">
          <label for="location" class="block text-sm font-medium text-textlight mb-2">所在地</label>
          <input v-model="formData.location" type="text" id="location"
            class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
            placeholder="城市, 国家">
        </div>
      </div>

      <!-- 社交媒体链接 -->
      <div class="social-links">
        <h3 class="text-md font-medium text-textlight mb-4">社交媒体链接</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Twitter -->
          <div class="form-group">
            <label for="twitter" class="block text-sm font-medium text-textlight mb-2">
              <span class="i-carbon-logo-twitter mr-1 text-neon"></span>
              Twitter
            </label>
            <input v-model="formData.socialLinks.twitter" type="text" id="twitter"
              class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
              placeholder="@username">
          </div>

          <!-- GitHub -->
          <div class="form-group">
            <label for="github" class="block text-sm font-medium text-textlight mb-2">
              <span class="i-carbon-logo-github mr-1 text-neon"></span>
              GitHub
            </label>
            <input v-model="formData.socialLinks.github" type="text" id="github"
              class="w-full px-4 py-3 bg-primary/40 rounded-lg border border-neon/20 text-textlight focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
              placeholder="username">
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end space-x-4 pt-4 border-t border-gray-800">
        <button type="button" class="btn-secondary" @click="$emit('cancel')">
          取消
        </button>
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          保存修改
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, reactive, onMounted } from 'vue';

  // 定义事件
  const emit = defineEmits(['submit', 'cancel']);

  // 定义接口
  interface SocialLinks {
    twitter?: string;
    github?: string;
    [key: string]: string | undefined;
  }

  interface ProfileData {
    id?: string;
    username?: string;
    displayName?: string;
    email?: string;
    bio?: string;
    avatar?: string;
    website?: string;
    location?: string;
    socialLinks: SocialLinks;
    [key: string]: any;
  }

  // 定义属性
  const props = defineProps({
    profile: {
      type: Object as () => Partial<ProfileData>,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    success: {
      type: String,
      default: ''
    },
    canChangeEmail: {
      type: Boolean,
      default: false
    }
  });

  // 文件输入引用
  const fileInput = ref<HTMLInputElement | null>(null);

  // 表单数据
  const formData = reactive<ProfileData>({
    displayName: '',
    email: '',
    bio: '',
    avatar: '',
    website: '',
    location: '',
    socialLinks: {
      twitter: '',
      github: ''
    }
  });

  // 头像预览
  const previewUrl = ref('');

  // 组件挂载
  onMounted(() => {
    // 初始化表单数据
    if (props.profile) {
      formData.displayName = props.profile.displayName || '';
      formData.email = props.profile.email || '';
      formData.bio = props.profile.bio || '';
      formData.avatar = props.profile.avatar || '';
      formData.website = props.profile.website || '';
      formData.location = props.profile.location || '';

      // 初始化社交链接
      if (props.profile.socialLinks) {
        formData.socialLinks = { ...props.profile.socialLinks };
      }
    }
  });

  // 获取用户名首字母
  const getInitial = (): string => {
    if (formData.displayName) return formData.displayName.charAt(0).toUpperCase();
    if (props.profile?.username) return props.profile.username.charAt(0).toUpperCase();
    return '?';
  };

  // 处理图片上传
  const handleImageChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // 验证文件类型
    if (!file.type.match('image.*')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    // 创建预览URL
    previewUrl.value = URL.createObjectURL(file);

    // 将文件对象保存到表单数据中
    // 注意：在实际提交时需要处理文件上传
    formData.avatarFile = file;
  };

  // 移除头像
  const removeAvatar = () => {
    previewUrl.value = '';
    formData.avatar = '';
    formData.avatarFile = undefined;

    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };

  // 提交表单
  const handleSubmit = () => {
    // 通知父组件
    emit('submit', { ...formData });
  };
</script>

<style scoped>
  .profile-form {
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

  .avatar-preview img,
  .avatar-placeholder {
    border: 2px solid rgba(12, 255, 225, 0.3);
    transition: all 0.3s ease;
  }

  .avatar-preview:hover img,
  .avatar-preview:hover .avatar-placeholder {
    border-color: rgba(12, 255, 225, 0.5);
    box-shadow: 0 0 15px rgba(12, 255, 225, 0.2);
  }
</style>