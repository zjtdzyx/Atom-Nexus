import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { Credential } from './entities/credential.entity';
import { CredentialProof } from './entities/credential-proof.entity';
import { CredentialShare } from './entities/credential-share.entity';
import { DidModule } from '../did/did.module';

@Module({
  imports: [TypeOrmModule.forFeature([Credential, CredentialProof, CredentialShare]), DidModule],
  controllers: [CredentialController],
  providers: [CredentialService],
  exports: [CredentialService],
})
export class CredentialModule {}
