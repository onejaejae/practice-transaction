import { Role } from 'src/common/types/user/role.type';
import { RoleTransformer } from '../transformer/role.transformer';

describe('RoleTransformer test', () => {
  let roleTransformer: RoleTransformer;

  beforeAll(() => {
    roleTransformer = new RoleTransformer();
  });

  it('should transform Role to string', () => {
    const role = Role.ADMIN;
    const result = roleTransformer.to(role);

    expect(result).toBe(role.enumName);
  });

  it('should transform string to Role', () => {
    const roleName = 'ADMIN';
    const transformedRole = roleTransformer.from(roleName);
    const expectedRole = Role.valueByName(roleName);

    expect(transformedRole).toBe(expectedRole);
  });
});
