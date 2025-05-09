<template>
  <div class="credential-detail-page">
    <!-- 页面标题和导航 -->
    <div class="page-header py-6">
      <div class="container">
        <div class="flex items-center mb-4">
          <router-link to="/credential" class="btn-secondary mr-4">
            <span class="i-carbon-arrow-left mr-1"></span>返回
          </router-link>
          <h1 class="text-2xl font-bold text-textlight">凭证详情</h1>
        </div>
      </div>
    </div>

    <div class="container py-6">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
        <p>{{ error }}</p>
        <button class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" @click="fetchCredential">
          重试
        </button>
      </div>

      <!-- 凭证详情 -->
      <div v-else-if="credential" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 主要信息卡片 -->
        <div class="md:col-span-1">
          <div class="card p-6">
            <!-- 凭证状态和基本信息 -->
            <div class="flex items-center justify-between mb-6">
              <div class="credential-icon w-16 h-16 rounded-full bg-violet/20 flex items-center justify-center">
                <span v-if="!credential.metadata?.image" class="i-carbon-certificate text-3xl text-neon"></span>
                <img v-else :src="credential.metadata.image" alt="凭证图标" class="w-full h-full object-cover rounded-full">
              </div>
              <span class="px-3 py-1 text-xs rounded-full" :class="{
                'bg-green-500/20 text-green-500': credential.status === 'valid',
                'bg-yellow-500/20 text-yellow-500': credential.status === 'expired',
                'bg-red-500/20 text-red-500': credential.status === 'revoked'
              }">
                {{ credential.status === 'valid' ? '有效' : credential.status === 'expired' ? '已过期' : '已撤销' }}
              </span>
            </div>

            <h2 class="text-xl font-semibold text-textlight mb-2">
              {{ credential.metadata?.name || getCredentialTypeName(credential) }}
            </h2>
            <p class="text-textgray text-sm mb-6">{{ credential.metadata?.description || '无描述' }}</p>

            <!-- 发行信息 -->
            <div class="mb-6">
              <h3 class="text-sm text-textgray font-medium mb-2">发行信息</h3>
              <div class="bg-darkbg/50 rounded-lg p-4 space-y-3">
                <div>
                  <div class="text-xs text-textgray mb-1">发行者</div>
                  <div class="text-sm text-textlight">{{ formatDid(credential.issuer) }}</div>
                </div>
                <div>
                  <div class="text-xs text-textgray mb-1">持有者</div>
                  <div class="text-sm text-textlight">{{ formatDid(credential.holder) }}</div>
                </div>
                <div>
                  <div class="text-xs text-textgray mb-1">颁发日期</div>
                  <div class="text-sm text-textlight">{{ formatDate(credential.issuanceDate) }}</div>
                </div>
                <div v-if="credential.expirationDate">
                  <div class="text-xs text-textgray mb-1">过期日期</div>
                  <div class="text-sm" :class="{
                    'text-textlight': credential.status === 'valid',
                    'text-yellow-500': credential.status === 'expired'
                  }">{{ formatDate(credential.expirationDate) }}</div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="space-y-3">
              <button class="btn-primary w-full py-2" @click="verifyCredential">
                <span class="i-carbon-certificate-check mr-1"></span>验证凭证
              </button>
              <button class="btn-secondary w-full py-2" @click="shareCredential">
                <span class="i-carbon-share mr-1"></span>分享凭证
              </button>
              <button class="btn-secondary w-full py-2" @click="exportCredential">
                <span class="i-carbon-export mr-1"></span>导出凭证
              </button>
              <button v-if="credential.status === 'valid'" class="btn-secondary w-full py-2 text-red-500"
                @click="openRevokeModal">
                <span class="i-carbon-close mr-1"></span>撤销凭证
              </button>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="md:col-span-2">
          <!-- 凭证内容 -->
          <div class="card p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-textlight">凭证内容</h3>
              <div class="flex items-center">
                <span class="text-xs px-2 py-1 rounded-full bg-primary/80">
                  {{ credential.type.join(', ') }}
                </span>
              </div>
            </div>

            <!-- 凭证主体信息 -->
            <div class="credential-subject mb-6">
              <h4 class="text-sm text-textgray mb-2">凭证主体数据</h4>
              <div class="bg-darkbg/50 rounded-lg p-4">
                <div v-for="(value, key) in credential.credentialSubject" :key="key" class="mb-3 last:mb-0">
                  <div class="text-xs text-textgray mb-1">{{ formatFieldName(key) }}</div>
                  <div class="text-sm text-textlight">
                    {{ typeof value === 'object' ? JSON.stringify(value) : value }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 凭证证明 -->
            <div class="credential-proof">
              <h4 class="text-sm text-textgray mb-2">证明信息</h4>
              <div class="bg-darkbg/50 rounded-lg p-4">
                <div v-if="credential.proof">
                  <div class="mb-3">
                    <div class="text-xs text-textgray mb-1">类型</div>
                    <div class="text-sm text-textlight">{{ credential.proof.type }}</div>
                  </div>
                  <div class="mb-3">
                    <div class="text-xs text-textgray mb-1">创建时间</div>
                    <div class="text-sm text-textlight">{{ formatDate(credential.proof.created) }}</div>
                  </div>
                  <div class="mb-3">
                    <div class="text-xs text-textgray mb-1">验证方法</div>
                    <div class="text-sm text-textlight overflow-auto">
                      {{ credential.proof.verificationMethod }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-xs text-textgray mb-1">目的</div>
                    <div class="text-sm text-textlight">{{ credential.proof.proofPurpose }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-textgray mb-1">签名值</div>
                    <div class="text-sm text-textlight font-mono overflow-auto">{{
                      truncateSignature(credential.proof.signature) }}</div>
                  </div>
                </div>
                <div v-else class="text-textgray text-sm">此凭证无证明信息</div>
              </div>
            </div>
          </div>

          <!-- 验证历史 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-textlight mb-4">验证历史</h3>
            <div v-if="verificationHistory.length === 0" class="text-center text-textgray py-6">
              暂无验证记录
            </div>
            <div v-else class="space-y-4">
              <div v-for="(record, index) in verificationHistory" :key="index" class="p-3 rounded-lg"
                :class="record.isValid ? 'bg-green-500/10' : 'bg-red-500/10'">
                <div class="flex items-start">
                  <div class="mt-1 mr-3">
                    <span class="w-8 h-8 flex items-center justify-center rounded-full"
                      :class="record.isValid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'">
                      <span :class="record.isValid ? 'i-carbon-checkmark' : 'i-carbon-close'"></span>
                    </span>
                  </div>
                  <div>
                    <div class="flex items-center">
                      <span class="text-textlight font-medium">
                        {{ record.isValid ? '验证通过' : '验证失败' }}
                      </span>
                      <span class="text-xs text-textgray ml-2">由 {{ formatDid(record.verifier) }} 验证</span>
                    </div>
                    <div class="text-xs text-textgray mt-1">{{ formatDate(record.timestamp) }}</div>
                    <div v-if="!record.isValid" class="mt-2 text-sm text-red-400">
                      失败原因: {{ record.reason || '未知错误' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 验证结果模态框 -->
    <div v-if="showVerifyModal" class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-md m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-textlight">验证结果</h3>
        </div>
        <div class="modal-body p-6">
          <div v-if="verifyResult?.isValid" class="text-center mb-6">
            <div class="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span class="i-carbon-checkmark text-green-500 text-4xl"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-2">验证通过</h3>
            <p class="text-textgray">此凭证有效且未被篡改</p>
          </div>
          <div v-else class="text-center mb-6">
            <div class="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <span class="i-carbon-close text-red-500 text-4xl"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-2">验证失败</h3>
            <p class="text-textgray">{{ verifyResult?.errors?.[0] || '凭证无效或已被篡改' }}</p>
          </div>

          <div class="bg-darkbg/30 rounded-lg p-4 mb-6">
            <h4 class="text-sm font-medium text-textlight mb-3">详细检查结果</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-textgray">格式检查</span>
                <span :class="verifyResult?.checks.format ? 'text-green-500' : 'text-red-500'">
                  {{ verifyResult?.checks.format ? '通过' : '失败' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-textgray">签名检查</span>
                <span :class="verifyResult?.checks.signature ? 'text-green-500' : 'text-red-500'">
                  {{ verifyResult?.checks.signature ? '通过' : '失败' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-textgray">过期检查</span>
                <span :class="!verifyResult?.checks.expired ? 'text-green-500' : 'text-red-500'">
                  {{ !verifyResult?.checks.expired ? '通过' : '已过期' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-textgray">吊销检查</span>
                <span :class="!verifyResult?.checks.revoked ? 'text-green-500' : 'text-red-500'">
                  {{ !verifyResult?.checks.revoked ? '通过' : '已撤销' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <button class="btn-primary" @click="closeVerifyModal">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 撤销确认框 -->
    <div v-if="showRevokeConfirm"
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-md m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-textlight">确认撤销凭证</h3>
        </div>
        <div class="modal-body p-6">
          <p class="text-textgray mb-4">您确定要撤销此凭证吗？此操作不可撤销，撤销后凭证将不再有效。</p>
          <div class="mb-4">
            <label class="block text-textlight mb-2">撤销原因 (可选)</label>
            <input v-model="revokeReason" type="text" class="input w-full" placeholder="请输入撤销原因">
          </div>
          <div class="flex justify-end space-x-4">
            <button class="btn-secondary" @click="closeRevokeModal">取消</button>
            <button class="btn-primary bg-red-500 hover:bg-red-600" @click="revokeCredential" :disabled="isRevoking">
              <span v-if="isRevoking" class="i-carbon-circle-dash animate-spin mr-2"></span>
              撤销
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享模态框 -->
    <div v-if="showShareModal" class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-md m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-textlight">分享凭证</h3>
        </div>
        <div class="modal-body p-6">
          <div class="mb-6">
            <h4 class="text-textlight mb-2">分享链接</h4>
            <div class="relative">
              <input type="text" :value="shareLink" readonly class="input w-full pr-10">
              <button @click="copyShareLink" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span class="i-carbon-copy text-textgray hover:text-neon"></span>
              </button>
            </div>
            <p class="text-xs text-textgray mt-1">链接有效期：24小时</p>
          </div>

          <div class="mb-6">
            <h4 class="text-textlight mb-2">二维码</h4>
            <div class="bg-white p-4 rounded-lg flex justify-center">
              <div class="qr-code-placeholder w-48 h-48 bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500">QR码加载中...</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button class="btn-secondary" @click="closeShareModal">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useCredentialStore, type VerifyResult } from '../../stores/credential';
  import { logger } from '../../utils/logger';

  // 初始化路由和存储
  const route = useRoute();
  const router = useRouter();
  const credentialStore = useCredentialStore();

  // 页面状态
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const credential = ref(null);

  // 模态框状态
  const showVerifyModal = ref(false);
  const verifyResult = ref<VerifyResult | null>(null);
  const showRevokeConfirm = ref(false);
  const revokeReason = ref('');
  const isRevoking = ref(false);
  const showShareModal = ref(false);
  const shareLink = ref('https://atomnexus.example/share/cred-123456');

  // 模拟数据
  const verificationHistory = ref([
    {
      isValid: true,
      verifier: 'did:ethr:0x123...789',
      timestamp: '2023-06-10T14:23:45Z',
    },
    {
      isValid: false,
      verifier: 'did:web:validator.example',
      timestamp: '2023-06-08T09:12:30Z',
      reason: '签名验证失败'
    },
    {
      isValid: true,
      verifier: 'did:key:z6Mk...7b9',
      timestamp: '2023-06-05T11:45:12Z',
    }
  ]);

  // 获取凭证详情
  const fetchCredential = async () => {
    const id = route.params.id as string;
    isLoading.value = true;
    error.value = null;

    logger.info('Page:CredentialDetail', '获取凭证详情', { id });

    try {
      await credentialStore.fetchCredentialById(id);
      credential.value = credentialStore.currentCredential;
      logger.info('Page:CredentialDetail', '凭证详情获取成功', { id });
    } catch (err: any) {
      error.value = err.message || '获取凭证详情失败';
      logger.error('Page:CredentialDetail', '凭证详情获取失败', { id, error: err.message });
    } finally {
      isLoading.value = false;
    }
  };

  // 验证凭证
  const verifyCredential = async () => {
    if (!credential.value) return;

    logger.info('Page:CredentialDetail', '开始验证凭证', { id: credential.value.id });

    try {
      const result = await credentialStore.verifyCredential(credential.value.id);
      verifyResult.value = result;
      showVerifyModal.value = true;
      logger.info('Page:CredentialDetail', '凭证验证完成', { isValid: result.isValid });
    } catch (err: any) {
      logger.error('Page:CredentialDetail', '凭证验证失败', { error: err.message });
      alert(`验证失败：${err.message}`);
    }
  };

  // 关闭验证结果模态框
  const closeVerifyModal = () => {
    showVerifyModal.value = false;
  };

  // 撤销凭证
  const openRevokeModal = () => {
    showRevokeConfirm.value = true;
    revokeReason.value = '';
    logger.info('Page:CredentialDetail', '打开撤销确认框');
  };

  // 关闭撤销模态框
  const closeRevokeModal = () => {
    showRevokeConfirm.value = false;
  };

  // 执行撤销
  const revokeCredential = async () => {
    if (!credential.value) return;

    isRevoking.value = true;
    logger.info('Page:CredentialDetail', '开始撤销凭证', { id: credential.value.id, reason: revokeReason.value });

    try {
      await credentialStore.revokeCredential(credential.value.id, revokeReason.value);
      credential.value.status = 'revoked';
      closeRevokeModal();
      logger.info('Page:CredentialDetail', '凭证撤销成功');
    } catch (err: any) {
      logger.error('Page:CredentialDetail', '凭证撤销失败', { error: err.message });
      alert(`撤销失败：${err.message}`);
    } finally {
      isRevoking.value = false;
    }
  };

  // 分享凭证
  const shareCredential = () => {
    showShareModal.value = true;
    logger.info('Page:CredentialDetail', '打开分享模态框');
  };

  // 关闭分享模态框
  const closeShareModal = () => {
    showShareModal.value = false;
  };

  // 复制分享链接
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink.value)
      .then(() => {
        alert('链接已复制到剪贴板');
        logger.info('Page:CredentialDetail', '分享链接已复制');
      })
      .catch(err => {
        logger.error('Page:CredentialDetail', '复制分享链接失败', { error: err });
      });
  };

  // 导出凭证
  const exportCredential = () => {
    if (!credential.value) return;

    logger.info('Page:CredentialDetail', '导出凭证', { id: credential.value.id });
    alert('凭证导出功能开发中...');

    // 实际实现应该调用API获取导出数据，然后创建下载
    // const blob = new Blob([JSON.stringify(credential.value)], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `credential-${credential.value.id}.json`;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };

  // 获取凭证类型名称
  const getCredentialTypeName = (cred: any): string => {
    // 取最后一个类型作为主类型（跳过 VerifiableCredential）
    const types = cred.type.filter((t: string) => t !== 'VerifiableCredential');
    if (types.length === 0) return 'VerifiableCredential';

    // 从完整类型URI中提取类型名
    const lastType = types[types.length - 1];
    return lastType.split('/').pop()?.split('#').pop() || lastType;
  };

  // 格式化字段名称
  const formatFieldName = (key: string): string => {
    // 将驼峰命名转换为空格分隔的词组并首字母大写
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化DID
  const formatDid = (did: string): string => {
    if (!did) return '';
    if (did.length <= 25) return did;
    return `${did.substring(0, 10)}...${did.substring(did.length - 10)}`;
  };

  // 截断签名
  const truncateSignature = (signature: string): string => {
    if (!signature) return '';
    if (signature.length <= 40) return signature;
    return `${signature.substring(0, 20)}...${signature.substring(signature.length - 20)}`;
  };

  // 页面加载时获取凭证详情
  onMounted(() => {
    logger.info('Page:CredentialDetail', '凭证详情页面已加载');
    fetchCredential();
  });
</script>

<style scoped>
  .modal-backdrop {
    backdrop-filter: blur(4px);
  }
</style>