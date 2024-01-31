import { Injectable } from '@nestjs/common';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
import { Item } from 'src/entities/item/item.entity';
import { ItemRepository } from 'src/entities/item/item.repository';
import { UserRepository } from 'src/entities/user/user.repository';
import { FindManyOptions } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async getOrders(
    userOrderListQueryDto: UserOrderListQueryDto,
    userId: number,
  ) {
    const findManyOption: FindManyOptions<Item> = {
      where: { userId },
      order: {
        ['createdAt']: 'DESC',
      },
    };
    return this.itemRepository.paginate(userOrderListQueryDto, findManyOption);
  }

  async getItems(userId: number) {
    return this.userRepository.getUserItems(userId);
  }
}
