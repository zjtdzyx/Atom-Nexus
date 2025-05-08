<template>
  <footer class="footer-section py-16 border-t border-metal/20">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- 第一栏：品牌和简介 -->
        <div>
          <div class="flex items-center mb-5">
            <img src="/atom-nexus-logo.png" alt="Atom Nexus" class="h-10 w-auto" />
            <span class="ml-3 text-2xl font-bold text-textlight">Atom Nexus</span>
          </div>
          <p class="text-textgray mb-6">
            重新定义数字身份和数据主权，为去中心化世界提供安全、自主的身份解决方案
          </p>
          <div class="social-links flex space-x-4">
            <a href="#" class="text-metal hover:text-neon transition-colors">
              <div class="i-carbon-logo-github text-2xl"></div>
            </a>
            <a href="#" class="text-metal hover:text-neon transition-colors">
              <div class="i-carbon-logo-twitter text-2xl"></div>
            </a>
            <a href="#" class="text-metal hover:text-neon transition-colors">
              <div class="i-carbon-logo-discord text-2xl"></div>
            </a>
          </div>
        </div>

        <!-- 第二栏：快速链接 -->
        <div>
          <h3 class="text-lg font-semibold text-textlight mb-5">产品与服务</h3>
          <ul class="space-y-3">
            <li v-for="(link, index) in productLinks" :key="index">
              <router-link :to="link.path" class="text-textgray hover:text-neon transition-colors">
                {{ link.title }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 第三栏：联系和资源 -->
        <div>
          <h3 class="text-lg font-semibold text-textlight mb-5">资源与支持</h3>
          <ul class="space-y-3">
            <li v-for="(link, index) in resourceLinks" :key="index">
              <router-link :to="link.path" class="text-textgray hover:text-neon transition-colors">
                {{ link.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="border-t border-metal/20 mt-10 pt-6 text-center text-textgray text-sm">
        <p>© {{ new Date().getFullYear() }} Atom Nexus. 保留所有权利。</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  // 产品链接
  const productLinks = [
    { title: '身份管理', path: '/identity' },
    { title: '凭证管理', path: '/credentials' },
    { title: '数据存储', path: '/storage' },
    { title: '应用集成', path: '/apps' },
    { title: '安全与隐私', path: '/security' }
  ];

  // 资源和支持链接
  const resourceLinks = [
    { title: '开发者文档', path: '/developer' },
    { title: '技术白皮书', path: '/whitepaper' },
    { title: '关于我们', path: '/about' },
    { title: '联系我们', path: '/contact' },
    { title: '常见问题', path: '/faq' }
  ];
</script>

<style scoped>
  .footer-section {
    background-color: var(--color-primary);
  }
</style>