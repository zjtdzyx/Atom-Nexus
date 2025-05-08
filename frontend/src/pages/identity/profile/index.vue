<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-2xl font-bold mb-6">身份资料</h1>
    <p class="mb-6">管理您的身份公开资料信息，这些信息可能会被其他应用程序或用户查看。</p>

    <div v-if="identityStore.loading" class="flex justify-center py-10">
      <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
    </div>

    <div v-else-if="identityStore.error" class="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
      <div class="flex items-center">
        <div class="i-carbon-warning-filled text-xl mr-2"></div>
        <p>{{ identityStore.error }}</p>
      </div>
    </div>

    <template v-else>
      <div class="card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-6">基本资料</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-textgray mb-2">显示名称</label>
            <input v-model="profile.displayName" placeholder="公开展示的名称"
              class="input w-full bg-darkbg text-textlight border-metal/20 mb-4" />
          </div>

          <div>
            <label class="block text-textgray mb-2">电子邮箱</label>
            <input v-model="profile.email" type="email" placeholder="联系邮箱"
              class="input w-full bg-darkbg text-textlight border-metal/20 mb-4" />
          </div>

          <div>
            <label class="block text-textgray mb-2">联系电话</label>
            <input v-model="profile.phone" placeholder="联系电话"
              class="input w-full bg-darkbg text-textlight border-metal/20 mb-4" />
          </div>
        </div>

        <div>
          <label class="block text-textgray mb-2">个人简介</label>
          <textarea v-model="profile.bio" placeholder="简短的个人或组织介绍"
            class="input w-full bg-darkbg text-textlight border-metal/20 mb-4" rows="4"></textarea>
        </div>
      </div>

      <div class="card p-6 mb-8">
        <h2 class="text-xl font-semibold mb-6">社交媒体链接</h2>

        <div v-for="(link, index) in profile.socialLinks" :key="index" class="flex gap-4 mb-4">
          <div class="w-1/3">
            <input v-model="link.platform" placeholder="平台名称"
              class="input w-full bg-darkbg text-textlight border-metal/20" />
          </div>

          <div class="flex-1">
            <input v-model="link.url" placeholder="链接网址"
              class="input w-full bg-darkbg text-textlight border-metal/20" />
          </div>

          <button @click="removeSocialLink(index)" class="text-red-400 hover:text-red-300">
            <div class="i-carbon-trash-can"></div>
          </button>
        </div>

        <button @click="addSocialLink" class="btn-secondary inline-flex items-center mt-2">
          <div class="i-carbon-add mr-2"></div>
          添加社交链接
        </button>
      </div>

      <div class="flex justify-end">
        <button @click="saveProfile" class="btn-primary" :class="{ 'opacity-50 cursor-not-allowed': saveLoading }"
          :disabled="saveLoading">
          <span v-if="saveLoading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          保存资料
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useIdentityStore } from '@/stores/identity';
  import type { IdentityProfile, SocialLink } from '@/types/identity';

  const route = useRoute();
  const identityStore = useIdentityStore();

  const identityId = computed(() => route.query.id as string || identityStore.currentIdentity?.id);
  const saveLoading = ref(false);

  // 默认空资料
  const defaultProfile: IdentityProfile = {
    identityId: identityId.value || '',
    displayName: '',
    email: '',
    phone: '',
    bio: '',
    socialLinks: [],
    customFields: {}
  };

  const profile = ref<IdentityProfile>({ ...defaultProfile });

  // 添加社交链接
  const addSocialLink = () => {
    profile.value.socialLinks = [...(profile.value.socialLinks || []), { platform: '', url: '' }];
  };

  // 移除社交链接
  const removeSocialLink = (index: number) => {
    profile.value.socialLinks = profile.value.socialLinks?.filter((_, i) => i !== index) || [];
  };

  // 保存资料
  const saveProfile = async () => {
    if (!identityId.value) return;

    saveLoading.value = true;

    try {
      await identityStore.updateProfile(profile.value, identityId.value);
      alert('资料已保存');
    } catch (err: any) {
      alert(`保存失败: ${err.message || '未知错误'}`);
    } finally {
      saveLoading.value = false;
    }
  };

  // 加载身份资料
  onMounted(async () => {
    if (!identityId.value) return;

    await identityStore.fetchProfile(identityId.value);

    if (identityStore.profile) {
      profile.value = { ...identityStore.profile };
    } else {
      profile.value = { ...defaultProfile, identityId: identityId.value };
    }
  });
</script>

<style scoped>
  .identity-profile-page {
    padding: 1.5rem;
  }
</style>