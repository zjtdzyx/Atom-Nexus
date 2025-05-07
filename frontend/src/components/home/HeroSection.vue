<template>
  <section class="hero-section relative overflow-hidden">
    <!-- 动态背景 -->
    <div class="bg-gradient absolute inset-0 z-0"></div>
    
    <!-- 主要内容 -->
    <div class="container relative z-10 h-screen flex flex-col justify-center items-start">
      <h1 class="title max-w-3xl mb-4 animate-slide-up">
        打造去中心化身份和数据主权的未来
      </h1>
      <h2 class="subtitle max-w-2xl mb-8 animate-slide-up animation-delay-200">
        Atom Nexus 把数据所有权交回用户手中，构建信任的数字生态系统
      </h2>
      <div class="flex flex-wrap gap-4 animate-slide-up animation-delay-400">
        <button class="btn-primary text-lg px-8 py-3">开始使用</button>
        <button class="btn-secondary text-lg px-8 py-3">了解更多</button>
      </div>
      
      <!-- 滚动提示 -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div class="flex flex-col items-center">
          <span class="text-textgray mb-2">向下滚动</span>
          <div class="i-carbon-chevron-down text-neon text-2xl"></div>
        </div>
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-20 z-0">
      <div class="w-full h-full bg-neon rounded-full filter blur-3xl animate-pulse"></div>
    </div>
    <div class="absolute top-1/4 left-10 w-16 h-16 opacity-30 z-0">
      <div class="w-full h-full bg-violet rounded-full filter blur-xl animate-float"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  background-color: var(--color-primary);
}

.bg-gradient {
  background: linear-gradient(135deg, #1e1e2f 0%, #121212 100%);
  background-size: 200% 200%;
  animation: gradientFlow 15s ease infinite;
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
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
</style> 