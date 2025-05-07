# Atom Nexus - 去中心化数字身份管理系统 🎯

> 我的2025年毕业设计项目

<div align="center">
  <img src="./Atom Nexus Logo.png" alt="Atom Nexus Logo" width="200" />
  <p><i>"Your Identity. Your Network. Decentralized."</i></p>
  <p><b>「身份自持，网络自由。」</b></p>
</div>

## 📝 项目简介
Atom Nexus 是一个面向个人和企业的去中心化数字身份管理系统，帮助用户在多平台中统一、安全地管理自己的数字身份凭证，避免隐私泄露与账号碎片化问题。系统致力于打造**简洁易用、标准合规、场景聚焦**的平台，实现凭证的**创建、签发、验证、管理**等全链路闭环，服务于高校学生和中小企业两大应用场景。

## 🚀 在线预览
⚠️ *开发中...*  
敬请期待部署在 Vercel / Railway 的在线版本！

## 💡 核心功能

### 用户身份模块
- DID 创建与管理，支持多种方法（基于钱包、邮箱、社交登录等）
- 身份认证和恢复机制
- 用户数据本地加密存储

### 凭证管理模块
- VC 凭证的签发、存储、查看、分享、撤销
- 凭证的真实性验证和有效期管理
- 支持大学生场景（学历、竞赛、实习凭证）和中小企业场景（员工ID、权限凭证）

### 身份验证模块
- 对接第三方系统，实现凭证真实性验证
- 支持一次性验证、长期授权等模式
- 验证流程的安全审计记录

### 权限控制模块
- 用户对凭证共享、授权、访问进行精细控制
- 权限审计与访问日志记录
- 图形化权限控制界面

### 开发者接口模块
- 提供 API 和 SDK，方便第三方集成
- 开发者文档与示例代码
- API密钥管理

### 系统管理后台
- 管理员对用户、凭证、权限、统计数据进行管理
- 系统监控与统计分析
- 凭证模板管理

## 🛠️ 技术栈详解

### DID/VC协议
- W3C DID 标准，支持 did:key、did:web、did:ethr 等方法
- W3C Verifiable Credentials 标准
- 密钥管理与加密技术

### 前端技术
- Vue 3 + TypeScript：响应式界面和类型安全
- Unocss：高效CSS框架，减少冗余样式
- WebCrypto API：本地加密存储

### 后端技术
- Node.js + NestJS：模块化后端框架
- TypeORM + PostgreSQL：数据存储与查询
- Redis：缓存与会话管理

### 去中心化技术
- IPFS + Ceramic：去中心化数据存储，支持数据更新
- 以太坊/Polygon：轻量化区块链集成，用于存证
- 零知识证明技术（ZK-Proofs）：隐私保护机制

### 部署与运维
- Vercel/Netlify：前端应用部署
- Docker + Kubernetes：后端服务容器化
- GitHub Actions：CI/CD自动化

## 📂 项目结构
- `frontend/` 前端代码
- `backend/` 后端API服务
- `smart-contracts/` 智能合约模块（可选）
- `sdk/` 开发者工具包
- `docs/` 文档资料和调研报告

## 🏁 快速开始

```bash
# 克隆仓库
git clone https://github.com/zjtdzyx/atom-nexus.git

# 进入项目根目录并安装依赖
pnpm install

# 启动前端开发服务器
cd frontend && pnpm dev

# 启动后端服务
cd backend && pnpm start:dev
```

## ✅ 已完成

- 项目立项书撰写
- 市场调研文档整理
- 系统架构设计
- 项目初始化与仓库设置
- 系统功能模块与API接口设计

## 📅 开发路线图

### 阶段一：基础闭环 MVP（1-2个月）
- DID 创建与管理功能
- VC 凭证签发、查看、验证闭环
- 简单的凭证分享（二维码/链接）
- 用户控制面板（前端界面）
- 后端 API 完整可用

### 阶段二：权限与场景增强（2-4个月）
- 凭证撤销、失效控制
- 精细化权限管理（谁可以验证、多久有效）
- 支持大学生场景（学历、竞赛、实习凭证模板）
- 支持中小企业场景（员工ID、权限凭证模板）
- 管理后台上线
- 开发者接口（API/SDK）开放

### 阶段三：生态拓展与优化（4-6个月）
- 去中心化存储（Ceramic/IPFS）集成
- 区块链轻集成（凭证锚定、不可篡改性提升）
- 高校/企业试点合作
- 隐私保护升级（ZK-Proof、Selective Disclosure）
- 开源版本发布
- 教育市场推广活动

## 📊 系统架构

```
+------------------+        +-------------------+        +---------------------+
|  用户层（前端）  | <----> |  后端服务层（API）  | <----> | 去中心化基础设施层    |
|  (Vue 3 + TS +   |        | (Node.js + NestJS)  |        | (DID, VC, Blockchain) |
|   Unocss)        |        |                   |        |                     |
+------------------+        +-------------------+        +---------------------+
```

## 🔍 API接口设计

系统提供完整的RESTful API，主要包括：

- 用户身份接口：`/api/did/*` - 注册、查询、恢复DID
- 凭证管理接口：`/api/vc/*` - 签发、查看、撤销、分享凭证
- 验证接口：`/api/vc/verify` - 验证凭证真实性
- 权限接口：`/api/permissions/*` - 设置、查询凭证权限
- 开发者接口：`/api/dev/*` - 获取API Key、SDK文档
- 管理后台接口：`/api/admin/*` - 用户管理、统计数据等

详细API文档请参考[系统设计文档](docs/system-design.md)。

## 📚 文档

- [立项书](docs/proposal.md)
- [市场调研](docs/market-research.md)
- [系统设计](docs/system-design.md)

## ✨ 开发计划

请查看 [GitHub Project看板](https://github.com/zjtdzyx/atom-nexus/projects/1)

## 🤝 许可协议

MIT License 