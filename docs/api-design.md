# IDVault API 设计文档

## API 概述

IDVault API 提供了一套完整的接口，用于管理去中心化身份（DID）和可验证凭证（VC）。这些API支持身份注册、凭证签发、验证和权限管理等核心功能。

## 基础信息

- **基础URL**: `https://api.idvault.example.com/v1`
- **认证方式**: JSON Web Token (JWT)
- **响应格式**: JSON
- **版本控制**: URL路径版本

## API 端点

### 1. 身份管理

#### 1.1 创建身份

- **URL**: `/identities`
- **方法**: `POST`
- **描述**: 创建新的去中心化身份（DID）
- **请求体**:
  ```json
  {
    "name": "张三",
    "avatarUrl": "https://example.com/avatar.jpg",
    "didMethod": "ethr" // 可选，默认为"ethr"
  }
  ```
- **响应**:
  ```json
  {
    "id": "12345",
    "did": "did:ethr:0x1234567890abcdef",
    "name": "张三",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2023-04-01T12:00:00Z"
  }
  ```

#### 1.2 获取身份详情

- **URL**: `/identities/{id}`
- **方法**: `GET`
- **描述**: 获取特定身份的详细信息
- **响应**:
  ```json
  {
    "id": "12345",
    "did": "did:ethr:0x1234567890abcdef",
    "name": "张三",
    "avatarUrl": "https://example.com/avatar.jpg",
    "credentials": [
      {
        "id": "credential-1",
        "type": "UniversityDegree",
        "issuer": "did:ethr:0xabcdef1234567890",
        "issuanceDate": "2023-03-01T10:00:00Z"
      }
    ],
    "createdAt": "2023-04-01T12:00:00Z"
  }
  ```

#### 1.3 更新身份

- **URL**: `/identities/{id}`
- **方法**: `PUT`
- **描述**: 更新身份信息
- **请求体**:
  ```json
  {
    "name": "李四",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
  ```
- **响应**:
  ```json
  {
    "id": "12345",
    "did": "did:ethr:0x1234567890abcdef",
    "name": "李四",
    "avatarUrl": "https://example.com/new-avatar.jpg",
    "updatedAt": "2023-04-02T09:30:00Z"
  }
  ```

### 2. 凭证管理

#### 2.1 签发凭证

- **URL**: `/credentials`
- **方法**: `POST`
- **描述**: 签发新的可验证凭证
- **请求体**:
  ```json
  {
    "type": "UniversityDegree",
    "subject": "did:ethr:0x1234567890abcdef",
    "claims": {
      "degree": "计算机科学学士",
      "graduationDate": "2024-06-30",
      "university": "某某大学"
    },
    "expirationDate": "2034-06-30T23:59:59Z"
  }
  ```
- **响应**:
  ```json
  {
    "id": "credential-1",
    "type": "UniversityDegree",
    "issuer": "did:ethr:0xabcdef1234567890",
    "subject": "did:ethr:0x1234567890abcdef",
    "claims": {
      "degree": "计算机科学学士",
      "graduationDate": "2024-06-30",
      "university": "某某大学"
    },
    "issuanceDate": "2023-04-01T14:30:00Z",
    "expirationDate": "2034-06-30T23:59:59Z",
    "proof": {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2023-04-01T14:30:00Z",
      "verificationMethod": "did:ethr:0xabcdef1234567890#keys-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFUzI1NksifQ.eyJpc3MiO..."
    }
  }
  ```

#### 2.2 验证凭证

- **URL**: `/credentials/verify`
- **方法**: `POST`
- **描述**: 验证凭证的有效性
- **请求体**:
  ```json
  {
    "credentialId": "credential-1"
  }
  ```
- **响应**:
  ```json
  {
    "valid": true,
    "checks": {
      "signature": true,
      "expiration": true,
      "revocation": true
    }
  }
  ```

#### 2.3 获取凭证列表

- **URL**: `/credentials`
- **方法**: `GET`
- **描述**: 获取当前用户的所有凭证
- **查询参数**:
  - `type` (可选): 按凭证类型筛选
  - `issuer` (可选): 按发行者筛选
- **响应**:
  ```json
  {
    "credentials": [
      {
        "id": "credential-1",
        "type": "UniversityDegree",
        "issuer": "did:ethr:0xabcdef1234567890",
        "issuanceDate": "2023-04-01T14:30:00Z"
      },
      {
        "id": "credential-2",
        "type": "EmployeeID",
        "issuer": "did:ethr:0x0987654321fedcba",
        "issuanceDate": "2023-03-15T09:00:00Z"
      }
    ],
    "total": 2
  }
  ```

