<template>
  <div class="permission-set-page">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-textlight">权限设置</h1>
      <p class="text-textgray mt-2">设置凭证的访问权限，支持不同类型的授权方式</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧边栏 - 说明 -->
      <div class="lg:col-span-1">
        <div class="bg-primary/50 p-5 rounded-xl border border-gray-800 shadow-lg h-full">
          <div class="rounded-full w-10 h-10 flex items-center justify-center bg-neon/20 mb-4">
            <div class="i-carbon-security text-neon text-xl"></div>
          </div>
          <h3 class="text-lg font-medium text-textlight mb-3">权限说明</h3>

          <div class="space-y-4 text-sm text-textgray">
            <p>通过设置权限，您可以控制其他DID对您凭证的访问权限。您可以选择以下权限类型:</p>

            <div class="flex items-start space-x-2 pt-2">
              <div class="i-carbon-time text-neon mt-0.5"></div>
              <div>
                <h4 class="text-textlight font-medium">一次性授权</h4>
                <p>仅允许查看凭证一次，适用于临时验证场景。</p>
              </div>
            </div>

            <div class="flex items-start space-x-2">
              <div class="i-carbon-calendar text-neon mt-0.5"></div>
              <div>
                <h4 class="text-textlight font-medium">长期授权</h4>
                <p>允许在指定时间段内无限次查看凭证，适用于长期合作关系。</p>
              </div>
            </div>

            <div class="flex items-start space-x-2">
              <div class="i-carbon-filter text-neon mt-0.5"></div>
              <div>
                <h4 class="text-textlight font-medium">部分授权</h4>
                <p>仅允许访问凭证中的部分声明内容，保护隐私的同时共享必要信息。</p>
              </div>
            </div>

            <div class="pt-2 border-t border-gray-800 mt-4">
              <p class="text-xs text-textgray/80">
                权限设置后，您随时可以通过权限管理页面查看和撤销已授予的权限。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧 - 表单 -->
      <div class="lg:col-span-2">
        <div class="bg-primary/50 p-5 rounded-xl border border-gray-800 shadow-lg">
          <h3 class="text-lg font-medium text-textlight mb-4">新建权限</h3>

          <PermissionForm :pre-selected-credential-id="preSelectedCredentialId" :pre-selected-did="preSelectedDid"
            @success="handleSuccess" @error="handleError" />
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage"
          class="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start">
          <div class="i-carbon-checkmark-filled text-green-400 text-xl mr-3 mt-0.5"></div>
          <div>
            <h4 class="text-green-300 font-medium">操作成功</h4>
            <p class="text-sm text-green-200/80">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import PermissionForm from '../../components/permission/PermissionForm.vue';

  const route = useRoute();
  const successMessage = ref('');

  // 从URL查询参数中获取预选凭证ID和DID
  const preSelectedCredentialId = ref('');
  const preSelectedDid = ref('');

  // 处理成功回调
  const handleSuccess = (data: any) => {
    successMessage.value = `成功授予权限给 ${data.targetDid || '目标DID'}`;

    // 5秒后清除成功消息
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  };

  // 处理错误回调
  const handleError = (message: string) => {
    console.error('权限设置失败', message);
  };

  onMounted(() => {
    // 从URL查询参数中读取预选值
    if (route.query.credentialId) {
      preSelectedCredentialId.value = route.query.credentialId as string;
    }
    if (route.query.targetDid) {
      preSelectedDid.value = route.query.targetDid as string;
    }
  });
</script>

<style scoped>
  .permission-set-page {
    animation: fade-in 0.4s ease-out;
  }

  @keyframes fade-in {
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