import { plainToInstance } from 'class-transformer';
import { UserOrderListQueryDto } from 'src/common/request/user/user-order-list.query.dto';
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

  generateUserOrderListQueryDto() {
    const dto = new UserOrderListQueryDto();
    return dto;
  }
}
