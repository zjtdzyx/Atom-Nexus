import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Express } from 'express';
import { StorageService } from './storage.service';
import { UploadFileResponseDto, FileDataDto, StorageIndexResponseDto, FileCategory } from './dto';

@ApiTags('去中心化存储')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({
    summary: '上传文件',
    description: '上传凭证或身份数据到IPFS或Ceramic，返回CID用于后续访问',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '要上传的文件',
        },
        category: {
          type: 'string',
          enum: Object.values(FileCategory),
          description: '文件分类',
        },
        description: {
          type: 'string',
          description: '文件描述（可选）',
        },
        uploaderDid: {
          type: 'string',
          description: '上传者DID（可选）',
        },
        metadata: {
          type: 'string',
          description: 'JSON格式的元数据（可选）',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '文件上传成功',
    type: UploadFileResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的请求参数或上传失败' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category?: string,
    @Body('description') description?: string,
    @Body('uploaderDid') uploaderDid?: string,
    @Body('metadata') metadataStr?: string
  ): Promise<UploadFileResponseDto> {
    // 解析和验证文件分类
    let fileCategory: FileCategory = FileCategory.OTHER;
    if (category && Object.values(FileCategory).includes(category as FileCategory)) {
      fileCategory = category as FileCategory;
    }

    // 解析元数据
    let metadata: Record<string, any> | undefined;
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (error) {
        throw new BadRequestException('无效的元数据JSON格式');
      }
    }

    return this.storageService.uploadFile(file, metadata, fileCategory, description, uploaderDid);
  }

  @Get(':cid')
  @ApiOperation({
    summary: '获取文件',
    description: '根据CID访问去中心化存储中的数据',
  })
  @ApiParam({
    name: 'cid',
    description: '内容标识符(CID)',
    example: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取文件数据',
    type: FileDataDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '未找到指定的文件' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '获取文件失败' })
  async getFileByCid(@Param('cid') cid: string): Promise<FileDataDto> {
    return this.storageService.getFileByCid(cid);
  }

  @Get('indexes')
  @ApiOperation({
    summary: '获取存储索引',
    description: '查询链下索引数据库记录，返回所有存储的索引记录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功获取存储索引数据',
    type: StorageIndexResponseDto,
  })
  async getStorageIndexes(): Promise<StorageIndexResponseDto> {
    return this.storageService.getStorageIndexes();
  }
}
