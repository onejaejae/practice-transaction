import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ItemType } from 'src/common/types/item/item.type';
import { Item } from 'src/entities/item/item.entity';

export class CreateBonusItemDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  count: number;

  @IsDateString()
  expiredAt: Date;

  toEntity() {
    const item = Item.of(this.userId, this.count);
    item.type = ItemType.BONUS;
    item.expiredAt = this.expiredAt;

    return item;
  }
}
