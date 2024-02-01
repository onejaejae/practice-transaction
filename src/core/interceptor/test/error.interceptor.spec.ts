import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorInterceptor } from '../error.interceptor';
import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom, throwError } from 'rxjs';
import { type MockProxy, mock } from 'jest-mock-extended';
import { TypeORMError } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { TypeORMException } from 'src/core/exception/typeorm.exception';
import { ThingsConfigService } from 'src/core/config/config.service';

describe('ErrorInterceptor test', () => {
  let interceptor: ErrorInterceptor;
  let context: ExecutionContext;
  let next: MockProxy<CallHandler>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorInterceptor,
        {
          provide: ThingsConfigService,
          useValue: {
            getAppConfig: jest.fn(() => ({ ENV: 'test' })),
          },
        },
      ],
    }).compile();

    interceptor = module.get<ErrorInterceptor>(ErrorInterceptor);
    context = createMock<ExecutionContext>();
    next = mock<CallHandler>();
  });

  it('Should be defined', () => {
    //given
    //when
    //then
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should handle HttpException and return response object', async () => {
      // given
      const message = 'Test Error';
      const httpException = new HttpException(message, HttpStatus.BAD_REQUEST);
      next.handle.mockReturnValue(throwError(() => httpException));

      // when
      const resultObservable = interceptor.intercept(context, next);

      // then
      const res = await lastValueFrom(resultObservable);
      expect(res.message).toBe(message);
      expect(res).toHaveProperty('callClass');
      expect(res).toHaveProperty('callMethod');
      expect(res).toHaveProperty('stack');
    });

    it('should handle TypeORMError and propagate exception', async () => {
      // given
      const message = 'Test TypeORM Error';
      next.handle.mockReturnValue(throwError(() => new TypeORMError(message)));

      // when
      try {
        await lastValueFrom(interceptor.intercept(context, next));
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(TypeORMException);
      }
    });
  });
});
