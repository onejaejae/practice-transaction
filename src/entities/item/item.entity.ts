import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { ItemType } from 'src/common/types/item/item.type';
import { ItemTypeTransformer } from 'src/core/database/typeorm/transformer/itemType.transformer';

@Entity({ name: 'items' })
export class Item extends BaseEntity {
  @Column({ type: 'int', nullable: false, default: 0 })
  count: number;

  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    transformer: new ItemTypeTransformer(),
  })
  type: ItemType;

  static of(userId: number, count: number) {
    const item = new Item();
    item.userId = userId;
    item.count = count;

    return item;
  }

  @Column({ type: 'timestamptz', default: null, nullable: true })
  expiredAt: Date | null;

  @ManyToOne(() => User, (user) => user.Items, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  caculateAmount(remainingCount: number) {
    return Math.min(remainingCount, this.count);
  }

  updateItem(deductedCount: number) {
    this.count -= deductedCount;
    if (this.count === 0 && !this.type.isCommon()) this.expiredAt = new Date();

    return this;
  }
}
