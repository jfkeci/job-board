import { UserRole } from '@borg/db';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: UserRole;
  tenantId: string;
  sessionId: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}
