import { InternalServerErrorException } from '@nestjs/common';
import { createNamespace } from 'cls-hooked';
import { DataSource } from 'typeorm';
import { Transactional } from '../transactional.decorator';
import {
  THINGS_NAMESPACE,
  THINGS_ENTITY_MANAGER,
} from 'src/common/constant/nameSpace';

class Things {
  @Transactional()
  flow() {}
}

describe('Transactional Decorator Test', () => {
  it('NameSpace가 없이 실행되는 경우', async () => {
    //given
    const mock = new Things();

    //when
    //then
    await expect(mock.flow()).rejects.toThrow(
      new InternalServerErrorException(`${THINGS_NAMESPACE} is not active`),
    );
  });

  it('NameSpace는 있지만 active 되지 않은 경우', async () => {
    //given
    createNamespace(THINGS_NAMESPACE);
    const mock = new Things();

    //when
    //then
    await expect(mock.flow()).rejects.toThrow(
      new InternalServerErrorException(`${THINGS_NAMESPACE} is not active`),
    );
  });

  it('entityManager가 없는 경우', async () => {
    //given
    const namespace = createNamespace(THINGS_NAMESPACE);
    const mock = new Things();

    //when
    //then
    await expect(
      namespace.runPromise(async () => Promise.resolve().then(mock.flow)),
    ).rejects.toThrow(
      new InternalServerErrorException(
        `Could not find EntityManager in ${THINGS_NAMESPACE} nameSpace`,
      ),
    );
  });

  it('entityManager가 있는 경우 (정상)', async () => {
    //given
    const namespace = createNamespace(THINGS_NAMESPACE);
    const mock = new Things();

    const dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
    }).initialize();
    const em = dataSource.createEntityManager();

    await expect(
      namespace.runPromise(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, em);
        await Promise.resolve().then(mock.flow);
      }),
    ).resolves.not.toThrow();
  });
});
