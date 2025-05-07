<template>
  <div class="permission-card hover:transform hover:-translate-y-2 transition-all duration-300 relative" :class="{
    'border-neon': permission.status === 'active',
    'border-red-500': permission.status === 'revoked',
    'border-amber-500': permission.status === 'expired'
  }">
    <!-- 状态标签 -->
    <div class="status-badge px-2 py-0.5 absolute top-3 right-3 rounded-full text-xs font-medium" :class="{
      'bg-neon/20 text-neon': permission.status === 'active',
      'bg-red-500/20 text-red-500': permission.status === 'revoked',
      'bg-amber-500/20 text-amber-500': permission.status === 'expired'
    }">
      {{ getStatusText(permission.status) }}
    </div>

    <!-- 权限类型图标 -->
    <div class="flex mb-4">
      <div class="permission-icon rounded-full p-3"
        :class="permission.status === 'active' ? 'bg-neon/20' : 'bg-gray-600/20'">
        <div
          :class="[getPermissionIcon(permission.permissionType), 'text-2xl', permission.status === 'active' ? 'text-neon' : 'text-metal']">
        </div>
      </div>
    </div>

    <!-- 权限内容 -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-textlight mb-1 truncate" :title="permission.credentialName || '未命名凭证'">
        {{ permission.credentialName || '未命名凭证' }}
      </h3>
      <p class="text-sm text-textgray">
        {{ getPermissionTypeText(permission.permissionType) }}
      </p>
      <p class="text-sm text-textgray mt-1">
        授权者: {{ permission.issuerName || formatDid(permission.issuerId) }}
      </p>
      <p class="text-sm text-textgray mt-1">
        授权日期: {{ formatDate(permission.grantedAt) }}
      </p>
      <p v-if="permission.expirationDate" class="text-sm text-textgray mt-1">
        到期日期: {{ formatDate(permission.expirationDate) }}
      </p>
    </div>

    <!-- 允许的声明（如果是部分授权） -->
    <div
      v-if="permission.permissionType === 'partial' && permission.allowedClaims && permission.allowedClaims.length > 0"
      class="mb-4 p-2 bg-gray-800/50 rounded-lg">
      <p class="text-xs text-textgray mb-1">允许的声明:</p>
      <div class="flex flex-wrap gap-1">
        <span v-for="claim in permission.allowedClaims" :key="claim"
          class="text-xs px-2 py-0.5 bg-neon/10 text-textlight rounded-full truncate max-w-[120px]" :title="claim">
          {{ claim }}
        </span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-between mt-auto">
      <button v-if="permission.status === 'active'" class="btn-danger text-xs px-3 py-1.5" @click="revokePermission">
        <span class="i-carbon-close-filled mr-1"></span>撤销
      </button>
      <button v-else class="btn-secondary text-xs px-3 py-1.5 invisible">
        <!-- 占位按钮，保持布局一致 -->
      </button>
      <button class="btn-primary text-xs px-3 py-1.5" @click="viewCredential">
        <span class="i-carbon-view mr-1"></span>查看凭证
      </button>
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
    router.push(`/credentials/${props.permission.credentialId}`);
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
    background-color: rgba(30, 30, 47, 0.5);
    backdrop-filter: blur(8px);
    border-radius: 1rem;
    border-width: 1px;
    border-style: solid;
    padding: 1.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .permission-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }

  .btn-danger {
    @apply bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 rounded-lg transition-colors;
  }
</style>