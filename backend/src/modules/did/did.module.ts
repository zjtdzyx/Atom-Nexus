import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DidService } from './did.service';
import { DidController } from './did.controller';
import { Did } from './entities/did.entity';
import { DidDocument } from './entities/did-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Did, DidDocument])],
  controllers: [DidController],
  providers: [DidService],
  exports: [DidService],
})
export class DidModule {}
