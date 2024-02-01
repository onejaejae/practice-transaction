import { ClassProvider, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserRepositoryKey } from './user-repository.interface';

export const userRepository: ClassProvider = {
  provide: UserRepositoryKey,
  useClass: UserRepository,
};

@Module({
  providers: [userRepository],
  exports: [userRepository],
})
export class UserRepositoryModule {}
