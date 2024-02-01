import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom, of } from 'rxjs';
import { type MockProxy, mock } from 'jest-mock-extended';
import { createMock } from '@golevelup/ts-jest';
import { ApiResponseInterceptor } from '../apiResponse.interceptor';

describe('ApiResponseInterceptor test', () => {
  let interceptor: ApiResponseInterceptor;
  let context: ExecutionContext;
  let next: MockProxy<CallHandler>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiResponseInterceptor],
    }).compile();

    interceptor = module.get<ApiResponseInterceptor>(ApiResponseInterceptor);
    context = createMock<ExecutionContext>();
    next = mock<CallHandler>();
  });

  it('Should be defined', () => {
    //given
    //when
    //then
    expect(interceptor).toBeDefined();
  });

  it('should intercept and wrap response in success message', async () => {
    // given
    const data = { things: 'flow' };
    next.handle.mockReturnValue(of(data));

    // when
    const result = await lastValueFrom(interceptor.intercept(context, next));

    // then
    expect(result).toEqual({ message: 'success', data });
  });
});
