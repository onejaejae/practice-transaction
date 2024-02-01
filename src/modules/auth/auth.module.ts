import { ClassProvider, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { AuthServiceKey } from './interface/auth-service.interface';

const authService: ClassProvider = {
  provide: AuthServiceKey,
  useClass: AuthService,
};
@Module({
  imports: [UserRepositoryModule],
  controllers: [AuthController],
  providers: [authService],
})
export class AuthModule {}
