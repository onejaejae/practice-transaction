import { Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [UserRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
