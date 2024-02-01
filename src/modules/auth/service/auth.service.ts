import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/common/request/auth/login.dto';
import {
  IUserRepository,
  UserRepositoryKey,
} from 'src/entities/user/user-repository.interface';
import { IAuthService } from '../interface/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(UserRepositoryKey) private readonly userRepository: IUserRepository,
  ) {}

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
