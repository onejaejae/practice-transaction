import { GenericRepository } from 'src/core/database/generic/generic.repository';
import { Item } from './item.entity';

export const ItemRepositoryKey = 'ItemRepositoryKey';

export interface IItemRepository extends GenericRepository<Item> {}
