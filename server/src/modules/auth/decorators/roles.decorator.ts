import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export const hasRoles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);
