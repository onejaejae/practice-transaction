import { NestFactory } from '@nestjs/core';
import { Modules } from './modules';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setNestApp } from './setNestApp';
import { ThingsConfigService } from './core/config/config.service';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(Modules);

  const configService = app.get(ThingsConfigService);
  const appConfig = configService.getAppConfig();
  const serverConfig = configService.getServer();

  app.use(cookieParser());
  app.use(session(serverConfig.SESSION));

  setNestApp(app);

  await app.listen(appConfig.PORT);
  Logger.log(`🧐 [THINGS-API][${appConfig.ENV}] Started at: ${Date.now()}`);
  Logger.log(`🚀 Server open at ${appConfig.BASE_URL}:${appConfig.PORT}`);
}
bootstrap();
