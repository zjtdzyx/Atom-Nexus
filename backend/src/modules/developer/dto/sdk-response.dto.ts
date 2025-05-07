import { ApiProperty } from '@nestjs/swagger';

export enum SdkPlatform {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  JAVA = 'java',
  PYTHON = 'python',
  GO = 'go',
  CSHARP = 'csharp',
}

export class SdkVersionInfo {
  @ApiProperty({
    description: 'SDK版本',
    example: '1.2.0',
  })
  version: string;

  @ApiProperty({
    description: '发布日期',
    example: '2023-07-15',
  })
  releaseDate: string;

  @ApiProperty({
    description: '版本说明',
    example: '增加了凭证验证功能，优化了DID解析性能',
  })
  releaseNotes: string;
}

export class SdkDownloadInfo {
  @ApiProperty({
    description: 'SDK名称',
    example: 'Atom Nexus SDK for JavaScript',
  })
  name: string;

  @ApiProperty({
    description: 'SDK平台',
    enum: SdkPlatform,
    example: SdkPlatform.JAVASCRIPT,
  })
  platform: SdkPlatform;

  @ApiProperty({
    description: '包管理器安装命令',
    example: 'npm install @atom-nexus/sdk',
  })
  packageInstallCommand: string;

  @ApiProperty({
    description: '下载URL',
    example: 'https://cdn.atom-nexus.com/sdk/javascript/atom-nexus-sdk-1.2.0.zip',
  })
  downloadUrl: string;

  @ApiProperty({
    description: '当前版本',
    type: SdkVersionInfo,
  })
  currentVersion: SdkVersionInfo;

  @ApiProperty({
    description: '历史版本',
    type: [SdkVersionInfo],
  })
  previousVersions: SdkVersionInfo[];

  @ApiProperty({
    description: '文档URL',
    example: 'https://docs.atom-nexus.com/sdk/javascript',
  })
  documentationUrl: string;

  @ApiProperty({
    description: '源码仓库',
    example: 'https://github.com/atom-nexus/sdk-javascript',
  })
  repositoryUrl: string;

  @ApiProperty({
    description: '示例代码',
    example: 'const client = new AtomNexusClient({ apiKey: "YOUR_API_KEY" });',
  })
  sampleCode: string;
}

export class SdkResponseDto {
  @ApiProperty({
    description: 'SDK下载信息列表',
    type: [SdkDownloadInfo],
  })
  sdks: SdkDownloadInfo[];

  @ApiProperty({
    description: 'SDK总数',
    example: 4,
  })
  total: number;

  @ApiProperty({
    description: 'SDK主页',
    example: 'https://atom-nexus.com/developers/sdk',
  })
  sdkHomepageUrl: string;

  @ApiProperty({
    description: '获取支持链接',
    example: 'https://atom-nexus.com/developers/support',
  })
  supportUrl: string;
}
