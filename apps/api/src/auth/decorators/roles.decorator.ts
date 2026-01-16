import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@job-board/db';

export const ROLES_KEY = 'roles';

/**
 * Sets the required roles for accessing a route
 * Multiple roles can be specified - user must have at least one
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
