import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from 'src/common/request/auth/login.dto';
import { AuthService } from './auth.service';
import { UserShowDto } from 'src/common/response/userShow.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);

    req.session.credentials = { user };
    req.session.save();

    return new UserShowDto(user);
  }
}
