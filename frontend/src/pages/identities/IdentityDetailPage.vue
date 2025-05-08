<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-6">
      <router-link to="/identities" class="text-neon hover:underline flex items-center">
        <div class="i-carbon-arrow-left mr-2"></div>
        返回列表
      </router-link>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
    </div>

    <!-- 错误消息 -->
    <div v-else-if="error" class="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
      <div class="flex items-center">
        <div class="i-carbon-warning-filled text-xl mr-2"></div>
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- 身份详情 -->
    <div v-else-if="identity" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧信息卡片 -->
      <div class="lg:col-span-1">
        <div class="card p-6">
          <div class="flex items-center mb-6">
            <div class="i-carbon-user-profile text-3xl text-neon mr-3"></div>
            <h2 class="text-xl font-semibold text-textlight">{{ identity.type || '主要身份' }}</h2>
          </div>

          <div class="mb-6">
            <div class="text-textgray text-sm mb-1">身份标识符</div>
            <div class="text-xs font-mono bg-darkbg p-3 rounded overflow-hidden text-textgray break-all">
              {{ identity.did }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-textgray text-sm mb-1">创建时间</div>
              <div class="text-textlight">{{ formatDate(identity.createdAt) }}</div>
            </div>
            <div>
              <div class="text-textgray text-sm mb-1">状态</div>
              <div :class="{
                'text-neon': identity.status === 'active',
                'text-orange-400': identity.status === 'inactive',
                'text-red-400': identity.status === 'revoked'
              }" class="flex items-center">
                <div :class="{
                  'i-carbon-checkmark-filled': identity.status === 'active',
                  'i-carbon-warning': identity.status === 'inactive',
                  'i-carbon-close-filled': identity.status === 'revoked'
                }" class="mr-1"></div>
                {{
                  identity.status === 'active' ? '活跃' :
                    identity.status === 'inactive' ? '未激活' : '已撤销'
                }}
              </div>
            </div>
          </div>

          <div v-if="identity.walletAddress" class="mb-6">
            <div class="text-textgray text-sm mb-1">关联钱包</div>
            <div class="text-xs font-mono bg-darkbg p-2 rounded overflow-hidden text-textgray">
              {{ identity.walletAddress }}
            </div>
          </div>

          <div v-if="identity.email" class="mb-6">
            <div class="text-textgray text-sm mb-1">关联邮箱</div>
            <div class="text-textlight">{{ identity.email }}</div>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-3">
            <button v-if="identity.status === 'active'" class="btn-primary w-full" @click="showVerifyModal = true">
              验证身份
            </button>
            <button v-if="identity.status !== 'revoked'" class="btn-secondary w-full">
              导出身份
            </button>
            <button v-if="identity.status !== 'revoked'"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full" @click="confirmRevoke">
              撤销身份
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="lg:col-span-2">
        <!-- 关联的证书和凭证 -->
        <div class="card p-6 mb-8">
          <h3 class="text-xl font-semibold text-textlight mb-6">关联的凭证</h3>

          <div v-if="credentials.length === 0" class="py-8 text-center">
            <div class="i-carbon-certificate text-5xl mx-auto mb-4 text-metal"></div>
            <h4 class="text-lg font-medium text-textlight mb-2">暂无凭证</h4>
            <p class="text-textgray mb-4">该身份下还没有关联任何凭证</p>
            <router-link to="/credentials" class="btn-primary inline-block">
              获取凭证
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <!-- 凭证项，实际项目中应循环渲染 -->
            <div class="bg-primary/40 p-4 rounded-lg flex justify-between items-center">
              <div>
                <div class="text-textlight font-medium">大学学历凭证</div>
                <div class="text-textgray text-sm">发布者: 某某大学</div>
              </div>
              <router-link to="/credential/1" class="text-neon hover:underline">
                查看
              </router-link>
            </div>
            <div class="bg-primary/40 p-4 rounded-lg flex justify-between items-center">
              <div>
                <div class="text-textlight font-medium">实习证明</div>
                <div class="text-textgray text-sm">发布者: 某某科技公司</div>
              </div>
              <router-link to="/credential/2" class="text-neon hover:underline">
                查看
              </router-link>
            </div>
          </div>
        </div>

        <!-- 身份活动记录 -->
        <div class="card p-6">
          <h3 class="text-xl font-semibold text-textlight mb-6">活动记录</h3>

          <div class="space-y-4">
            <div class="border-l-2 border-neon pl-4 pb-6 relative">
              <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-neon"></div>
              <div class="text-textlight font-medium">身份创建</div>
              <div class="text-textgray text-sm">{{ formatDate(identity.createdAt) }}</div>
            </div>
            <div class="border-l-2 border-metal/30 pl-4 pb-6 relative">
              <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-metal"></div>
              <div class="text-textlight font-medium">绑定邮箱</div>
              <div class="text-textgray text-sm">2023-06-01</div>
            </div>
            <div class="border-l-2 border-metal/30 pl-4 relative">
              <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-metal"></div>
              <div class="text-textlight font-medium">获取学历凭证</div>
              <div class="text-textgray text-sm">2023-06-15</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 验证身份模态框 -->
    <div v-if="showVerifyModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-primary p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-textlight">验证身份</h3>
          <button @click="showVerifyModal = false" class="text-metal hover:text-textlight">
            <div class="i-carbon-close text-xl"></div>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-textgray mb-4">您可以通过生成验证码或扫描二维码来验证您的身份。</p>

          <div class="bg-darkbg p-4 rounded-lg flex flex-col items-center mb-4">
            <div class="mb-4 w-48 h-48 bg-white p-2 rounded-lg flex items-center justify-center">
              <!-- 示例二维码，实际应该动态生成 -->
              <div class="i-carbon-qr-code text-8xl"></div>
            </div>
            <p class="text-center text-textgray text-sm">扫描以上二维码进行身份验证</p>
          </div>

          <div class="text-center">
            <button class="text-neon hover:underline">下载二维码</button>
          </div>
        </div>

        <div class="flex justify-end">
          <button @click="showVerifyModal = false" class="btn-secondary">关闭</button>
        </div>
      </div>
    </div>

    <!-- 撤销确认框 -->
    <div v-if="showRevokeConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-primary p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-textlight">确认撤销身份</h3>
          <button @click="showRevokeConfirm = false" class="text-metal hover:text-textlight">
            <div class="i-carbon-close text-xl"></div>
          </button>
        </div>

        <p class="text-textgray mb-6">您确定要撤销此身份吗？撤销后，该身份将无法再使用，所有关联的凭证也将失效。</p>

        <div class="text-xs font-mono bg-darkbg p-2 rounded mb-6 overflow-hidden text-textgray">
          {{ identity?.did || '无DID信息' }}
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showRevokeConfirm = false" class="btn-secondary">取消</button>
          <button @click="revokeIdentity" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            :class="{ 'opacity-50 cursor-not-allowed': revokeLoading }" :disabled="revokeLoading">
            <span v-if="revokeLoading" class="i-carbon-circle-dash animate-spin mr-2"></span>
            确认撤销
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useIdentityStore, type Identity } from '../../stores/identityStore';

  const route = useRoute();
  const router = useRouter();
  const identityStore = useIdentityStore();

  // 状态
  const identity = ref<Identity | null>(null);
  const loading = ref(true);
  const error = ref('');
  const credentials = ref<any[]>([]); // 实际使用时应有适当的类型
  const showVerifyModal = ref(false);
  const showRevokeConfirm = ref(false);
  const revokeLoading = ref(false);

  // 获取身份详情
  const fetchIdentityDetail = async () => {
    const id = route.params.id as string;

    if (!id) {
      error.value = '无效的身份ID';
      loading.value = false;
      return;
    }

    loading.value = true;

    try {
      // 先获取身份列表，如果store中没有数据
      if (identityStore.identities.length === 0) {
        await identityStore.fetchIdentities();
      }

      // 从store中查找对应身份
      const foundIdentity = identityStore.identities.find(item => item.id === id);

      if (foundIdentity) {
        identity.value = foundIdentity;

        // 实际项目中应该调用API获取关联的凭证
        // 这里使用模拟数据
        credentials.value = [];
      } else {
        error.value = '未找到指定的身份';
      }
    } catch (err: any) {
      error.value = err.message || '获取身份详情失败';
    } finally {
      loading.value = false;
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 确认撤销
  const confirmRevoke = () => {
    showRevokeConfirm.value = true;
  };

  // 撤销身份
  const revokeIdentity = async () => {
    if (!identity.value) return;

    revokeLoading.value = true;

    try {
      // 实际项目中应调用API撤销身份
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用

      // 更新身份状态
      if (identity.value) {
        identity.value.status = 'revoked';
      }

      showRevokeConfirm.value = false;
    } catch (err: any) {
      error.value = err.message || '撤销身份失败';
    } finally {
      revokeLoading.value = false;
    }
  };

  // 组件挂载时获取身份详情
  onMounted(() => {
    fetchIdentityDetail();
  });
</script>

<style scoped>
  .identity-detail-page {
    min-height: calc(100vh - 64px);
    background-color: var(--color-darkbg);
  }
</style>