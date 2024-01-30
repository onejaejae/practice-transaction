import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule as OrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ThingsConfigModule } from 'src/core/config/config.module';
import { ThingsConfigService } from 'src/core/config/config.service';

const entityPath = path.join(__dirname + './../../../entities/*/*.entity.js');
export class TypeOrmModule {
  static forRoot(): DynamicModule {
    return OrmModule.forRootAsync({
      imports: [ThingsConfigModule],
      inject: [ThingsConfigService],
      useFactory: async (configService: ThingsConfigService) => {
        const dbConfig = configService.getDBConfig();

        return {
          type: 'postgres',
          // host: dbConfig.DB_HOST,
          port: Number(dbConfig.DB_PORT),
          database: dbConfig.DB_DATABASE,
          username: dbConfig.DB_USER_NAME,
          password: dbConfig.DB_PASSWORD,
          synchronize: true,
          entities: [entityPath],
          logging: true,
          namingStrategy: new SnakeNamingStrategy(),
          extra: {
            max: 10,
          },
        };
      },
    });
  }
}

export const getTypeOrmModule = (): DynamicModule => {
  return TypeOrmModule.forRoot();
};
