import { ItemType } from 'src/common/types/item/item.type';
import { ValueTransformer } from 'typeorm';

export class ItemTypeTransformer implements ValueTransformer {
  to(value: ItemType): string {
    return value.enumName;
  }

  from(value: string): ItemType | null {
    if (!value) return null;
    return ItemType.valueByName(value);
  }
}
