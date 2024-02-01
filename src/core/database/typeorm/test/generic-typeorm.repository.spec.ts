import {
  DataSource,
  DeleteDateColumn,
  Entity,
  EntityTarget,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionManager } from '../transaction.manager';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createNamespace } from 'cls-hooked';
import { GenericTypeOrmRepository } from '../generic-typeorm.repository';
import {
  THINGS_ENTITY_MANAGER,
  THINGS_NAMESPACE,
} from 'src/common/constant/nameSpace';
import { RootEntity } from '../root.entity';
import { PaginationRequest } from 'src/common/pagination/pagination.request';
import { PaginationResponse } from 'src/common/pagination/pagination.response';

@Entity()
class Mock extends RootEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;
}

class MockRepository extends GenericTypeOrmRepository<Mock> {
  getName(): EntityTarget<Mock> {
    return Mock.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Mock);
  }
}

describe('Generic TypeORM Repository', () => {
  let dataSource: DataSource;
  let mockRepository: MockRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [Mock],
    });
    await dataSource.initialize();

    const txManager = new TransactionManager();
    mockRepository = new MockRepository(txManager);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('Should be defined', () => {
    expect(dataSource).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  it('NameSpace가 존재하지 않는 경우', async () => {
    //given
    const m = new Mock();

    //when
    //then
    await expect(mockRepository.createEntity(m)).rejects.toThrow(
      new InternalServerErrorException(`${THINGS_NAMESPACE} is not active`),
    );
  });

  it('NameSpace가 있지만 active 상태가 아닌 경우', async () => {
    //given
    const m = new Mock();
    createNamespace(THINGS_NAMESPACE);

    //when
    //then
    await expect(mockRepository.createEntity(m)).rejects.toThrow(
      new InternalServerErrorException(`${THINGS_NAMESPACE} is not active`),
    );
  });

  it('정상적으로 저장 with createEntity & findByIdOrThrow', async () => {
    //given
    const m = new Mock();
    const namespace = createNamespace(THINGS_NAMESPACE);

    //when
    await namespace.runPromise(async () => {
      await Promise.resolve().then(() =>
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager()),
      );

      // save
      const createdMock = await mockRepository.createEntity(m);

      //then
      const result = await mockRepository.findByIdOrThrow(createdMock.id);
      expect(result.id).toBe(createdMock.id);
      expect(result).not.toBeNull();
    });
  });

  it('정상적으로 저장 with createEntity & findOneOrThrow', async () => {
    //given
    const e = new Mock();
    const namespace = createNamespace(THINGS_NAMESPACE);

    //when
    await namespace.runPromise(async () => {
      await Promise.resolve().then(() =>
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager()),
      );

      // save
      const createdMock = await mockRepository.createEntity(e);

      //then
      const result = await mockRepository.findOneOrThrow({
        id: createdMock.id,
      });
      expect(result.id).toBe(createdMock.id);
      expect(result).not.toBeNull();
    });
  });

  it('정상적으로 삭제 with createEntity & deleteById & findByIdOrThrow', async () => {
    //given
    const m = new Mock();
    const namespace = createNamespace(THINGS_NAMESPACE);

    //when
    await namespace.runPromise(async () => {
      //set EntityManager
      await Promise.resolve().then(() =>
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager()),
      );

      // save
      const createdMock = await mockRepository.createEntity(m);

      // remove
      await mockRepository.deleteById(createdMock.id);

      //then
      await expect(
        mockRepository.findByIdOrThrow(createdMock.id),
      ).rejects.toThrow(
        new BadRequestException(`don't exist ${createdMock.id}`),
      );
    });
  });

  it('정상적으로 페이지네이션 with createEntity & paginate', async () => {
    //given
    const m = new Mock();
    const namespace = createNamespace(THINGS_NAMESPACE);
    const pagination = new PaginationRequest();

    //when
    await namespace.runPromise(async () => {
      //set EntityManager
      await Promise.resolve().then(() =>
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager()),
      );

      // save
      const createdMock = await mockRepository.createEntity(m);

      //then
      const result = await mockRepository.paginate(pagination, {
        where: { id: createdMock.id },
      });

      expect(result).toBeInstanceOf(PaginationResponse);
      expect(result.totalCount).not.toBeNull();
      expect(result.page).toBe(pagination.page);
      expect(result.take).toBe(pagination.take);
      expect(result.list).toEqual([createdMock]);
    });
  });
});
