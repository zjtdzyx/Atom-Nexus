<template>
  <div class="identity-card card backdrop-blur-sm hover:shadow-xl transition-all duration-300"
    :class="{ 'border-neon': identity.bindStatus, 'border-metal/40': !identity.bindStatus }">
    <div class="flex justify-between items-start">
      <div class="identity-icon rounded-full p-3" :class="identity.bindStatus ? 'bg-neon/20' : 'bg-gray-600/20'">
        <div class="i-carbon-user-profile text-2xl" :class="identity.bindStatus ? 'text-neon' : 'text-metal'"></div>
      </div>
      <div class="identity-status px-2 py-1 rounded-full text-xs font-medium"
        :class="identity.bindStatus ? 'bg-neon/20 text-neon' : 'bg-gray-600/20 text-metal'">
        {{ identity.bindStatus ? '已绑定' : '未绑定' }}
      </div>
    </div>

    <div class="mt-4">
      <h3 class="text-lg font-semibold text-textlight truncate" :title="identity.did">
        {{ formatDid(identity.did) }}
      </h3>
      <p class="text-sm text-textgray mt-1">
        创建时间: {{ formatDate(identity.createdAt) }}
      </p>
      <div v-if="identity.bindType" class="text-sm text-textgray mt-1">
        绑定类型: {{ identity.bindType }}
      </div>
    </div>

    <div class="mt-4 flex justify-between items-center">
      <button class="btn-secondary text-xs px-3 py-1.5" @click="copyDid(identity.did)">
        <span class="i-carbon-copy mr-1"></span>复制DID
      </button>
      <button class="btn-primary text-xs px-3 py-1.5" @click="viewDetails(identity.id)">
        <span class="i-carbon-view mr-1"></span>查看详情
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import { useRouter } from 'vue-router';

  // 定义属性
  const props = defineProps<{
    identity: {
      id: string;
      did: string;
      createdAt: string;
      bindStatus: boolean;
      bindType?: string;
    }
  }>();

  const router = useRouter();

  // 处理DID显示，如果太长则截断中间部分
  const formatDid = (did: string): string => {
    if (did.length <= 30) return did;
    return `${did.substring(0, 15)}...${did.substring(did.length - 10)}`;
  };

  // 格式化日期显示
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 复制DID到剪贴板
  const copyDid = (did: string) => {
    navigator.clipboard.writeText(did)
      .then(() => {
        // 这里可以添加一个提示组件，显示"复制成功"
        alert('DID已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 查看身份详情
  const viewDetails = (id: string) => {
    router.push(`/identities/${id}`);
  };
</script>

<style scoped>
  .identity-card {
    border-width: 1px;
    border-style: solid;
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .identity-card:hover {
    transform: translateY(-4px);
  }
</style>