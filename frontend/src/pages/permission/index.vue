<template>
  <div class="permission-manager">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header py-8">
      <div class="container">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-textlight mb-2">权限管理</h1>
            <p class="text-textgray">管理您的资源访问权限</p>
          </div>
          <div class="flex space-x-4">
            <button class="btn-primary" @click="openCreateModal">
              <span class="i-carbon-add mr-1"></span>新建权限
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container py-6">
      <!-- 加载状态 -->
      <div v-if="permissionStore.isLoading" class="flex justify-center py-12">
        <div class="i-carbon-circle-dash animate-spin text-4xl text-neon"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="permissionStore.error" class="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
        <p>{{ permissionStore.error }}</p>
        <button class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" @click="fetchPermissions">
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="permissionStore.permissions.length === 0" class="empty-state text-center py-16">
        <div class="i-carbon-security text-6xl text-textgray mx-auto mb-4"></div>
        <h3 class="text-xl font-medium text-textlight mb-2">您还没有设置任何权限</h3>
        <p class="text-textgray mb-6">通过创建权限来控制您的身份和凭证的访问</p>
        <button class="btn-primary" @click="openCreateModal">
          创建权限
        </button>
      </div>

      <!-- 权限列表 -->
      <template v-else>
        <!-- 过滤器 -->
        <div class="filters mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="search-box relative col-span-2">
              <input v-model="searchQuery" type="text" placeholder="搜索权限..." class="input pr-10 w-full">
              <span class="i-carbon-search absolute right-3 top-1/2 transform -translate-y-1/2 text-textgray"></span>
            </div>
            <div class="resource-filter">
              <select v-model="resourceFilter" class="input w-full">
                <option value="all">所有资源</option>
                <option value="credential">凭证</option>
                <option value="identity">身份</option>
                <option value="data">数据</option>
              </select>
            </div>
            <div class="status-filter">
              <select v-model="statusFilter" class="input w-full">
                <option value="all">所有状态</option>
                <option value="active">活跃</option>
                <option value="revoked">已撤销</option>
                <option value="expired">已过期</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 表格视图 -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-primary/60 text-left">
                <th class="p-4 text-textlight font-medium">资源</th>
                <th class="p-4 text-textlight font-medium">授权对象</th>
                <th class="p-4 text-textlight font-medium">操作类型</th>
                <th class="p-4 text-textlight font-medium">状态</th>
                <th class="p-4 text-textlight font-medium">创建时间</th>
                <th class="p-4 text-textlight font-medium">过期时间</th>
                <th class="p-4 text-textlight font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="permission in filteredPermissions" :key="permission.id"
                class="border-b border-gray-700 hover:bg-primary/30">
                <td class="p-4 text-textlight">
                  <div class="flex items-center">
                    <span class="resource-icon mr-2" :class="{
                      'i-carbon-certificate text-violet': permission.type === 'credential',
                      'i-carbon-user-profile text-neon': permission.type === 'identity',
                      'i-carbon-data-base text-blue-500': permission.type === 'data'
                    }"></span>
                    <div>
                      <div class="font-medium">{{ getResourceName(permission) }}</div>
                      <div class="text-xs text-textgray truncate max-w-xs">{{ permission.resourceId }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-textlight">
                  <div>
                    <div class="font-medium truncate max-w-xs">{{ formatDid(permission.subject) }}</div>
                    <div v-if="permission.metadata?.subjectName" class="text-xs text-textgray">
                      {{ permission.metadata.subjectName }}
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="{
                    'bg-green-500/20 text-green-500': permission.action === 'read',
                    'bg-blue-500/20 text-blue-500': permission.action === 'write',
                    'bg-yellow-500/20 text-yellow-500': permission.action === 'verify',
                    'bg-red-500/20 text-red-500': permission.action === 'revoke',
                    'bg-violet/20 text-violet': permission.action === 'admin'
                  }">
                    {{ getActionLabel(permission.action) }}
                  </span>
                </td>
                <td class="p-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="{
                    'bg-green-500/20 text-green-500': permission.status === 'active',
                    'bg-red-500/20 text-red-500': permission.status === 'revoked',
                    'bg-yellow-500/20 text-yellow-500': permission.status === 'expired'
                  }">
                    {{ getStatusLabel(permission.status) }}
                  </span>
                </td>
                <td class="p-4 text-textgray">
                  {{ formatDate(permission.createdAt) }}
                </td>
                <td class="p-4 text-textgray">
                  {{ permission.conditions?.expires ? formatDate(permission.conditions.expires) : '永久有效' }}
                </td>
                <td class="p-4">
                  <div class="flex space-x-2">
                    <button @click="openEditModal(permission)" class="p-1 text-textgray hover:text-neon">
                      <span class="i-carbon-edit"></span>
                    </button>
                    <button v-if="permission.status === 'active'" @click="confirmRevoke(permission)"
                      class="p-1 text-textgray hover:text-red-500">
                      <span class="i-carbon-close"></span>
                    </button>
                    <button @click="viewDetails(permission)" class="p-1 text-textgray hover:text-neon">
                      <span class="i-carbon-view"></span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- 创建/编辑权限模态框 -->
    <div v-if="showPermissionModal"
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-2xl m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-textlight">{{ editingPermission ? '编辑权限' : '创建新权限' }}</h3>
        </div>
        <div class="modal-body p-6">
          <form @submit.prevent="savePermission">
            <!-- 资源类型选择 -->
            <div class="mb-4">
              <label class="block text-textlight mb-2">资源类型</label>
              <select v-model="permissionForm.type" class="input w-full" :disabled="!!editingPermission"
                @change="onResourceTypeChange">
                <option value="credential">凭证</option>
                <option value="identity">身份</option>
                <option value="data">数据</option>
              </select>
            </div>

            <!-- 资源ID -->
            <div class="mb-4">
              <label class="block text-textlight mb-2">资源ID</label>
              <input v-model="permissionForm.resourceId" type="text" class="input w-full"
                :disabled="!!editingPermission" :placeholder="`选择要授权的${getResourceTypeLabel(permissionForm.type)}`">
              <p v-if="formErrors.resourceId" class="text-red-500 text-xs mt-1">{{ formErrors.resourceId }}</p>
            </div>

            <!-- 授权对象 -->
            <div class="mb-4">
              <label class="block text-textlight mb-2">授权对象 (DID)</label>
              <input v-model="permissionForm.subject" type="text" class="input w-full" placeholder="did:example:123...">
              <p v-if="formErrors.subject" class="text-red-500 text-xs mt-1">{{ formErrors.subject }}</p>
            </div>

            <!-- 操作类型 -->
            <div class="mb-4">
              <label class="block text-textlight mb-2">操作类型</label>
              <select v-model="permissionForm.action" class="input w-full">
                <option value="read">读取</option>
                <option value="write">修改</option>
                <option value="verify">验证</option>
                <option value="revoke">撤销</option>
                <option value="admin">管理员</option>
              </select>
            </div>

            <!-- 有效期设置 -->
            <div class="mb-4">
              <label class="block text-textlight mb-2">有效期</label>
              <div class="flex items-center mb-2">
                <input type="checkbox" id="expireCheckbox" v-model="hasExpiration" class="mr-2">
                <label for="expireCheckbox" class="text-textgray">设置过期时间</label>
              </div>
              <input v-if="hasExpiration" v-model="permissionForm.expiresAt" type="datetime-local" class="input w-full">
            </div>

            <!-- 高级选项 -->
            <div class="mb-6">
              <div class="flex items-center mb-2">
                <span class="text-textlight">高级选项</span>
                <button type="button" @click="showAdvanced = !showAdvanced" class="ml-2 text-textgray">
                  <span :class="showAdvanced ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"></span>
                </button>
              </div>

              <div v-if="showAdvanced" class="bg-darkbg/30 p-4 rounded-lg">
                <!-- IP限制 -->
                <div class="mb-4">
                  <label class="block text-textlight mb-2">IP限制 (可选)</label>
                  <input v-model="permissionForm.ipRestriction" type="text" class="input w-full"
                    placeholder="192.168.1.1, 10.0.0.0/24">
                </div>

                <!-- 域名限制 -->
                <div class="mb-4">
                  <label class="block text-textlight mb-2">域名限制 (可选)</label>
                  <input v-model="permissionForm.domainRestriction" type="text" class="input w-full"
                    placeholder="example.com, *.example.org">
                </div>

                <!-- 一次性使用 -->
                <div class="flex items-center">
                  <input type="checkbox" id="oneTimeCheckbox" v-model="permissionForm.oneTime" class="mr-2">
                  <label for="oneTimeCheckbox" class="text-textgray">一次性使用 (使用后自动撤销)</label>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-4">
              <button type="button" class="btn-secondary" @click="closeModal">取消</button>
              <button type="submit" class="btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="i-carbon-circle-dash animate-spin mr-2"></span>
                {{ editingPermission ? '保存修改' : '创建权限' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 撤销确认对话框 -->
    <div v-if="showRevokeConfirm"
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="modal-content bg-primary w-full max-w-md m-4 rounded-xl shadow-lg overflow-hidden" @click.stop>
        <div class="modal-header p-6 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-textlight">确认撤销权限</h3>
        </div>
        <div class="modal-body p-6">
          <p class="text-textgray mb-4">您确定要撤销此权限吗？此操作不可撤销。</p>
          <div class="mb-4">
            <label class="block text-textlight mb-2">撤销原因 (可选)</label>
            <input v-model="revokeReason" type="text" class="input w-full" placeholder="请输入撤销原因">
          </div>
          <div class="flex justify-end space-x-4">
            <button class="btn-secondary" @click="closeRevokeModal">取消</button>
            <button class="btn-primary bg-red-500 hover:bg-red-600" @click="revokePermission" :disabled="isRevoking">
              <span v-if="isRevoking" class="i-carbon-circle-dash animate-spin mr-2"></span>
              撤销
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePermissionStore, type Permission } from '../../stores/permission';
  import { logger } from '../../utils/logger';

  // 初始化路由和存储
  const router = useRouter();
  const permissionStore = usePermissionStore();

  // 权限列表状态
  const searchQuery = ref('');
  const resourceFilter = ref('all');
  const statusFilter = ref('all');

  // 模态框状态
  const showPermissionModal = ref(false);
  const editingPermission = ref<Permission | null>(null);
  const showAdvanced = ref(false);
  const isSaving = ref(false);

  // 撤销确认状态
  const showRevokeConfirm = ref(false);
  const permissionToRevoke = ref<Permission | null>(null);
  const revokeReason = ref('');
  const isRevoking = ref(false);

  // 表单状态
  const hasExpiration = ref(false);
  const permissionForm = ref({
    type: 'credential' as 'credential' | 'identity' | 'data',
    resourceId: '',
    subject: '',
    action: 'read' as 'read' | 'write' | 'verify' | 'revoke' | 'admin',
    expiresAt: '',
    ipRestriction: '',
    domainRestriction: '',
    oneTime: false
  });
  const formErrors = ref({
    resourceId: '',
    subject: ''
  });

  // 页面加载
  onMounted(() => {
    logger.info('Page:Permission', '权限管理页面已加载');
    fetchPermissions();
  });

  // 获取权限列表
  const fetchPermissions = async () => {
    await permissionStore.fetchPermissions();
  };

  // 根据筛选条件过滤权限列表
  const filteredPermissions = computed(() => {
    let result = [...permissionStore.permissions];

    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(permission =>
        permission.resourceId.toLowerCase().includes(query) ||
        permission.subject.toLowerCase().includes(query) ||
        (permission.metadata?.name?.toLowerCase().includes(query))
      );
    }

    // 资源类型过滤
    if (resourceFilter.value !== 'all') {
      result = result.filter(permission => permission.type === resourceFilter.value);
    }

    // 状态过滤
    if (statusFilter.value !== 'all') {
      result = result.filter(permission => permission.status === statusFilter.value);
    }

    return result;
  });

  // 打开创建模态框
  const openCreateModal = () => {
    editingPermission.value = null;
    resetForm();
    showPermissionModal.value = true;
    logger.info('Page:Permission', '打开创建权限模态框');
  };

  // 打开编辑模态框
  const openEditModal = (permission: Permission) => {
    editingPermission.value = permission;
    populateForm(permission);
    showPermissionModal.value = true;
    logger.info('Page:Permission', '打开编辑权限模态框', { id: permission.id });
  };

  // 重置表单
  const resetForm = () => {
    permissionForm.value = {
      type: 'credential',
      resourceId: '',
      subject: '',
      action: 'read',
      expiresAt: '',
      ipRestriction: '',
      domainRestriction: '',
      oneTime: false
    };
    hasExpiration.value = false;
    showAdvanced.value = false;
    formErrors.value = {
      resourceId: '',
      subject: ''
    };
  };

  // 填充表单数据
  const populateForm = (permission: Permission) => {
    permissionForm.value.type = permission.type;
    permissionForm.value.resourceId = permission.resourceId;
    permissionForm.value.subject = permission.subject;
    permissionForm.value.action = permission.action;

    // 有效期设置
    if (permission.conditions?.expires) {
      hasExpiration.value = true;
      // 转换为本地日期时间格式
      permissionForm.value.expiresAt = new Date(permission.conditions.expires)
        .toISOString().slice(0, 16);
    } else {
      hasExpiration.value = false;
      permissionForm.value.expiresAt = '';
    }

    // IP限制
    permissionForm.value.ipRestriction = permission.conditions?.ip?.join(', ') || '';

    // 域名限制
    permissionForm.value.domainRestriction = permission.conditions?.domain?.join(', ') || '';

    // 一次性使用
    permissionForm.value.oneTime = permission.conditions?.oneTime || false;

    // 如果有高级设置，展开高级选项
    showAdvanced.value = !!(permission.conditions?.ip || permission.conditions?.domain || permission.conditions?.oneTime);
  };

  // 关闭模态框
  const closeModal = () => {
    showPermissionModal.value = false;
  };

  // 资源类型变更
  const onResourceTypeChange = () => {
    permissionForm.value.resourceId = '';
  };

  // 保存权限
  const savePermission = async () => {
    // 验证表单
    formErrors.value = {
      resourceId: '',
      subject: ''
    };

    if (!permissionForm.value.resourceId) {
      formErrors.value.resourceId = '请输入资源ID';
      return;
    }

    if (!permissionForm.value.subject) {
      formErrors.value.subject = '请输入授权对象DID';
      return;
    }

    if (!permissionForm.value.subject.startsWith('did:')) {
      formErrors.value.subject = 'DID格式不正确，应以"did:"开头';
      return;
    }

    isSaving.value = true;

    try {
      // 构建权限数据
      const permissionData: Partial<Permission> = {
        type: permissionForm.value.type,
        resourceId: permissionForm.value.resourceId,
        subject: permissionForm.value.subject,
        action: permissionForm.value.action,
        conditions: {}
      };

      // 添加有效期
      if (hasExpiration.value && permissionForm.value.expiresAt) {
        permissionData.conditions!.expires = new Date(permissionForm.value.expiresAt).toISOString();
      }

      // 添加IP限制
      if (permissionForm.value.ipRestriction) {
        permissionData.conditions!.ip = permissionForm.value.ipRestriction
          .split(',')
          .map(ip => ip.trim())
          .filter(ip => ip);
      }

      // 添加域名限制
      if (permissionForm.value.domainRestriction) {
        permissionData.conditions!.domain = permissionForm.value.domainRestriction
          .split(',')
          .map(domain => domain.trim())
          .filter(domain => domain);
      }

      // 添加一次性使用标志
      if (permissionForm.value.oneTime) {
        permissionData.conditions!.oneTime = true;
      }

      if (editingPermission.value) {
        // 更新权限
        await permissionStore.updatePermission(editingPermission.value.id, permissionData);
        logger.info('Page:Permission', '权限更新成功', { id: editingPermission.value.id });
      } else {
        // 创建权限
        await permissionStore.createPermission(permissionData);
        logger.info('Page:Permission', '新权限创建成功');
      }

      closeModal();
    } catch (error: any) {
      logger.error('Page:Permission', '保存权限失败', { error: error.message });
      alert(`操作失败：${error.message}`);
    } finally {
      isSaving.value = false;
    }
  };

  // 确认撤销
  const confirmRevoke = (permission: Permission) => {
    permissionToRevoke.value = permission;
    revokeReason.value = '';
    showRevokeConfirm.value = true;
    logger.info('Page:Permission', '打开撤销确认对话框', { id: permission.id });
  };

  // 关闭撤销对话框
  const closeRevokeModal = () => {
    showRevokeConfirm.value = false;
    permissionToRevoke.value = null;
  };

  // 执行撤销
  const revokePermission = async () => {
    if (!permissionToRevoke.value) return;

    isRevoking.value = true;
    logger.info('Page:Permission', '执行撤销权限', { id: permissionToRevoke.value.id, reason: revokeReason.value });

    try {
      await permissionStore.revokePermission(permissionToRevoke.value.id, revokeReason.value || undefined);
      closeRevokeModal();
    } catch (error: any) {
      logger.error('Page:Permission', '撤销权限失败', { error: error.message });
      alert(`撤销失败：${error.message}`);
    } finally {
      isRevoking.value = false;
    }
  };

  // 查看权限详情
  const viewDetails = (permission: Permission) => {
    logger.info('Page:Permission', '查看权限详情', { id: permission.id });
    router.push(`/permission/${permission.id}`);
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化DID
  const formatDid = (did: string): string => {
    if (!did) return '';
    if (did.length <= 30) return did;
    return `${did.substring(0, 15)}...${did.substring(did.length - 10)}`;
  };

  // 获取操作标签
  const getActionLabel = (action: string): string => {
    const actionMap: Record<string, string> = {
      'read': '读取',
      'write': '修改',
      'verify': '验证',
      'revoke': '撤销',
      'admin': '管理员'
    };
    return actionMap[action] || action;
  };

  // 获取状态标签
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'active': '活跃',
      'revoked': '已撤销',
      'expired': '已过期'
    };
    return statusMap[status] || status;
  };

  // 获取资源类型标签
  const getResourceTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      'credential': '凭证',
      'identity': '身份',
      'data': '数据'
    };
    return typeMap[type] || type;
  };

  // 获取资源名称
  const getResourceName = (permission: Permission): string => {
    return permission.metadata?.name || getResourceTypeLabel(permission.type);
  };
</script>

<style scoped>
  .modal-backdrop {
    backdrop-filter: blur(4px);
  }
</style>