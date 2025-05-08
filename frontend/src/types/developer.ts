/**
 * API文档类型
 */
export interface ApiDocument {
  title: string;
  version: string;
  description: string;
  servers: ApiServer[];
  paths: Record<string, any>;
  components: Record<string, any>;
}

/**
 * API服务器
 */
export interface ApiServer {
  url: string;
  description?: string;
}

/**
 * SDK信息
 */
export interface SdkInfo {
  id: string;
  name: string;
  language: string;
  description: string;
  versions: SdkVersion[];
  repositoryUrl?: string;
  documentationUrl?: string;
}

/**
 * SDK版本
 */
export interface SdkVersion {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  changelog?: string;
  isLatest: boolean;
}

/**
 * 示例项目
 */
export interface ExampleProject {
  id: string;
  name: string;
  description: string;
  language: string;
  tags: string[];
  repositoryUrl: string;
  demoUrl?: string;
  thumbnail?: string;
}

/**
 * API密钥
 */
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
}
