import { InternalServerErrorException } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import {
  THINGS_ENTITY_MANAGER,
  THINGS_NAMESPACE,
} from 'src/common/constant/nameSpace';
import { EntityManager } from 'typeorm';

export function Transactional() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Transaction
    async function transactionWrapped(...args: unknown[]) {
      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(THINGS_NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${THINGS_NAMESPACE} is not active`,
        );

      // get EntityManager
      const em = nameSpace.get(THINGS_ENTITY_MANAGER) as EntityManager;
      if (!em)
        throw new InternalServerErrorException(
          `Could not find EntityManager in ${THINGS_NAMESPACE} nameSpace`,
        );

      return await em.transaction(
        process.env.NODE_ENV !== 'test' ? 'REPEATABLE READ' : 'SERIALIZABLE',
        async (tx: EntityManager) => {
          nameSpace.set(THINGS_ENTITY_MANAGER, tx);
          return await originMethod.apply(this, args);
        },
      );
    }

    descriptor.value = transactionWrapped;
  };
}
