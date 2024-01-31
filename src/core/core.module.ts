import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThingsConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';
import { TransactionManager } from './database/typeorm/transaction.manager';
import { TransactionMiddleware } from './middleware/transaction.middleware';

const modules = [ThingsConfigModule];
const providers = [TransactionManager];

@Global()
@Module({
  imports: [getTypeOrmModule(), ...modules],
  providers: [...providers],
  exports: [...modules],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
