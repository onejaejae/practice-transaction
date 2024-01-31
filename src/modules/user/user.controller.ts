import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Credentials } from 'src/core/decorator/credentials.decorator';
import { User } from 'src/entities/user/user.entity';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
import { ItemShowDto } from 'src/common/response/item/itemShowDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/orders')
  async getOrders(
    @Query() userOrderListQueryDto: UserOrderListQueryDto,
    @Credentials() user: User,
  ) {
    const orders = await this.userService.getOrders(
      userOrderListQueryDto,
      user.id,
    );
    return ItemShowDto.from(orders);
  }

  @UseGuards(AuthGuard)
  @Get('/items')
  async getItems(@Credentials() user: User) {
    return this.userService.getItems(user.id);
  }
}
