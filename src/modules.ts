import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.service';

const applicationModules = [AuthModule];
@Module({
  imports: [CoreModule, ...applicationModules],
})
export class Modules {}
