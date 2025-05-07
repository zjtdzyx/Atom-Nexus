# IDVault 前端

## 简介

这是IDVault项目的前端部分，使用现代前端框架构建用户界面。

## 技术栈

- Next.js / Vue 3
- TailwindCSS
- TypeScript
- Ethers.js (区块链交互)

## 功能模块

- 用户身份管理界面
- 凭证展示与管理
- 身份验证流程
- 权限控制面板

## 开发指南

```bash
# 安装依赖
pnpm install

# 开发模式启动
pnpm dev

# 构建生产版本
pnpm build
```

## 目录结构

```
frontend/
├── public/         # 静态资源
├── src/            # 源代码
│   ├── components/ # UI组件
│   ├── pages/      # 页面
│   ├── hooks/      # 自定义钩子
│   ├── services/   # API服务
│   ├── utils/      # 工具函数
│   └── styles/     # 样式文件
└── tests/          # 测试文件
``` 