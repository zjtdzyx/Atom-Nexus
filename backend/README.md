# Atom Nexus 后端服务

## 简介

这是Atom Nexus项目的后端API服务，负责处理身份管理和凭证验证的核心逻辑，实现去中心化身份标准，并提供完整的身份生命周期管理。

## 技术栈

- Node.js
- NestJS (后端框架)
- TypeScript
- PostgreSQL (主数据库)
- Redis (缓存与会话管理)
- JSON Web Token (JWT)
- W3C DID/VC 标准实现
- Docker (容器化部署)
- WebCrypto API (加密操作)

## 核心功能

- **用户身份管理**
  - DID 创建、解析与管理
  - 多种DID方法支持 (did:key, did:web, did:ethr等)
  - 身份恢复机制

- **凭证管理**
  - 凭证签发与验证
  - 凭证模板管理
  - 凭证撤销与状态检查
  - 链下/链上双模式存储

- **权限控制**
  - 细粒度权限管理
  - 数据访问控制
  - 授权日志与审计

- **开发者接口**
  - RESTful API
  - WebHooks
  - SDK后端支持
  - 集成示例

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

# 数据库迁移
pnpm migrate:dev
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
│   ├── app.module.ts       # 主模块
│   ├── main.ts             # 应用入口
│   ├── config/             # 配置文件
│   ├── modules/            # 功能模块
│   │   ├── identity/       # 身份模块
│   │   ├── credential/     # 凭证模块
│   │   ├── verification/   # 验证模块
│   │   ├── permission/     # 权限模块
│   │   ├── storage/        # 存储模块
│   │   └── admin/          # 管理后台模块
│   ├── shared/             # 共享功能
│   │   ├── dto/            # 数据传输对象
│   │   ├── entities/       # 数据实体
│   │   ├── interfaces/     # 接口定义
│   │   └── utils/          # 工具函数
│   ├── crypto/             # 加密工具
│   └── blockchain/         # 区块链集成(可选)
├── prisma/                 # 数据库模型
│   ├── schema.prisma       # Prisma模型定义
│   └── migrations/         # 数据库迁移
├── test/                   # 测试文件
├── docker/                 # Docker配置
├── nest-cli.json           # NestJS配置
└── tsconfig.json           # TypeScript配置
```

## 数据模型

主要数据实体包括：

- **Identity** - 用户DID与基本信息
- **Credential** - 可验证凭证数据
- **CredentialTemplate** - 凭证模板定义
- **VerificationRequest** - 验证请求记录
- **Permission** - 权限配置
- **AccessLog** - 访问记录

## 开发计划

后端开发将按照项目总体路线图进行，优先实现核心身份与凭证功能，再逐步完善权限管理和开发者接口。 