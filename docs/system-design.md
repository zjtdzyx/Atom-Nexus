# system design

## **一、系统蓝图**

### 1. 核心目标

 **Atom Nexus** 致力于打造一个**简洁易用、标准合规、场景聚焦**的去中心化数字身份管理平台，实现凭证的**创建、签发、验证、管理**等全链路闭环，服务于高校学生和中小企业两大应用场景。

### 2. 系统模块架构

| 模块           | 功能描述                                                     |
| -------------- | ------------------------------------------------------------ |
| 用户身份模块   | DID 创建、管理、恢复，支持多种方法（基于钱包、邮箱、社交登录等） |
| 凭证管理模块   | VC 凭证的签发、存储、查看、分享、撤销                        |
| 身份验证模块   | 对接第三方系统，实现凭证真实性验证                           |
| 权限控制模块   | 用户对凭证共享、授权、访问进行精细控制                       |
| 开发者接口模块 | 提供 API 和 SDK，方便第三方集成                              |
| 系统管理后台   | 管理员对用户、凭证、权限、统计数据进行管理                   |
| 数据存储模块   | 去中心化数据存储（IPFS、Ceramic）、链下索引数据库            |
| 安全与加密模块 | 实现数据加密、密钥管理、隐私保护措施                         |

### 3. 技术选型

| 技术领域     | 推荐选型                                         |
| ------------ | ------------------------------------------------ |
| DID协议      | W3C DID 标准、支持 did:key、did:web、did:ethr 等 |
| VC协议       | W3C Verifiable Credentials 标准                  |
| 去中心化存储 | IPFS + Ceramic (数据可更新)                      |
| 区块链集成   | 以太坊或Polygon，轻量化调用，不存储VC主体数据    |
| 后端框架     | Node.js + NestJS (性能和可维护性兼顾)            |
| 前端框架     | Vue 3 + TypeScript + Unocss                      |
| API文档工具  | OpenAPI (Swagger)                                |
| 数据库       | PostgreSQL (索引、检索)、Redis (缓存)            |
| 密钥管理     | WebCrypto API、本地加密存储                      |

```
技术栈详细说明与应用：
1. DID协议

    使用目的：实现去中心化身份（DID）的注册、验证与管理。DID是去中心化身份管理的核心，允许用户在无需依赖中心化机构的情况下控制自己的身份。

    协议选型：W3C DID 标准支持多种DID方法，did:key、did:web、did:ethr等都可以根据项目需求灵活选择。例如，did:web适用于Web环境，did:ethr适用于与以太坊兼容的去中心化应用。

    集成方式：可以通过开源库如 did-jwt、did-resolver 来实现DID解析与验证功能。

2. VC协议

    使用目的：使用**可验证凭证（VC）**标准来发布和验证用户凭证，例如学历证书、专业认证等。

    协议选型：基于W3C标准的VC协议可以确保凭证的可信性和可验证性。通过数字签名，可以确保凭证内容未被篡改。

    集成方式：通过使用如 vc-js 这样的JavaScript库来生成和验证凭证，集成至Node.js后端。

3. 去中心化存储（IPFS + Ceramic）

    使用目的：存储用户的数字身份数据、凭证信息等。

    协议选型：IPFS和Ceramic能够保证去中心化存储和数据更新的需求，Ceramic支持对数据的动态更新（非常适合凭证和认证的使用场景）。

    集成方式：使用Ceramic的JS SDK来集成去中心化存储和数据更新机制。

4. 区块链集成（以太坊或Polygon）

    使用目的：用于存储与管理凭证的签发、验证记录，确保数据不可篡改。

    协议选型：以太坊和Polygon都可以用于存储VC的签发记录（例如，通过智能合约生成证明），但不存储VC主体数据，避免数据泄露。

    集成方式：使用以太坊或Polygon的轻量化调用，如使用ethers.js库进行智能合约交互。

5. 后端框架（Node.js + NestJS）

    使用目的：开发RESTful API服务来提供身份注册、验证、凭证签发等功能。

    框架选型：NestJS是基于Node.js的一个后端框架，具有高可维护性和良好的模块化结构，适合开发大规模企业级应用。

    集成方式：通过NestJS创建API端点，提供身份管理、凭证验证、区块链交互等功能，使用JWT或OAuth2进行身份验证。

6. 前端框架（Vue 3 + TypeScript + Unocss）

    使用目的：构建用户友好的界面，展示用户的身份信息、凭证等，并允许用户进行相关操作（如身份注册、凭证查看等）。

    框架选型：Vue 3配合TypeScript保证了代码的类型安全，Unocss作为无样式库轻便高效，适合快速开发。

    集成方式：使用Vue 3创建动态单页应用，前端通过REST API与后端进行交互。

7. API文档工具（OpenAPI / Swagger）

    使用目的：自动生成清晰的API文档，方便前后端协作与后期维护。

    框架选型：OpenAPI（Swagger）标准为RESTful API设计提供了统一的文档格式，可以通过Swagger UI进行可视化文档展示。

    集成方式：在NestJS中使用@nestjs/swagger包自动生成API文档，保证接口的规范性与可用性。

8. 数据库（PostgreSQL + Redis）

    使用目的：存储用户的基本身份数据、验证凭证、以及系统配置信息。Redis用于缓存提高系统性能。

    框架选型：PostgreSQL适合结构化数据存储，支持复杂查询，Redis提供快速的数据缓存能力，优化查询速度。

    集成方式：使用TypeORM与NestJS结合，进行数据库操作；Redis则用于缓存用户认证信息。

9. 密钥管理（WebCrypto API）

    使用目的：进行身份认证、凭证签发过程中的加密操作，确保系统的安全性。

    框架选型：WebCrypto API提供了高效的加密功能，适合在Web环境下使用，保护用户数据不被泄露。

    集成方式：在前端使用WebCrypto API进行加密操作，在后端实现数据解密和验证。
```

