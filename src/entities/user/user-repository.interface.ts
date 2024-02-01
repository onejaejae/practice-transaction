import { GenericRepository } from 'src/core/database/generic/generic.repository';
import { AvaliableItemCount, User } from './user.entity';
import { Item } from '../item/item.entity';

export const UserRepositoryKey = 'UserRepositoryKey';

export interface IUserRepository extends GenericRepository<User> {
  findByEmail(email: string): Promise<User>;
  getOrders(userId: number): Promise<User>;
  getAvailableItemAmount(userId: number): Promise<AvaliableItemCount>;
  getAvailableItems(userId: number): Promise<Item[]>;
}
