import {
  Controller,
  Get,
  Inject,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Credentials } from 'src/core/decorator/credentials.decorator';
import { User } from 'src/entities/user/user.entity';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
import { UserOrderListDto } from 'src/common/response/user/userItemList.dto';
import {
  IUserService,
  UserServiceKey,
} from '../interface/user-service.interface';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserServiceKey) private readonly userService: IUserService,
  ) {}

  @UseGuards(AuthGuard)
  @Patch('/item-use')
  async useItem(@Query('count') count: number, @Credentials() user: User) {
    return this.userService.useItem(count, user.id);
  }

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
    return UserOrderListDto.from(orders);
  }

  @UseGuards(AuthGuard)
  @Get('/items')
  async getItems(@Credentials() user: User) {
    return this.userService.getItems(user.id);
  }
}
