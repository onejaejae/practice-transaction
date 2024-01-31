import { Enum, EnumType } from 'ts-jenum';

@Enum('type')
export class ItemType extends EnumType<ItemType>() {
  static readonly COMMON = new ItemType(0, 'COMMON');
  static readonly BONUS = new ItemType(1, 'BONUS');

  private constructor(readonly code: number, readonly type: string) {
    super();
  }

  isCommon(): boolean {
    return this.code < ItemType.BONUS.code;
  }
}
