import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
      },
      {
        path: 'identity',
        name: 'Identity',
        component: () => import('../pages/Identity.vue'),
      },
      {
        path: 'identities',
        name: 'IdentityList',
        component: () => import('../pages/identities/IdentityListPage.vue'),
        meta: {
          title: '身份管理',
          requiresAuth: true,
        },
      },
      {
        path: 'identities/:id',
        name: 'IdentityDetail',
        component: () => import('../pages/identities/IdentityDetailPage.vue'),
        meta: {
          title: '身份详情',
          requiresAuth: true,
        },
      },
      {
        path: 'credentials',
        name: 'Credentials',
        component: () => import('../pages/Credentials.vue'),
      },
      {
        path: 'credential/:id',
        name: 'CredentialDetail',
        component: () => import('../pages/CredentialDetail.vue'),
      },
      {
        path: 'permissions/set',
        name: 'PermissionSet',
        component: () => import('../pages/permissions/PermissionSetPage.vue'),
        meta: {
          title: '权限设置',
          requiresAuth: true,
        },
      },
      {
        path: 'permissions/audit',
        name: 'PermissionAudit',
        component: () => import('../pages/permissions/PermissionAuditPage.vue'),
        meta: {
          title: '权限审计',
          requiresAuth: true,
        },
      },
      {
        path: 'permissions/:did',
        name: 'DidPermission',
        component: () => import('../pages/permissions/DidPermissionPage.vue'),
        meta: {
          title: 'DID权限',
          requiresAuth: true,
        },
      },
      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import('../pages/Permissions.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../pages/Settings.vue'),
      },
      {
        path: 'apps',
        name: 'Apps',
        component: () => import('../pages/Apps.vue'),
      },
      // 用户模块路由配置
      {
        path: 'user/profile',
        name: 'UserProfile',
        component: () => import('../pages/user/ProfilePage.vue'),
        meta: {
          title: '用户资料',
          requiresAuth: true,
        },
      },
      {
        path: 'user/login',
        name: 'UserLogin',
        component: () => import('../pages/user/LoginPage.vue'),
        meta: {
          title: '用户登录',
          requiresAuth: false,
        },
      },
      // 存储模块路由配置
      {
        path: 'storage',
        name: 'StorageUpload',
        component: () => import('../pages/storage/UploadPage.vue'),
        meta: {
          title: '上传数据',
          requiresAuth: true,
        },
      },
      {
        path: 'storage/upload',
        redirect: '/storage',
      },
      {
        path: 'storage/view',
        name: 'StorageDataView',
        component: () => import('../pages/storage/DataViewPage.vue'),
        meta: {
          title: '数据访问',
          requiresAuth: true,
        },
      },
      {
        path: 'storage/:cid',
        name: 'StorageDataDetail',
        component: () => import('../pages/storage/DataViewPage.vue'),
        meta: {
          title: '数据详情',
          requiresAuth: true,
        },
      },
      {
        path: 'storage/indexes',
        name: 'StorageIndexes',
        component: () => import('../pages/storage/IndexesPage.vue'),
        meta: {
          title: '索引记录',
          requiresAuth: true,
        },
      },
      // 管理模块路由配置
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('../pages/admin/UserManagementPage.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: 'admin/credentials',
        name: 'AdminCredentials',
        component: () => import('../pages/admin/CredentialRecordsPage.vue'),
        meta: {
          title: '凭证记录',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: 'admin/permissions',
        name: 'AdminPermissions',
        component: () => import('../pages/admin/PermissionManagementPage.vue'),
        meta: {
          title: '权限管理',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: 'admin/stats',
        name: 'AdminStats',
        component: () => import('../pages/admin/SystemStatsPage.vue'),
        meta: {
          title: '系统统计',
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
  },
];

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
