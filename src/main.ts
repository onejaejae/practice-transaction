import { NestFactory } from '@nestjs/core';
import { Modules } from './modules';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(Modules);
  await app.listen(3000);
}
bootstrap();
