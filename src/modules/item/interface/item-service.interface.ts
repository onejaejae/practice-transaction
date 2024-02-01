import { CreateBonusItemDto } from 'src/common/request/item/create-bonus-item.dto';
import { CreateCommonItemQueryDto } from 'src/common/request/item/create-common-item.query.dto';
import { UpdateBonusItemDto } from 'src/common/request/item/update-bonus.item.dto';
import { Item } from 'src/entities/item/item.entity';

export const ItemServiceKey = 'ItemServiceKey';

export interface IItemService {
  createCommonItem(
    userId: number,
    createCommonItemQueryDto: CreateCommonItemQueryDto,
  ): Promise<Item>;
  createBonusItem(createBonusItemDto: CreateBonusItemDto): Promise<Item>;
  updateBonusItem(
    itemId: number,
    updateBonusItemDto: UpdateBonusItemDto,
  ): Promise<Item>;
}
