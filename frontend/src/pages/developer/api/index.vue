<template>
  <div class="developer-api-page">
    <h1 class="text-2xl font-bold mb-6">API文档</h1>
    <p class="mb-4">Atom Nexus提供完整的REST API，便于您集成和构建基于去中心化身份的应用。</p>

    <!-- API文档内容将根据业务需求实现 -->
    <div class="api-documentation mt-8" v-if="developerStore.apiDocumentation">
      <!-- API文档内容将在此显示 -->
    </div>

    <div class="loading-state" v-else-if="developerStore.loading">
      正在加载API文档...
    </div>

    <div class="error-state" v-else-if="developerStore.error">
      加载API文档失败: {{ developerStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useDeveloperStore } from '@/stores/developer';

  const developerStore = useDeveloperStore();

  onMounted(() => {
    // 加载API文档
    developerStore.fetchApiDocumentation();
  });
</script>

<style scoped>
  .developer-api-page {
    padding: 1.5rem;
  }
</style>