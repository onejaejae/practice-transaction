import { User } from 'src/entities/user/user.entity';

type ValueType = string | number | boolean;

export type Union<
  T extends { [key: string]: ValueType } | ReadonlyArray<ValueType>,
> = T extends ReadonlyArray<ValueType>
  ? T[number]
  : T extends { [key: string]: infer U }
  ? U
  : never;

declare module 'express-session' {
  interface SessionData {
    credentials: { user: User };
  }
}
