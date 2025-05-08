<template>
  <div class="update-log-list">
    <h2 class="text-2xl font-bold text-textlight mb-6">更新日志</h2>
    
    <div class="space-y-6">
      <div v-for="log in logs" :key="log.id" class="update-log-card card p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-xl font-semibold text-textlight">{{ log.title }}</h3>
            <div class="flex items-center space-x-3 mt-1">
              <span class="text-neon font-medium">v{{ log.version }}</span>
              <span class="text-textgray text-sm">{{ formatDate(log.releaseDate) }}</span>
            </div>
          </div>
          
          <button 
            class="btn-outline-primary text-sm px-3 py-1"
            @click="toggleExpand(log.id)"
          >
            {{ expandedLogs.includes(log.id) ? '收起' : '查看详情' }}
          </button>
        </div>
        
        <p class="text-textgray mb-4">{{ log.description }}</p>
        
        <div v-if="expandedLogs.includes(log.id)" class="change-list mt-4 space-y-3">
          <div v-for="(change, index) in log.changes" :key="index" class="change-item flex">
            <div class="change-badge mr-3" :class="getBadgeClass(change.type)">
              {{ getChangeTypeText(change.type) }}
            </div>
            <div class="text-textlight">{{ change.description }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="hasMore" class="flex justify-center mt-8">
      <button class="btn-primary" @click="loadMore">加载更多</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ChangeItem {
  type: 'feature' | 'fix' | 'improvement' | 'security';
  description: string;
}

interface UpdateLog {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  description: string;
  changes: ChangeItem[];
}

const props = defineProps<{
  logs: UpdateLog[];
  hasMore: boolean;
}>();

const emit = defineEmits<{
  (e: 'load-more'): void;
}>();

const expandedLogs = ref<string[]>([]);

const toggleExpand = (id: string) => {
  if (expandedLogs.value.includes(id)) {
    expandedLogs.value = expandedLogs.value.filter(logId => logId !== id);
  } else {
    expandedLogs.value.push(id);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getChangeTypeText = (type: string) => {
  const types: Record<string, string> = {
    feature: '新功能',
    fix: '修复',
    improvement: '改进',
    security: '安全更新'
  };
  return types[type] || type;
};

const getBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    feature: 'bg-neon/20 text-neon',
    fix: 'bg-amber-500/20 text-amber-500',
    improvement: 'bg-blue-500/20 text-blue-500',
    security: 'bg-red-500/20 text-red-500'
  };
  return classes[type] || 'bg-gray-500/20 text-gray-500';
};

const loadMore = () => {
  emit('load-more');
};
</script>

<style scoped>
.update-log-card {
  position: relative;
  border-left: 3px solid var(--color-neon);
}

.change-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}
</style> 