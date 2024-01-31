import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import {
  THINGS_NAMESPACE,
  THINGS_ENTITY_MANAGER,
} from 'src/common/constant/nameSpace';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionManager {
  getEntityManager(): EntityManager {
    const nameSpace = getNamespace(THINGS_NAMESPACE);
    if (!nameSpace || !nameSpace.active)
      throw new InternalServerErrorException(
        `${THINGS_NAMESPACE} is not active`,
      );
    return nameSpace.get(THINGS_ENTITY_MANAGER);
  }
}
