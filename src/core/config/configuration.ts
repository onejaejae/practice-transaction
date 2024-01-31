import { Configurations } from './index';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

export const configurations = (): Configurations => {
  const currentEnv = process.env.NODE_ENV;
  const PostgresqlStore = pgSession(session);
  const sessionStore = new PostgresqlStore({
    conString: process.env.CON_STRING,
  });

  return {
    APP: {
      PORT: process.env.PORT,
      ENV: currentEnv,
      NAME: process.env.NAME,
      BASE_URL: process.env.BASE_URL,
    },
    DB: {
      DB_HOST: process.env.DB_HOST,
      DB_USER_NAME: process.env.DB_USER_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
      DB_PORT: process.env.DB_PORT || 5432,
    },
    SERVER: {
      SESSION: {
        resave: false,
        saveUninitialized: false,
        proxy: true,
        rolling: true,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
          maxAge: parseInt(process.env.SESSION_EXPIRE || '86400000', 10),
          secure: 'auto',
        },
        store: sessionStore,
      },
    },
  };
};
