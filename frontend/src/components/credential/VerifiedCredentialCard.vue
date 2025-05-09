<template>
  <div class="verified-credential-card" :class="{ 'border-green-500/50': isValid, 'border-red-500/50': !isValid }">
    <div class="card p-5" :class="{ 'bg-green-500/5': isValid, 'bg-red-500/5': !isValid }">
      <!-- 验证状态标识 -->
      <div class="flex justify-between items-start mb-4">
        <div class="credential-type">
          <div class="flex items-center">
            <div class="icon-bg w-10 h-10 rounded-full flex items-center justify-center mr-3" :class="getTypeIconBg()">
              <span :class="getTypeIcon()" class="text-lg"></span>
            </div>
            <div>
              <h3 class="text-textlight font-medium">{{ getName() }}</h3>
              <p class="text-xs text-textgray">{{ getIssuerText() }}</p>
            </div>
          </div>
        </div>
        <div class="verification-status">
          <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass()">
            {{ getStatusText() }}
          </span>
        </div>
      </div>

      <!-- 凭证主要信息 -->
      <div class="credential-main-info border-t border-gray-700 pt-3 mt-3 space-y-2">
        <div v-for="(field, index) in getMainFields()" :key="index">
          <div class="text-xs text-textgray">{{ field.label }}</div>
          <div class="text-sm text-textlight">{{ field.value }}</div>
        </div>
      </div>

      <!-- 验证详情 -->
      <div class="verification-details border-t border-gray-700 pt-3 mt-4">
        <div class="text-xs text-textgray mb-2">验证信息</div>
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-darkbg/30 p-2 rounded">
            <span class="text-xs text-textgray">验证时间</span>
            <div class="text-sm text-textlight mt-1">{{ formatDate(verificationTime) }}</div>
          </div>
          <div class="bg-darkbg/30 p-2 rounded">
            <span class="text-xs text-textgray">验证方式</span>
            <div class="text-sm text-textlight mt-1">{{ verificationMethod }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions flex justify-between mt-4 pt-3 border-t border-gray-700">
        <button class="btn-text" @click="$emit('view-details')">
          <span class="i-carbon-view mr-1"></span>详情
        </button>
        <button class="btn-text" @click="$emit('verify-again')">
          <span class="i-carbon-renew mr-1"></span>重新验证
        </button>
        <button v-if="isValid" class="btn-text text-neon" @click="$emit('use-credential')">
          <span class="i-carbon-checkmark mr-1"></span>使用凭证
        </button>
        <button v-else class="btn-text text-red-500" @click="$emit('show-errors')">
          <span class="i-carbon-warning mr-1"></span>查看错误
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue';

  // 定义组件属性
  const props = defineProps({
    credential: {
      type: Object,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true
    },
    verificationTime: {
      type: String,
      default: () => new Date().toISOString()
    },
    verificationMethod: {
      type: String,
      default: '在线验证'
    },
    errors: {
      type: Array,
      default: () => []
    }
  });

  // 定义事件
  defineEmits(['view-details', 'verify-again', 'use-credential', 'show-errors']);

  // 根据凭证类型获取图标背景色
  const getTypeIconBg = () => {
    if (!props.credential) return 'bg-gray-500/20';

    const type = Array.isArray(props.credential.type)
      ? props.credential.type[props.credential.type.length - 1]
      : props.credential.type;

    if (type.includes('Educational')) return 'bg-blue-500/20 text-blue-500';
    if (type.includes('Employment')) return 'bg-green-500/20 text-green-500';
    if (type.includes('Identity')) return 'bg-violet/20 text-violet';
    if (type.includes('Health')) return 'bg-red-500/20 text-red-500';
    if (type.includes('Membership')) return 'bg-yellow-500/20 text-yellow-500';

    return 'bg-neon/20 text-neon';
  };

  // 根据凭证类型获取图标
  const getTypeIcon = () => {
    if (!props.credential) return 'i-carbon-document';

    const type = Array.isArray(props.credential.type)
      ? props.credential.type[props.credential.type.length - 1]
      : props.credential.type;

    if (type.includes('Educational')) return 'i-carbon-certificate';
    if (type.includes('Employment')) return 'i-carbon-badge';
    if (type.includes('Identity')) return 'i-carbon-user-profile';
    if (type.includes('Health')) return 'i-carbon-medicine';
    if (type.includes('Membership')) return 'i-carbon-group';

    return 'i-carbon-certificate';
  };

  // 获取凭证名称
  const getName = () => {
    const credential = props.credential;
    if (!credential) return '未知凭证';

    if (credential.metadata?.name) {
      return credential.metadata.name;
    }

    // 从类型中获取名称
    if (Array.isArray(credential.type) && credential.type.length > 0) {
      const types = credential.type.filter(t => t !== 'VerifiableCredential');
      if (types.length > 0) {
        const lastType = types[types.length - 1];
        return lastType.split('/').pop()?.split('#').pop() || lastType;
      }
    }

    return '可验证凭证';
  };

  // 获取发行者文本
  const getIssuerText = () => {
    const credential = props.credential;
    if (!credential || !credential.issuer) return '';

    if (typeof credential.issuer === 'string') {
      if (credential.issuer.startsWith('did:')) {
        return `由 ${credential.issuer.substring(0, 10)}...${credential.issuer.substring(credential.issuer.length - 5)} 颁发`;
      }
      return `由 ${credential.issuer} 颁发`;
    } else if (typeof credential.issuer === 'object' && credential.issuer.name) {
      return `由 ${credential.issuer.name} 颁发`;
    }

    return '未知发行者';
  };

  // 获取状态类
  const getStatusClass = () => {
    if (!props.isValid) return 'bg-red-500/20 text-red-500';

    const credential = props.credential;
    if (!credential) return 'bg-gray-500/20 text-gray-500';

    if (credential.status === 'revoked') {
      return 'bg-red-500/20 text-red-500';
    }

    // 检查是否过期
    if (credential.expirationDate) {
      const expiryDate = new Date(credential.expirationDate);
      if (expiryDate < new Date()) {
        return 'bg-yellow-500/20 text-yellow-500';
      }
    }

    return 'bg-green-500/20 text-green-500';
  };

  // 获取状态文本
  const getStatusText = () => {
    if (!props.isValid) return '验证失败';

    const credential = props.credential;
    if (!credential) return '未知状态';

    if (credential.status === 'revoked') {
      return '已撤销';
    }

    // 检查是否过期
    if (credential.expirationDate) {
      const expiryDate = new Date(credential.expirationDate);
      if (expiryDate < new Date()) {
        return '已过期';
      }
    }

    return '有效';
  };

  // 获取主要字段
  const getMainFields = () => {
    const credential = props.credential;
    if (!credential || !credential.credentialSubject) return [];

    const fields = [];
    const subject = credential.credentialSubject;

    // 最多显示3个关键字段
    let count = 0;
    for (const key in subject) {
      if (count >= 3) break;

      // 跳过id字段
      if (key === 'id') continue;

      const value = subject[key];
      if (typeof value !== 'object') {
        fields.push({
          label: formatFieldName(key),
          value: value
        });
        count++;
      }
    }

    return fields;
  };

  // 格式化字段名称
  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
</script>

<style scoped>
  .verified-credential-card {
    @apply border rounded-lg border-gray-700 overflow-hidden transition-colors;
  }

  .btn-text {
    @apply text-sm text-textgray hover:text-textlight flex items-center transition-colors;
  }
</style>