import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ItemType } from 'src/common/types/item/item.type';
import { Item } from 'src/entities/item/item.entity';

export class CreateCommonItemQueryDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  readonly count: number;

  toEntity(userId: number) {
    const item = Item.of(userId, this.count);
    item.type = ItemType.COMMON;

    return item;
  }
}