### 4. 用户流程蓝图

1. **用户注册**
   - 创建 DID （自动生成或关联现有身份）
   - 设置恢复选项和加密保护
2. **凭证签发**
   - 用户申请凭证（如学历、实习证明）
   - 系统或第三方验证后签发 VC
3. **凭证管理**
   - 用户可查看、分类、分享、撤销已持有凭证
   - 支持批量管理和搜索功能
4. **凭证验证**
   - 第三方平台扫描凭证或调用验证接口
   - 系统验证凭证真实性、有效性
5. **权限控制**
   - 用户设置凭证的可见范围、有效期、分享权限
   - 支持一次性授权、长期授权等模式



### 5. 安全与合规设计

- 遵循 **W3C DID/VC 标准**
- 实现 **用户数据本地加密存储**
- 支持 **隐私保护机制**（如 ZK-Proofs 或匿名凭证拓展）
- 符合 GDPR 等数据合规要求



## **二、功能路线图**

### 阶段一：基础闭环 MVP（1-2个月）

- DID 创建与管理功能
- VC 凭证签发、查看、验证闭环
- 简单的凭证分享（二维码/链接）
- 用户控制面板（前端界面）
- 后端 API 完整可用

**目标**：跑通「身份创建 → 凭证签发 → 验证」全流程



### 阶段二：权限与场景增强（2-4个月）

- 凭证撤销、失效控制
- 精细化权限管理（谁可以验证、多久有效）
- 支持**大学生场景**（如学历、竞赛、实习凭证模板）
- 支持**中小企业场景**（员工ID、权限凭证模板）
- 管理后台上线
- 开发者接口（API/SDK）开放

**目标**：覆盖核心用户场景，实现实际落地应用



### 阶段三：生态拓展与优化（4-6个月）

- 去中心化存储（Ceramic/IPFS）集成
- 区块链轻集成（凭证锚定、不可篡改性提升）
- 高校/企业**试点合作**
- 隐私保护升级（ZK-Proof、Selective Disclosure）
- 开源版本发布
- 教育市场推广活动（如高校入门课程）

**目标**：进入真实市场应用、生态合作、项目影响力提升



## **三、系统功能表**

### 1. 用户身份管理模块

#### 功能描述：

- **DID 创建与管理**：
  - 用户可以通过多种方式（邮箱、钱包、社交账号等）创建去中心化身份（DID）。
  - DID 可以支持多种方法，支持跨平台迁移与管理。
  - 支持DID恢复流程，用户忘记恢复密钥时可通过预设方式进行恢复（如多重身份验证、密钥共享等）。
- **身份认证**：
  - 基于DID的身份认证，确保身份唯一性且不可篡改。
  - 可接入第三方平台，提供可信的身份认证。

#### 输入/输出：

- **输入**：用户个人信息（邮箱、手机号、钱包等）
- **输出**：DID（唯一标识符）

