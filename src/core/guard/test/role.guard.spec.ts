import {
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'src/common/types/user/role.type';
import { RoleGuard } from '../role.guard';
import { createMock } from '@golevelup/ts-jest';
import { mock } from 'jest-mock-extended';
import { User } from 'src/entities/user/user.entity';

// MOCK
export class mockNoReturnRoleReflect extends Reflector {
  get<TResult = Role | null, TKey = string>(_: TKey, __: Function): TResult {
    return null as TResult;
  }
}

export class mockReturnAdminRoleReflect extends Reflector {
  get<TResult = Role | null, TKey = string>(_: TKey, __: Function): TResult {
    return Role.ADMIN as TResult;
  }
}

describe('RoleGuard Test', () => {
  it('RoleGuard 생성 테스트', () => {
    //given
    //when
    //then
    expect(new RoleGuard(new Reflector())).toBeDefined();
  });

  it('RoleGuard에 Role이 존재하지 않는 경우', () => {
    //given
    const roleGuard = new RoleGuard(new mockNoReturnRoleReflect());

    //when
    //then
    expect(() =>
      roleGuard.canActivate({ getHandler: () => {} } as ExecutionContext),
    ).toThrow(
      new InternalServerErrorException(
        '서버에 이상이 있습니다. 관리자에게 문의해주세요.',
      ),
    );
  });

  it('ExecutionContext에 credentials가 존재하지 않는 경우', () => {
    //given
    const roleGuard = new RoleGuard(new mockReturnAdminRoleReflect());

    const request = { path: '/test' } as Request;
    const context = createMock<ExecutionContext>();

    //when
    //then
    expect(() => roleGuard.canActivate(context)).toThrow(
      new UnauthorizedException('인증정보가 없습니다.'),
    );
  });

  it('유저의 Role을 가지고 MetaData의 Role의 isAdmin 실행했을 때 false일 경우', () => {
    //given
    const roleGuard = new RoleGuard(new mockReturnAdminRoleReflect());
    const context = mock<ExecutionContext>();
    const mockUser = new User();
    mockUser.role = Role.TEST;

    const request = {
      getRequest: () => {
        return {
          session: {
            credentials: {
              user: mockUser,
            },
          },
        };
      },
    } as any;
    context.switchToHttp.mockReturnValue(request);

    //when
    //then
    expect(() => roleGuard.canActivate(context)).toThrow(
      new ForbiddenException('권한이 없습니다.'),
    );
  });

  it('권한 통과', () => {
    //given
    const roleGuard = new RoleGuard(new mockReturnAdminRoleReflect());
    const context = mock<ExecutionContext>();
    const mockUser = new User();
    mockUser.role = Role.ADMIN;

    const request = {
      getRequest: () => {
        return {
          session: {
            credentials: {
              user: mockUser,
            },
          },
        };
      },
    } as any;
    context.switchToHttp.mockReturnValue(request);

    //when
    const result = roleGuard.canActivate(context);

    //then
    expect(result).toBe(true);
  });
});
