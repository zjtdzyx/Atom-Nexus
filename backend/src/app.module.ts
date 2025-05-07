import { Module } from '@nestjs/common';
import { DidModule } from './modules/did/did.module';

@Module({
  imports: [DidModule],
  controllers: [],
  providers: [],
})
export class AppModule {} 