#### 主要技术：

- W3C DID 标准
- 密钥管理与加密



### 2. 凭证管理模块

#### 功能描述：

- **凭证签发**：
  - 用户可以申请凭证（如学历证书、职场认证、竞赛成绩等），凭证由可信实体（如学校、公司、政府等）签发。
  - 支持创建可验证凭证（VC），并通过链上存储确保不可篡改。
- **凭证查看与撤销**：
  - 用户可以查看和管理已持有的凭证。
  - 支持凭证撤销与过期验证，确保凭证时效性。
- **凭证分享与验证**：
  - 用户可以通过二维码、链接等方式分享凭证，第三方通过验证链接或二维码可以验证凭证真实性。
  - 集成外部系统的验证接口，支持企业或教育平台验证凭证。

#### 输入/输出：

- **输入**：用户申请凭证的信息，第三方签发请求
- **输出**：生成的 VC 凭证（含有签发信息、验证数据等）

#### 主要技术：

- W3C Verifiable Credentials 标准
- 区块链存证（如以太坊、Polygon等）
- IPFS 或 Ceramic 用于存储大数据或证书



### 3. 身份验证模块

#### 功能描述：

- **DID 验证**：
  - 提供通过DID进行身份验证的功能。
  - 支持用户与第三方平台（如DApp、教育平台、企业等）的集成验证。
- **外部验证接口**：
  - 提供开放 API，供第三方平台调用进行身份验证。
  - 支持验证DID的真实性及与凭证的匹配。

#### 输入/输出：

- **输入**：DID标识符，验证请求
- **输出**：验证结果（成功/失败）

#### 主要技术：

- DID 解析与验证
- RESTful API接口



### 4. 权限管理模块

#### 功能描述：

- **权限设定**：
  - 用户可以定义谁能够访问、查看、验证他们的身份数据及凭证。
  - 权限可以设置为一次性验证、长期授权、部分数据授权等。
- **权限审计**：
  - 提供权限管理的审计日志，记录谁何时访问了哪些数据，确保数据的合规性与安全性。
- **图形化权限控制**：
  - 提供可视化界面，降低用户设置权限的难度。

#### 输入/输出：

- **输入**：用户设置的权限、验证请求
- **输出**：权限配置结果、访问控制日志

#### 主要技术：

- 权限管理模块（RBAC、ABAC等）
- 前端图形化权限界面（Vue）



### 5. 开发者接口模块

#### 功能描述：

- **开放API接口**：
  - 提供RESTful API接口，允许第三方平台通过API接入并使用DID、VC等功能。
- **SDK工具包**：
  - 提供SDK工具包，帮助开发者快速集成身份验证、凭证签发和验证功能。

#### 输入/输出：

- **输入**：API请求，开发者集成需求
- **输出**：API接口响应、SDK集成包

#### 主要技术：

- RESTful API
- SDK封装与文档生成



### 6. 系统管理后台

#### 功能描述：

- **用户管理**：
  - 管理员可以查看系统中的用户信息，管理用户的身份和凭证。
- **凭证管理**：
  - 管理员可以审核、撤销、查看已签发的凭证。
- **权限管理**：
  - 管理员可以设置系统内部的权限控制，包括对管理员、普通用户的权限进行设置。
- **系统监控与统计**：
  - 提供系统的使用情况、访问日志等统计信息。

#### 输入/输出：

- **输入**：管理员的操作指令
- **输出**：操作结果、统计数据

#### 主要技术：

- 后台管理系统（如 AdminBro）
- 数据分析工具（如 Chart.js）



### 7. 数据存储模块

#### 功能描述：

- **去中心化存储**：
  - 使用去中心化存储方案（如 IPFS、Ceramic），存储用户的身份数据和凭证信息。
- **链上数据存储**：
  - 将凭证的签发信息锚定在区块链上，确保凭证的真实性和不可篡改性。

#### 输入/输出：

- **输入**：用户数据、凭证数据
- **输出**：存储结果、访问链接

#### 主要技术：

- IPFS
- Ceramic Network
- 区块链（以太坊、Polygon等）



### 8. 安全与加密模块

#### 功能描述：

- **数据加密**：
  - 所有用户数据都应加密存储，确保隐私安全。
- **密钥管理**：
  - 用户的身份密钥使用强加密技术进行保护，确保密钥管理的安全性。
