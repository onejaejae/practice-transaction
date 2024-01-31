import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('login')
  async login(@Req() req: Request) {}
}
