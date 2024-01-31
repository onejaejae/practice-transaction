import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';

@Module({
  imports: [UserRepositoryModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
