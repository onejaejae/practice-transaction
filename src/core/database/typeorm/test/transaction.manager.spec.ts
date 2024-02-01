import { InternalServerErrorException } from '@nestjs/common';
import { createNamespace } from 'cls-hooked';
import { DataSource } from 'typeorm';
import { TransactionManager } from '../transaction.manager';
import {
  THINGS_ENTITY_MANAGER,
  THINGS_NAMESPACE,
} from 'src/common/constant/nameSpace';

describe('TransactionManager Test', () => {
  it('NameSpace가 없는 경우', () => {
    //given
    const manager = new TransactionManager();

    //when
    //then
    expect(() => manager.getEntityManager()).toThrow(
      new InternalServerErrorException(`${THINGS_NAMESPACE} is not active`),
    );
  });

  it('NameSpace가 있지만 Active가 아닌 경우', () => {
    //given
    const manager = new TransactionManager();
    createNamespace(THINGS_NAMESPACE);

    //when
    //then
    expect(() => manager.getEntityManager()).toThrow(
      new InternalServerErrorException(`${THINGS_NAMESPACE} is not active`),
    );
  });

  it('정상 작동', async () => {
    //given
    const manager = new TransactionManager();
    const namespace = createNamespace(THINGS_NAMESPACE);

    //when
    const dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
    }).initialize();
    const em = dataSource.createEntityManager();

    //when
    await namespace.runPromise(async () => {
      namespace.set(THINGS_ENTITY_MANAGER, em);
      const got = manager.getEntityManager();
      expect(got).toStrictEqual(em);
    });
  });
});
