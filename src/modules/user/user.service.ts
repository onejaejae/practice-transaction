import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/entities/user/user.repository';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
