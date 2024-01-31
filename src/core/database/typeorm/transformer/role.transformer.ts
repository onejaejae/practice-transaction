import { Role } from 'src/common/types/user/role.type';
import { ValueTransformer } from 'typeorm';

export class RoleTransformer implements ValueTransformer {
  to(value: Role): string {
    return value.enumName;
  }

  from(value: string): Role | null {
    if (!value) return null;
    return Role.valueByName(value);
  }
}
