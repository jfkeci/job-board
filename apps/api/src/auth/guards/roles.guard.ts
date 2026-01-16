import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UserRole } from '@job-board/db';

import { ROLES_KEY } from '../decorators';
import { RequestUser } from '../interfaces';

/**
 * Role hierarchy - higher roles have access to lower role resources
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.CLIENT]: 2,
  [UserRole.CLIENT_ADMIN]: 3,
  [UserRole.ADMIN]: 4,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: RequestUser }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    const userRoleLevel = ROLE_HIERARCHY[user.role];

    // Check if user's role level is >= any of the required roles
    return requiredRoles.some((role) => userRoleLevel >= ROLE_HIERARCHY[role]);
  }
}
