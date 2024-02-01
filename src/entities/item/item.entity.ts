import { BaseEntity } from 'src/core/database/typeorm/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { ItemType } from 'src/common/types/item/item.type';
import { ItemTypeTransformer } from 'src/core/database/typeorm/transformer/itemType.transformer';
import { InternalServerErrorException } from '@nestjs/common';

@Entity({ name: 'items' })
export class Item extends BaseEntity {
  @Column({ type: 'int', nullable: false, default: 0 })
  original_count: number;

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

  @Column({ type: 'timestamptz', default: null, nullable: true })
  expiredAt: Date | null;

  @ManyToOne(() => User, (user) => user.Items, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  User: User;

  static of(userId: number, count: number) {
    const item = new Item();
    item.userId = userId;
    item.count = count;
    item.original_count = count;

    return item;
  }

  caculateDeductedCount(remainingCount: number) {
    return Math.min(remainingCount, this.count);
  }

  useItem(deductedCount: number) {
    this.count -= deductedCount;

    if (this.count < 0)
      throw new InternalServerErrorException(
        'item의 count 값은 항상 양수여야합니다.',
      );

    if (this.count === 0 && !this.type.isCommon()) this.expiredAt = new Date();

    return this;
  }

  updateItem(expiredAt: Date) {
    this.expiredAt = expiredAt;
    return this;
  }
}
