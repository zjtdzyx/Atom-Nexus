<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-textlight mb-8">身份管理中心</h1>

    <!-- 身份创建与绑定卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <!-- 创建身份卡片 -->
      <div class="card p-6 hover:bg-primary/80 transition-all duration-300">
        <div class="flex items-center mb-6">
          <div class="i-carbon-user-profile text-3xl text-neon mr-3"></div>
          <h2 class="text-xl font-semibold text-textlight">创建新身份</h2>
        </div>
        <p class="text-textgray mb-6">创建一个新的去中心化数字身份(DID)，您将完全掌控这个身份的所有权与使用权。</p>
        <button class="btn-primary w-full">创建DID</button>
      </div>

      <!-- 绑定身份卡片 -->
      <div class="card p-6 hover:bg-primary/80 transition-all duration-300">
        <div class="flex items-center mb-6">
          <div class="i-carbon-connect text-3xl text-neon mr-3"></div>
          <h2 class="text-xl font-semibold text-textlight">绑定已有身份</h2>
        </div>
        <p class="text-textgray mb-6">如果您已经拥有DID，可以在此绑定到您的Atom Nexus账户。</p>
        <button class="btn-primary w-full" @click="showBindForm = true">绑定已有DID</button>
      </div>
    </div>

    <!-- 身份列表导航 -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-textlight">我的身份列表</h2>
      <router-link to="/identities" class="text-neon hover:underline flex items-center">
        查看全部
        <div class="i-carbon-arrow-right ml-1"></div>
      </router-link>
    </div>

    <!-- 身份列表预览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="card p-5 hover:shadow-neon/20 hover:shadow-lg transition-all duration-300">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center">
            <div class="i-carbon-user-profile text-2xl text-neon mr-2"></div>
            <h3 class="text-lg font-medium text-textlight">主要身份</h3>
          </div>
          <div class="px-2 py-1 bg-neon/20 text-neon text-xs rounded-full">活跃</div>
        </div>
        <div class="text-xs font-mono bg-darkbg p-2 rounded mb-4 overflow-hidden text-textgray">
          did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-textgray">创建于 2023-05-15</span>
          <router-link :to="`/identities/${i}`" class="text-neon hover:underline">管理</router-link>
        </div>
      </div>
    </div>

    <!-- 绑定DID表单对话框 -->
    <div v-if="showBindForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-primary p-6 rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-textlight">绑定已有DID</h3>
          <button @click="showBindForm = false" class="text-metal hover:text-textlight">
            <div class="i-carbon-close text-xl"></div>
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-textgray mb-2">DID 标识符</label>
          <input v-model="bindForm.did" placeholder="输入以did:开头的身份标识符"
            class="input w-full bg-darkbg text-textlight border-metal/20" />
          <p class="text-xs text-textgray mt-1">例如: did:key:z6MkvTPicF..., did:ethr:0x...</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showBindForm = false" class="btn-secondary">取消</button>
          <button @click="bindIdentity" class="btn-primary">绑定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  // 是否显示绑定表单
  const showBindForm = ref(false);

  // 绑定表单数据
  const bindForm = ref({
    did: ''
  });

  // 绑定身份
  const bindIdentity = () => {
    if (!bindForm.value.did.startsWith('did:')) {
      alert('DID必须以did:开头');
      return;
    }

    // TODO: 实际调用API进行绑定
    console.log('绑定DID:', bindForm.value.did);
    showBindForm.value = false;
  };
</script>