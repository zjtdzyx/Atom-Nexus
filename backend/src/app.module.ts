import { Module } from '@nestjs/common';
import { DidModule } from './modules/did/did.module';
import { CredentialModule } from './modules/credential/credential.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { AdminModule } from './modules/admin/admin.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    DidModule,
    CredentialModule,
    AuthModule,
    PermissionModule,
    DeveloperModule,
    AdminModule,
    StorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
