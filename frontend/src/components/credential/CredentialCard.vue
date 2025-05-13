<template>
  <div class="credential-card card-atom p-6 group relative" :class="{
    'border-neon/40': credential.status === CredentialStatus.VALID,
    'border-red-500/40': credential.status === CredentialStatus.REVOKED,
    'border-amber-500/40': credential.status === CredentialStatus.EXPIRED
  }">
    <!-- 发光轨道背景 -->
    <div class="card-glow-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    </div>

    <!-- 状态标签 -->
    <div class="status-badge px-3 py-1 absolute top-4 right-4 rounded-full text-xs font-medium backdrop-blur-sm border"
      :class="{
        'bg-neon/10 text-neon border-neon/30': credential.status === CredentialStatus.VALID,
        'bg-red-500/10 text-red-500 border-red-500/30': credential.status === CredentialStatus.REVOKED,
        'bg-amber-500/10 text-amber-500 border-amber-500/30': credential.status === CredentialStatus.EXPIRED
      }">
      {{ getStatusText(credential.status) }}
    </div>

    <!-- 凭证内容 -->
    <div class="relative z-10">
      <!-- 凭证类型图标 -->
      <div class="flex mb-4">
        <div class="credential-icon w-14 h-14 rounded-full flex items-center justify-center relative"
          :class="getStatusColorClass(credential.status)">
          <div :class="[getIconClass(credential.type), 'text-3xl', getStatusTextClass(credential.status)]">
          </div>
          <div class="icon-ring absolute inset-0 rounded-full animate-pulse-slow opacity-50"></div>
        </div>
      </div>

      <!-- 凭证信息 -->
      <div class="mb-6">
        <h3 class="text-lg font-bold text-textlight mb-1 truncate" :title="credential.metadata?.name">
          {{ credential.metadata?.name || getCredentialTypeName(credential) }}
        </h3>
        <div class="credential-type px-2 py-0.5 rounded text-xs inline-block mb-3 bg-primary/60 border border-neon/10">
          {{ getCredentialTypeName(credential) }}
        </div>

        <div class="space-y-2 text-xs">
          <div class="flex items-center text-textgray">
            <span class="i-carbon-user-profile mr-2 opacity-70"></span>
            <span>签发者: {{ formatId(credential.issuer) }}</span>
          </div>
          <div class="flex items-center text-textgray">
            <span class="i-carbon-calendar mr-2 opacity-70"></span>
            <span>签发日期: {{ formatDate(credential.issuanceDate) }}</span>
          </div>
          <div v-if="credential.expirationDate" class="flex items-center"
            :class="isExpired(credential.expirationDate) ? 'text-amber-500' : 'text-textgray'">
            <span class="i-carbon-time mr-2 opacity-70"></span>
            <span>到期日期: {{ formatDate(credential.expirationDate) }}</span>
          </div>
        </div>
      </div>

      <!-- 轨道分隔线 -->
      <div class="network-viz h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent mb-4"></div>

      <!-- 操作按钮 -->
      <div class="flex justify-between">
        <button class="btn-outline text-xs px-3 py-1.5 flex items-center" @click="showQRCode">
          <span class="i-carbon-qr-code mr-1"></span>分享
        </button>
        <button class="btn-primary text-xs px-3 py-1.5 flex items-center" @click="viewDetails">
          <span class="i-carbon-view mr-1"></span>详情
        </button>
      </div>
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

  // 获取凭证类型名称
  const getCredentialTypeName = (cred: Credential): string => {
    // 取最后一个类型作为主类型（跳过 VerifiableCredential）
    const types = cred.type.filter((t: string) => t !== 'VerifiableCredential');
    if (types.length === 0) return 'VerifiableCredential';

    // 从完整类型URI中提取类型名
    const lastType = types[types.length - 1];
    return lastType.split('/').pop()?.split('#').pop() || lastType;
  };

  // 获取状态文本
  const getStatusText = (status: CredentialStatus): string => {
    const statusMap: Record<string, string> = {
      [CredentialStatus.VALID]: '有效',
      [CredentialStatus.REVOKED]: '已撤销',
      [CredentialStatus.EXPIRED]: '已过期'
    };

    return statusMap[status] || '未知状态';
  };

  // 获取状态对应的背景色类
  const getStatusColorClass = (status: CredentialStatus): string => {
    const statusMap: Record<string, string> = {
      [CredentialStatus.VALID]: 'bg-neon/20',
      [CredentialStatus.REVOKED]: 'bg-red-500/20',
      [CredentialStatus.EXPIRED]: 'bg-amber-500/20'
    };

    return statusMap[status] || 'bg-gray-500/20';
  };

  // 获取状态对应的文字颜色类
  const getStatusTextClass = (status: CredentialStatus): string => {
    const statusMap: Record<string, string> = {
      [CredentialStatus.VALID]: 'text-neon',
      [CredentialStatus.REVOKED]: 'text-red-500',
      [CredentialStatus.EXPIRED]: 'text-amber-500'
    };

    return statusMap[status] || 'text-gray-500';
  };

  // 判断是否已过期
  const isExpired = (dateString: string): boolean => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
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

  // 格式化ID (简化显示)
  const formatId = (id: string): string => {
    if (!id) return '';
    if (id.length <= 20) return id;
    return `${id.substring(0, 10)}...${id.substring(id.length - 6)}`;
  };

  // 根据凭证类型获取对应图标
  const getIconClass = (types: string[]): string => {
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
    for (const type of types) {
      for (const [key, value] of Object.entries(typeIconMap)) {
        if (type.toLowerCase().includes(key.toLowerCase())) {
          return value;
        }
      }
    }

    // 默认图标
    return 'i-carbon-certificate';
  };

  // 查看凭证详情
  const viewDetails = () => {
    router.push(`/credential/${props.credential.id}`);
  };

  // 显示二维码
  const showQRCode = () => {
    router.push(`/credential/${props.credential.id}?showQr=true`);
  };
</script>

<style scoped>
  .credential-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .credential-card:hover {
    transform: translateY(-5px);
  }

  .card-glow-effect {
    background: radial-gradient(circle at center, var(--color-neon) 0%, transparent 70%);
    filter: blur(20px);
    transition: opacity 0.5s ease;
  }

  .credential-card:hover .card-glow-effect {
    animation: pulse-slow 3s infinite;
  }

  .icon-ring {
    border: 1px solid;
    border-color: inherit;
  }

  .network-viz {
    animation: pulse-slow 3s infinite;
  }

  @keyframes pulse-slow {

    0%,
    100% {
      opacity: 0.3;
    }

    50% {
      opacity: 0.6;
    }
  }
</style>
