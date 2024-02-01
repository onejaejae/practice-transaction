import { plainToInstance } from 'class-transformer';
import { CreateBonusItemDto } from 'src/common/request/item/create-bonus-item.dto';
import { CreateCommonItemQueryDto } from 'src/common/request/item/create-common-item.query.dto';
import { UpdateBonusItemDto } from 'src/common/request/item/update-bonus.item.dto';
import { ItemType } from 'src/common/types/item/item.type';
import { Item } from 'src/entities/item/item.entity';

export class ItemFactory {
  mockItem(userId) {
    return plainToInstance(Item, {
      originalCount: 1000,
      count: 1000,
      userId,
      type: ItemType.BONUS,
      expiredAt: new Date(),
    });
  }

  generateCreateCommonItemQueryDto() {
    const dto = new CreateCommonItemQueryDto();
    dto.count = 100;
    return dto;
  }

  generateCreateBonusItemDto(userId: number) {
    const dto = new CreateBonusItemDto();
    dto.count = 100;
    dto.userId = userId;
    dto.expiredAt = new Date('2024-02-03T10:56:59.322Z');
    return dto;
  }

  generateUpdateBonusItemDto() {
    const dto = new UpdateBonusItemDto();
    dto.expiredAt = new Date('2022-02-05T10:56:59.322Z');

    return dto;
  }
}
