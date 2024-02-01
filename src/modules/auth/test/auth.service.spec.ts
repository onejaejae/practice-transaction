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
import { IAuthService } from '../interface/auth-service.interface';
import { User } from 'src/entities/user/user.entity';
import { UserRepository } from 'src/entities/user/user.repository';
import { AuthService } from '../service/auth.service';
import { LoginDto } from 'src/common/request/auth/login.dto';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/common/types/user/role.type';
import { Item } from 'src/entities/item/item.entity';

const mockUser: User = plainToInstance(User, {
  email: 'userA',
  password: 'password',
  role: Role.ADMIN,
});

describe('auth service test', () => {
  // for testContainers
  jest.setTimeout(300_000);

  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let service: IAuthService;
  let namespace: Namespace;

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
    service = new AuthService(userRepository);
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
  it('login - user가 존재하지 않는 경우', async () => {
    //given
    const loginDto = new LoginDto();
    loginDto.email = 'foobar';
    loginDto.password = 'test';

    //when
    //then
    await expect(
      namespace.runPromise(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        await service.login(loginDto);
      }),
    ).rejects.toThrow(
      new BadRequestException(`email: ${loginDto.email} don't exist in users`),
    );
  });

  it('login - 입력한 비밀번호와 다른 경우', async () => {
    //given
    const user = await dataSource.manager.save(User, mockUser);
    const loginDto = new LoginDto();
    loginDto.email = user.email;
    loginDto.password = 'difference';

    //when
    //then
    await expect(
      namespace.runPromise(async () => {
        namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
        await service.login(loginDto);
      }),
    ).rejects.toThrow(new BadRequestException('Incorrect password'));
  });

  it('login - 성공', async () => {
    //given
    const user = await dataSource.manager.save(User, mockUser);
    const loginDto = new LoginDto();
    loginDto.email = user.email;
    loginDto.password = user.password;

    //when
    //then
    const result = await namespace.runAndReturn(async () => {
      namespace.set(THINGS_ENTITY_MANAGER, dataSource.createEntityManager());
      return service.login(loginDto);
    });
    expect(result).toEqual(user);
  });
});
