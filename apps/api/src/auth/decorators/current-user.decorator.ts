import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { RequestUser } from '../interfaces';

/**
 * Extracts the authenticated user from the request
 * Must be used with JwtAuthGuard
 */
export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext): RequestUser | RequestUser[keyof RequestUser] => {
    const request = ctx.switchToHttp().getRequest<Request & { user: RequestUser }>();
    const user = request.user;

    // If a specific field is requested, return just that field
    if (data) {
      return user[data];
    }

    return user;
  },
);
