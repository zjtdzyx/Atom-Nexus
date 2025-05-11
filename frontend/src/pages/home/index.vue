<template>
  <div class="home-page">
    <!-- 主横幅 -->
    <div class="hero-banner py-20 bg-gradient-to-b from-primary/80 to-primary relative overflow-hidden">
      <!-- 背景装饰元素 -->
      <div class="absolute top-1/4 right-0 w-1/3 h-1/3 bg-neon/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-10 w-1/4 h-1/4 bg-violet/5 rounded-full blur-3xl"></div>

      <!-- 网络连接线 -->
      <div class="network-line absolute top-1/3 right-0 w-1/3 opacity-20" style="transform: rotate(-15deg);"></div>
      <div class="network-line absolute bottom-1/3 left-0 w-1/4 opacity-20" style="transform: rotate(10deg);"></div>

      <div class="container">
        <div class="flex flex-col lg:flex-row items-center">
          <!-- 左侧文字内容 -->
          <div class="w-full lg:w-3/5 text-left mb-10 lg:mb-0">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">
              <div class="text-neon">Your Identity.</div>
              <div class="text-violet">Your Network.</div>
              <div class="text-textlight">Decentralized.</div>
            </h1>
            <p class="text-xl text-textgray max-w-2xl mb-10">
              每个个体是一个独立原子，通过Nexus（枢纽）连接整个去中心化世界。
              <br>身份自持，网络自由。
            </p>
            <div class="flex space-x-6">
              <router-link to="/identity" class="btn-primary py-3 px-8">
                开始使用
              </router-link>
              <router-link to="/about" class="btn-outline py-3 px-8">
                了解更多
              </router-link>
            </div>
          </div>

          <!-- 右侧原子图形 -->
          <div class="w-full lg:w-2/5 relative">
            <div class="atom-illustration relative h-80 w-80 mx-auto">
              <!-- 中心原子 -->
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-neon opacity-70 blur-sm">
              </div>
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-neon opacity-80">
              </div>

              <!-- 轨道 -->
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-violet/30 animate-spin-slow">
              </div>
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-neon/40 animate-spin-slow-reverse">
              </div>

              <!-- 粒子 -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-neon"></div>
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-neon"></div>
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-neon"></div>
                <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-neon"></div>
                <div class="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-violet"></div>
                <div class="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-violet"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心理念部分 -->
    <div class="core-concepts-section py-16 bg-primary/60 text-center">
      <div class="container">
        <h2 class="text-4xl font-bold text-textlight mb-16">核心理念</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="feature-card card p-6 flex flex-col items-center text-center">
            <div class="feature-icon w-16 h-16 rounded-full bg-neon/20 flex items-center justify-center mb-6">
              <span class="i-carbon-user-profile text-3xl text-neon"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-3">身份管理</h3>
            <p class="text-textgray">创建和管理您的去中心化数字身份，保持完全的自主权</p>
          </div>

          <div class="feature-card card p-6 flex flex-col items-center text-center">
            <div class="feature-icon w-16 h-16 rounded-full bg-violet/20 flex items-center justify-center mb-6">
              <span class="i-carbon-certificate text-3xl text-violet"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-3">凭证管理</h3>
            <p class="text-textgray">安全地存储、分享和验证您的可验证凭证，掌控数据隐私</p>
          </div>

          <div class="feature-card card p-6 flex flex-col items-center text-center">
            <div class="feature-icon w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
              <span class="i-carbon-security text-3xl text-blue-500"></span>
            </div>
            <h3 class="text-xl font-semibold text-textlight mb-3">权限控制</h3>
            <p class="text-textgray">精确控制谁可以访问您的数字身份和凭证，随时撤销权限</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术栈部分 -->
    <div class="tech-stack-section py-16">
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
        <h2 class="text-3xl font-bold text-textlight mb-4">掌握、连接、构建你的数字宇宙</h2>
        <p class="text-textgray max-w-2xl mx-auto mb-8">
          Atom Nexus不只是帮你「登录」，而是帮你掌握、连接、构建自己的数字宇宙。加入我们，体验真正的去中心化身份网络。
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
  .hero-banner {
    min-height: 80vh;
    display: flex;
    align-items: center;
  }

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

  .atom-illustration {
    position: relative;
  }

  @keyframes spin-slow {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes spin-slow-reverse {
    from {
      transform: translate(-50%, -50%) rotate(360deg);
    }

    to {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }

  .animate-spin-slow-reverse {
    animation: spin-slow-reverse 15s linear infinite;
  }
</style>