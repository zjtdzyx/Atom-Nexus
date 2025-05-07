<template>
  <section class="features-section py-20 relative overflow-hidden">
    <div class="container">
      <!-- 标题 -->
      <div class="text-center mb-16">
        <h2 class="subtitle mb-4">为什么选择 Atom Nexus?</h2>
        <p class="text max-w-2xl mx-auto">
          我们的去中心化身份平台赋予用户完全控制个人数据的能力，同时简化企业验证流程
        </p>
      </div>
      
      <!-- 特性卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index" 
          class="feature-card card backdrop-blur-md"
          :class="{ 'feature-card-highlight': feature.highlight }"
        >
          <div class="feature-icon mb-4 p-3 rounded-full inline-block" :class="feature.iconBg">
            <div :class="feature.icon + ' text-3xl'"></div>
          </div>
          <h3 class="text-xl font-semibold mb-3 text-textlight">{{ feature.title }}</h3>
          <p class="text-textgray">{{ feature.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 背景效果 -->
    <div class="absolute -top-24 -right-24 w-64 h-64 opacity-10 z-0">
      <div class="w-full h-full bg-neon rounded-full filter blur-3xl"></div>
    </div>
    <div class="absolute -bottom-32 -left-32 w-72 h-72 opacity-10 z-0">
      <div class="w-full h-full bg-violet rounded-full filter blur-3xl"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 特性数据
const features = [
  {
    title: '自主身份控制',
    description: '使用去中心化身份 (DID) 技术，让用户完全掌控个人数字身份，保护隐私',
    icon: 'i-carbon-user-profile',
    iconBg: 'bg-neon/20',
    highlight: true
  },
  {
    title: '可验证凭证',
    description: '数字化的凭证系统，安全地证明身份和资格，无需披露敏感信息',
    icon: 'i-carbon-certificate',
    iconBg: 'bg-violet/20',
    highlight: false
  },
  {
    title: '去中心化存储',
    description: '安全、加密的数据存储方案，用户自主掌控数据访问权限',
    icon: 'i-carbon-data-storage',
    iconBg: 'bg-neon/20',
    highlight: false
  },
  {
    title: '开发者工具',
    description: '全面的SDK和API支持，帮助开发者集成去中心化身份验证系统',
    icon: 'i-carbon-code',
    iconBg: 'bg-violet/20',
    highlight: false
  },
  {
    title: '隐私保护',
    description: '零知识证明技术保护用户隐私，只证明必要信息，不泄露原始数据',
    icon: 'i-carbon-security',
    iconBg: 'bg-neon/20',
    highlight: false
  },
  {
    title: '跨平台兼容',
    description: '与各种应用和区块链系统兼容，实现身份和数据的无缝互操作',
    icon: 'i-carbon-connect',
    iconBg: 'bg-violet/20',
    highlight: true
  }
];
</script>

<style scoped>
.features-section {
  background-color: var(--color-darkbg);
}

.feature-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-neon);
  box-shadow: 0 10px 20px rgba(0, 224, 209, 0.1);
}

.feature-card-highlight {
  border-color: var(--color-neon);
  box-shadow: 0 5px 15px rgba(0, 224, 209, 0.15);
}

.feature-icon {
  color: var(--color-textlight);
}
</style> 