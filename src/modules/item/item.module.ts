import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemRepositoryModule } from 'src/entities/item/item-repository.module';

@Module({
  imports: [ItemRepositoryModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
