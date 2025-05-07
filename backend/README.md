# IDVault 后端服务

## 简介

这是IDVault项目的后端API服务，负责处理身份管理和凭证验证的核心逻辑。

## 技术栈

- NestJS / Express
- TypeScript
- PostgreSQL
- JSON Web Token (JWT)
- DID (去中心化身份) 协议实现

## 核心功能

- 用户身份管理
- 凭证签发与验证
- 权限控制
- 区块链交互层

## 开发指南

```bash
# 安装依赖
pnpm install

# 开发模式启动
pnpm start:dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test
```

## API 文档

开发完成后，可通过以下方式访问API文档：

```
http://localhost:3000/api/docs
```

## 目录结构

```
backend/
├── src/
│   ├── controllers/  # API控制器
│   ├── services/     # 业务逻辑
│   ├── models/       # 数据模型
│   ├── utils/        # 工具函数
│   └── config/       # 配置文件
├── prisma/           # 数据库模型 (如使用Prisma)
└── tests/            # 测试文件
``` 