import { PaginationResponse } from 'src/common/pagination/pagination.response';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
import { Item } from 'src/entities/item/item.entity';
import { AvaliableItemCount, User } from 'src/entities/user/user.entity';

export const UserServiceKey = 'UserServiceKey';

export interface IUserService {
  mockUser(): Promise<User[]>;
  useItem(count: number, userId: number): Promise<Item[]>;
  getOrders(
    userOrderListQueryDto: UserOrderListQueryDto,
    userId: number,
  ): Promise<PaginationResponse<Item>>;
  getItems(userId: number): Promise<AvaliableItemCount>;
}
