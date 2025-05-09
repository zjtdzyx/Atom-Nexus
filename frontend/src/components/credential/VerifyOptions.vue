<template>
  <div class="verify-options">
    <div class="bg-primary/50 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-md font-medium text-textlight">高级验证选项</h3>
        <button @click="toggle" class="text-textgray hover:text-neon">
          <span :class="expanded ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"></span>
        </button>
      </div>

      <div v-if="expanded" class="space-y-4">
        <!-- 信任策略选择 -->
        <div>
          <label class="block text-textlight text-sm mb-2">信任策略</label>
          <select v-model="options.trustPolicy" class="input w-full">
            <option value="strict">严格 (仅信任系统认证的发行者)</option>
            <option value="medium">中等 (信任已知发行者网络)</option>
            <option value="permissive">宽松 (信任所有有效签名)</option>
          </select>
          <p class="text-xs text-textgray mt-1">设置用于验证凭证发行者的信任级别</p>
        </div>

        <!-- 验证级别选择 -->
        <div>
          <label class="block text-textlight text-sm mb-2">验证级别</label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input type="checkbox" id="verifySignature" v-model="options.verifySignature"
                class="mr-2 h-4 w-4 rounded border-gray-700 bg-darkbg/50 checked:bg-neon">
              <label for="verifySignature" class="text-textgray text-sm">验证数字签名</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="verifyStatus" v-model="options.verifyStatus"
                class="mr-2 h-4 w-4 rounded border-gray-700 bg-darkbg/50 checked:bg-neon">
              <label for="verifyStatus" class="text-textgray text-sm">检查撤销状态</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="verifyExpiry" v-model="options.verifyExpiry"
                class="mr-2 h-4 w-4 rounded border-gray-700 bg-darkbg/50 checked:bg-neon">
              <label for="verifyExpiry" class="text-textgray text-sm">检查过期日期</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="verifySchema" v-model="options.verifySchema"
                class="mr-2 h-4 w-4 rounded border-gray-700 bg-darkbg/50 checked:bg-neon">
              <label for="verifySchema" class="text-textgray text-sm">验证凭证结构模式</label>
            </div>
          </div>
        </div>

        <!-- 离线验证选项 -->
        <div>
          <div class="flex items-center">
            <input type="checkbox" id="offlineVerification" v-model="options.offlineVerification"
              class="mr-2 h-4 w-4 rounded border-gray-700 bg-darkbg/50 checked:bg-neon">
            <label for="offlineVerification" class="text-textgray text-sm">离线验证</label>
          </div>
          <p class="text-xs text-textgray mt-1">启用离线验证模式(不检查撤销状态)</p>
        </div>

        <!-- 记录验证历史 -->
        <div>
          <div class="flex items-center">
            <input type="checkbox" id="recordVerification" v-model="options.recordVerification"
              class="mr-2 h-4 w-4 rounded border-gray-700 bg-darkbg/50 checked:bg-neon">
            <label for="recordVerification" class="text-textgray text-sm">记录验证历史</label>
          </div>
          <p class="text-xs text-textgray mt-1">在系统中保存此次验证记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineEmits, watch } from 'vue';
  import { logger } from '../../utils/logger';

  const emit = defineEmits(['update:options']);

  // 组件状态
  const expanded = ref(false);

  // 验证选项对象
  const options = reactive({
    trustPolicy: 'medium',
    verifySignature: true,
    verifyStatus: true,
    verifyExpiry: true,
    verifySchema: true,
    offlineVerification: false,
    recordVerification: true
  });

  // 展开/收起面板
  const toggle = () => {
    expanded.value = !expanded.value;
    logger.info('Component:VerifyOptions', expanded.value ? '展开高级验证选项' : '收起高级验证选项');
  };

  // 监听选项变化并向父组件发出事件
  watch(options, (newVal) => {
    logger.info('Component:VerifyOptions', '验证选项已更新', newVal);
    emit('update:options', newVal);
  }, { deep: true });

</script>

<style scoped>
  .input {
    @apply w-full px-4 py-2 bg-darkbg/50 border border-gray-700 rounded-lg text-textlight focus:outline-none focus:ring-2 focus:ring-neon/50;
  }
</style>