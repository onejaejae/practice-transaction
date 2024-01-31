import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { ItemModule } from './modules/item/item.module';

const applicationModules = [AuthModule, ItemModule];
@Module({
  imports: [CoreModule, ...applicationModules],
})
export class Modules {}
