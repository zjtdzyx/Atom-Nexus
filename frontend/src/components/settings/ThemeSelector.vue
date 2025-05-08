<template>
  <div class="theme-selector">
    <h3 class="text-lg font-medium text-textlight mb-4">选择主题</h3>
    
    <div class="flex space-x-4">
      <div 
        class="theme-option flex-1 p-4 rounded-lg cursor-pointer flex flex-col items-center"
        :class="{ 'bg-neon/10 border-neon': modelValue === 'light' }"
        @click="updateTheme('light')"
      >
        <div class="w-16 h-16 rounded-lg bg-white mb-2"></div>
        <span>浅色</span>
      </div>
      <div 
        class="theme-option flex-1 p-4 rounded-lg cursor-pointer flex flex-col items-center"
        :class="{ 'bg-neon/10 border-neon': modelValue === 'dark' }"
        @click="updateTheme('dark')"
      >
        <div class="w-16 h-16 rounded-lg bg-darkbg mb-2"></div>
        <span>深色</span>
      </div>
      <div 
        class="theme-option flex-1 p-4 rounded-lg cursor-pointer flex flex-col items-center"
        :class="{ 'bg-neon/10 border-neon': modelValue === 'system' }"
        @click="updateTheme('system')"
      >
        <div class="w-16 h-16 rounded-lg bg-gradient-to-r from-white to-darkbg mb-2"></div>
        <span>跟随系统</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ThemeType = 'light' | 'dark' | 'system';

const props = defineProps<{
  modelValue: ThemeType;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ThemeType): void;
}>();

const updateTheme = (theme: ThemeType) => {
  emit('update:modelValue', theme);
};
</script>

<style scoped>
.theme-option {
  border: 2px solid transparent;
  transition: all 0.3s;
}
.theme-option:hover {
  background-color: rgba(var(--color-primary), 0.1);
}
</style> 