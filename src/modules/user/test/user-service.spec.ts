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
import { ItemRepository } from 'src/entities/item/item.repository';
import { ItemFactory } from '../../../../test/factory/item.factory';
import { UserFactory } from '../../../../test/factory/user.factory';
import { ItemType } from 'src/common/types/item/item.type';
import { IUserService } from '../interface/user-service.interface';
import { UserService } from '../service/user.service';
import { type MockProxy, mock } from 'jest-mock-extended';
import { IRedisDLM } from 'src/core/database/redis/redis-dml.interface';

describe('user service test', () => {
  // for testContainers
  jest.setTimeout(300_000);

  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let service: IUserService;
  let namespace: Namespace;
  let itemFactory: ItemFactory;
  let userFactory: UserFactory;
  let redisDLM: MockProxy<IRedisDLM>;

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
    redisDLM = mock<IRedisDLM>();
    service = new UserService(userRepository, itemRepository, redisDLM);

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

  describe('getOrders method', () => {
    it('유저의 하트 충전 내역이 없는 경우 - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);
      const userOrderListQueryDto = userFactory.generateUserOrderListQueryDto();

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.getOrders(userOrderListQueryDto, user.id);
      });

      expect(result.totalCount).toBe(0);
      expect(result.page).toBe(1);
      expect(result.take).toBe(10);
      expect(result.list.length).toBe(0);
    });

    it('유저의 하트 충전 내역이 있는 경우 - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      const mockItem = itemFactory.mockCommonItem(user.id);
      const item = await dataSource.manager.save(Item, mockItem);

      const userOrderListQueryDto = userFactory.generateUserOrderListQueryDto();

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.getOrders(userOrderListQueryDto, user.id);
      });

      expect(result.totalCount).toBe(1);
      expect(result.page).toBe(1);
      expect(result.take).toBe(10);
      expect(result.list[0]).toEqual(item);
    });
  });

  describe('getItems method', () => {
    it('유저의 사용 가능한 하트가 없는 경우 - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.getItems(user.id);
      });

      expect(result.totalCount).toBe(0);
    });

    it('유저의 사용 가능한 하트 중 일반 하트만 있는 경우 - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      const mockItem = itemFactory.mockCommonItem(user.id);
      const item = await dataSource.manager.save(Item, mockItem);

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.getItems(user.id);
      });

      expect(result.totalCount).toBe(item.count);
    });

    it('유저의 사용 가능한 하트 중 일반 하트 + 보너스 하트(만료x) 있는 경우 - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      const mockCommonItem = itemFactory.mockCommonItem(user.id);
      const commonItem = await dataSource.manager.save(Item, mockCommonItem);

      const mockBonusItem = itemFactory.mockBonusItem(user.id);
      const bonusItem = await dataSource.manager.save(Item, mockBonusItem);

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.getItems(user.id);
      });

      expect(result.totalCount).toBe(commonItem.count + bonusItem.count);
    });

    it('유저의 사용 가능한 하트 중 일반 하트 + 보너스 하트(만료x) + 보너스 하트(만료o) 있는 경우 - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      const mockCommonItem = itemFactory.mockCommonItem(user.id);
      const commonItem = await dataSource.manager.save(Item, mockCommonItem);

      const mockBonusItem = itemFactory.mockBonusItem(user.id);
      const bonusItem = await dataSource.manager.save(Item, mockBonusItem);

      const mockExpiredBonusItem = itemFactory.mockExpiredBonusItem(user.id);
      await dataSource.manager.save(Item, mockExpiredBonusItem);

      //when
      //then
      const result = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.getItems(user.id);
      });

      expect(result.totalCount).toBe(commonItem.count + bonusItem.count);
    });
  });

  describe('useItem method', () => {
    it('하트 사용 시 하트의 개수가 부족한 경우 - 실패', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      //when
      //then
      await expect(
        namespace.runPromise(async () => {
          namespace.set(
            THINGS_ENTITY_MANAGER,
            dataSource.createEntityManager(),
          );
          await service.useItem(1000, user.id);
        }),
      ).rejects.toThrow(new BadRequestException('Not enough hearts'));
    });

    it('하트 사용 - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      const mockItem = itemFactory.mockCommonItem(user.id);
      const item = await dataSource.manager.save(Item, mockItem);

      //when
      //then
      const [result] = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.useItem(item.originalCount, user.id);
      });

      expect(result.count).toBe(0);
    });

    it('하트 사용 시 보너스 하트 + 일반 하트 있는 경우, 보너스 하트가 먼저 사용되야 한다. - 성공', async () => {
      //given
      const mockUser = userFactory.mockUser();
      const user = await dataSource.manager.save(User, mockUser);

      const mockCommonItem = itemFactory.mockCommonItem(user.id);
      await dataSource.manager.save(Item, mockCommonItem);

      const mockBonusItem = itemFactory.mockBonusItem(user.id);
      const bonusItem = await dataSource.manager.save(Item, mockBonusItem);

      //when
      //then
      const [result] = await namespace.runAndReturn(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        return service.useItem(bonusItem.originalCount, user.id);
      });

      expect(result.type.enumName).toBe(ItemType.BONUS.enumName);
      expect(result.count).toBe(0);
    });
  });
});
