import { ClassProvider, Module } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { ItemRepositoryKey } from './item-repository.interface';

export const itemRepository: ClassProvider = {
  provide: ItemRepositoryKey,
  useClass: ItemRepository,
};

@Module({
  providers: [itemRepository],
  exports: [itemRepository],
})
export class ItemRepositoryModule {}
