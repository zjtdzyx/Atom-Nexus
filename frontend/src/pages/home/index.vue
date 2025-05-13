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

    <!-- 使用FooterSection组件，只保留一个 -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onActivated, onUnmounted, defineAsyncComponent } from 'vue';
  import { logger } from '../../utils/logger';

  // 基本组件直接导入
  import HeroSection from '../../components/home/HeroSection.vue';

  // 使用异步组件按需加载，提高首屏速度
  const FeaturesSection = defineAsyncComponent(() =>
    import('../../components/home/FeaturesSection.vue')
  );
  const ModulesSection = defineAsyncComponent(() =>
    import('../../components/home/ModulesSection.vue')
  );
  const FooterSection = defineAsyncComponent(() =>
    import('../../components/home/FooterSection.vue')
  );

  // 优化滚动性能
  let rafId: number | null = null;
  let ticking = false;

  // 页面加载日志
  onMounted(() => {
    logger.info('Page:Home', '首页已加载');

    // 添加滚动优化
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 图片懒加载
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        // @ts-ignore
        img.loading = 'lazy';
      });
    }
  });

  // 在keepAlive组件被激活时触发
  onActivated(() => {
    logger.info('Page:Home', '首页重新激活');
  });

  // 组件卸载时清理
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);

    // 取消任何未完成的动画帧请求
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
    }
  });

  // 使用requestAnimationFrame优化滚动处理
  const handleScroll = () => {
    if (!ticking) {
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        // 在这里可以处理滚动相关效果
        ticking = false;
      });
    }
  };
</script>

<style scoped>

  /* 保留必要的样式，移除组件已实现的样式 */
  .cta-section {
    transition: all 0.3s ease;
    will-change: transform;
  }

  .home-page {
    /* 添加GPU加速 */
    transform: translateZ(0);
    will-change: transform;
    contain: content;
  }

  /* 预加载关键资源 */
  .home-page::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    z-index: -1;
    background-image: url('/atom-nexus-logo.png');
  }
</style>