#### 2.4 撤销凭证

- **URL**: `/credentials/{id}/revoke`
- **方法**: `POST`
- **描述**: 撤销已签发的凭证
- **请求体**:
  ```json
  {
    "reason": "信息过期"
  }
  ```
- **响应**:
  ```json
  {
    "id": "credential-1",
    "status": "revoked",
    "revocationDate": "2023-04-10T11:20:00Z",
    "reason": "信息过期"
  }
  ```

### 3. 权限管理

#### 3.1 设置访问权限

- **URL**: `/permissions`
- **方法**: `POST`
- **描述**: 为特定身份或凭证设置访问权限
- **请求体**:
  ```json
  {
    "resourceType": "credential",
    "resourceId": "credential-1",
    "granteeId": "did:ethr:0x5678901234abcdef",
    "permissions": ["read", "verify"],
    "expiresAt": "2023-05-01T00:00:00Z"
  }
  ```
- **响应**:
  ```json
  {
    "id": "permission-1",
    "resourceType": "credential",
    "resourceId": "credential-1",
    "granteeId": "did:ethr:0x5678901234abcdef",
    "permissions": ["read", "verify"],
    "createdAt": "2023-04-01T15:45:00Z",
    "expiresAt": "2023-05-01T00:00:00Z"
  }
  ```

#### 3.2 查询权限

- **URL**: `/permissions`
- **方法**: `GET`
- **描述**: 查询当前用户的权限设置
- **查询参数**:
  - `resourceType` (可选): 资源类型
  - `resourceId` (可选): 资源ID
- **响应**:
  ```json
  {
    "permissions": [
      {
        "id": "permission-1",
        "resourceType": "credential",
        "resourceId": "credential-1",
        "granteeId": "did:ethr:0x5678901234abcdef",
        "permissions": ["read", "verify"],
        "expiresAt": "2023-05-01T00:00:00Z"
      }
    ],
    "total": 1
  }
  ```

### 4. 验证请求

#### 4.1 创建验证请求

- **URL**: `/verifications`
- **方法**: `POST`
- **描述**: 创建验证身份或凭证的请求
- **请求体**:
  ```json
  {
    "type": "credential",
    "credentialType": "UniversityDegree",
    "subjectId": "did:ethr:0x1234567890abcdef",
    "requiredClaims": ["degree", "university"],
    "callbackUrl": "https://verifier.example.com/callbacks/verify",
    "expiresIn": 3600 // 秒
  }
  ```
- **响应**:
  ```json
  {
    "id": "verification-1",
    "url": "https://idvault.example.com/verify/abcdef123456",
    "qrCode": "data:image/png;base64,iVBORw0KGgoA...",
    "expiresAt": "2023-04-01T16:45:00Z"
  }
  ```

#### 4.2 验证结果查询

- **URL**: `/verifications/{id}`
- **方法**: `GET`
- **描述**: 查询验证请求的状态和结果
- **响应**:
  ```json
  {
    "id": "verification-1",
    "status": "completed", // pending, completed, expired, rejected
    "result": {
      "verified": true,
      "claims": {
        "degree": "计算机科学学士",
        "university": "某某大学"
      }
    },
    "completedAt": "2023-04-01T16:30:00Z"
  }
  ```

## 错误处理

所有API错误都将返回适当的HTTP状态码和JSON格式的错误详情：

```json
{
  "error": {
    "code": "invalid_credential",
    "message": "凭证验证失败",
    "details": "签名无效"
  }
}
```

## 常见HTTP状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 认证失败
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `409 Conflict`: 资源冲突
- `422 Unprocessable Entity`: 请求格式正确但语义错误
- `500 Internal Server Error`: 服务器内部错误

## SDK示例

```javascript
// 创建身份
const identity = await idvault.identities.create({
  name: "张三",
  avatarUrl: "https://example.com/avatar.jpg"
});

// 签发凭证
const credential = await idvault.credentials.issue({
  type: "UniversityDegree",
  subject: identity.did,
  claims: {
    degree: "计算机科学学士",
    university: "某某大学"
  }
});

// 验证凭证
const verification = await idvault.credentials.verify({
  credentialId: credential.id
});
``` 