import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from 'src/common/request/auth/login.dto';
import { UserShowDto } from 'src/common/response/user/userShow.dto';
import {
  AuthServiceKey,
  IAuthService,
} from '../interface/auth-service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthServiceKey) private readonly authService: IAuthService,
  ) {}

  @Post('login')
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);

    req.session.credentials = { user };
    req.session.save();

    return new UserShowDto(user);
  }
}
