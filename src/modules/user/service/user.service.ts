import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
import { Transactional } from 'src/core/decorator/transactional.decorator';
import {
  IItemRepository,
  ItemRepositoryKey,
} from 'src/entities/item/item-repository.interface';
import { Item } from 'src/entities/item/item.entity';
import {
  IUserRepository,
  UserRepositoryKey,
} from 'src/entities/user/user-repository.interface';
import { FindManyOptions } from 'typeorm';
import { IUserService } from '../interface/user-service.interface';
import {
  IRedisDLM,
  RedisDLMKey,
} from 'src/core/database/redis/redis-dml.interface';
import { User } from 'src/entities/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/common/types/user/role.type';
@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryKey) private readonly userRepository: IUserRepository,
    @Inject(ItemRepositoryKey) private readonly itemRepository: IItemRepository,
    @Inject(RedisDLMKey) private readonly redisDLM: IRedisDLM,
  ) {}

  mockUser(): Promise<User[]> {
    return this.userRepository.insertMany([
      plainToInstance(User, {
        email: 'test@naver.com',
        password: 'test',
        role: Role.ADMIN,
      }),
      plainToInstance(User, {
        email: 'test2@naver.com',
        password: 'test',
        role: Role.TEST,
      }),
    ]);
  }

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
