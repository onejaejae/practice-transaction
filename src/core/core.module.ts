import { Global, Module } from '@nestjs/common';
import { ThingsConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';

const modules = [ThingsConfigModule];

@Global()
@Module({
  imports: [getTypeOrmModule(), ...modules],
  providers: [],
  exports: [...modules],
})
export class CoreModule {}
