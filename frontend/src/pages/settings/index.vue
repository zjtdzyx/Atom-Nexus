<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-textlight mb-8">设置中心</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 左侧导航 -->
      <div class="md:col-span-1">
        <div class="card p-4">
          <ul class="space-y-2">
            <li class="p-2 bg-neon/10 rounded-lg border-l-2 border-neon">
              <a href="#account" class="text-textlight block">账户设置</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#security" class="text-textgray hover:text-textlight block">安全与隐私</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#appearance" class="text-textgray hover:text-textlight block">外观设置</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#notifications" class="text-textgray hover:text-textlight block">通知设置</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#advanced" class="text-textgray hover:text-textlight block">高级设置</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧设置内容 -->
      <div class="md:col-span-2">
        <!-- 账户设置 -->
        <div id="account" class="card p-6 mb-8">
          <h2 class="text-xl font-semibold text-textlight mb-6">账户设置</h2>

          <div class="space-y-6">
            <div>
              <label class="block text-textgray mb-2">用户名</label>
              <input type="text" v-model="userPreferences.username" class="input w-full bg-darkbg text-textlight border-metal/20" />
            </div>

            <div>
              <label class="block text-textgray mb-2">电子邮箱</label>
              <input type="email" v-model="userPreferences.email" class="input w-full bg-darkbg text-textlight border-metal/20" />
            </div>

            <div>
              <label class="block text-textgray mb-2">语言</label>
              <select v-model="userPreferences.language" class="input w-full bg-darkbg text-textlight border-metal/20">
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-metal/20">
              <button class="btn-secondary" @click="resetPreferences">重置</button>
              <button class="btn-primary" @click="savePreferences">保存更改</button>
            </div>
          </div>
        </div>

        <!-- 外观设置 -->
        <div id="appearance" class="card p-6 mb-8">
          <h2 class="text-xl font-semibold text-textlight mb-6">外观设置</h2>
          <ThemeSelector v-model="userPreferences.theme" />
        </div>

        <!-- 通知设置 -->
        <div id="notifications" class="card p-6 mb-8">
          <h2 class="text-xl font-semibold text-textlight mb-6">通知设置</h2>
          <NotificationSettings v-model="userPreferences.notifications" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchUserPreferences, updateUserPreferences, resetUserPreferences } from '../../services/settings';
import { useToast } from '../../hooks/useToast';
import ThemeSelector from '../../components/settings/ThemeSelector.vue';
import NotificationSettings from '../../components/settings/NotificationSettings.vue';

const { showToast } = useToast();

const userPreferences = ref({
  username: 'AtomUser',
  email: 'user@example.com',
  language: 'zh-CN',
  theme: 'dark',
  notifications: {
    email: true,
    sms: false,
    push: true,
    loginAlert: true,
    securityAlert: true
  }
});

onMounted(async () => {
  try {
    const { data } = await fetchUserPreferences();
    userPreferences.value = {
      ...userPreferences.value,
      language: data.language,
      theme: data.theme,
      notifications: data.notifications
    };
  } catch (error) {
    showToast('获取用户偏好设置失败', 'error');
  }
});

const savePreferences = async () => {
  try {
    await updateUserPreferences({
      language: userPreferences.value.language,
      theme: userPreferences.value.theme,
      notifications: userPreferences.value.notifications
    });
    showToast('设置保存成功', 'success');
  } catch (error) {
    showToast('设置保存失败', 'error');
  }
};

const resetPreferences = async () => {
  try {
    const { data } = await resetUserPreferences();
    userPreferences.value = {
      ...userPreferences.value,
      language: data.language,
      theme: data.theme,
      notifications: data.notifications
    };
    showToast('设置已重置为默认值', 'success');
  } catch (error) {
    showToast('设置重置失败', 'error');
  }
};
</script>

<style scoped>
/* 所有样式已移至相应组件中 */
</style>