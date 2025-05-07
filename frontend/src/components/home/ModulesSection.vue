<template>
  <section class="modules-section py-20 relative">
    <div class="container">
      <!-- 标题 -->
      <div class="text-center mb-16">
        <h2 class="subtitle mb-4">探索我们的核心功能</h2>
        <p class="text max-w-2xl mx-auto">
          通过 Atom Nexus 管理你的数字身份、凭证和数据，体验去中心化的安全与便捷
        </p>
      </div>
      
      <!-- 模块卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="(module, index) in modules" 
          :key="index" 
          class="module-card relative overflow-hidden group"
        >
          <!-- 卡片内容 -->
          <div class="relative z-10 h-full flex flex-col justify-between p-8">
            <div>
              <div class="module-icon mb-6 p-4 inline-block rounded-xl" :class="module.iconBg">
                <div :class="module.icon + ' text-4xl'"></div>
              </div>
              <h3 class="text-2xl font-semibold mb-4 text-textlight">{{ module.title }}</h3>
              <p class="text-textgray mb-6">{{ module.description }}</p>
            </div>
            <router-link :to="module.path" class="module-link group">
              <span class="text-neon font-medium">{{ module.linkText }}</span>
              <span class="i-carbon-arrow-right ml-2 text-neon transition-transform group-hover:translate-x-1"></span>
            </router-link>
          </div>
          
          <!-- 背景装饰 -->
          <div class="absolute inset-0 bg-primary/80 backdrop-blur-sm z-0 transition-all duration-500 group-hover:bg-primary/60"></div>
          <div class="absolute inset-0 opacity-30 bg-cover bg-center" :style="{ backgroundImage: `url(${module.bgImage})` }"></div>
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r" :class="module.gradientColor"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 模块数据
const modules = [
  {
    title: '身份管理',
    description: '创建和管理你的去中心化身份 (DID)，掌控你的数字身份和个人数据',
    icon: 'i-carbon-user-profile',
    iconBg: 'bg-neon/20',
    path: '/identity',
    linkText: '管理身份',
    bgImage: '/src/assets/images/identity-bg.jpg',
    gradientColor: 'from-neon to-primary'
  },
  {
    title: '凭证管理',
    description: '管理你的可验证凭证，安全分享和验证你的资格证明和数字身份',
    icon: 'i-carbon-certificate',
    iconBg: 'bg-violet/20',
    path: '/credentials',
    linkText: '查看凭证',
    bgImage: '/src/assets/images/credential-bg.jpg',
    gradientColor: 'from-violet to-primary'
  },
  {
    title: '数据存储',
    description: '安全、加密地存储你的数据，自主控制谁可以访问你的信息',
    icon: 'i-carbon-data-storage',
    iconBg: 'bg-neon/20',
    path: '/storage',
    linkText: '存储数据',
    bgImage: '/src/assets/images/storage-bg.jpg',
    gradientColor: 'from-neon to-primary'
  },
  {
    title: '开发者工具',
    description: '使用我们的API和SDK集成Atom Nexus的去中心化身份和存储功能',
    icon: 'i-carbon-code',
    iconBg: 'bg-violet/20',
    path: '/developer',
    linkText: '开发集成',
    bgImage: '/src/assets/images/developer-bg.jpg',
    gradientColor: 'from-violet to-primary'
  }
];
</script>

<style scoped>
.modules-section {
  background-color: var(--color-primary);
}

.module-card {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 320px;
  transition: all 0.3s ease;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.module-icon {
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--color-textlight);
  transition: all 0.3s ease;
}

.module-card:hover .module-icon {
  transform: scale(1.05);
}

.module-link {
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.module-link:hover {
  text-decoration: underline;
}
</style> 