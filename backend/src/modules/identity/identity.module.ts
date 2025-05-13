import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { Identity } from './entities/identity.entity';
import { IdentityProfile } from './entities/identity-profile.entity';
import { LoginHistory } from './entities/login-history.entity';
import { DidModule } from '../did/did.module';

@Module({
  imports: [TypeOrmModule.forFeature([Identity, IdentityProfile, LoginHistory]), DidModule],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
