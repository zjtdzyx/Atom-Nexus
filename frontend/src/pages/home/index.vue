<template>
  <div class="home-page">
    <!-- 使用HeroSection组件 -->
    <HeroSection />

    <!-- 使用FeaturesSection组件 -->
    <FeaturesSection />

    <!-- 使用ModulesSection组件 -->
    <ModulesSection />

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

    <!-- 使用FooterSection组件 -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { logger } from '../../utils/logger';
  import HeroSection from '../../components/home/HeroSection.vue';
  import FeaturesSection from '../../components/home/FeaturesSection.vue';
  import ModulesSection from '../../components/home/ModulesSection.vue';
  import FooterSection from '../../components/home/FooterSection.vue';

  // 页面加载日志
  onMounted(() => {
    logger.info('Page:Home', '首页已加载');
  });
</script>

<style scoped>

  /* 保留必要的样式，移除组件已实现的样式 */
  .cta-section {
    transition: all 0.3s ease;
  }
</style>