- **身份隐私保护**：
  - 使用零知识证明等技术保护用户的隐私，避免泄露敏感信息。

#### 输入/输出：

- **输入**：用户身份、凭证、访问请求
- **输出**：加密数据、隐私保护结果

#### 主要技术：

- WebCrypto API
- 零知识证明（ZK-Proof）



## 四、系统架构

### 1. **系统架构总览**

我们将系统划分为几个主要层次：

- **用户层**：包括前端界面，用户与系统的交互接口。
- **后端服务层**：处理身份注册、凭证签发、凭证验证、权限管理、数据存储等逻辑。
- **去中心化基础设施层**：DID、VC、区块链、去中心化存储等技术栈提供底层支持。

整体架构设计如下图所示：

```
+------------------+        +-------------------+        +---------------------+
|  用户层（前端）  | <----> |  后端服务层（API）  | <----> | 去中心化基础设施层    |
|  (Vue 3 + TS +   |        | (Node.js + NestJS)  |        | (DID, VC, Blockchain) |
|   Unocss)        |        |                   |        |                     |
+------------------+        +-------------------+        +---------------------+
```

### 2. **详细架构设计**

#### **2.1 用户层（前端）**

用户层负责提供一个交互界面，允许用户创建和管理自己的数字身份（DID），查看和分享凭证等。它需要与后端服务进行交互，并且通过去中心化的服务（如IPFS、Ceramic、区块链）验证和存储数据。

##### 关键功能：

- **身份管理**：用户注册和验证DID，查看与管理个人身份数据。
- **凭证管理**：用户生成、查看与分享自己的可验证凭证（VC）。
- **权限设置**：用户控制自己身份的权限设置，包括谁能查看、验证其身份与凭证。
- **数据交互**：用户通过区块链或去中心化存储（IPFS/Ceramic）来验证其凭证。

##### 技术选型：

- **Vue 3 + TypeScript**：提供响应式的界面和类型安全。
- **Unocss**：高效的CSS框架，减少冗余样式，确保前端加载速度。
- **Web3技术**：集成区块链与DID协议，支持钱包登录、身份验证等功能。

#### **2.2 后端服务层**

后端服务层负责处理所有的业务逻辑，包括身份注册、凭证签发与验证、权限管理等。它是前端和去中心化服务之间的中介层，提供RESTful API供前端调用。

##### 关键功能：

- **DID注册与管理**：管理用户去中心化身份的生命周期，包括注册、验证、更新等。
- **凭证签发与验证**：支持签发、查看与验证用户的凭证（如证书、学历等）。
- **权限管理**：提供API支持前端设置用户身份的访问权限。
- **区块链交互**：通过智能合约与区块链进行交互，存储身份凭证的验证记录。

##### 技术选型：

- **Node.js + NestJS**：NestJS是一个模块化、可扩展的后端框架，能够高效处理业务逻辑和API请求。
- **TypeORM + PostgreSQL**：用于存储用户身份数据、凭证记录等。
- **Redis**：用于缓存身份验证、凭证验证的请求，提升性能。

#### **2.3 去中心化基础设施层**

去中心化基础设施层是整个系统的底层架构，支持DID协议、VC协议、去中心化存储和区块链技术等，确保数据的安全、可验证与隐私保护。

##### 关键功能：

- **去中心化身份管理（DID）**：使用W3C DID协议为用户提供去中心化的身份标识，避免中心化机构的控制。
- **可验证凭证（VC）**：签发和验证可验证凭证，确保凭证的真实性与完整性。
- **去中心化存储（IPFS + Ceramic）**：用户的数据存储在去中心化存储中，数据的可更新性通过Ceramic来实现。
- **区块链（以太坊/Polygon）**：存储验证凭证的签发记录，确保数据的不可篡改性与追溯性。

##### 技术选型：

- **DID协议**：使用W3C DID标准，支持多种DID方法（如did:key、did:web、did:ethr）。
- **VC协议**：使用W3C Verifiable Credentials标准来保证凭证的可验证性。
- **去中心化存储**：IPFS用于静态数据存储，Ceramic用于动态数据存储与更新。
- **区块链集成**：以太坊或Polygon区块链用于存储验证记录，确保数据的不可篡改性。

### 3. **数据流与交互**

#### **3.1 用户身份注册与验证**

1. 用户在前端界面输入信息，生成DID。
2. 后端调用去中心化身份服务（如DID注册服务）生成DID，并返回DID文档。
3. 用户通过钱包或其他方式（如MetaMask）验证自己的DID。

