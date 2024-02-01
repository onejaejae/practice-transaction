import { BadRequestException, Injectable } from '@nestjs/common';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
import { Transactional } from 'src/core/decorator/transactional.decorator';
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

  @Transactional()
  async useItem(count: number, userId: number) {
    const items = await this.userRepository.getAvailableItems(userId);

    let remainingCount = count;
    const updatedItems = [];

    for (const item of items) {
      if (remainingCount <= 0) break;

      const deductedCount = item.caculateDeductedCount(remainingCount);
      const updatedItem = item.useItem(deductedCount);
      updatedItems.push(updatedItem);

      remainingCount -= deductedCount;
    }

    if (remainingCount > 0) throw new BadRequestException('Not enough hearts');

    return this.itemRepository.updateMany(updatedItems);
  }

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
    return this.userRepository.getAvailableItemAmount(userId);
  }
}
