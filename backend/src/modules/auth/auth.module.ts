import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CredentialModule } from '../credential/credential.module';
import { AuthLog } from './entities/auth-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthLog]), CredentialModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
