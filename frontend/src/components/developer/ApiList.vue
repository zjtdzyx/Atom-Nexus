<template>
  <div class="api-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="i-carbon-circle-dash animate-spin text-3xl text-cyan-400"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 my-4">
      <div class="flex items-center">
        <span class="i-carbon-warning-filled text-xl mr-2"></span>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- API分类列表 -->
    <template v-else>
      <!-- 搜索框 -->
      <div class="mb-6">
        <div class="relative">
          <input type="text" v-model="searchQuery"
            class="w-full pl-12 pr-4 py-3 bg-primary/70 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            placeholder="搜索API名称、路径或描述..." />
          <div class="absolute left-4 top-3.5 text-cyan-500">
            <div class="i-carbon-search text-xl"></div>
          </div>
        </div>
      </div>

      <!-- API分类内容 -->
      <div class="space-y-10">
        <div v-for="(apis, category) in groupedApis" :key="category" class="api-category">
          <h3 class="text-xl font-semibold text-textlight mb-4 flex items-center">
            <span class="i-carbon-api mr-2 text-cyan-400"></span>
            {{ category }}
            <span class="ml-2 text-sm bg-primary-dark px-2 py-0.5 rounded-full text-textgray">{{ apis.length }}</span>
          </h3>

          <!-- API卡片 -->
          <div class="grid grid-cols-1 gap-4">
            <div v-for="api in apis" :key="api.id"
              class="api-card bg-primary/40 border border-gray-800 rounded-lg p-4 hover:border-cyan-800 transition-all duration-300">
              <!-- 标题和方法徽章 -->
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-lg font-medium text-textlight flex items-center">
                  {{ api.name }}
                  <span v-if="api.deprecated"
                    class="ml-2 text-xs bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full">已弃用</span>
                </h4>
                <span :class="[
                  'px-2 py-0.5 text-sm rounded-md font-semibold',
                  methodClass(api.method)
                ]">
                  {{ api.method }}
                </span>
              </div>

              <!-- API路径 -->
              <div
                class="api-path bg-primary-dark rounded px-3 py-2 font-mono text-sm text-cyan-300 mb-3 overflow-x-auto">
                {{ api.path }}
              </div>

              <!-- 描述 -->
              <p class="text-textgray mb-3">{{ api.description }}</p>

              <!-- 标签行 -->
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="text-xs px-2 py-0.5 rounded-full bg-primary-dark text-cyan-400 flex items-center">
                  <span class="i-carbon-version mr-1"></span>{{ api.version }}
                </span>
                <span v-if="api.authRequired"
                  class="text-xs px-2 py-0.5 rounded-full bg-primary-dark text-amber-400 flex items-center">
                  <span class="i-carbon-security mr-1"></span>需要认证
                </span>
                <a v-if="api.documentationUrl" :href="api.documentationUrl" target="_blank" rel="noopener noreferrer"
                  class="text-xs px-2 py-0.5 rounded-full bg-primary-dark text-green-400 flex items-center hover:bg-primary">
                  <span class="i-carbon-document mr-1"></span>文档
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果显示 -->
        <div v-if="Object.keys(groupedApis).length === 0" class="empty-state py-12 text-center">
          <div class="i-carbon-no-image text-6xl mx-auto mb-4 text-textgray"></div>
          <p class="text-textgray">未找到符合条件的API</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps, onMounted, watch } from 'vue';
  import { useDeveloperStore } from '../../stores/developer';
  import type { Api } from '../../stores/developer';

  // 定义属性
  const props = defineProps<{
    initialCategory?: string;
  }>();

  const store = useDeveloperStore();
  const searchQuery = ref('');

  // 状态计算属性
  const loading = computed(() => store.isLoading);
  const error = computed(() => store.getError);
  const apis = computed(() => store.getApis);

  // 按搜索和分类过滤API
  const filteredApis = computed(() => {
    if (!searchQuery.value) {
      return apis.value;
    }

    const query = searchQuery.value.toLowerCase();
    return apis.value.filter(api =>
      api.name.toLowerCase().includes(query) ||
      api.path.toLowerCase().includes(query) ||
      api.description.toLowerCase().includes(query)
    );
  });

  // 按分类分组API
  const groupedApis = computed(() => {
    const result: Record<string, Api[]> = {};

    filteredApis.value.forEach(api => {
      if (!result[api.category]) {
        result[api.category] = [];
      }
      result[api.category].push(api);
    });

    // 如果提供了初始分类，则仅显示该分类
    if (props.initialCategory && result[props.initialCategory]) {
      return { [props.initialCategory]: result[props.initialCategory] };
    }

    return result;
  });

  // HTTP方法对应的样式类
  const methodClass = (method: string): string => {
    const methodStyles: Record<string, string> = {
      'GET': 'bg-green-600/30 text-green-400',
      'POST': 'bg-blue-600/30 text-blue-400',
      'PUT': 'bg-amber-600/30 text-amber-400',
      'DELETE': 'bg-red-600/30 text-red-400',
      'PATCH': 'bg-purple-600/30 text-purple-400'
    };

    return methodStyles[method.toUpperCase()] || 'bg-gray-600/30 text-gray-400';
  };

  // 组件挂载时加载API
  onMounted(async () => {
    if (apis.value.length === 0) {
      await store.fetchApis();
    }
  });
</script>

<style scoped>
  .api-card {
    transition: all 0.3s ease-out;
  }

  .api-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .api-path {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }
</style>