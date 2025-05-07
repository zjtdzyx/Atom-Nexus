<template>
  <div
    class="sdk-card bg-primary/40 border border-gray-800 rounded-xl p-5 hover:border-cyan-700/50 transition-all duration-300">
    <!-- SDK徽标和基本信息 -->
    <div class="flex items-start mb-4">
      <div class="sdk-logo rounded-lg p-3 bg-primary-dark mr-4 flex items-center justify-center w-16 h-16">
        <div :class="getLanguageIcon(sdk.language)" class="text-3xl" :style="{ color: getLanguageColor(sdk.language) }">
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-semibold text-textlight mb-1 truncate" :title="sdk.name">{{ sdk.name }}</h3>
        <div class="flex items-center text-sm text-textgray mb-1">
          <span class="flex items-center mr-3">
            <span class="i-carbon-code text-cyan-400 mr-1"></span>
            {{ sdk.language }}
          </span>
          <span class="flex items-center">
            <span class="i-carbon-version text-cyan-400 mr-1"></span>
            {{ sdk.version }}
          </span>
        </div>
      </div>
    </div>

    <!-- SDK描述 -->
    <p class="text-textgray mb-4">{{ sdk.description }}</p>

    <!-- 详细信息 -->
    <div class="grid grid-cols-2 gap-2 text-sm mb-4">
      <div class="bg-primary-dark/50 rounded-lg p-2">
        <span class="text-textgray">文件大小:</span>
        <span class="text-textlight ml-1">{{ sdk.size }}</span>
      </div>
      <div class="bg-primary-dark/50 rounded-lg p-2">
        <span class="text-textgray">更新日期:</span>
        <span class="text-textlight ml-1">{{ formatDate(sdk.lastUpdated) }}</span>
      </div>
    </div>

    <!-- 下载按钮 -->
    <div class="flex justify-end">
      <a :href="sdk.downloadUrl" class="download-btn bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2.5 rounded-lg
               flex items-center font-medium hover:from-cyan-500 hover:to-blue-500 transition-all duration-300
               shadow-lg shadow-cyan-700/20" @click="trackDownload">
        <span class="i-carbon-download mr-2"></span>
        下载 SDK
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import type { Sdk } from '../../stores/developer';

  const props = defineProps<{
    sdk: Sdk;
  }>();

  const emit = defineEmits<{
    (e: 'download', sdk: Sdk): void;
  }>();

  // 获取编程语言图标
  const getLanguageIcon = (language: string): string => {
    const languageIcons: Record<string, string> = {
      'javascript': 'i-logos-javascript',
      'typescript': 'i-logos-typescript-icon',
      'python': 'i-logos-python',
      'java': 'i-logos-java',
      'csharp': 'i-logos-c-sharp',
      'go': 'i-logos-go',
      'rust': 'i-logos-rust',
      'ruby': 'i-logos-ruby',
      'php': 'i-logos-php',
      'swift': 'i-logos-swift',
      'kotlin': 'i-logos-kotlin-icon',
    };

    const normalizedLang = language.toLowerCase();
    return languageIcons[normalizedLang] || 'i-carbon-code';
  };

  // 获取编程语言颜色
  const getLanguageColor = (language: string): string => {
    const languageColors: Record<string, string> = {
      'javascript': '#F7DF1E',
      'typescript': '#3178C6',
      'python': '#3776AB',
      'java': '#007396',
      'csharp': '#239120',
      'go': '#00ADD8',
      'rust': '#DEA584',
      'ruby': '#CC342D',
      'php': '#777BB4',
      'swift': '#FA7343',
      'kotlin': '#7F52FF',
    };

    const normalizedLang = language.toLowerCase();
    return languageColors[normalizedLang] || '#6BDDFF'; // 默认青色
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 跟踪下载事件
  const trackDownload = () => {
    emit('download', props.sdk);
  };
</script>

<style scoped>
  .sdk-card {
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(8px);
  }

  .sdk-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  .download-btn {
    position: relative;
    overflow: hidden;
  }

  .download-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  .download-btn:hover::after {
    left: 100%;
  }
</style>