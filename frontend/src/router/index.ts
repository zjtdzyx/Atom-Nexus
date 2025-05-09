import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { logger } from '@/utils/logger';

// -- AUTO-IMPORT ROUTES START --
// 这里会自动导入路由组件
// -- AUTO-IMPORT ROUTES END --

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      // -- AUTO-ROUTES START --
      {
        path: '',
        name: 'Home',
        component: () => import('../pages/home/index.vue'),
        meta: {
          title: '首页',
          requiresAuth: false,
        },
      },
      {
        path: 'identity',
        name: 'Identity',
        component: () => import('../pages/identity/index.vue'),
        meta: {
          title: '身份管理',
          requiresAuth: true,
        },
      },
      {
        path: 'identity/:id',
        name: 'IdentityDetail',
        component: () => import('../pages/identity/[id].vue'),
        meta: {
          title: '身份详情',
          requiresAuth: true,
        },
      },
      {
        path: 'identity/login-history',
        name: 'IdentityLoginHistory',
        component: () => import('../pages/identity/login-history/index.vue'),
        meta: {
          title: '登录历史',
          requiresAuth: true,
        },
      },
      {
        path: 'identity/profile',
        name: 'IdentityProfile',
        component: () => import('../pages/identity/profile/index.vue'),
        meta: {
          title: '身份资料',
          requiresAuth: true,
        },
      },
      {
        path: 'credential',
        name: 'Credential',
        component: () => import('../pages/credential/index.vue'),
        meta: {
          title: '凭证管理',
          requiresAuth: true,
        },
      },
      {
        path: 'credential/issue',
        name: 'CredentialIssue',
        component: () => import('../pages/credential/issue/index.vue'),
        meta: {
          title: '颁发凭证',
          requiresAuth: true,
        },
      },
      {
        path: 'credential/verify',
        name: 'CredentialVerify',
        component: () => import('../pages/credential/verify/index.vue'),
        meta: {
          title: '验证凭证',
          requiresAuth: true,
        },
      },
      {
        path: 'credential/:id',
        name: 'CredentialDetail',
        component: () => import('../pages/credential/[id].vue'),
        meta: {
          title: '凭证详情',
          requiresAuth: true,
        },
      },
      {
        path: 'developer',
        name: 'Developer',
        component: () => import('../pages/developer/index.vue'),
        meta: {
          title: '开发者工具',
          requiresAuth: true,
        },
      },
      {
        path: 'developer/sdk',
        name: 'DeveloperSdk',
        component: () => import('../pages/developer/sdk/index.vue'),
        meta: {
          title: '开发者SDK',
          requiresAuth: true,
        },
      },
      {
        path: 'developer/api',
        name: 'DeveloperApi',
        component: () => import('../pages/developer/api/index.vue'),
        meta: {
          title: 'API文档',
          requiresAuth: true,
        },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../pages/about/index.vue'),
        meta: {
          title: '关于我们',
          requiresAuth: false,
        },
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('../pages/account/index.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
        },
      },
      {
        path: 'account/settings',
        name: 'AccountSettings',
        component: () => import('../pages/account/settings/index.vue'),
        meta: {
          title: '账户设置',
          requiresAuth: true,
        },
      },
      {
        path: 'account/security',
        name: 'AccountSecurity',
        component: () => import('../pages/account/security/index.vue'),
        meta: {
          title: '账户安全',
          requiresAuth: true,
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../pages/settings/index.vue'),
        meta: {
          title: '设置中心',
          requiresAuth: true,
        },
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('../pages/permission/index.vue'),
        meta: {
          title: '权限管理',
          requiresAuth: true,
        },
      },
      {
        path: 'permission/set',
        name: 'PermissionSet',
        component: () => import('../pages/permission/set/index.vue'),
        meta: {
          title: '权限设置',
          requiresAuth: true,
        },
      },
      {
        path: 'permission/audit',
        name: 'PermissionAudit',
        component: () => import('../pages/permission/audit/index.vue'),
        meta: {
          title: '权限审计',
          requiresAuth: true,
        },
      },
      {
        path: 'identity/create',
        name: 'IdentityCreate',
        component: () => import('../pages/identity/create/index.vue'),
        meta: {
          title: '创建身份',
          requiresAuth: true,
        },
      },
      // -- AUTO-ROUTES END --
    ],
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../pages/auth/login.vue'),
        meta: {
          title: '用户登录',
          requiresAuth: false,
        },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../pages/auth/register.vue'),
        meta: {
          title: '用户注册',
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/NotFound.vue'),
  },
];

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 记录路由跳转日志
  logger.info('Router', `路由跳转: ${from.path} -> ${to.path}`, {
    from: from.path,
    to: to.path,
    name: to.name,
    params: to.params,
    query: to.query,
  });

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Atom Nexus`;
  } else {
    document.title = 'Atom Nexus';
  }

  // 继续导航
  next();
});

// 全局后置钩子
router.afterEach((to, _from) => {
  // 记录路由加载完成日志
  logger.info('Router', `路由加载完成: ${to.path}`, {
    duration: performance.now(), // 粗略估计加载时间
  });
});

// 路由错误处理
router.onError((error) => {
  logger.error('Router', '路由错误', { error: error.message });
});

export default router;
