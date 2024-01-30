import { Global, Module } from '@nestjs/common';
import { ThingsConfigModule } from './config/config.module';

const modules = [ThingsConfigModule];

@Global()
@Module({
  imports: [...modules],
  providers: [],
  exports: [...modules],
})
export class CoreModule {}
