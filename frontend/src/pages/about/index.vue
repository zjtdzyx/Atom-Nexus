<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-12">
      <h1 class="text-3xl font-bold text-textlight mb-4">关于 Atom Nexus</h1>
      <p class="text-xl text-textgray max-w-3xl">{{ aboutInfo.description }}</p>
    </div>

    <!-- 特色功能 -->
    <div class="mb-16">
      <h2 class="text-2xl font-bold text-textlight mb-6">核心特性</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(feature, index) in aboutInfo.features" :key="index" class="card p-6 hover:bg-primary/30 transition-colors">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 flex items-center justify-center rounded-full bg-neon/20 text-neon mr-3">
              <span class="text-xl font-bold">{{ index + 1 }}</span>
            </div>
            <h3 class="text-lg font-semibold text-textlight">特性 {{ index + 1 }}</h3>
          </div>
          <p class="text-textgray">{{ feature }}</p>
        </div>
      </div>
    </div>

    <!-- 团队成员 -->
    <TeamSection :members="aboutInfo.teamMembers" class="mb-16" />

    <!-- 更新日志 -->
    <UpdateLogList 
      :logs="updateLogs.items" 
      :has-more="updateLogs.items.length < updateLogs.total"
      @load-more="loadMoreLogs"
      class="mb-16"
    />

    <!-- 联系信息 -->
    <div class="contact-section mb-16">
      <h2 class="text-2xl font-bold text-textlight mb-6">联系我们</h2>
      <div class="card p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col space-y-4">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center mr-3">
                <i class="i-carbon-email text-neon text-xl"></i>
              </div>
              <div>
                <p class="text-textgray text-sm">电子邮件</p>
                <p class="text-textlight">{{ aboutInfo.contactInfo.email }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center mr-3">
                <i class="i-carbon-phone text-neon text-xl"></i>
              </div>
              <div>
                <p class="text-textgray text-sm">联系电话</p>
                <p class="text-textlight">{{ aboutInfo.contactInfo.phone }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center mr-3">
                <i class="i-carbon-location text-neon text-xl"></i>
              </div>
              <div>
                <p class="text-textgray text-sm">办公地址</p>
                <p class="text-textlight">{{ aboutInfo.contactInfo.address }}</p>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col space-y-4">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center mr-3">
                <i class="i-carbon-globe text-neon text-xl"></i>
              </div>
              <div>
                <p class="text-textgray text-sm">官方网站</p>
                <a :href="aboutInfo.contactInfo.website" target="_blank" class="text-neon hover:underline">{{ aboutInfo.contactInfo.website }}</a>
              </div>
            </div>
            
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center mr-3">
                <i class="i-carbon-logo-github text-neon text-xl"></i>
              </div>
              <div>
                <p class="text-textgray text-sm">GitHub</p>
                <a :href="aboutInfo.contactInfo.github" target="_blank" class="text-neon hover:underline">{{ aboutInfo.contactInfo.github }}</a>
              </div>
            </div>
            
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center mr-3">
                <i class="i-carbon-license text-neon text-xl"></i>
              </div>
              <div>
                <p class="text-textgray text-sm">授权协议</p>
                <p class="text-textlight">{{ aboutInfo.license }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户反馈 -->
    <div class="feedback-section">
      <h2 class="text-2xl font-bold text-textlight mb-6">意见反馈</h2>
      <div class="card p-6">
        <form @submit.prevent="submitUserFeedback">
          <div class="mb-4">
            <label class="block text-textgray mb-2">您的邮箱</label>
            <input type="email" v-model="feedback.email" required class="input w-full bg-darkbg text-textlight border-metal/20" />
          </div>
          
          <div class="mb-4">
            <label class="block text-textgray mb-2">反馈类型</label>
            <select v-model="feedback.type" required class="input w-full bg-darkbg text-textlight border-metal/20">
              <option value="suggestion">功能建议</option>
              <option value="bug">问题反馈</option>
              <option value="question">使用咨询</option>
              <option value="other">其他</option>
            </select>
          </div>
          
          <div class="mb-6">
            <label class="block text-textgray mb-2">反馈内容</label>
            <textarea 
              v-model="feedback.content" 
              required 
              rows="4" 
              class="input w-full bg-darkbg text-textlight border-metal/20"
              placeholder="请详细描述您的想法或问题..."
            ></textarea>
          </div>
          
          <div class="flex justify-end">
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交反馈' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAboutInfo, fetchUpdateLogs, submitFeedback } from '../../services/about';
import { useToast } from '../../hooks/useToast';
import TeamSection from '../../components/about/TeamSection.vue';
import UpdateLogList from '../../components/about/UpdateLogList.vue';

const { showToast } = useToast();

const aboutInfo = ref({
  version: '1.0.0',
  releaseDate: '2023-12-01',
  description: 'Atom Nexus致力于重新定义数字身份和数据主权，为去中心化世界提供安全、自主的身份解决方案。我们的使命是让每个人都能完全掌控自己的数字身份和数据。',
  features: [
    '去中心化身份管理：创建、管理和验证符合W3C DID标准的去中心化身份标识符',
    '可验证凭证：颁发和验证符合W3C VC标准的可验证凭证',
    '身份钱包：安全存储和管理您的数字身份和凭证',
    '数据主权：完全控制您的个人数据共享和访问权限',
    '跨平台兼容：支持多种区块链和身份系统的互操作性',
    '开发者工具包：简化身份解决方案的集成和开发'
  ],
  teamMembers: [],
  contactInfo: {
    email: 'contact@atomnexus.example',
    phone: '+86 123 4567 8910',
    address: '中国北京市海淀区中关村科技园',
    website: 'https://www.atomnexus.example',
    github: 'https://github.com/atom-nexus/atom-nexus'
  },
  license: 'MIT License'
});

const updateLogs = ref({
  total: 0,
  items: [],
  page: 1,
  pageSize: 5
});

const feedback = ref({
  email: '',
  type: 'suggestion',
  content: ''
});

const submitting = ref(false);

onMounted(async () => {
  try {
    // 获取关于我们信息
    const { data } = await fetchAboutInfo();
    aboutInfo.value = data;
    
    // 获取更新日志
    await loadLogs();
  } catch (error) {
    showToast('获取页面数据失败', 'error');
  }
});

const loadLogs = async () => {
  try {
    const { data } = await fetchUpdateLogs({
      page: updateLogs.value.page,
      pageSize: updateLogs.value.pageSize
    });
    
    updateLogs.value.total = data.total;
    updateLogs.value.items = data.items;
  } catch (error) {
    showToast('获取更新日志失败', 'error');
  }
};

const loadMoreLogs = async () => {
  updateLogs.value.page += 1;
  
  try {
    const { data } = await fetchUpdateLogs({
      page: updateLogs.value.page,
      pageSize: updateLogs.value.pageSize
    });
    
    updateLogs.value.items = [...updateLogs.value.items, ...data.items];
  } catch (error) {
    updateLogs.value.page -= 1;
    showToast('加载更多失败', 'error');
  }
};

const submitUserFeedback = async () => {
  submitting.value = true;
  
  try {
    await submitFeedback({
      email: feedback.value.email,
      type: feedback.value.type,
      content: feedback.value.content
    });
    
    showToast('感谢您的反馈！', 'success');
    feedback.value.content = '';
  } catch (error) {
    showToast('提交反馈失败，请稍后重试', 'error');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
/* 页面样式 */
</style>