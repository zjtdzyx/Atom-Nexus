<template>
  <div class="credential-card hover:transform hover:-translate-y-2 transition-all duration-300 relative" :class="{
    'border-neon': credential.status === 'active',
    'border-red-500': credential.status === 'revoked',
    'border-amber-500': credential.status === 'expired'
  }">
    <!-- 状态标签 -->
    <div class="status-badge px-2 py-0.5 absolute top-3 right-3 rounded-full text-xs font-medium" :class="{
      'bg-neon/20 text-neon': credential.status === 'active',
      'bg-red-500/20 text-red-500': credential.status === 'revoked',
      'bg-amber-500/20 text-amber-500': credential.status === 'expired'
    }">
      {{ getStatusText(credential.status) }}
    </div>

    <!-- 凭证类型图标 -->
    <div class="flex mb-4">
      <div class="credential-icon rounded-full p-3"
        :class="credential.status === 'active' ? 'bg-neon/20' : 'bg-gray-600/20'">
        <div
          :class="[getIconClass(credential.type.name), 'text-2xl', credential.status === 'active' ? 'text-neon' : 'text-metal']">
        </div>
      </div>
    </div>

    <!-- 凭证内容 -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-textlight mb-1 truncate" :title="credential.name">
        {{ credential.name }}
      </h3>
      <p class="text-sm text-textgray">
        {{ credential.type.name }}
      </p>
      <p class="text-sm text-textgray mt-1">
        签发者: {{ credential.issuerName || credential.issuerId }}
      </p>
      <p class="text-sm text-textgray mt-1">
        发行日期: {{ formatDate(credential.issuedAt) }}
      </p>
      <p v-if="credential.expirationDate" class="text-sm text-textgray mt-1">
        到期日期: {{ formatDate(credential.expirationDate) }}
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-between mt-auto">
      <button class="btn-secondary text-xs px-3 py-1.5" @click="showQRCode">
        <span class="i-carbon-qr-code mr-1"></span>分享
      </button>
      <button class="btn-primary text-xs px-3 py-1.5" @click="viewDetails">
        <span class="i-carbon-view mr-1"></span>查看详情
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import { useRouter } from 'vue-router';
  import { CredentialStatus } from '../../stores/credential';
  import type { Credential } from '../../stores/credential';

  const props = defineProps<{
    credential: Credential
  }>();

  const router = useRouter();

  // 获取状态文本
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      [CredentialStatus.ACTIVE]: '有效',
      [CredentialStatus.REVOKED]: '已撤销',
      [CredentialStatus.EXPIRED]: '已过期'
    };

    return statusMap[status] || '未知状态';
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

  // 根据凭证类型获取对应图标
  const getIconClass = (typeName: string): string => {
    const typeIconMap: Record<string, string> = {
      'Identity': 'i-carbon-user-profile',
      'Education': 'i-carbon-education',
      'Employment': 'i-carbon-workspace',
      'Certificate': 'i-carbon-certificate',
      'License': 'i-carbon-license',
      'Membership': 'i-carbon-group',
      'Verification': 'i-carbon-checkmark-filled',
      'Health': 'i-carbon-health-cross',
      'Award': 'i-carbon-trophy',
      'Financial': 'i-carbon-currency',
    };

    // 尝试匹配凭证类型名称
    for (const [key, value] of Object.entries(typeIconMap)) {
      if (typeName.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // 默认图标
    return 'i-carbon-certificate';
  };

  // 查看凭证详情
  const viewDetails = () => {
    router.push(`/credentials/${props.credential.id}`);
  };

  // 显示二维码
  const showQRCode = () => {
    router.push(`/credentials/${props.credential.id}?showQr=true`);
  };
</script>

<style scoped>
  .credential-card {
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

  .credential-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
</style>
