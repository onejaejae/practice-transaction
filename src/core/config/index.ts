import { SessionOptions } from 'express-session';

export interface AppConfig {
  PORT: string | number;
  ENV: string;
  NAME: string;
  BASE_URL: string;
}

export interface DBConfig {
  DB_HOST: string;
  DB_USER_NAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_PORT: number | string;
}

export interface ServerConfig {
  SESSION: SessionOptions;
}

export interface Configurations {
  APP: AppConfig;
  DB: DBConfig;
  SERVER: ServerConfig;
}
