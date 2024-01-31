import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../types/user/role.type';
import { User } from 'src/entities/user/user.entity';

export class UserShowDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _role: Role;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;
  @Exclude() private readonly _deletedAt: Date;

  constructor(user: User) {
    this._id = user.id;
    this._email = user.email;
    this._role = user.role;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._deletedAt = user.deletedAt;
  }

  @Expose()
  get id(): number {
    return this._id;
  }

  @Expose()
  get email(): string {
    return this._email;
  }

  @Expose()
  get role(): string {
    return this._role.enumName;
  }

  @Expose()
  get createdAt(): Date {
    return this._createdAt;
  }

  @Expose()
  get updatedAt(): Date {
    return this._updatedAt;
  }

  @Expose()
  get deletedAt(): Date {
    return this._deletedAt;
  }
}
