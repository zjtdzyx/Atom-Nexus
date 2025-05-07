# IDVault - 去中心化数字身份管理系统 🎯

> 我的2025年毕业设计项目

## 📝 项目简介
IDVault 是一个面向个人和企业的去中心化数字身份管理系统，帮助用户在多平台中统一、安全地管理自己的数字身份凭证，避免隐私泄露与账号碎片化问题。系统致力于打造**简洁易用、标准合规、场景聚焦**的平台，实现凭证的**创建、签发、验证、管理**等全链路闭环，服务于高校学生和中小企业两大应用场景。

## 🚀 在线预览
⚠️ *开发中...*  
敬请期待部署在 Vercel / Railway 的在线版本！

## 💡 核心功能
- 用户身份注册 & 去中心化身份标识（DID）生成与管理
- 凭证（Credential）签发、验证、存储、分享与撤销
- 第三方平台接入 & 身份验证机制
- 精细化权限管理 & 隐私保护
- 开发者接口和SDK集成
- 系统管理后台

## 🛠️ 技术栈
| 层级       | 技术            |
|------------|----------------|
| 前端       | Vue 3 + TypeScript + Unocss |
| 后端       | Node.js + NestJS + PostgreSQL + Redis |
| DID/VC     | W3C DID/VC 标准实现 |
| 存储       | IPFS + Ceramic Network (可选) |
| 区块链     | 以太坊/Polygon (轻量化集成) |
| 部署       | Vercel + Railway + GitHub Actions |

## 📂 项目结构
- `frontend/` 前端代码
- `backend/` 后端API服务
- `smart-contracts/` 智能合约模块（可选）
- `sdk/` 开发者工具包
- `docs/` 文档资料和调研报告

## 🏁 快速开始

```bash
# 克隆仓库
git clone https://github.com/zjtdzyx/idvault-graduation-project.git

# 进入前端或后端目录分别安装依赖
cd frontend && pnpm install
cd backend && pnpm install
```

## ✅ 已完成

- 项目立项书撰写
- 市场调研文档整理
- 系统架构设计
- 项目初始化与仓库设置

## 📅 开发路线图

### 阶段一：基础闭环 MVP（1-2个月）
- DID 创建与管理功能
- VC 凭证签发、查看、验证闭环
- 简单的凭证分享（二维码/链接）
- 用户控制面板（前端界面）
- 后端 API 完整可用

### 阶段二：权限与场景增强（2-4个月）
- 凭证撤销、失效控制
- 精细化权限管理
- 支持大学生场景与中小企业场景
- 管理后台上线
- 开发者接口（API/SDK）开放

### 阶段三：生态拓展与优化（4-6个月）
- 去中心化存储集成
- 区块链轻集成
- 高校/企业试点合作
- 隐私保护升级
- 开源版本发布

## 📚 文档

- [立项书](docs/proposal.md)
- [市场调研](docs/market-research.md)
- [API设计](docs/api-design.md)
- [系统设计](docs/system-design.md)

## ✨ 开发计划

请查看 [GitHub Project看板](https://github.com/zjtdzyx/idvault-graduation-project/projects/1)

## 🤝 许可协议

MIT License 