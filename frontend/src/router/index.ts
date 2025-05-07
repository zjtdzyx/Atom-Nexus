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
