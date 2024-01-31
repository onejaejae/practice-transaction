import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { Role } from 'src/common/types/user/role.type';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    await userRepository.insert([
      {
        email: 'test@naver.com',
        password: 'test',
        role: Role.ADMIN,
      },
      {
        email: 'test@naver.com',
        password: 'test',
        role: Role.TEST,
      },
    ]);
  }
}
