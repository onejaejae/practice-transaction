import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { RootEntity } from '../typeorm/root.entity';
import { PaginationResponse } from 'src/common/pagination/pagination.response';
import { FindManyOptions } from 'typeorm';

export interface GenericRepository<T extends RootEntity> {
  findOneOrThrow(filters: Partial<T>): Promise<T>;
  findByIdOrThrow(id: number): Promise<T>;
  createEntity(model: T): Promise<T>;
  deleteById(id: number);
  paginate(
    pagination: PaginationRequest,
    findManyOption: FindManyOptions<T>,
  ): Promise<PaginationResponse<T>>;
  update(models: T): Promise<T>;
  updateMany(models: T[]): Promise<T[]>;
}
