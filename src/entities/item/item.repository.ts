import { EntityTarget } from 'typeorm';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Injectable } from '@nestjs/common';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { Item } from './item.entity';
import { IItemRepository } from './item-repository.interface';

@Injectable()
export class ItemRepository
  extends GenericTypeOrmRepository<Item>
  implements IItemRepository
{
  constructor(protected readonly txManager: TransactionManager) {
    super(Item);
  }

  getName(): EntityTarget<Item> {
    return Item.name;
  }
}
