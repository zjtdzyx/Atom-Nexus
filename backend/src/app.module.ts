import { Module } from '@nestjs/common';
import { DidModule } from './modules/did/did.module';
import { CredentialModule } from './modules/credential/credential.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    DidModule,
    CredentialModule,
    AuthModule,
    PermissionModule,
    DeveloperModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
