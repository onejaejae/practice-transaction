import { ClassProvider, Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { ItemRepositoryModule } from 'src/entities/item/item-repository.module';
import { UserServiceKey } from './interface/user-service.interface';

const userService: ClassProvider = {
  provide: UserServiceKey,
  useClass: UserService,
};
@Module({
  imports: [UserRepositoryModule, ItemRepositoryModule],
  controllers: [UserController],
  providers: [userService],
})
export class UserModule {}
