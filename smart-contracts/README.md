# IDVault 智能合约

## 简介

这是IDVault项目的智能合约部分，用于在区块链上记录和验证数字身份凭证。

## 技术栈

- Solidity
- Hardhat / Truffle
- Ethers.js
- OpenZeppelin 合约库

## 核心功能

- 身份注册与验证
- 凭证存储与查询
- 权限管理
- 凭证撤销机制

## 开发指南

```bash
# 安装依赖
pnpm install

# 编译合约
pnpm compile

# 运行测试
pnpm test

# 部署合约（测试网）
pnpm deploy:testnet
```

## 合约架构

```
smart-contracts/
├── contracts/         # 智能合约代码
│   ├── Identity.sol   # 身份合约
│   ├── Credential.sol # 凭证合约
│   └── Registry.sol   # 注册表合约
├── scripts/           # 部署脚本
├── test/              # 测试代码
└── hardhat.config.js  # Hardhat配置
```

## 注意事项

- 本模块为可选部分，可根据项目实际需求决定是否实现
- 初期可考虑使用测试网或本地模拟网络进行开发
- 生产环境部署前需要进行安全审计 