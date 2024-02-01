import { Namespace, createNamespace, destroyNamespace } from 'cls-hooked';
import { DataSource } from 'typeorm';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TransactionManager } from 'src/core/database/typeorm/transaction.manager';
import {
  THINGS_ENTITY_MANAGER,
  THINGS_NAMESPACE,
} from 'src/common/constant/nameSpace';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/entities/user/user.entity';
import { UserRepository } from 'src/entities/user/user.repository';
import { Item } from 'src/entities/item/item.entity';
import { IItemService } from '../interface/item-service.interface';
import { ItemService } from '../service/item.service';
import { ItemRepository } from 'src/entities/item/item.repository';
import { ItemFactory } from '../../../../test/factory/item.factory';
import { UserFactory } from '../../../../test/factory/user.factory';
import { ItemType } from 'src/common/types/item/item.type';

describe('item service test', () => {
  // for testContainers
  jest.setTimeout(300_000);

  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let service: IItemService;
  let namespace: Namespace;
  let itemFactory: ItemFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start();
    dataSource = await new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      username: container.getUsername(),
      password: container.getPassword(),
      synchronize: true,
      entities: [User, Item],
      namingStrategy: new SnakeNamingStrategy(),
    }).initialize();

    const txManager = new TransactionManager();
    const userRepository = new UserRepository(txManager);
    const itemRepository = new ItemRepository(txManager);
    service = new ItemService(userRepository, itemRepository);
    itemFactory = new ItemFactory();
    userFactory = new UserFactory();
  });

  beforeEach(() => {
    namespace = createNamespace(THINGS_NAMESPACE);
  });

  afterEach(async () => {
    await dataSource.query('TRUNCATE TABLE users CASCADE;');
    await dataSource.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    destroyNamespace(THINGS_NAMESPACE);
  });

  afterAll(async () => {
    await container.stop();
    await dataSource.destroy();
  });

  it('Should be defined', () => {
    expect(dataSource).toBeDefined();
    expect(namespace).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createCommonItem method', () => {
    it('user가 존재하지 않는 경우 - 실패', async () => {
      //given
      const unExistUserId = 100000;
      const createCommonItemQueryDto =
        itemFactory.generateCreateCommonItemQueryDto();

      //when
      //then
      await expect(
        namespace.runPromise(async () => {
          namespace.set(
            THINGS_ENTITY_MANAGER,
            dataSource.createEntityManager(),
          );
          await service.createCommonItem(
            unExistUserId,
            createCommonItemQueryDto,
          );
        }),
      ).rejects.toThrow(
        new BadRequestException(`don't exist ${unExistUserId}`),
      );
    });

    it('일반 하트 충전 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);
      const createCommonItemQueryDto =
        itemFactory.generateCreateCommonItemQueryDto();

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.createCommonItem(user.id, createCommonItemQueryDto);
      });

      expect(result.userId).toBe(user.id);
      expect(result.type.enumName).toBe(ItemType.COMMON.enumName);
      expect(result.originalCount).toBe(createCommonItemQueryDto.count);
      expect(result.count).toBe(createCommonItemQueryDto.count);
      expect(result.expiredAt).toBeNull();
    });
  });

  describe('createBonusItem method', () => {
    it('user가 존재하지 않는 경우 - 실패', async () => {
      //given
      const unExistUserId = 100000;
      const createBonusItemDto =
        itemFactory.generateCreateBonusItemDto(unExistUserId);

      //when
      //then
      await expect(
        namespace.runPromise(async () => {
          namespace.set(
            THINGS_ENTITY_MANAGER,
            dataSource.createEntityManager(),
          );
          await service.createBonusItem(createBonusItemDto);
        }),
      ).rejects.toThrow(
        new BadRequestException(`don't exist ${unExistUserId}`),
      );
    });

    it('보너스 하트 충전 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);
      const createBonusItemDto = itemFactory.generateCreateBonusItemDto(
        user.id,
      );

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.createBonusItem(createBonusItemDto);
      });

      expect(result.userId).toBe(user.id);
      expect(result.type.enumName).toBe(ItemType.BONUS.enumName);
      expect(result.originalCount).toBe(createBonusItemDto.count);
      expect(result.count).toBe(createBonusItemDto.count);
      expect(result.expiredAt).not.toBeNull();
    });
  });

  describe('updateBonusItem method', () => {
    it('item이 존재하지 않는 경우 - 실패', async () => {
      //given
      const unExistItem = 100000;
      const updateBonusItemDto = itemFactory.generateUpdateBonusItemDto();

      //when
      //then
      await expect(
        namespace.runPromise(async () => {
          namespace.set(
            THINGS_ENTITY_MANAGER,
            dataSource.createEntityManager(),
          );
          await service.updateBonusItem(unExistItem, updateBonusItemDto);
        }),
      ).rejects.toThrow(new BadRequestException(`don't exist ${unExistItem}`));
    });

    it('보너스 하트 수정 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      const mockItem = itemFactory.mockBonusItem(user.id);
      const item = await dataSource.manager.save(Item, mockItem);

      const updateBonusItemDto = itemFactory.generateUpdateBonusItemDto();

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.updateBonusItem(item.id, updateBonusItemDto);
      });

      expect(item.expiredAt).not.toBe(result.expiredAt);
      expect(result.expiredAt).not.toBe(updateBonusItemDto.expiredAt);
    });
  });
});
