<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-6">
      <router-link to="/permissions" class="text-neon hover:underline flex items-center">
        <div class="i-carbon-arrow-left mr-2"></div>
        返回权限管理
      </router-link>
    </div>

    <h1 class="text-3xl font-bold text-textlight mb-8">权限设置</h1>

    <div class="card p-6 mb-8">
      <h2 class="text-xl font-semibold text-textlight mb-6">数据隐私设置</h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-primary/40 rounded-lg">
          <div>
            <div class="text-textlight font-medium">身份信息可见性</div>
            <div class="text-textgray text-sm">控制谁可以查看您的身份信息</div>
          </div>
          <select class="bg-darkbg text-textlight border border-metal/20 rounded-lg p-2">
            <option value="public">公开</option>
            <option value="contacts">仅联系人</option>
            <option value="private">私密</option>
          </select>
        </div>

        <div class="flex items-center justify-between p-4 bg-primary/40 rounded-lg">
          <div>
            <div class="text-textlight font-medium">凭证可见性</div>
            <div class="text-textgray text-sm">控制谁可以查看您的凭证列表</div>
          </div>
          <select class="bg-darkbg text-textlight border border-metal/20 rounded-lg p-2">
            <option value="public">公开</option>
            <option value="contacts">仅联系人</option>
            <option value="private">私密</option>
          </select>
        </div>

        <div class="flex items-center justify-between p-4 bg-primary/40 rounded-lg">
          <div>
            <div class="text-textlight font-medium">验证通知</div>
            <div class="text-textgray text-sm">当有人验证您的凭证时通知您</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer">
            <div
              class="w-11 h-6 bg-darkbg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-metal after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon">
            </div>
          </label>
        </div>
      </div>

      <div class="mt-6">
        <button class="btn-primary">保存设置</button>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-textlight mb-6">授权管理</h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-primary/40 rounded-lg">
          <div>
            <div class="text-textlight font-medium">某某大学</div>
            <div class="text-textgray text-sm">可查看：学历凭证</div>
            <div class="text-textgray text-sm">授权时间：2023-05-15</div>
          </div>
          <button class="text-red-400 hover:underline">撤销</button>
        </div>

        <div class="flex items-center justify-between p-4 bg-primary/40 rounded-lg">
          <div>
            <div class="text-textlight font-medium">某某企业</div>
            <div class="text-textgray text-sm">可查看：实习证明</div>
            <div class="text-textgray text-sm">授权时间：2023-06-20</div>
          </div>
          <button class="text-red-400 hover:underline">撤销</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 权限设置页面逻辑
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