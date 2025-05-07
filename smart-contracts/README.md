# IDVault 智能合约

## 简介

这是IDVault项目的智能合约部分，使用轻量化集成模式，仅用于凭证的锚定、验证和状态管理，而非存储完整的凭证数据。

## 技术栈

- Solidity
- Hardhat (开发框架)
- Ethers.js (JavaScript客户端)
- OpenZeppelin 合约库
- Polygon/以太坊测试网

## 核心功能

- **凭证锚定**：将凭证哈希锚定在链上以确保不可篡改性
- **凭证状态**：管理凭证的有效性状态（有效、撤销、过期）
- **身份注册**：可选的链上DID注册（如使用ERC-1056）
- **权限验证**：验证操作权限

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
├── contracts/                # 合约代码
│   ├── registry/             # 注册表合约
│   │   └── CredentialRegistry.sol   # 凭证注册表
│   ├── interfaces/           # 接口定义
│   └── utils/                # 工具合约
├── scripts/                  # 部署脚本
│   └── deploy.ts             # 部署脚本
├── test/                     # 测试代码
├── tasks/                    # Hardhat任务
├── hardhat.config.ts         # Hardhat配置
└── .openzeppelin/            # OpenZeppelin配置
```

## 轻量化设计原则

本项目采用"区块链轻集成"思路，遵循以下原则：

1. **数据与逻辑分离**：完整凭证数据存储在链下，链上仅存储验证所需信息
2. **最小化上链数据**：仅将凭证哈希、状态等关键数据上链
3. **经济性优先**：优化Gas消耗，降低用户使用成本
4. **多链兼容**：设计支持多链部署，包括测试网、Layer 2等

## 实现细节

### CredentialRegistry 合约

核心合约，实现凭证的锚定和状态管理：

```solidity
// 简化示例
function registerCredential(
    bytes32 credentialHash,
    address issuer,
    address subject,
    uint256 validUntil
) external returns (uint256 credentialId);

function revokeCredential(uint256 credentialId) external;

function verifyCredential(
    uint256 credentialId,
    bytes32 credentialHash
) external view returns (bool isValid, address issuer, uint256 validUntil);
```

## 注意事项

- 本模块为系统的可选部分，项目的核心功能不依赖区块链也能实现
- 初期推荐使用测试网或本地网络进行开发
- 生产环境部署前需要进行安全审计
- 将在项目**阶段三**完成与主系统的完整集成 