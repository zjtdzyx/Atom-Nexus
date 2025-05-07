# IDVault SDK

## 简介

IDVault SDK 是开发者工具包，为第三方应用提供便捷的接口，轻松集成去中心化身份（DID）与可验证凭证（VC）功能。

## 主要功能

- **身份管理** - 创建、导入、恢复DID身份
- **凭证处理** - 签发、验证、存储、展示VC凭证
- **身份验证** - 简化第三方应用的用户身份验证流程
- **权限集成** - 支持细粒度的数据访问控制

## 技术栈

- TypeScript
- W3C DID/VC 标准实现
- 加密与签名库
- RESTful API 客户端

## 使用示例

```typescript
// 初始化SDK
import { IDVaultSDK } from '@idvault/sdk';

const sdk = new IDVaultSDK({
  apiKey: 'YOUR_API_KEY',
  environment: 'development'
});

// 创建用户身份
const identity = await sdk.identity.create({
  name: '张三',
  email: 'zhangsan@example.com'
});

// 签发凭证
const credential = await sdk.credential.issue({
  type: 'UniversityDegree',
  subject: identity.did,
  claims: {
    degree: '计算机科学学士',
    university: '某某大学'
  }
});

// 验证凭证
const verification = await sdk.credential.verify({
  credentialId: credential.id
});

// 展示凭证为可分享链接
const shareableLink = await sdk.credential.share({
  id: credential.id,
  expiresIn: '24h'
});
```

## 集成指南

### 安装

```bash
npm install @idvault/sdk
# 或
pnpm add @idvault/sdk
```

### 配置

```typescript
// 配置SDK
const sdk = new IDVaultSDK({
  apiKey: 'YOUR_API_KEY',
  environment: 'production', // 'production' 或 'development'
  options: {
    timeout: 5000,
    autoRefreshToken: true
  }
});
```

## API 文档

详细的API文档请参见：

- [身份管理 API](../docs/api-design.md#1-身份管理)
- [凭证管理 API](../docs/api-design.md#2-凭证管理)
- [验证请求 API](../docs/api-design.md#4-验证请求)

## 开发计划

SDK开发将按照项目总体路线图进行，预计在**阶段二**（2-4个月）完成基本功能并对外开放。 