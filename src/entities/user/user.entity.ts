import { Role } from 'src/common/types/user/role.type';
import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { RoleTransformer } from 'src/core/database/typeorm/transformer/role.transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { Item } from '../item/item.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column('varchar', { length: 40, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    transformer: new RoleTransformer(),
  })
  role: Role;

  @OneToMany(() => Item, (item) => item.User)
  Items: Item[];

  isSamePassword(password: string) {
    return this.password === password;
  }
}

export class UserItemCount {
  id: string;
  totalCount: number;
}
