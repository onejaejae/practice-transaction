import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { Role } from 'src/common/types/user/role.type';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger: Logger = new Logger(RoleGuard.name);
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role: Role = this.reflector.get<Role>('role', context.getHandler());
    if (!role) {
      this.logger.error('Could not define role where metaData');
      throw new InternalServerErrorException(
        '서버에 이상이 있습니다. 관리자에게 문의해주세요.',
      );
    }

    const request: Request = context.switchToHttp().getRequest();
    const credentials = request.session.credentials;
    if (!credentials) throw new UnauthorizedException('인증정보가 없습니다.');

    const currentUser = plainToInstance(User, credentials.user);
    const isAllow = role.isAdmin(currentUser.role);
    if (isAllow) return true;

    throw new ForbiddenException('권한이 없습니다.');
  }
}
