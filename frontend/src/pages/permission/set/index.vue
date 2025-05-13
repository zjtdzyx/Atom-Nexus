<template>
  <div class="container mx-auto py-10 px-4">
    <div class="flex items-center mb-8">
      <router-link to="/permission" class="text-metal hover:text-textlight mr-4">
        <div class="i-carbon-arrow-left text-2xl"></div>
      </router-link>
      <h1 class="text-3xl font-bold text-textlight">权限设置</h1>
    </div>

    <div class="card bg-primary/40 p-6 rounded-lg mb-8">
      <h2 class="text-xl font-bold text-textlight mb-6">创建新权限</h2>

      <!-- 使用权限表单组件 -->
      <PermissionForm :initial-data="initialPermission" @submit="handlePermissionSubmit" @cancel="navigateBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { logger } from '../../../utils/logger';
  import PermissionForm from '../../../components/permission/PermissionForm.vue';
  import { usePermissionStore } from '../../../stores/permission';

  const router = useRouter();
  const route = useRoute();
  const permissionStore = usePermissionStore();

  // 初始权限数据
  const initialPermission = reactive({
    type: route.query.type?.toString() || 'credential',
    resourceId: route.query.resourceId?.toString() || '',
    action: 'read',
    subject: ''
  });

  // 页面加载时记录日志
  onMounted(() => {
    logger.info('Page:Permission:Set', '权限设置页面已加载');
  });

  // 处理权限表单提交
  const handlePermissionSubmit = async (permissionData: any) => {
    try {
      await permissionStore.createPermission(permissionData);
      router.push('/permission');
    } catch (error) {
      logger.error('Page:Permission:Set', '创建权限失败', error);
    }
  };

  // 返回权限列表
  const navigateBack = () => {
    router.push('/permission');
  };
</script>