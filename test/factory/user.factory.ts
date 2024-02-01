import { plainToInstance } from 'class-transformer';
import { Role } from 'src/common/types/user/role.type';
import { User } from 'src/entities/user/user.entity';

export class UserFactory {
  mockUser() {
    return plainToInstance(User, {
      email: 'userA',
      password: 'password',
      role: Role.ADMIN,
    });
  }
}
