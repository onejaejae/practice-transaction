import { Injectable } from '@nestjs/common';
import { CreateBonusItemDto } from 'src/common/request/item/create-bonus-item.dto';
import { CreateCommonItemQueryDto } from 'src/common/request/item/create-common-item.query.dto';
import { Transactional } from 'src/core/decorator/transactional.decorator';
import { ItemRepository } from 'src/entities/item/item.repository';
import { UserRepository } from 'src/entities/user/user.repository';

@Injectable()
export class ItemService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  @Transactional()
  async createCommonItem(
    userId: number,
    createCommonItemQueryDto: CreateCommonItemQueryDto,
  ) {
    await this.userRepository.findByIdOrThrow(userId);
    const commonItemEntiy = createCommonItemQueryDto.toEntity(userId);

    return this.itemRepository.createEntity(commonItemEntiy);
  }

  @Transactional()
  async createBonusItem(createBonusItemDto: CreateBonusItemDto) {
    await this.userRepository.findByIdOrThrow(createBonusItemDto.userId);
    const bonusItemEntiy = createBonusItemDto.toEntity();

    return this.itemRepository.createEntity(bonusItemEntiy);
  }
}