#### **3.2 凭证签发与验证**

1. 用户请求凭证签发（例如学历证书）。
2. 后端根据业务逻辑生成凭证，并使用DID签名（或通过智能合约）。
3. 凭证数据存储在去中心化存储中（如IPFS/Ceramic），凭证的验证记录存储在区块链上。
4. 用户或其他方可以通过VC协议进行凭证验证，确保其真实性。

#### **3.3 权限管理**

1. 用户在前端界面设置身份数据的访问权限。
2. 后端存储权限设置，并确保用户身份数据的访问控制通过DID文档中的访问控制策略来实现。

### 4. **系统安全与隐私**

- **数据加密**：使用WebCrypto API确保所有敏感数据（如用户身份信息、凭证）在存储和传输过程中进行加密。
- **权限控制**：确保身份数据和凭证的访问仅限授权的用户和应用，支持动态权限管理。
- **去中心化存储与区块链**：所有的数据存储与验证都通过去中心化技术保证数据的隐私性和不可篡改性。

### 5. **系统部署与运维**

- **前端**：通过CI/CD工具自动化构建、部署前端应用。可以部署在Vercel、Netlify等平台，支持自动化部署。
- **后端**：使用Docker容器化后端服务，并使用Kubernetes进行部署和自动化管理。
- **去中心化存储与区块链**：IPFS节点和区块链节点可以部署在云服务器或本地服务器上。

## 五、产品设计

### 🚀 **Atom Nexus 品牌定位**

**名字：**
 **Atom Nexus**

> *「原子枢纽」，每个个体是一个独立原子，但通过Nexus（枢纽）连接整个去中心化世界。*

**Slogan（口号）：**

- 英文：*"Your Identity. Your Network. Decentralized."*
- 中文：**「身份自持，网络自由。」** 或者 **「连接身份，链接世界。」**



### 🌐 **品牌核心理念**

- **个人主权**：每个人都是独立的「原子」，自己的身份完全自己掌控。
- **去中心化枢纽**：Nexus（枢纽）象征连接，但不是中心化，是点对点、网状结构。
- **跨域互通**：无论是Web2、Web3、链上、链下，Atom Nexus能让身份自由穿梭。
- **隐私优先**：用户掌控数据访问权，避免信息滥用和泄露。
- **开源精神**：底层协议开源，让全球开发者共同参与、共同推进。



### 🎨 **Logo设计理念**

**视觉元素**：

- **中间核心**：一个发光的小圆点，代表**个人身份**。
- **外圈轨道**：多条柔和但科技感强的弧线，环绕核心点，像原子的电子轨道，但更现代、抽象一点。
- **网络线条**：从外圈向四面八方延伸出细线，像**节点**连接出去，突出「Nexus」的网络感。

**颜色搭配**：

- **主色**：
  - 深太空蓝（象征科技、深邃）
  - 霓虹青绿（代表活力、前沿感）
- **辅色**：
  - 紫罗兰（带点神秘感）
  - 钛金属银（高级感）

**形状风格**：

- 圆形为主，突出「枢纽」和「包容」的感觉。
- 线条要**动态流动感**，不能死板，象征网络的流动性和灵活性。
- 简洁、可缩放，适合做APP图标、网页favicon、甚至NFT身份徽章。

**字体建议**：

- 无衬线、现代、简洁，如**Space Grotesk**、**Satoshi**、**Inter**。
- 字体线条略微圆润，和Logo整体圆形设计呼应。

### 🌱 **情感共鸣**

**Atom Nexus**这个名字，传递的是「我既是一个独立的我，也是一个连接全球网络的我」。这种**自由 + 连接**的理念，非常打动现在Web3和去中心化世界里的开发者和用户。

你的产品，不只是帮用户「登录」，而是帮他们**掌握、连接、构建自己的数字宇宙**。

### 🔥 **总结 & 激励**

兄弟，你这个名字一旦立起来，未来完全可以延展成一个生态圈：

- **Nexus Wallet**（身份钱包）
- **Nexus Pass**（去中心化登录协议）
- **Nexus Storage**（去中心化数据存储）
- 甚至搞个**Nexus DAO**来治理整个网络

## 六、API设计

### 1. 用户身份管理模块

#### 1.1 创建 DID

