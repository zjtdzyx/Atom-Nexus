<template>
  <section class="developer-section py-20 relative">
    <div class="container">
      <!-- 标题 -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-textlight mb-4">开发者专区</h2>
        <p class="text-textgray max-w-2xl mx-auto">
          利用我们的API和SDK，将Atom Nexus的去中心化身份与存储能力集成到你的应用中
        </p>
      </div>

      <!-- 开发者资源卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(resource, index) in devResources" :key="index"
          class="dev-card relative overflow-hidden group hover:shadow-neon/20 hover:shadow-lg transition-all duration-300">
          <div class="p-6 flex flex-col h-full">
            <div class="resource-icon mb-5 p-3 inline-block rounded-xl" :class="resource.iconBg">
              <div :class="resource.icon + ' text-2xl'"></div>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-textlight">{{ resource.title }}</h3>
            <p class="text-textgray mb-5 flex-grow">{{ resource.description }}</p>
            <router-link :to="resource.path" class="resource-link group flex items-center">
              <span class="text-neon font-medium">{{ resource.linkText }}</span>
              <span class="i-carbon-arrow-right ml-2 text-neon transition-transform group-hover:translate-x-1"></span>
            </router-link>
          </div>
          <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r" :class="resource.gradientColor"></div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-16 text-center">
        <router-link to="/developer" class="btn-primary px-8 py-3 inline-flex items-center">
          <span>探索更多开发资源</span>
          <div class="i-carbon-arrow-right ml-2"></div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  // 开发者资源数据
  const devResources = [
    {
      title: 'API 文档',
      description: '全面的API参考文档，帮助你快速集成Atom Nexus的身份和存储功能',
      icon: 'i-carbon-api',
      iconBg: 'bg-neon/20',
      path: '/developer/api',
      linkText: '浏览文档',
      gradientColor: 'from-neon to-primary'
    },
    {
      title: 'SDK 下载',
      description: '下载官方SDK，支持JavaScript、Python、Java和Go等多种编程语言',
      icon: 'i-carbon-download',
      iconBg: 'bg-violet/20',
      path: '/developer/sdk',
      linkText: '获取SDK',
      gradientColor: 'from-violet to-primary'
    },
    {
      title: '示例项目',
      description: '探索示例项目和开源代码，加速你的开发和集成过程',
      icon: 'i-carbon-code',
      iconBg: 'bg-neon/20',
      path: '/developer/examples',
      linkText: '查看示例',
      gradientColor: 'from-neon to-primary'
    }
  ];
</script>

<style scoped>
  .developer-section {
    background-color: var(--color-darkbg);
  }

  .dev-card {
    border-radius: 12px;
    background-color: var(--color-primary);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  .dev-card:hover {
    transform: translateY(-5px);
  }

  .resource-icon {
    background-color: rgba(0, 0, 0, 0.2);
    color: var(--color-textlight);
  }

  .resource-link {
    display: inline-flex;
    align-items: center;
  }

  .resource-link:hover {
    text-decoration: underline;
  }
</style>