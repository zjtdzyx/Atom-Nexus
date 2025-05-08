# Atom Nexus 前端

## 简介

这是Atom Nexus项目的前端部分，使用现代前端框架构建用户友好的界面，实现去中心化身份与凭证的管理。

## 技术栈

- Vue 3
- TypeScript
- UnoCSS (原子化CSS框架)
- Pinia (状态管理)
- Vue Router
- Vite (构建工具)
- Vitest (测试框架)
- Axios (HTTP客户端)

## 功能模块

- **用户身份管理**
  - DID创建、恢复与管理界面
  - 用户档案设置
  - 身份验证流程

- **凭证管理**
  - 凭证列表与详情展示
  - 凭证申请与签发
  - 凭证分享（二维码/链接生成）
  - 凭证验证

- **权限控制**
  - 图形化权限设置界面
  - 访问控制管理
  - 授权历史查看

- **应用集成**
  - 第三方应用连接
  - 单点登录管理
  - API密钥管理

## 开发指南

```bash
# 开发模式启动
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test
```

## 目录结构

```
frontend/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 资源文件
│   ├── components/      # 通用组件
│   │   ├── common/      # 基础UI组件
│   │   ├── identity/    # 身份相关组件
│   │   ├── credential/  # 凭证相关组件
│   │   └── permission/  # 权限相关组件
│   ├── composables/     # 组合式API
│   ├── layouts/         # 布局组件
│   ├── pages/           # 页面组件
│   ├── router/          # 路由配置
│   ├── services/        # API服务
│   ├── stores/          # 状态管理
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   └── App.vue          # 根组件
├── tests/               # 测试文件
├── .eslintrc.js         # ESLint配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
└── package.json         # 项目配置
```

## 设计风格

- 简洁现代的UI设计
- 响应式布局，支持移动端和桌面端
- 遵循Material Design和Flat Design原则
- 统一的色彩系统，主色调为蓝色和绿色

## 页面路由

- `/` - 首页/仪表盘
- `/identity` - 身份管理
- `/credentials` - 凭证管理
- `/credential/:id` - 凭证详情
- `/permissions` - 权限管理
- `/settings` - 用户设置
- `/apps` - 应用管理

## 开发计划

前端开发将按照总体路线图进行，重点关注用户体验和易用性，降低去中心化身份管理的使用门槛。 