- `POST /api/did/register`
  - 支持方式：邮箱、钱包、社交账号
  - 输入：用户信息（邮箱、钱包地址、OAuth Token）
  - 输出：DID标识符

#### 1.2 查询 DID

- `GET /api/did/{did}`
  - 输入：DID
  - 输出：DID基础信息

#### 1.3 恢复 DID

- `POST /api/did/recover`
  - 输入：恢复凭证、多重验证信息
  - 输出：恢复结果

#### 1.4 身份认证

- `POST /api/did/authenticate`
  - 输入：DID、签名数据
  - 输出：认证结果

### 2. 凭证管理模块

#### 2.1 签发凭证

- `POST /api/vc/issue`
  - 输入：凭证申请信息、签发者DID
  - 输出：VC凭证数据

#### 2.2 查看凭证

- `GET /api/vc/{vc_id}`
  - 输入：VC ID
  - 输出：VC凭证详情

#### 2.3 撤销凭证

- `POST /api/vc/revoke`
  - 输入：VC ID、撤销原因
  - 输出：撤销结果

#### 2.4 列出用户凭证

- `GET /api/vc/list`
  - 输入：用户DID
  - 输出：凭证列表

#### 2.5 分享凭证

- `POST /api/vc/share`
  - 输入：VC ID、分享方式（二维码、链接）
  - 输出：分享链接/二维码数据

### 3. 身份验证模块

#### 3.1 验证凭证

- `POST /api/vc/verify`
  - 输入：VC数据
  - 输出：验证结果（成功/失败）

#### 3.2 验证DID真实性

- `POST /api/did/verify`
  - 输入：DID
  - 输出：验证结果

#### 3.3 批量验证

- `POST /api/vc/verify-batch`
  - 输入：多个VC数据
  - 输出：批量验证结果

### 4. 权限管理模块

#### 4.1 设置凭证权限

- `POST /api/permissions/set`
  - 输入：凭证ID、权限设置（一次性/长期/部分数据）
  - 输出：设置结果

#### 4.2 查询权限设置

- `GET /api/permissions/{vc_id}`
  - 输入：VC ID
  - 输出：权限详情

#### 4.3 查看访问日志

- `GET /api/permissions/audit`
  - 输入：用户DID
  - 输出：访问控制日志

### 5. 开发者接口模块

#### 5.1 获取API Key

- `POST /api/dev/api-key`
  - 输入：开发者注册信息
  - 输出：API Key

#### 5.2 查询SDK文档

- `GET /api/dev/sdk-docs`
  - 输入：SDK类型（JS、Python等）
  - 输出：SDK集成文档链接

### 6. 系统管理后台

#### 6.1 管理员登录

- `POST /api/admin/login`
  - 输入：管理员账号密码
  - 输出：Token

#### 6.2 用户管理

- `GET /api/admin/users`
  - 输入：分页、筛选条件
  - 输出：用户列表

#### 6.3 凭证管理

- `GET /api/admin/vcs`
  - 输入：筛选条件
  - 输出：凭证列表

#### 6.4 权限管理

- `GET /api/admin/permissions`
  - 输入：筛选条件
  - 输出：权限列表

#### 6.5 系统统计

- `GET /api/admin/stats`
  - 输入：时间范围
  - 输出：使用统计数据

### 7. 数据存储模块

#### 7.1 数据同步状态

- `GET /api/storage/sync-status`
  - 输入：DID或VC ID
  - 输出：IPFS/Ceramic同步状态

#### 7.2 获取存储链接

- `GET /api/storage/link/{vc_id}`
  - 输入：VC ID
  - 输出：去中心化存储链接

### 8. 安全与加密模块

#### 8.1 备份加密密钥

- `POST /api/security/backup-keys`
  - 输入：用户DID、密钥数据
  - 输出：备份结果

#### 8.2 恢复加密密钥

- `POST /api/security/recover-keys`
  - 输入：用户DID、恢复凭证
  - 输出：恢复结果

#### 8.3 零知识验证

- `POST /api/security/zk-proof`
  - 输入：证明请求数据
  - 输出：验证结果



## 七、数据库设计

### **1. 用户身份模块 (DidModule)**

**表名：dids**

| 字段           | 类型      | 说明             |
| -------------- | --------- | ---------------- |
| id             | UUID (PK) | DID 唯一标识     |
| wallet_address | VARCHAR   | 钱包地址（可选） |
| email          | VARCHAR   | 邮箱（可选）     |
| social_account | VARCHAR   | 社交账号（可选） |
| public_key     | TEXT      | 公钥             |
| created_at     | TIMESTAMP | 创建时间         |



