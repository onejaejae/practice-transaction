import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/types/user/role.type';

export const AllowRole = (role: Role) => SetMetadata('role', role);
