<template>
  <div class="developer-sdk-page">
    <h1 class="text-2xl font-bold mb-6">开发者SDK</h1>
    <p class="mb-4">下载Atom Nexus的SDK，支持多种编程语言，快速集成身份和存储功能。</p>

    <!-- SDK列表将根据业务需求实现 -->
    <div class="sdk-list mt-8" v-if="developerStore.sdkList.length > 0">
      <!-- SDK内容将在此显示 -->
    </div>

    <div class="loading-state" v-else-if="developerStore.loading">
      正在加载SDK信息...
    </div>

    <div class="error-state" v-else-if="developerStore.error">
      加载SDK信息失败: {{ developerStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useDeveloperStore } from '@/stores/developer';

  const developerStore = useDeveloperStore();

  onMounted(() => {
    // 加载SDK列表
    developerStore.fetchSdkList();
  });
</script>

<style scoped>
  .developer-sdk-page {
    padding: 1.5rem;
  }
</style>