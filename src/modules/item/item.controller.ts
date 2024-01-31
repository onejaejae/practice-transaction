import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateBonusItemDto } from 'src/common/request/item/create-bonus-item.dto';
import { ItemService } from './item.service';
import { RoleGuard } from 'src/core/guard/role.guard';
import { AllowRole } from 'src/core/decorator/roles.decorator';
import { Role } from 'src/common/types/user/role.type';
import { ItemShowDto } from 'src/common/response/item/itemShowDto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(RoleGuard)
  @AllowRole(Role.ADMIN)
  @Post('/bonus')
  async createBonusItem(@Body() createBonusItemDto: CreateBonusItemDto) {
    const item = await this.itemService.createBonusItem(createBonusItemDto);
    return new ItemShowDto(item);
  }
}
