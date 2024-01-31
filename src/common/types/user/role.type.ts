import { Enum, EnumType } from 'ts-jenum';

@Enum('role')
export class Role extends EnumType<Role>() {
  static readonly ADMIN = new Role(0, 'ADMIN');
  static readonly TEST = new Role(1, 'TEST');

  private constructor(readonly code: number, readonly role: string) {
    super();
  }

  isAdmin(): boolean {
    return this.code < Role.TEST.code;
  }
}
