<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-6">
      <router-link to="/permissions" class="text-neon hover:underline flex items-center">
        <div class="i-carbon-arrow-left mr-2"></div>
        返回权限管理
      </router-link>
    </div>

    <h1 class="text-3xl font-bold text-textlight mb-4">DID 权限管理</h1>
    <p class="text-textgray mb-8">正在查看 DID: {{ $route.params.did }}</p>

    <div class="card p-6 mb-8">
      <div class="flex items-center mb-6">
        <div class="i-carbon-user-profile text-3xl text-neon mr-3"></div>
        <div>
          <h2 class="text-xl font-semibold text-textlight">身份信息</h2>
          <p class="text-textgray text-sm mt-1">此身份的基本信息与授权情况</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="text-textgray text-sm mb-1">DID 标识符</div>
          <div class="text-xs font-mono bg-darkbg p-3 rounded overflow-hidden text-textgray break-all">
            {{ $route.params.did }}
          </div>
        </div>

        <div>
          <div class="text-textgray text-sm mb-1">权限状态</div>
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
            <span class="text-textlight">已授权</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6 mb-8">
      <h2 class="text-xl font-semibold text-textlight mb-6">已授权凭证</h2>

      <div class="space-y-4">
        <div class="bg-primary/40 p-4 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-textlight font-medium mb-1">学历凭证</div>
              <div class="text-textgray text-sm">授权方式：所有字段</div>
              <div class="text-textgray text-sm">到期时间：2023-12-31</div>
            </div>
            <div class="flex items-center">
              <button class="text-textgray hover:text-textlight text-sm mr-4">编辑</button>
              <button class="text-red-400 hover:text-red-300 text-sm">撤销</button>
            </div>
          </div>
        </div>

        <div class="bg-primary/40 p-4 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-textlight font-medium mb-1">实习证明</div>
              <div class="text-textgray text-sm">授权方式：仅公开字段</div>
              <div class="text-textgray text-sm">到期时间：2023-09-30</div>
            </div>
            <div class="flex items-center">
              <button class="text-textgray hover:text-textlight text-sm mr-4">编辑</button>
              <button class="text-red-400 hover:text-red-300 text-sm">撤销</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-textlight mb-6">访问历史</h2>

      <div class="space-y-4">
        <div class="border-l-2 border-neon pl-4 pb-6 relative">
          <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-neon"></div>
          <div class="text-textlight font-medium">查看了学历凭证</div>
          <div class="text-textgray text-sm">2023-07-22 14:30</div>
        </div>

        <div class="border-l-2 border-metal/30 pl-4 pb-6 relative">
          <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-metal"></div>
          <div class="text-textlight font-medium">验证了身份</div>
          <div class="text-textgray text-sm">2023-07-15 09:15</div>
        </div>

        <div class="border-l-2 border-metal/30 pl-4 relative">
          <div class="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-metal"></div>
          <div class="text-textlight font-medium">首次获得授权</div>
          <div class="text-textgray text-sm">2023-07-01 16:45</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  // 组件挂载时获取DID详情
  onMounted(() => {
    // 这里应该调用API获取指定DID的权限详情
    console.log('获取DID权限详情:', route.params.did);

    // 暂时使用假数据，实际项目中应该从API获取
  });
</script>