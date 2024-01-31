import { Global, Module } from '@nestjs/common';
import { ThingsConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';
import { TransactionManager } from './database/typeorm/transaction.manager';

const modules = [ThingsConfigModule];
const providers = [TransactionManager];

@Global()
@Module({
  imports: [getTypeOrmModule(), ...modules],
  providers: [...providers],
  exports: [...modules],
})
export class CoreModule {}
