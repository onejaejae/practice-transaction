import { FactoryProvider, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisDLM } from './redis.dml';

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

@Module({
  providers: [redisConnect, RedisDLM],
  exports: [RedisDLM],
})
export class RedisModule {}
