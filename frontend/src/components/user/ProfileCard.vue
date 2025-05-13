<template>
  <div class="profile-card p-6 rounded-lg shadow-md bg-primary/40 border border-gray-800/50">
    <div class="flex flex-col md:flex-row items-center md:items-start">
      <!-- 用户头像 -->
      <div class="avatar-container mb-4 md:mb-0 md:mr-6">
        <img v-if="profile?.avatar" :src="profile.avatar" alt="用户头像"
          class="rounded-full w-24 h-24 object-cover border-2 border-neon/30" />
        <div v-else
          class="avatar-placeholder rounded-full w-24 h-24 flex items-center justify-center bg-primary text-neon text-2xl border-2 border-neon/30">
          {{ getInitial(profile) }}
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="profile-info flex-1 text-center md:text-left">
        <h2 class="text-xl font-bold text-textlight">
          {{ profile?.displayName || profile?.username || '未知用户' }}
        </h2>
        <p class="text-textgray mt-1">{{ profile?.email || '无邮箱信息' }}</p>

        <!-- 用户ID和创建日期 -->
        <div class="mt-2 text-sm text-textgray">
          <p v-if="profile?.id" class="mb-1 truncate">
            <span class="i-carbon-id text-neon mr-1 opacity-70"></span>
            ID: {{ shortenId(profile.id) }}
          </p>
          <p v-if="profile?.createdAt" class="mb-1">
            <span class="i-carbon-time text-neon mr-1 opacity-70"></span>
            创建于: {{ formatDate(profile.createdAt) }}
          </p>
        </div>

        <!-- 用户标签 -->
        <div v-if="profile?.tags && profile.tags.length > 0"
          class="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
          <span v-for="tag in profile.tags" :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-neon/10 text-neon border border-neon/30">
            {{ tag }}
          </span>
        </div>

        <!-- 操作按钮 -->
        <div class="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
          <slot name="actions">
            <button @click="$emit('edit')" class="btn-primary text-sm px-4 py-1.5 flex items-center">
              <span class="i-carbon-edit mr-1"></span>
              编辑资料
            </button>
            <button @click="$emit('view-details')" class="btn-secondary text-sm px-4 py-1.5 flex items-center">
              <span class="i-carbon-view mr-1"></span>
              完整资料
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  const emit = defineEmits(['edit', 'view-details']);

  interface UserProfile {
    id?: string;
    username?: string;
    displayName?: string;
    email?: string;
    avatar?: string;
    createdAt?: string;
    tags?: string[];
    [key: string]: any;
  }

  const props = defineProps<{
    profile?: UserProfile;
  }>();

  // 获取用户名首字母
  const getInitial = (profile?: UserProfile): string => {
    if (!profile) return '?';
    if (profile.displayName) return profile.displayName.charAt(0).toUpperCase();
    if (profile.username) return profile.username.charAt(0).toUpperCase();
    return '?';
  };

  // 格式化创建日期
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 缩短ID显示
  const shortenId = (id: string): string => {
    if (id.length <= 12) return id;
    return `${id.substring(0, 6)}...${id.substring(id.length - 6)}`;
  };
</script>

<style scoped>
  .profile-card {
    transition: all 0.3s ease;
  }

  .profile-card:hover {
    box-shadow: 0 4px 20px rgba(12, 255, 225, 0.05);
    border-color: rgba(12, 255, 225, 0.2);
  }

  .avatar-placeholder {
    transition: all 0.3s ease;
  }

  .avatar-placeholder:hover {
    background-color: rgba(12, 255, 225, 0.1);
  }
</style>