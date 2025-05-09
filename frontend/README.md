# Atom Nexus 前端项目

这是 Atom Nexus 去中心化数字身份管理系统的前端项目，基于 Vue 3 + TypeScript + UnoCSS 构建。

## 项目结构

```
frontend/
├── public/            # 静态资源
├── src/               # 源代码
│   ├── assets/        # 图片、字体等资源
│   ├── components/    # 可复用组件
│   │   ├── identity/  # 身份模块组件
│   │   ├── credential/# 凭证模块组件
│   │   ├── permission/# 权限模块组件
│   │   ├── common/    # 通用组件
│   │   └── layout/    # 布局组件
│   ├── pages/         # 页面组件
│   │   ├── home/      # 首页
│   │   ├── identity/  # 身份管理页面
│   │   ├── credential/# 凭证管理页面
│   │   ├── permission/# 权限管理页面
│   │   └── error/     # 错误页面
│   ├── router/        # 路由配置
│   ├── services/      # API 服务
│   ├── stores/        # 状态管理
│   ├── styles/        # 全局样式
│   ├── types/         # 类型定义
│   └── utils/         # 工具函数
├── index.html         # 入口 HTML
├── vite.config.ts     # Vite 配置
├── uno.config.ts      # UnoCSS 配置
└── package.json       # 依赖和脚本
```

## 已实现的模块

### 1. 身份管理模块

- 身份列表展示与管理
- 身份创建界面与流程
- 身份详情页面
- 支持多种DID方法（did:key、did:ethr、did:web、did:email）
- 身份状态管理（激活、停用、设为默认）

### 2. 凭证管理模块

- 凭证列表展示与管理
- 凭证筛选功能（按类型、状态、日期等）
- 凭证详情页面
- 凭证分享与验证功能

### 3. 权限管理模块

- 权限列表展示与管理
- 权限创建界面
- 权限修改与撤销功能
- 支持不同资源类型（凭证、身份、数据）的权限控制

### 4. 通用功能

- 响应式布局，适配多种设备
- 深色主题设计
- 完整的日志记录系统
- 错误处理与提示
- 加载状态管理

## 设计规范

本项目使用 UnoCSS 进行样式管理，主要设计特点包括：

- **色彩系统**：以深太空蓝为基色，搭配霓虹青绿和紫罗兰色作为强调色
- **排版**：使用 Inter 和 Satoshi 字体，清晰易读
- **组件风格**：采用卡片式设计，圆角和微妙的阴影效果
- **动效**：简洁的过渡动画，提升用户体验

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码规范检查

```bash
pnpm lint
```

## 模块开发规范

### 新增页面

1. 在 `src/pages/<模块名>/` 下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如需添加新 API，在 `src/services/<模块名>.ts` 中定义

### 新增状态

1. 在 `src/stores/<模块名>.ts` 中定义状态管理
2. 使用 Pinia 的 `defineStore` 创建 store
3. 实现必要的 actions 和 getters

### 日志记录

请确保在关键操作中使用 `logger` 记录日志：

```typescript
import { logger } from '@/utils/logger';

// 信息日志
logger.info('Component:Example', '组件已加载');

// 错误日志
logger.error('API:Example', '请求失败', { error });
```

## 技术栈

- **框架**：Vue 3
- **语言**：TypeScript
- **构建工具**：Vite
- **CSS 框架**：UnoCSS
- **状态管理**：Pinia
- **路由**：Vue Router
- **HTTP 客户端**：Axios
- **图标**：Carbon Icons（通过 UnoCSS 图标预设）

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