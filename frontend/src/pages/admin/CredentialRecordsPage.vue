<template>
  <div class="credential-records-page p-6">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-zinc-100 flex items-center">
        <span class="i-carbon-certificate text-violet-400 mr-2 text-3xl"></span>
        凭证记录
      </h1>
      <p class="text-zinc-400 mt-1">
        查看系统内所有已发布的凭证记录及其状态。
      </p>
    </div>

    <div class="page-content">
      <!-- 错误提示 -->
      <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 mb-6">
        <div class="flex items-center">
          <span class="i-carbon-warning-filled text-xl mr-2"></span>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- 凭证统计卡片 -->
      <div class="stats-section mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-violet-800/40 transition-all duration-300">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400 mr-3">
              <div class="i-carbon-checkmark text-xl"></div>
            </div>
            <div>
              <p class="text-zinc-400 text-sm">有效凭证</p>
              <h3 class="text-xl font-semibold text-zinc-200">
                {{ validCredentialsCount }}
              </h3>
            </div>
          </div>
        </div>

        <div
          class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-violet-800/40 transition-all duration-300">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400 mr-3">
              <div class="i-carbon-time text-xl"></div>
            </div>
            <div>
              <p class="text-zinc-400 text-sm">已过期</p>
              <h3 class="text-xl font-semibold text-zinc-200">
                {{ expiredCredentialsCount }}
              </h3>
            </div>
          </div>
        </div>

        <div
          class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-violet-800/40 transition-all duration-300">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400 mr-3">
              <div class="i-carbon-close text-xl"></div>
            </div>
            <div>
              <p class="text-zinc-400 text-sm">已撤销</p>
              <h3 class="text-xl font-semibold text-zinc-200">
                {{ revokedCredentialsCount }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-10">
        <div class="i-carbon-circle-dash animate-spin text-4xl text-violet-400"></div>
      </div>

      <!-- 凭证表格 -->
      <CredentialTable v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAdminStore } from '../../stores/admin';
  import CredentialTable from '../../components/admin/CredentialTable.vue';

  const store = useAdminStore();

  // 加载状态
  const loading = computed(() => store.isLoading);
  const error = computed(() => store.getError);

  // 统计数据
  const validCredentialsCount = computed(() => {
    return store.getCredentials.filter(credential => credential.status === 'valid').length;
  });

  const expiredCredentialsCount = computed(() => {
    return store.getCredentials.filter(credential => credential.status === 'expired').length;
  });

  const revokedCredentialsCount = computed(() => {
    return store.getCredentials.filter(credential => credential.status === 'revoked').length;
  });

  // 页面加载时获取凭证数据
  onMounted(() => {
    store.fetchCredentials();
  });
</script>

<style scoped>
  .credential-records-page {
    min-height: calc(100vh - 64px);
    animation: fadeIn 0.3s ease-out;
  }

  .stat-card {
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -2px rgba(124, 58, 237, 0.1);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>