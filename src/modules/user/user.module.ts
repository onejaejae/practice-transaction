import { Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ItemRepositoryModule } from 'src/entities/item/item-repository.module';

@Module({
  imports: [UserRepositoryModule, ItemRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
