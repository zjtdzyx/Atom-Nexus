<template>
  <div class="permission-card card-atom p-6 group relative" :class="{
    'border-neon/40': permission.status === 'active',
    'border-red-500/40': permission.status === 'revoked',
    'border-amber-500/40': permission.status === 'expired'
  }">
    <!-- 网络连接线背景效果 -->
    <div class="network-lines absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
      <div class="network-line" style="top: 30%; left: 0; width: 60%; transform: rotate(15deg);"></div>
      <div class="network-line" style="top: 60%; right: 0; width: 40%; transform: rotate(-10deg);"></div>
    </div>

    <!-- 状态标签 -->
    <div class="status-badge px-3 py-1 absolute top-4 right-4 rounded-full text-xs font-medium backdrop-blur-sm border"
      :class="{
        'bg-neon/10 text-neon border-neon/30': permission.status === 'active',
        'bg-red-500/10 text-red-500 border-red-500/30': permission.status === 'revoked',
        'bg-amber-500/10 text-amber-500 border-amber-500/30': permission.status === 'expired'
      }">
      {{ getStatusText(permission.status) }}
    </div>

    <!-- 内容区 -->
    <div class="relative z-10">
      <!-- 权限类型图标 -->
      <div class="flex mb-5">
        <div class="permission-icon w-14 h-14 rounded-full flex items-center justify-center relative"
          :class="permission.status === 'active' ? 'bg-neon/20 shadow-neon' : 'bg-primary/60'">
          <div
            :class="[getPermissionIcon(permission.permissionType), 'text-3xl', permission.status === 'active' ? 'text-neon' : 'text-metal']">
          </div>
          <!-- 旋转环 -->
          <div class="icon-ring absolute inset-0 rounded-full"></div>
        </div>
      </div>

      <!-- 权限信息 -->
      <div class="mb-5">
        <!-- 凭证名称 -->
        <h3 class="text-lg font-bold text-textlight mb-1 truncate" :title="permission.credentialName || '未命名凭证'">
          {{ permission.credentialName || '未命名凭证' }}
        </h3>

        <!-- 权限类型 -->
        <div class="permission-type px-2 py-0.5 rounded text-xs inline-block mb-3 bg-primary/60 border border-neon/10">
          {{ getPermissionTypeText(permission.permissionType) }}
        </div>

        <!-- 详细信息 -->
        <div class="space-y-2 text-xs">
          <div class="flex items-center text-textgray">
            <span class="i-carbon-user-profile mr-2 opacity-70"></span>
            <span class="truncate">授权者: {{ permission.issuerName || formatDid(permission.issuerId) }}</span>
          </div>
          <div class="flex items-center text-textgray">
            <span class="i-carbon-calendar mr-2 opacity-70"></span>
            <span>授权日期: {{ formatDate(permission.grantedAt) }}</span>
          </div>
          <div v-if="permission.expirationDate" class="flex items-center"
            :class="isExpired(permission.expirationDate) ? 'text-amber-500' : 'text-textgray'">
            <span class="i-carbon-time mr-2 opacity-70"></span>
            <span>到期日期: {{ formatDate(permission.expirationDate) }}</span>
          </div>
        </div>
      </div>

      <!-- 允许的声明（如果是部分授权） -->
      <div
        v-if="permission.permissionType === 'partial' && permission.allowedClaims && permission.allowedClaims.length > 0"
        class="mb-5 p-3 bg-primary/40 rounded-lg border border-neon/5">
        <p class="text-xs text-textgray mb-2 flex items-center">
          <span class="i-carbon-filter mr-1"></span>允许的声明:
        </p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="claim in permission.allowedClaims" :key="claim"
            class="text-xs px-2 py-0.5 bg-neon/10 text-neon border border-neon/20 rounded-full truncate max-w-[120px]"
            :title="claim">
            {{ claim }}
          </span>
        </div>
      </div>

      <!-- 网络分隔线 -->
      <div class="network-viz h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent mb-5"></div>

      <!-- 操作按钮 -->
      <div class="flex justify-between">
        <button v-if="permission.status === 'active'"
          class="btn-outline text-xs px-3 py-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center"
          @click="revokePermission">
          <span class="i-carbon-close-filled mr-1"></span>撤销
        </button>
        <button v-else class="btn-outline text-xs px-3 py-1.5 opacity-0 pointer-events-none">
          <!-- 占位按钮，保持布局一致 -->
        </button>
        <button class="btn-primary text-xs px-3 py-1.5 flex items-center" @click="viewCredential">
          <span class="i-carbon-view mr-1"></span>凭证详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePermissionStore } from '../../stores/permission';
  import type { DidPermission } from '../../stores/permission';
  import { PermissionType } from '../../stores/permission';

  const props = defineProps<{
    permission: DidPermission;
  }>();

  const emit = defineEmits<{
    (e: 'revoke', permissionId: string): void;
  }>();

  const router = useRouter();
  const permissionStore = usePermissionStore();

  // 获取状态文本
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'active': '有效',
      'revoked': '已撤销',
      'expired': '已过期'
    };

    return statusMap[status] || '未知状态';
  };

  // 获取权限类型文本
  const getPermissionTypeText = (type: string): string => {
    const typeMap: Record<string, string> = {
      [PermissionType.ONE_TIME]: '一次性授权',
      [PermissionType.LONG_TERM]: '长期授权',
      [PermissionType.PARTIAL]: '部分授权'
    };

    return typeMap[type] || '未知类型';
  };

  // 根据权限类型获取对应图标
  const getPermissionIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      [PermissionType.ONE_TIME]: 'i-carbon-time',
      [PermissionType.LONG_TERM]: 'i-carbon-calendar',
      [PermissionType.PARTIAL]: 'i-carbon-filter'
    };

    return iconMap[type] || 'i-carbon-document-security';
  };

  // 格式化日期
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '无';

    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 判断是否已过期
  const isExpired = (dateString: string): boolean => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // 格式化DID，截断过长的DID
  const formatDid = (did: string): string => {
    if (!did) return '';
    if (did.length <= 20) return did;

    const start = did.substring(0, 10);
    const end = did.substring(did.length - 5);
    return `${start}...${end}`;
  };

  // 查看凭证详情
  const viewCredential = () => {
    router.push(`/credential/${props.permission.credentialId}`);
  };

  // 撤销权限
  const revokePermission = async () => {
    if (confirm('确定要撤销此权限吗？该操作不可恢复。')) {
      try {
        await permissionStore.revokePermission(props.permission.id);
        emit('revoke', props.permission.id);
      } catch (error) {
        console.error('撤销权限失败', error);
      }
    }
  };
</script>

<style scoped>
  .permission-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .permission-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(12, 255, 225, 0.2);
  }

  .network-lines {
    pointer-events: none;
  }

  .network-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, var(--color-neon), transparent);
    animation: line-flash 5s infinite ease-in-out;
    opacity: 0.3;
  }

  .icon-ring {
    border: 1px solid rgba(12, 255, 225, 0.3);
    animation: orbit 15s linear infinite;
  }

  .network-viz {
    animation: pulse-slow 3s infinite;
  }

  @keyframes line-flash {

    0%,
    100% {
      opacity: 0.2;
    }

    50% {
      opacity: 0.6;
    }
  }

  @keyframes pulse-slow {

    0%,
    100% {
      opacity: 0.3;
    }

    50% {
      opacity: 0.7;
    }
  }
</style>