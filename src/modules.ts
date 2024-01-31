import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { ItemModule } from './modules/item/item.module';
import { UserModule } from './modules/user/user.module';

const applicationModules = [AuthModule, ItemModule, UserModule];
@Module({
  imports: [CoreModule, ...applicationModules],
})
export class Modules {}
