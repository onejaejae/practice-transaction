import { ItemTypeTransformer } from '../transformer/itemType.transformer';
import { ItemType } from 'src/common/types/item/item.type';

describe('ItemTypeTransformer test', () => {
  let itemTypeTransformer: ItemTypeTransformer;

  beforeAll(() => {
    itemTypeTransformer = new ItemTypeTransformer();
  });

  it('should transform ItemType to string', () => {
    const type = ItemType.COMMON;
    const result = itemTypeTransformer.to(type);

    expect(result).toBe(type.enumName);
  });

  it('should transform string to ItemType', () => {
    const itemTypeName = 'COMMON';
    const transformedItemType = itemTypeTransformer.from(itemTypeName);
    const expectedItemType = ItemType.valueByName(itemTypeName);

    expect(transformedItemType).toBe(expectedItemType);
  });
});
