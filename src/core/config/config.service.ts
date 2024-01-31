import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Configurations, DBConfig, ServerConfig } from '.';

@Injectable()
export class ThingsConfigService {
  constructor(private readonly configService: ConfigService<Configurations>) {}

  getAppConfig(): AppConfig {
    return this.configService.getOrThrow('APP');
  }

  getDBConfig(): DBConfig {
    return this.configService.getOrThrow('DB');
  }

  getServer(): ServerConfig {
    return this.configService.getOrThrow('SERVER');
  }
}
