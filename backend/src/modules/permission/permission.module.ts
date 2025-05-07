import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { PermissionAuditLog } from './entities/permission-audit-log.entity';
import { DidModule } from '../did/did.module';
import { CredentialModule } from '../credential/credential.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, PermissionAuditLog]),
    DidModule,
    CredentialModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
