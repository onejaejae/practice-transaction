import { INestApplication } from '@nestjs/common';

export function setNestApp<T extends INestApplication>(app: T): void {}
