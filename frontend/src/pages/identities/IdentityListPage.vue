<template>
  <div class="identity-list-page">
    <div class="container py-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-textlight mb-2">我的身份管理</h1>
          <p class="text-textgray">管理您的去中心化身份 (DID)，掌控您的数字身份</p>
        </div>

        <!-- 刷新按钮 -->
        <button class="mt-4 md:mt-0 btn-secondary" @click="refreshIdentities" :disabled="loading">
          <span v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></span>
          <span v-else class="i-carbon-refresh mr-2"></span>
          {{ loading ? '加载中...' : '刷新列表' }}
        </button>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
        <p class="text-red-300 flex items-center">
          <span class="i-carbon-warning-filled mr-2"></span>
          {{ error }}
        </p>
        <button class="text-sm text-red-300 underline mt-2" @click="clearError">关闭</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧表单 -->
        <div class="lg:col-span-1">
          <BindIdentityForm @identity-added="refreshIdentities" />
        </div>

        <!-- 右侧身份列表 -->
        <div class="lg:col-span-3">
          <!-- 没有身份时显示的提示 -->
          <div v-if="!loading && identities.length === 0" class="bg-primary/40 rounded-lg p-8 text-center">
            <div class="i-carbon-user-profile text-6xl mx-auto mb-4 text-textgray/50"></div>
            <h3 class="text-xl font-medium text-textlight mb-2">暂无身份</h3>
            <p class="text-textgray mb-4">您还没有绑定任何DID身份，请使用左侧表单添加您的第一个身份</p>
          </div>

          <!-- 身份卡片网格 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <!-- 加载中占位 -->
            <div v-if="loading" class="col-span-full flex justify-center py-12">
              <div class="flex flex-col items-center">
                <div class="i-carbon-circle-dash animate-spin text-4xl text-neon mb-4"></div>
                <p class="text-textgray">正在加载身份列表...</p>
              </div>
            </div>

            <!-- 身份卡片 -->
            <IdentityCard v-else v-for="identity in identities" :key="identity.id" :identity="identity" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useIdentityStore } from '../../stores/identity';
  import IdentityCard from '../../components/identity/IdentityCard.vue';
  import BindIdentityForm from '../../components/identity/BindIdentityForm.vue';

  const identityStore = useIdentityStore();

  // 从store中获取状态
  const identities = ref(identityStore.identities);
  const loading = ref(false);
  const error = ref('');

  // 获取身份列表
  const fetchIdentities = async () => {
    loading.value = true;
    await identityStore.fetchIdentities();
    identities.value = identityStore.identities;
    error.value = identityStore.error || '';
    loading.value = false;
  };

  // 刷新身份列表
  const refreshIdentities = () => {
    fetchIdentities();
  };

  // 清除错误信息
  const clearError = () => {
    error.value = '';
    identityStore.clearError();
  };

  // 页面加载时获取身份列表
  onMounted(() => {
    fetchIdentities();
  });
</script>

<style scoped>
  .identity-list-page {
    min-height: calc(100vh - 64px);
    background-color: var(--color-darkbg);
  }
</style>