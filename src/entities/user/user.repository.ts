import { EntityTarget } from 'typeorm';
import { User } from './user.entity';
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
}
