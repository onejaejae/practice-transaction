import { LoginDto } from 'src/common/request/auth/login.dto';
import { User } from 'src/entities/user/user.entity';

export const AuthServiceKey = 'AuthServiceKey';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<User>;
}
