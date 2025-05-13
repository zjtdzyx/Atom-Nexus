<template>
  <section class="hero-section relative overflow-hidden">
    <!-- 动态背景 -->
    <div class="bg-gradient absolute inset-0 z-0"></div>

    <!-- 装饰元素 -->
    <div class="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-20 z-0">
      <div class="w-full h-full bg-neon rounded-full filter blur-3xl animate-pulse"></div>
    </div>
    <div class="absolute top-1/4 left-10 w-16 h-16 opacity-30 z-0">
      <div class="w-full h-full bg-violet rounded-full filter blur-xl animate-float"></div>
    </div>

    <!-- 主要内容 -->
    <div class="container relative z-10 min-h-[90vh] flex flex-col justify-center items-start pt-20">
      <h1
        class="text-5xl md:text-6xl lg:text-7xl font-bold text-textlight max-w-3xl mb-6 animate-slide-up leading-tight">
        重构身份，赋能<span class="text-neon">去中心化</span>世界
      </h1>
      <h2 class="text-xl md:text-2xl text-textgray max-w-2xl mb-10 animate-slide-up animation-delay-200">
        Atom Nexus 把数据所有权交回用户手中，构建安全可信的数字身份生态
      </h2>
      <div class="flex flex-wrap gap-6 animate-slide-up animation-delay-400">
        <button class="btn-primary text-lg px-8 py-3 rounded-md">开始使用</button>
        <button class="btn-secondary text-lg px-8 py-3 rounded-md">了解更多</button>
      </div>

      <!-- 滚动提示 -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div class="flex flex-col items-center">
          <span class="text-textgray mb-2">向下滚动</span>
          <div class="i-carbon-chevron-down text-neon text-2xl"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { logger } from '../../utils/logger';
  
  // 高性能动画标志
  let animationActive = true;
  let rafId: number | null = null;
  
  // 组件加载时初始化
  onMounted(() => {
    logger.info('Component:HeroSection', '英雄区域已加载');
    
    // 监听视口
    setupIntersectionObserver();
    
    // 在视口内启动高性能动画
    animateHeroElements();
  });
  
  // 组件卸载时清理
  onUnmounted(() => {
    // 清理动画帧
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    animationActive = false;
  });
  
  // 使用交叉观察器优化性能 - 只有在视口内才进行动画
  const setupIntersectionObserver = () => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // 当组件进入视口时启动动画，离开时停止
          animationActive = entry.isIntersecting;
          
          if (entry.isIntersecting && !rafId) {
            animateHeroElements();
          } else if (!entry.isIntersecting && rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      }, { threshold: 0.1 });
      
      // 观察当前组件
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        observer.observe(heroSection);
      }
    }
  };
  
  // 高性能动画函数
  const animateHeroElements = () => {
    if (!animationActive) return;
    
    // 在这里可以添加任何需要平滑动画的逻辑
    // 例如: 视差滚动效果、背景动画等
    
    // 循环动画帧
    rafId = requestAnimationFrame(animateHeroElements);
  };
</script>

<style scoped>
  .hero-section {
    min-height: 100vh;
    background-color: var(--color-primary);
    will-change: transform; /* GPU加速 */
    contain: content; /* 包含内部布局 */
  }

  .bg-gradient {
    background: linear-gradient(135deg, #1e1e2f 0%, #121212 100%);
    background-size: 200% 200%;
    animation: gradientFlow 15s ease infinite;
    transform: translateZ(0); /* 强制GPU渲染 */
    will-change: background-position;
    backface-visibility: hidden;
  }

  /* 动画 */
  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20px);
    }
  }

  .animate-float {
    animation: float 8s ease-in-out infinite;
    will-change: transform;
  }

  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
    will-change: transform, opacity;
  }

  .animation-delay-200 {
    animation-delay: 0.2s;
  }

  .animation-delay-400 {
    animation-delay: 0.4s;
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 移动端优化 - 减少动画数量 */
  @media (max-width: 768px) {
    .bg-gradient {
      animation-duration: 30s; /* 降低动画频率 */
    }
    
    .animate-float {
      animation: none; /* 移动端禁用浮动动画 */
    }
  }
</style>