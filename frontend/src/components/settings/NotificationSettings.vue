<template>
  <div class="notification-settings">
    <h3 class="text-lg font-medium text-textlight mb-4">通知设置</h3>
    
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-textgray">邮件通知</span>
          <p class="text-xs text-textgray/70">接收系统通知和安全提醒邮件</p>
        </div>
        <label class="toggle">
          <input 
            type="checkbox" 
            :checked="notifications.email"
            @change="updateNotification('email', $event.target.checked)"
          >
          <span class="slider round"></span>
        </label>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <span class="text-textgray">短信通知</span>
          <p class="text-xs text-textgray/70">接收重要操作的短信验证码和提醒</p>
        </div>
        <label class="toggle">
          <input 
            type="checkbox" 
            :checked="notifications.sms"
            @change="updateNotification('sms', $event.target.checked)"
          >
          <span class="slider round"></span>
        </label>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <span class="text-textgray">登录提醒</span>
          <p class="text-xs text-textgray/70">新设备登录时接收安全提醒</p>
        </div>
        <label class="toggle">
          <input 
            type="checkbox" 
            :checked="notifications.loginAlert"
            @change="updateNotification('loginAlert', $event.target.checked)"
          >
          <span class="slider round"></span>
        </label>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <span class="text-textgray">安全提醒</span>
          <p class="text-xs text-textgray/70">身份和凭证变更时接收安全提醒</p>
        </div>
        <label class="toggle">
          <input 
            type="checkbox" 
            :checked="notifications.securityAlert"
            @change="updateNotification('securityAlert', $event.target.checked)"
          >
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  loginAlert: boolean;
  securityAlert: boolean;
}

const props = defineProps<{
  modelValue: NotificationSettings;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: NotificationSettings): void;
}>();

const notifications = computed(() => props.modelValue);

const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  });
};
</script>

<style scoped>
.toggle {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 26px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2b2b2b;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--color-neon);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--color-neon);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style> 