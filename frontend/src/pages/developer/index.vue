<template>
  <div class="developer-page py-10">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header mb-12 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-textlight mb-4">开发者中心</h1>
        <p class="text-textgray max-w-2xl mx-auto">
          利用Atom Nexus的API和SDK，将去中心化身份与存储能力集成到您的应用中
        </p>
      </div>

      <!-- 开发资源卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div v-for="(resource, index) in developerResources" :key="index" class="resource-card card p-6">
          <div class="resource-icon p-4 rounded-lg mb-6" :class="resource.iconBg">
            <div :class="resource.icon + ' text-3xl ' + resource.iconColor"></div>
          </div>
          <h3 class="text-xl font-semibold text-textlight mb-3">{{ resource.title }}</h3>
          <p class="text-textgray mb-6">{{ resource.description }}</p>
          <router-link :to="resource.path" class="btn-primary py-2 px-4 inline-flex items-center">
            {{ resource.linkText }}
            <span class="i-carbon-arrow-right ml-2"></span>
          </router-link>
        </div>
      </div>

      <!-- API列表预览 -->
      <div class="mb-16">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-textlight">热门API</h2>
          <router-link to="/developer/api" class="text-neon hover:underline flex items-center">
            查看全部
            <span class="i-carbon-arrow-right ml-1"></span>
          </router-link>
        </div>

        <ApiList initialCategory="identity" />
      </div>

      <!-- 开发者注册表单 -->
      <div class="bg-primary/40 rounded-xl p-8 mb-16">
        <h2 class="text-2xl font-bold text-textlight mb-6">获取开发者密钥</h2>
        <RegistrationForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { logger } from '../../utils/logger';
  import ApiList from '../../components/developer/ApiList.vue';
  import RegistrationForm from '../../components/developer/RegistrationForm.vue';

  // 页面加载日志
  onMounted(() => {
    logger.info('Page:Developer', '开发者页面已加载');
  });

  // 开发者资源数据
  const developerResources = [
    {
      title: 'API 文档',
      description: '浏览完整的API参考文档，学习如何集成Atom Nexus的身份和存储服务',
      icon: 'i-carbon-api',
      iconBg: 'bg-neon/20',
      iconColor: 'text-neon',
      path: '/developer/api',
      linkText: '查看文档'
    },
    {
      title: 'SDK 下载',
      description: '获取我们的官方SDK，支持多种编程语言，加速您的开发过程',
      icon: 'i-carbon-code',
      iconBg: 'bg-violet/20',
      iconColor: 'text-violet',
      path: '/developer/sdk',
      linkText: '下载SDK'
    },
    {
      title: '开发示例',
      description: '通过示例项目学习如何在您的应用中实现去中心化身份和凭证功能',
      icon: 'i-carbon-notebook',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      path: '/developer/examples',
      linkText: '浏览示例'
    }
  ];
</script>

<style scoped>
  .resource-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .resource-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
</style>