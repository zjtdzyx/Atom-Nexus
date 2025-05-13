<template>
  <div class="identity-card card-atom p-6"
    :class="{ 'border-neon/30': identity.isActive, 'border-metal/20': !identity.isActive }">

    <!-- 原子可视化效果 -->
    <div class="atom-visualization absolute inset-0 opacity-20">
      <div class="atom-core-viz"></div>
      <div class="atom-orbit-viz atom-orbit-1-viz"></div>
      <div class="atom-orbit-viz atom-orbit-2-viz"></div>
    </div>

    <!-- 卡片内容 -->
    <div class="relative z-10">
      <!-- 头部 -->
      <div class="flex justify-between items-start">
        <div class="identity-icon w-12 h-12 rounded-full flex items-center justify-center"
          :class="identity.isActive ? 'bg-neon/20 shadow-neon' : 'bg-primary/60'">
          <div class="i-carbon-user-profile text-2xl" :class="identity.isActive ? 'text-neon' : 'text-metal'"></div>
        </div>
        <div class="identity-status px-3 py-1 rounded-full text-xs font-medium"
          :class="identity.status === IdentityStatus.ACTIVE ? 'bg-neon/20 text-neon border border-neon/30' : 'bg-primary/60 text-metal border border-metal/20'">
          {{ identity.status === IdentityStatus.ACTIVE ? '活跃' : identity.status === IdentityStatus.INACTIVE ? '非活跃' :
            '已撤销' }}
        </div>
      </div>

      <!-- DID 信息 -->
      <div class="mt-6">
        <div class="text-xs text-textgray mb-1">去中心化标识符 (DID)</div>
        <h3 class="text-lg font-semibold text-textlight mb-1 truncate" :title="identity.did">
          {{ formatDid(identity.did) }}
        </h3>
        <div class="text-xs text-textgray flex items-center">
          <span class="i-carbon-time mr-1"></span>
          创建于 {{ formatDate(identity.createdAt) }}
        </div>
        <div class="text-xs text-textgray mt-1 flex items-center">
          <span class="i-carbon-connection mr-1"></span>
          类型: {{ identity.type }}
        </div>
        <div v-if="isDefault" class="text-xs text-neon mt-1 flex items-center">
          <span class="i-carbon-star mr-1"></span>
          默认身份
        </div>
      </div>

      <!-- 网络连接可视化 -->
      <div class="network-viz my-4 h-1 bg-gradient-to-r from-transparent via-neon/30 to-transparent"></div>

      <!-- 操作按钮 -->
      <div class="mt-4 flex justify-between items-center">
        <button class="btn-outline text-xs px-3 py-1.5 flex items-center" @click="copyDid(identity.did)">
          <span class="i-carbon-copy mr-1"></span>复制DID
        </button>
        <button class="btn-primary text-xs px-3 py-1.5 flex items-center" @click="viewDetails(identity.id)">
          <span class="i-carbon-view mr-1"></span>查看详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import { useRouter } from 'vue-router';
  import { type Identity, IdentityStatus } from '../../types/identity';

  // 定义事件
  const emit = defineEmits(['view', 'toggle-dropdown', 'set-default', 'activate', 'deactivate', 'delete']);

  // 定义属性
  const props = defineProps<{
    identity: Identity;
    isDefault: boolean;
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
    emit('view');
  };
</script>

<style scoped>
  .identity-card {
    border-width: 1px;
    border-style: solid;
    transition: all 0.3s ease;
  }

  .identity-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(12, 255, 225, 0.2);
  }

  /* 原子可视化 */
  .atom-visualization {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .atom-core-viz {
    position: absolute;
    top: 80%;
    right: 10%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--color-neon);
    box-shadow: 0 0 8px var(--color-neon);
    opacity: 0.6;
  }

  .atom-orbit-viz {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(12, 255, 225, 0.1);
    opacity: 0.6;
  }

  .atom-orbit-1-viz {
    top: 80%;
    right: 10%;
    width: 40px;
    height: 40px;
    animation: orbit 10s linear infinite;
  }

  .atom-orbit-2-viz {
    top: 80%;
    right: 10%;
    width: 70px;
    height: 70px;
    animation: orbit 15s linear infinite reverse;
  }

  /* 网络连接可视化 */
  .network-viz {
    animation: pulse-slow 3s infinite;
  }
</style>