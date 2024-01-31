import { Injectable } from '@nestjs/common';
import { CreateBonusItemDto } from 'src/common/request/item/create-bonus-item.dto';
import { ItemRepository } from 'src/entities/item/item.repository';
import { UserRepository } from 'src/entities/user/user.repository';

@Injectable()
export class ItemService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly itemRepostory: ItemRepository,
  ) {}

  async createBonusItem(createBonusItemDto: CreateBonusItemDto) {
    await this.userRepository.findByIdOrThrow(createBonusItemDto.userId);
    const bonusItemEntiy = createBonusItemDto.toEntity();

    return this.itemRepostory.createEntity(bonusItemEntiy);
  }
}
