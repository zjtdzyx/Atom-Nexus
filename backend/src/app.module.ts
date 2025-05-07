import { Module } from '@nestjs/common';
import { DidModule } from './modules/did/did.module';
import { CredentialModule } from './modules/credential/credential.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [DidModule, CredentialModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {} 