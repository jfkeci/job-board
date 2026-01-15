import { UserRole } from '@borg/db';

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
  sessionId: string;
}
