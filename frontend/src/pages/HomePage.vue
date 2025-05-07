<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <HeroSection />
    
    <!-- 特性介绍 -->
    <FeaturesSection />
    
    <!-- 功能模块 -->
    <ModulesSection />
    
    <!-- CTA 区域 -->
    <section class="cta-section py-20 relative overflow-hidden">
      <div class="container">
        <div class="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h2 class="subtitle mb-6">准备好开始您的去中心化身份之旅了吗？</h2>
          <p class="text mb-8 max-w-2xl">
            加入 Atom Nexus，体验数据自主权的未来，掌控您的数字身份并保护您的隐私
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <button class="btn-primary text-lg px-8 py-3">创建身份</button>
            <button class="btn-secondary text-lg px-8 py-3">联系我们</button>
          </div>
        </div>
      </div>
      
      <!-- 背景效果 -->
      <div class="absolute inset-0 bg-gradient-radial z-0"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue';
import FeaturesSection from '@/components/home/FeaturesSection.vue';
import ModulesSection from '@/components/home/ModulesSection.vue';
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.cta-section {
  background-color: var(--color-darkbg);
}

.bg-gradient-radial {
  background: radial-gradient(circle at center, rgba(155, 77, 202, 0.2) 0%, rgba(30, 30, 47, 0) 70%);
}
</style> 