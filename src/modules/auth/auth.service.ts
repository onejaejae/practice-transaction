import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/common/request/auth/login.dto';
import { UserRepository } from 'src/entities/user/user.repository';
@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new BadRequestException(`email: ${email} don't exist in users`);

    if (!user.isSamePassword(password))
      throw new BadRequestException(`Incorrect password`);

    return user;
  }
}
