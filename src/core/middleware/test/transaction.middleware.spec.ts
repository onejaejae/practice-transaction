import { EntityManager } from 'typeorm';
import { TransactionMiddleware } from '../transaction.middleware';
import { Request, Response } from 'express';
import { createMock } from '@golevelup/ts-jest';
import { THINGS_NAMESPACE } from 'src/common/constant/nameSpace';

jest.mock('cls-hooked');

describe('TransactionMiddleware Test', () => {
  let transactionMiddleware: TransactionMiddleware;
  let request: Request;
  let response: Response;
  let entityManager: EntityManager;
  let nextMock: jest.Mock;

  beforeAll(() => {
    request = createMock<Request>();
    response = createMock<Response>();
    entityManager = createMock<EntityManager>();
    nextMock = jest.fn();

    transactionMiddleware = new TransactionMiddleware(entityManager);
  });

  it('정상 작동 - nameSpace 없는 경우', async () => {
    //given
    const craeteNamespaceMock = jest.fn();
    const mockReturn = {
      runAndReturn: jest.fn(),
    };
    craeteNamespaceMock.mockReturnValue(mockReturn);

    require('cls-hooked').createNamespace = craeteNamespaceMock;

    // when
    transactionMiddleware.use(request, response, nextMock);

    // then
    expect(craeteNamespaceMock).toHaveBeenCalledWith(THINGS_NAMESPACE);
    expect(mockReturn.runAndReturn).toHaveBeenCalled();
  });
});
