import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { type MockProxy, mock } from 'jest-mock-extended';

describe('AuthGuard test', () => {
  let guard: AuthGuard;
  let context: MockProxy<ExecutionContext>;

  beforeAll(() => {
    guard = new AuthGuard();
    context = mock<ExecutionContext>();
  });

  it('Should be defined', () => {
    //given
    //when
    //then
    expect(guard).toBeDefined();
  });

  it('credentials이 없는 경우 - 실패', () => {
    const mock = {
      getRequest: () => {
        return {
          session: {},
        };
      },
    } as any;
    context.switchToHttp.mockReturnValue(mock);

    //when
    const result = guard.canActivate(context);

    //then
    expect(result).toBe(false);
  });

  it('credentials 있는 경우 - 실패', () => {
    const mock = {
      getRequest: () => {
        return {
          session: {
            credentials: {
              user: {},
            },
          },
        };
      },
    } as any;
    context.switchToHttp.mockReturnValue(mock);

    //when
    const result = guard.canActivate(context);

    //then
    expect(result).toBeTruthy();
  });
});
