import { BadRequestException, Injectable } from '@nestjs/common';
import {
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { TransactionManager } from './transaction.manager';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { RootEntity } from './root.entity';
import { PaginationBuilder } from 'src/common/pagination/pagination.builder';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { GenericRepository } from '../generic/generic.repository';

@Injectable()
export abstract class GenericTypeOrmRepository<T extends RootEntity>
  implements GenericRepository<T>
{
  protected abstract readonly txManager: TransactionManager;
  constructor(private readonly classType: ClassConstructor<T>) {}

  async insertMany(models: T[]): Promise<T[]> {
    const results = await this.getRepository().save(models);

    return results.map((res) => plainToInstance(this.classType, res));
  }

  abstract getName(): EntityTarget<T>;

  async findOneOrThrow(filters: Partial<T>): Promise<T> {
    const findOption: FindOneOptions = { where: filters };
    const res = this.getRepository().findOne(findOption);

    if (!res) {
      throw new BadRequestException(`don't exist ${findOption}`);
    }
    return plainToInstance(this.classType, res);
  }

  async findByIdOrThrow(id: number): Promise<T> {
    const findOption: FindOneOptions = { where: { id } };
    const res = await this.getRepository().findOne(findOption);

    if (!res) {
      throw new BadRequestException(`don't exist ${id}`);
    }
    return plainToInstance(this.classType, res);
  }

  async paginate(
    pagination: PaginationRequest,
    findManyOption: FindManyOptions<T>,
  ) {
    const { take, page } = pagination;
    const options = {
      take,
      skip: (page - 1) * take,
      ...findManyOption,
    };

    const [data, total] = await this.getRepository().findAndCount(options);

    return new PaginationBuilder<T>()
      .setData(plainToInstance(this.classType, data))
      .setPage(page)
      .setTake(take)
      .setTotalCount(total)
      .build();
  }

  async update(models: T): Promise<T> {
    const res = await this.getRepository().save(models);

    return plainToInstance(this.classType, res);
  }

  async updateMany(models: T[]): Promise<T[]> {
    const results = await this.getRepository().save(models);

    return results.map((res) => plainToInstance(this.classType, res));
  }

  async createEntity(model: T): Promise<T> {
    const res = await this.getRepository().save(model);
    return plainToInstance(this.classType, res);
  }

  async deleteById(id: number) {
    return this.getRepository().softDelete(id);
  }

  protected getRepository(): Repository<T> {
    return this.txManager.getEntityManager().getRepository(this.getName());
  }

  protected getQueryBuilder(): SelectQueryBuilder<T> {
    return this.txManager
      .getEntityManager()
      .getRepository(this.getName())
      .createQueryBuilder(String(this.getName()).toLowerCase());
  }
}
