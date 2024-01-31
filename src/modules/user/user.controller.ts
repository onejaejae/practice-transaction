import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Credentials } from 'src/core/decorator/credentials.decorator';
import { User } from 'src/entities/user/user.entity';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/items')
  async getItems(@Credentials() user: User) {
    return this.userService.getItems(user.id);
  }
}