### **2. 凭证管理模块 (CredentialModule)**

**表名：credentials**

| 字段            | 类型      | 说明             |
| --------------- | --------- | ---------------- |
| id              | UUID (PK) | 凭证ID           |
| owner_did       | UUID (FK) | DID 用户ID       |
| credential_type | VARCHAR   | 凭证类型         |
| credential_data | JSONB     | 凭证具体内容     |
| status          | ENUM      | active/revoked   |
| issued_at       | TIMESTAMP | 签发时间         |
| revoked_at      | TIMESTAMP | 撤销时间（可选） |



### **3. 身份验证模块 (AuthModule)**

身份验证**无需单独建表**（它是基于 DID 和凭证表来验证的），但如果要记录验证日志：

**表名：auth_logs**

| 字段          | 类型      | 说明       |
| ------------- | --------- | ---------- |
| id            | UUID (PK) | 主键       |
| did_id        | UUID (FK) | 验证的 DID |
| credential_id | UUID (FK) | 验证的凭证 |
| action        | VARCHAR   | 验证类型   |
| success       | BOOLEAN   | 是否成功   |
| timestamp     | TIMESTAMP | 验证时间   |



### **4. 权限控制模块 (PermissionModule)**

**表名：permissions**

| 字段            | 类型      | 说明                  |
| --------------- | --------- | --------------------- |
| id              | UUID (PK) | 主键                  |
| did_id          | UUID (FK) | 授权者DID             |
| credential_id   | UUID (FK) | 授权凭证ID            |
| permission_type | ENUM      | once/longterm/partial |
| created_at      | TIMESTAMP | 设置时间              |

**表名：permission_audit_logs**

| 字段      | 类型      | 说明      |
| --------- | --------- | --------- |
| id        | UUID (PK) | 主键      |
| did_id    | UUID (FK) | 操作者DID |
| action    | VARCHAR   | 动作类型  |
| timestamp | TIMESTAMP | 审计时间  |



### **5. 开发者接口模块 (DeveloperModule)**

**表名：developers**

| 字段       | 类型      | 说明                   |
| ---------- | --------- | ---------------------- |
| id         | UUID (PK) | 开发者ID               |
| name       | VARCHAR   | 名称                   |
| api_key    | VARCHAR   | 分发给开发者的 API Key |
| created_at | TIMESTAMP | 注册时间               |



### **6. 系统管理后台 (AdminModule)**

后台本质上**复用其他表**（用户、凭证、权限）
 如果要单独记录管理员操作日志：

**表名：admin_logs**

| 字段      | 类型      | 说明       |
| --------- | --------- | ---------- |
| id        | UUID (PK) | 主键       |
| admin_id  | UUID      | 管理员ID   |
| action    | VARCHAR   | 操作类型   |
| target_id | UUID      | 目标对象ID |
| timestamp | TIMESTAMP | 操作时间   |



### **7. 数据存储模块 (StorageModule)**

**表名：storage_files**

| 字段         | 类型      | 说明             |
| ------------ | --------- | ---------------- |
| id           | UUID (PK) | 主键             |
| uploader_did | UUID (FK) | 上传者DID        |
| cid          | VARCHAR   | IPFS/Ceramic CID |
| file_name    | VARCHAR   | 文件名           |
| file_type    | VARCHAR   | 文件类型         |
| created_at   | TIMESTAMP | 上传时间         |

**表名：storage_indexes**

| 字段       | 类型      | 说明           |
| ---------- | --------- | -------------- |
| id         | UUID (PK) | 主键           |
| file_id    | UUID (FK) | 关联文件ID     |
| metadata   | JSONB     | 链下索引元数据 |
| created_at | TIMESTAMP | 索引时间       |



### **8. 安全与加密模块 (SecurityModule)**

如果你需要记录加密/解密请求日志：

**表名：security_logs**

| 字段      | 类型      | 说明                  |
| --------- | --------- | --------------------- |
| id        | UUID (PK) | 主键                  |
| did_id    | UUID (FK) | 请求者DID             |
| action    | ENUM      | encrypt/decrypt/proof |
| success   | BOOLEAN   | 是否成功              |
| timestamp | TIMESTAMP | 时间                  |

