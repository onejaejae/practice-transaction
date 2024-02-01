import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBonusItemDto } from 'src/common/request/item/create-bonus-item.dto';
import { ItemService } from '../service/item.service';
import { RoleGuard } from 'src/core/guard/role.guard';
import { AllowRole } from 'src/core/decorator/roles.decorator';
import { Role } from 'src/common/types/user/role.type';
import { ItemShowDto } from 'src/common/response/item/itemShowDto';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CreateCommonItemQueryDto } from 'src/common/request/item/create-common-item.query.dto';
import { Credentials } from 'src/core/decorator/credentials.decorator';
import { User } from 'src/entities/user/user.entity';
import { UpdateBonusItemDto } from 'src/common/request/item/update-bonus.item.dto';
import {
  IItemService,
  ItemServiceKey,
} from '../interface/item-service.interface';

@Controller('items')
export class ItemController {
  constructor(
    @Inject(ItemServiceKey) private readonly itemService: IItemService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/common')
  async createCommonItem(
    @Query() createCommonItemQueryDto: CreateCommonItemQueryDto,
    @Credentials() user: User,
  ) {
    const item = await this.itemService.createCommonItem(
      user.id,
      createCommonItemQueryDto,
    );
    return new ItemShowDto(item);
  }

  @UseGuards(RoleGuard)
  @AllowRole(Role.ADMIN)
  @Post('/bonus')
  async createBonusItem(@Body() createBonusItemDto: CreateBonusItemDto) {
    const item = await this.itemService.createBonusItem(createBonusItemDto);
    return new ItemShowDto(item);
  }

  @UseGuards(RoleGuard)
  @AllowRole(Role.ADMIN)
  @Patch('/:itemId/bonus')
  async updateBonusItem(
    @Param('itemId') itemId: number,
    @Body() updateBonusItemDto: UpdateBonusItemDto,
  ) {
    const item = await this.itemService.updateBonusItem(
      itemId,
      updateBonusItemDto,
    );
    return new ItemShowDto(item);
  }
}
