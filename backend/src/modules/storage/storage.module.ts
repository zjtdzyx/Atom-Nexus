import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { StorageFile } from './entities/storage-file.entity';
import { StorageIndex } from './entities/storage-index.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFile, StorageIndex]),
    MulterModule.register({
      dest: './tmp/uploads', // 上传临时目录
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
