import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './tmp/uploads', // 上传临时目录
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
