import { Role } from 'src/common/types/user/role.type';
import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column('varchar', { length: 40, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  role: Role;
}
