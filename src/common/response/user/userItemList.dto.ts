import { Exclude, Expose } from 'class-transformer';
import { Item } from 'src/entities/item/item.entity';
import { ItemType } from 'src/common/types/item/item.type';
import { PaginationResponse } from 'src/common/pagination/pagination.response';

export class UserOrderListDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _count: number;
  @Exclude() private readonly _type: ItemType;
  @Exclude() private readonly _expiredAt: Date;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _deletedAt: Date;

  constructor(item: Item) {
    this._id = item.id;
    this._userId = item.userId;
    this._count = item.original_count;
    this._type = item.type;
    this._expiredAt = item.expiredAt;
    this._createdAt = item.createdAt;
    this._updatedAt = item.updatedAt;
    this._deletedAt = item.deletedAt;
  }

  static from(listPagination: PaginationResponse<Item>) {
    listPagination.list = listPagination.list.map(
      (item) => new UserOrderListDto(item),
    ) as any;

    return listPagination;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get userId(): number {
    return this._userId;
  }

  @Expose()
  get count(): number {
    return this._count;
  }

  @Expose()
  get type(): string {
    return this._type.enumName;
  }

  @Expose()
  get expiredAt(): Date {
    return this._expiredAt;
  }

  @Expose()
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @Expose()
  get deletedAt(): Date {
    return this._deletedAt;
  }
}
