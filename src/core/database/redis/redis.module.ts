import { ClassProvider, FactoryProvider, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisDLM } from './redis.dml';
import { RedisDLMKey } from './redis-dml.interface';

const redisConnect: FactoryProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = new Redis({
      port: 6379,
      host: '127.0.0.1',
    });
    return client;
  },
};

const redisDLM: ClassProvider = {
  provide: RedisDLMKey,
  useClass: RedisDLM,
};

@Module({
  providers: [redisConnect, redisDLM],
  exports: [redisDLM],
})
export class RedisModule {}
