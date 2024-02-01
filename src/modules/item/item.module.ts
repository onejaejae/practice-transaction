import { ClassProvider, Module } from '@nestjs/common';
import { ItemController } from './controller/item.controller';
import { ItemService } from './service/item.service';
import { ItemRepositoryModule } from 'src/entities/item/item-repository.module';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { ItemServiceKey } from './interface/item-service.interface';

const itemService: ClassProvider = {
  provide: ItemServiceKey,
  useClass: ItemService,
};
@Module({
  imports: [ItemRepositoryModule, UserRepositoryModule],
  controllers: [ItemController],
  providers: [itemService],
})
export class ItemModule {}
