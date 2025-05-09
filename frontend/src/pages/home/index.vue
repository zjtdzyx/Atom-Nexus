<template>
  <div class="home-page">
    <!-- 主横幅 -->
    <div class="hero-banner py-20 bg-gradient-to-b from-primary/80 to-primary">
      <div class="container text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-textlight mb-6">
          Atom Nexus
        </h1>
        <p class="text-xl md:text-2xl text-textgray max-w-2xl mx-auto mb-10">
          身份自持，网络自由。管理您的数字身份与凭证
        </p>
        <div class="flex justify-center space-x-6">
          <router-link to="/identity" class="btn-primary py-3 px-8">
            <span class="i-carbon-earth-filled mr-2"></span>开始探索
          </router-link>
          <router-link to="/about" class="btn-secondary py-3 px-8">
            <span class="i-carbon-information mr-2"></span>了解更多
          </router-link>
        </div>
      </div>
    </div>

    <!-- 简介部分 -->
    <div class="features-section py-16 bg-primary/60">
      <div class="container">
        <h2 class="text-3xl font-bold text-textlight text-center mb-12">重新定义您的数字身份</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-card card p-6 flex flex-col items-center text-center">
            <div class="feature-icon w-16 h-16 rounded-full bg-neon/20 flex items-center justify-center mb-4">
              <span class="i-carbon-user-profile text-3xl text-neon"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-2">身份管理</h3>
            <p class="text-textgray mb-4">创建和管理您的去中心化数字身份，保持完全的自主权</p>
            <router-link to="/identity" class="mt-auto text-neon hover:underline">
              管理身份
            </router-link>
          </div>

          <div class="feature-card card p-6 flex flex-col items-center text-center">
            <div class="feature-icon w-16 h-16 rounded-full bg-violet/20 flex items-center justify-center mb-4">
              <span class="i-carbon-certificate text-3xl text-violet"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-2">凭证管理</h3>
            <p class="text-textgray mb-4">安全地存储、分享和验证您的可验证凭证，掌控数据隐私</p>
            <router-link to="/credential" class="mt-auto text-neon hover:underline">
              管理凭证
            </router-link>
          </div>

          <div class="feature-card card p-6 flex flex-col items-center text-center">
            <div class="feature-icon w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <span class="i-carbon-security text-3xl text-green-500"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-2">权限控制</h3>
            <p class="text-textgray mb-4">精确控制谁可以访问您的数字身份和凭证，随时撤销权限</p>
            <router-link to="/permission" class="mt-auto text-neon hover:underline">
              管理权限
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用场景部分 -->
    <div class="use-cases-section py-16">
      <div class="container">
        <h2 class="text-3xl font-bold text-textlight text-center mb-4">使用场景</h2>
        <p class="text-textgray text-center max-w-2xl mx-auto mb-12">Atom Nexus适用于各种需要安全、可靠身份验证的场景</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="use-case-card bg-primary/40 rounded-lg overflow-hidden">
            <div class="h-48 bg-gradient-to-r from-neon/30 to-violet/30 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="i-carbon-campus text-6xl text-textlight"></span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-textlight mb-2">教育场景</h3>
              <ul class="text-textgray space-y-2 mb-4">
                <li class="flex items-start">
                  <span class="i-carbon-checkmark text-neon mr-2 mt-1"></span>
                  <span>学历证书和能力凭证的数字化管理</span>
                </li>
                <li class="flex items-start">
                  <span class="i-carbon-checkmark text-neon mr-2 mt-1"></span>
                  <span>多平台学习成果的统一认证与展示</span>
                </li>
                <li class="flex items-start">
                  <span class="i-carbon-checkmark text-neon mr-2 mt-1"></span>
                  <span>跨校区、跨机构的身份验证与授权</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="use-case-card bg-primary/40 rounded-lg overflow-hidden">
            <div class="h-48 bg-gradient-to-r from-violet/30 to-neon/30 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="i-carbon-enterprise text-6xl text-textlight"></span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-textlight mb-2">企业场景</h3>
              <ul class="text-textgray space-y-2 mb-4">
                <li class="flex items-start">
                  <span class="i-carbon-checkmark text-neon mr-2 mt-1"></span>
                  <span>员工身份与权限的安全管理</span>
                </li>
                <li class="flex items-start">
                  <span class="i-carbon-checkmark text-neon mr-2 mt-1"></span>
                  <span>跨部门、跨组织的身份互认与协作</span>
                </li>
                <li class="flex items-start">
                  <span class="i-carbon-checkmark text-neon mr-2 mt-1"></span>
                  <span>供应链上下游的身份验证与授权</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈部分 -->
    <div class="tech-stack-section py-16 bg-primary/60">
      <div class="container">
        <h2 class="text-3xl font-bold text-textlight text-center mb-12">先进技术栈</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="tech-card p-4 bg-primary/40 rounded-lg flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
              <span class="i-carbon-earth text-3xl text-neon"></span>
            </div>
            <h3 class="text-lg font-medium text-textlight mb-1">W3C DID</h3>
            <p class="text-sm text-textgray">去中心化身份标识符</p>
          </div>

          <div class="tech-card p-4 bg-primary/40 rounded-lg flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
              <span class="i-carbon-certificate-check text-3xl text-violet"></span>
            </div>
            <h3 class="text-lg font-medium text-textlight mb-1">可验证凭证</h3>
            <p class="text-sm text-textgray">W3C标准凭证格式</p>
          </div>

          <div class="tech-card p-4 bg-primary/40 rounded-lg flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
              <span class="i-carbon-blockchain text-3xl text-green-500"></span>
            </div>
            <h3 class="text-lg font-medium text-textlight mb-1">区块链集成</h3>
            <p class="text-sm text-textgray">凭证锚定与不可篡改性</p>
          </div>

          <div class="tech-card p-4 bg-primary/40 rounded-lg flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
              <span class="i-carbon-privacy text-3xl text-yellow-500"></span>
            </div>
            <h3 class="text-lg font-medium text-textlight mb-1">隐私保护</h3>
            <p class="text-sm text-textgray">零知识证明与选择性披露</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 行动召唤部分 -->
    <div class="cta-section py-20 bg-gradient-to-t from-primary/80 to-primary text-center">
      <div class="container">
        <h2 class="text-3xl font-bold text-textlight mb-4">准备开始使用吗？</h2>
        <p class="text-textgray max-w-2xl mx-auto mb-8">
          加入Atom Nexus，开始掌控您的数字身份和数据，享受真正的数字自主权
        </p>
        <div class="flex justify-center">
          <router-link to="/identity/create" class="btn-primary py-3 px-8">
            创建您的第一个身份
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { logger } from '../../utils/logger';

  // 页面加载日志
  onMounted(() => {
    logger.info('Page:Home', '首页已加载');
  });
</script>

<style scoped>

  .feature-card,
  .use-case-card,
  .tech-card {
    transition: all 0.3s ease;
  }

  .feature-card:hover,
  .use-case-card:hover,
  .tech-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 224, 209, 0.1);
    background-color: rgba(30, 30, 47, 0.6);
  }
</style>