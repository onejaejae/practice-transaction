import { BadRequestException, Injectable } from '@nestjs/common';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
import { RedisDLM } from 'src/core/database/redis/redis.dml';
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
    private readonly redisDLM: RedisDLM,
  ) {}

  @Transactional()
  async useItem(count: number, userId: number) {
    const lockKey = userId + 'lock';
    const identity = await this.redisDLM.acquireLock(lockKey);

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

    if (remainingCount > 0) {
      await this.redisDLM.releaseLock(lockKey, identity);
      throw new BadRequestException('Not enough hearts');
    }

    const results = await this.itemRepository.updateMany(updatedItems);
    await this.redisDLM.releaseLock(lockKey, identity);

    return results;
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
