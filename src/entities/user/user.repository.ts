import { EntityTarget } from 'typeorm';
import { User, UserItemCount } from './user.entity';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Injectable } from '@nestjs/common';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import { TransformPlainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository extends GenericTypeOrmRepository<User> {
  constructor(protected readonly txManager: TransactionManager) {
    super(User);
  }

  @TransformPlainToInstance(User)
  async findByEmail(email: string): Promise<User> {
    return this.getRepository().findOneBy({ email });
  }

  getName(): EntityTarget<User> {
    return User.name;
  }

  async getOrders(userId: number) {
    return this.getQueryBuilder()
      .leftJoinAndSelect('user.Items', 'item')
      .andWhere('user.id = :userId', { userId })
      .orderBy('item.createdAt', 'DESC')
      .getOne();
  }

  @TransformPlainToInstance(UserItemCount)
  async getUserItems(userId: number): Promise<UserItemCount> {
    return this.getQueryBuilder()
      .select('user.id', 'id')
      .addSelect('SUM(item.count)', 'totalCount')
      .leftJoin('user.Items', 'item')
      .andWhere('user.id = :userId', { userId })
      .andWhere('(item.expiredAt IS NULL OR item.expiredAt > :currentDate)', {
        currentDate: new Date(),
      })
      .groupBy('user.id')
      .getRawOne();
  }
}
