<template>
  <div class="container mx-auto py-10 px-4">
    <div v-if="identityStore.loading" class="flex justify-center py-10">
      <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
    </div>

    <div v-else-if="identityStore.error" class="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
      <div class="flex items-center">
        <div class="i-carbon-warning-filled text-xl mr-2"></div>
        <p>{{ identityStore.error }}</p>
      </div>
    </div>

    <div v-else-if="!identity" class="bg-primary/40 p-6 rounded-lg">
      <h3 class="text-xl font-medium text-textlight mb-2">未找到身份</h3>
      <p class="text-textgray mb-4">无法找到ID为 {{ id }} 的身份</p>
      <router-link to="/identity" class="btn-primary inline-flex items-center">
        <div class="i-carbon-arrow-left mr-2"></div>
        返回身份列表
      </router-link>
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <router-link to="/identity" class="text-metal hover:text-textlight mr-4">
            <div class="i-carbon-arrow-left text-2xl"></div>
          </router-link>
          <h1 class="text-3xl font-bold text-textlight">{{ identity.name }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <button @click="showEditModal = true" class="btn-secondary flex items-center">
            <div class="i-carbon-edit mr-2"></div>
            编辑
          </button>

          <button @click="exportIdentity" class="btn-secondary flex items-center">
            <div class="i-carbon-export mr-2"></div>
            导出
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 身份基本信息卡片 -->
        <div class="card p-5">
          <h3 class="text-lg font-medium text-textlight mb-4 flex items-center">
            <div class="i-carbon-user-profile text-xl mr-2 text-neon"></div>
            基本信息
          </h3>

          <div class="mb-4">
            <div class="text-sm text-textgray mb-1">DID 标识符</div>
            <div class="text-sm font-mono bg-darkbg p-2 rounded text-textlight flex items-center justify-between group">
              <span class="truncate">{{ identity.did }}</span>
              <button @click="copyToClipboard(identity.did)"
                class="opacity-0 group-hover:opacity-100 text-metal hover:text-textlight transition-opacity">
                <div class="i-carbon-copy"></div>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-textgray mb-1">状态</div>
              <div :class="{
                'bg-neon/20 text-neon': identity.status === 'active',
                'bg-orange-500/20 text-orange-400': identity.status === 'inactive',
                'bg-red-500/20 text-red-400': identity.status === 'revoked'
              }" class="inline-block px-2 py-1 text-xs rounded-full">
                {{
                  identity.status === 'active' ? '活跃' :
                    identity.status === 'inactive' ? '未激活' : '已撤销'
                }}
              </div>
            </div>

            <div>
              <div class="text-sm text-textgray mb-1">类型</div>
              <div class="text-textlight">{{ identity.type || '主要身份' }}</div>
            </div>

            <div>
              <div class="text-sm text-textgray mb-1">创建时间</div>
              <div class="text-textlight">{{ formatDate(identity.createdAt) }}</div>
            </div>

            <div>
              <div class="text-sm text-textgray mb-1">更新时间</div>
              <div class="text-textlight">{{ formatDate(identity.updatedAt) }}</div>
            </div>
          </div>
        </div>

        <!-- 功能卡片 -->
        <div class="card p-5 lg:col-span-2">
          <h3 class="text-lg font-medium text-textlight mb-4 flex items-center">
            <div class="i-carbon-tool-kit text-xl mr-2 text-neon"></div>
            身份功能
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <router-link to="/credential"
              class="p-4 border border-metal/20 rounded-lg hover:bg-primary/40 transition-colors">
              <div class="i-carbon-certificate text-2xl text-neon mb-2"></div>
              <h4 class="text-textlight font-medium mb-1">凭证管理</h4>
              <p class="text-xs text-textgray">管理与此身份关联的凭证</p>
            </router-link>

            <router-link :to="`/identity/login-history?id=${identity.id}`"
              class="p-4 border border-metal/20 rounded-lg hover:bg-primary/40 transition-colors">
              <div class="i-carbon-login text-2xl text-neon mb-2"></div>
              <h4 class="text-textlight font-medium mb-1">登录历史</h4>
              <p class="text-xs text-textgray">查看身份的登录记录</p>
            </router-link>

            <router-link :to="`/identity/profile?id=${identity.id}`"
              class="p-4 border border-metal/20 rounded-lg hover:bg-primary/40 transition-colors">
              <div class="i-carbon-user-avatar text-2xl text-neon mb-2"></div>
              <h4 class="text-textlight font-medium mb-1">资料管理</h4>
              <p class="text-xs text-textgray">编辑身份的公开资料</p>
            </router-link>
          </div>
        </div>
      </div>
    </template>

    <!-- 编辑身份弹窗 -->
    <div v-if="showEditModal && identity" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-primary p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-textlight">编辑身份</h3>
          <button @click="showEditModal = false" class="text-metal hover:text-textlight">
            <div class="i-carbon-close text-xl"></div>
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-textgray mb-2">名称</label>
          <input v-model="editForm.name" placeholder="输入身份名称"
            class="input w-full bg-darkbg text-textlight border-metal/20" />
        </div>

        <div class="mb-4">
          <label class="block text-textgray mb-2">类型</label>
          <input v-model="editForm.type" placeholder="例如：个人、组织、设备等"
            class="input w-full bg-darkbg text-textlight border-metal/20" />
        </div>

        <div class="mb-6">
          <label class="block text-textgray mb-2">状态</label>
          <select v-model="editForm.status" class="input w-full bg-darkbg text-textlight border-metal/20">
            <option value="active">活跃</option>
            <option value="inactive">未激活</option>
            <option value="revoked">已撤销</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showEditModal = false" class="btn-secondary">取消</button>
          <button @click="updateIdentity" class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': updateLoading }" :disabled="updateLoading">
            <span v-if="updateLoading" class="i-carbon-circle-dash animate-spin mr-2"></span>
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useIdentityStore } from '@/stores/identity';
  import type { Identity } from '@/types/identity';

  const route = useRoute();
  const router = useRouter();
  const identityStore = useIdentityStore();

  const id = computed(() => route.params.id as string);
  const showEditModal = ref(false);
  const updateLoading = ref(false);
  const editForm = ref({
    name: '',
    type: '',
    status: ''
  });

  // 当前身份
  const identity = computed(() => identityStore.getIdentityById(id.value));

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 显示一个toast提示，这里简化处理
    alert('已复制到剪贴板');
  };

  // 导出身份
  const exportIdentity = () => {
    if (!identity.value) return;

    const data = JSON.stringify(identity.value, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `identity-${identity.value.id}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  // 更新身份
  const updateIdentity = async () => {
    if (!identity.value) return;
    updateLoading.value = true;

    try {
      await identityStore.updateIdentity(identity.value.id, editForm.value);
      showEditModal.value = false;
    } catch (error) {
      // 错误已在store中处理
    } finally {
      updateLoading.value = false;
    }
  };

  // 初始化
  onMounted(async () => {
    if (!identity.value) {
      await identityStore.fetchIdentityById(id.value);
    }

    if (identity.value) {
      editForm.value = {
        name: identity.value.name,
        type: identity.value.type || '',
        status: identity.value.status
      };
    }
  });
</script>