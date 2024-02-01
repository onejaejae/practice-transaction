import {
  ClassProvider,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ThingsConfigModule } from './config/config.module';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';
import { TransactionManager } from './database/typeorm/transaction.manager';
import { TransactionMiddleware } from './middleware/transaction.middleware';
import { RedisModule } from './database/redis/redis.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeORMExceptionFilter } from './filter/typeorm.exception.filter';
import { ErrorInterceptor } from './interceptor/error.interceptor';

const modules = [ThingsConfigModule, RedisModule];
const providers = [TransactionManager];
const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
];
const filters: ClassProvider[] = [
  { provide: APP_FILTER, useClass: TypeORMExceptionFilter },
];

@Global()
@Module({
  imports: [getTypeOrmModule(), ...modules],
  providers: [...providers, ...interceptors, ...filters],
  exports: [...modules, ...providers],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
