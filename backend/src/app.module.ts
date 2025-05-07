import { Module } from '@nestjs/common';
import { DidModule } from './modules/did/did.module';
import { CredentialModule } from './modules/credential/credential.module';

@Module({
  imports: [DidModule, CredentialModule],
  controllers: [],
  providers: [],
})
export class AppModule {} 