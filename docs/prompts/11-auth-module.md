---
title: Authentication Module with JWT and Session Management
id: 11-auth-module
created: 2026-01-15
updated: 2026-01-15
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: backend
complexity: complex
tags:
  - authentication
  - jwt
  - security
  - session-management
  - rbac
dependencies:
  - 05-database-package
  - 09-api-setup
  - 10-api-exception-filter-integration
blocks: []
related_specs:
  - "[[initial/er-diagram]]"
related_planning: []
notes: Successfully implemented auth module with JWT tokens, session management, and RBAC. Added JWT config to @borg/config. All type checks pass.
---

# 11 - Authentication Module with JWT and Session Management

**Date**: 2026-01-15
**Target**: Backend
**Related Spec**: [[initial/er-diagram]]

---

## Context

The `@borg/api` application needs a complete authentication system to secure API endpoints and manage user sessions. The database layer (`@borg/db`) already provides entities for `User`, `Session`, and `RefreshToken` with the appropriate schema defined. This prompt implements the authentication logic, JWT token handling, and role-based access control.

## Goal

Implement a production-ready authentication module in `apps/api` that provides:
- User registration and login endpoints
- JWT-based authentication with access/refresh token pattern
- Session tracking with device information
- Role-based access control (RBAC) using the existing `UserRole` enum
- Secure password hashing with Argon2
- Refresh token rotation for security

## Current State

### Existing Infrastructure
- **Database Entities** (`packages/db/src/entities/`):
  - `User` - email, passwordHash, role (UserRole enum), tenantId, organizationId
  - `Session` - userId, userAgent, ipAddress, deviceType, lastActivityAt, expiresAt
  - `RefreshToken` - sessionId, token, expiresAt (cascade delete with Session)
- **DatabaseService** (`packages/db/src/database.service.ts`) - facade providing `db.users`, `db.sessions`, `db.refreshTokens` repositories
- **UserRole Enum** (`packages/db/src/enums/user-role.enum.ts`): `USER`, `CLIENT`, `CLIENT_ADMIN`, `ADMIN`
- **ConfigService** (`@borg/config`) - environment configuration with Zod validation
- **ExceptionsModule** (`@borg/backend-lib`) - global exception handling with i18n support

### Files to Reference
```
packages/db/src/entities/user.entity.ts
packages/db/src/entities/session.entity.ts
packages/db/src/entities/refresh-token.entity.ts
packages/db/src/enums/user-role.enum.ts
packages/db/src/database.service.ts
apps/api/src/app.module.ts
packages/config/src/config.service.ts
```

## Requirements

### 1. **Environment Configuration**

Extend `@borg/config` to include JWT configuration:

- `JWT_SECRET` - Secret key for signing tokens (required)
- `JWT_ACCESS_TOKEN_EXPIRY` - Access token TTL (default: `15m`)
- `JWT_REFRESH_TOKEN_EXPIRY` - Refresh token TTL (default: `7d`)
- `SESSION_EXPIRY` - Session TTL (default: `30d`)

Add these to the Zod schema in `packages/config/src/schemas/config.schema.ts` and expose via `ConfigService`.

### 2. **Auth Module Structure**

Create the auth module at `apps/api/src/auth/` with the following structure:

```
apps/api/src/auth/
├── auth.module.ts          # Module definition
├── auth.controller.ts      # REST endpoints
├── auth.service.ts         # Core authentication logic
├── session.service.ts      # Session management
├── token.service.ts        # JWT generation/validation
├── dto/
│   ├── register.dto.ts     # Registration input validation
│   ├── login.dto.ts        # Login input validation
│   ├── refresh-token.dto.ts # Refresh token input
│   └── auth-response.dto.ts # Token response structure
├── guards/
│   ├── jwt-auth.guard.ts   # JWT validation guard
│   └── roles.guard.ts      # Role-based access guard
├── decorators/
│   ├── current-user.decorator.ts  # Extract user from request
│   ├── roles.decorator.ts         # Role metadata decorator
│   └── public.decorator.ts        # Mark route as public
├── strategies/
│   └── jwt.strategy.ts     # Passport JWT strategy
└── interfaces/
    ├── jwt-payload.interface.ts   # JWT payload structure
    └── request-user.interface.ts  # Authenticated request user
```

### 3. **Authentication Endpoints**

#### `POST /auth/register`
- **Input**: `RegisterDto` (email, password, firstName, lastName, tenantId)
- **Validation**:
  - Email format and uniqueness (per tenant)
  - Password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
- **Process**:
  1. Hash password with Argon2
  2. Create User record with role `USER`
  3. Create UserProfile with firstName/lastName
  4. Create Session and RefreshToken
  5. Return access token, refresh token, and user data
- **Response**: `AuthResponseDto`

#### `POST /auth/login`
- **Input**: `LoginDto` (email, password, tenantId)
- **Process**:
  1. Find user by email + tenantId
  2. Verify password hash
  3. Create new Session with device info (from headers)
  4. Generate new RefreshToken
  5. Return tokens and user data
- **Error**: Throw `UnauthorizedException` with generic message (don't reveal if email exists)
- **Response**: `AuthResponseDto`

#### `POST /auth/refresh`
- **Input**: `RefreshTokenDto` (refreshToken)
- **Process**:
  1. Validate refresh token exists and not expired
  2. Implement token rotation:
     - Delete old RefreshToken
     - Create new RefreshToken for same Session
  3. Update Session `lastActivityAt`
  4. Return new access token and refresh token
- **Error**: Throw `UnauthorizedException` if token invalid/expired
- **Response**: `AuthResponseDto` (tokens only, no user data)

#### `POST /auth/logout`
- **Auth**: Requires valid access token
- **Process**:
  1. Delete current Session (cascades to RefreshToken)
  2. Return success message
- **Response**: `{ message: 'Logged out successfully' }`

#### `GET /auth/me`
- **Auth**: Requires valid access token
- **Process**: Return current user with profile
- **Response**: User object with profile data

### 4. **JWT Token Structure**

**Access Token Payload** (`JwtPayload`):
```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;
  role: UserRole;
  tenantId: string;
  sessionId: string;
  iat: number;        // Issued at
  exp: number;        // Expiration
}
```

**Refresh Token**: Random 64-byte hex string (not JWT), stored hashed in database.

### 5. **Guards and Decorators**

#### `JwtAuthGuard`
- Extend `AuthGuard('jwt')` from `@nestjs/passport`
- Check for `@Public()` decorator to skip auth
- Validate token and attach user to request

#### `RolesGuard`
- Check user role against `@Roles()` decorator
- Implement role hierarchy: `ADMIN` > `CLIENT_ADMIN` > `CLIENT` > `USER`
- Allow access if user role >= required role

#### Decorators
```typescript
// @Public() - Mark endpoint as publicly accessible
@Public()
@Post('login')

// @Roles() - Require specific roles
@Roles(UserRole.ADMIN, UserRole.CLIENT_ADMIN)
@Get('admin/users')

// @CurrentUser() - Extract user from request
@Get('me')
async getProfile(@CurrentUser() user: RequestUser) {}
```

### 6. **Password Hashing**

Use `argon2` library with secure defaults:
```typescript
import * as argon2 from 'argon2';

// Hash
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,    // 64 MB
  timeCost: 3,
  parallelism: 4,
});

// Verify
const isValid = await argon2.verify(hash, password);
```

### 7. **Session Management Service**

`SessionService` responsibilities:
- Create session with device fingerprint (user-agent, IP, device type)
- Track session activity (update `lastActivityAt`)
- Clean up expired sessions (scheduled task, optional)
- List active sessions for a user (future endpoint)

### 8. **Security Considerations**

- Store refresh tokens hashed (SHA-256) in database
- Implement rate limiting on auth endpoints (use existing NestJS throttler if available, or note for future)
- Log authentication events (success/failure) using `LoggerService`
- Never expose whether email exists in error messages
- Set secure cookie options when implementing cookie-based auth (future)

## Constraints

- **Do NOT** implement email verification (out of scope)
- **Do NOT** implement password reset functionality (separate prompt)
- **Do NOT** implement OAuth/social login (separate prompt)
- Use existing `DatabaseService` facade - don't inject repositories directly
- Follow existing NestJS patterns from `apps/api/src/health/` module
- Use `class-validator` and `class-transformer` for DTO validation
- Integrate with existing `ExceptionsModule` for error handling

## Expected Output

- [ ] **Config Package Updates**:
  - [ ] `packages/config/src/schemas/config.schema.ts` - Add JWT env vars
  - [ ] `packages/config/src/config.service.ts` - Add JWT config getters

- [ ] **Auth Module Files** (all new):
  - [ ] `apps/api/src/auth/auth.module.ts`
  - [ ] `apps/api/src/auth/auth.controller.ts`
  - [ ] `apps/api/src/auth/auth.service.ts`
  - [ ] `apps/api/src/auth/session.service.ts`
  - [ ] `apps/api/src/auth/token.service.ts`
  - [ ] `apps/api/src/auth/dto/*.ts` (4 files)
  - [ ] `apps/api/src/auth/guards/*.ts` (2 files)
  - [ ] `apps/api/src/auth/decorators/*.ts` (3 files)
  - [ ] `apps/api/src/auth/strategies/jwt.strategy.ts`
  - [ ] `apps/api/src/auth/interfaces/*.ts` (2 files)

- [ ] **App Module Update**:
  - [ ] `apps/api/src/app.module.ts` - Import AuthModule

- [ ] **Dependencies**:
  - [ ] Add to `apps/api/package.json`: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `argon2`
  - [ ] Add types: `@types/passport-jwt`

## Acceptance Criteria

- [ ] `POST /auth/register` creates user, profile, session, and returns tokens
- [ ] `POST /auth/login` authenticates user and returns tokens
- [ ] `POST /auth/refresh` rotates refresh token and returns new tokens
- [ ] `POST /auth/logout` invalidates session
- [ ] `GET /auth/me` returns authenticated user (protected route)
- [ ] `@Public()` decorator allows unauthenticated access
- [ ] `@Roles()` decorator restricts access by role
- [ ] Invalid/expired tokens return 401 Unauthorized
- [ ] Passwords are hashed with Argon2
- [ ] Refresh tokens are stored hashed
- [ ] Session tracks device info (user-agent, IP)
- [ ] TypeScript compiles without errors (`pnpm type-check`)
- [ ] API starts successfully (`pnpm dev:api`)

## Technical Notes

### Dependency Installation
```bash
pnpm --filter @borg/api add @nestjs/jwt @nestjs/passport passport passport-jwt argon2
pnpm --filter @borg/api add -D @types/passport-jwt
```

### Example DTO Validation
```typescript
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUUID()
  tenantId: string;
}
```

### JWT Strategy Pattern
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly db: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    // Verify session still exists and not expired
    const session = await this.db.sessions.findOne({
      where: { id: payload.sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      sessionId: payload.sessionId,
    };
  }
}
```

## Files to Modify

```
packages/config/
  src/
    schemas/config.schema.ts    - Add JWT environment variables
    config.service.ts           - Add JWT config getters

apps/api/
  package.json                  - Add auth dependencies
  src/
    app.module.ts               - Import AuthModule
    auth/                       - Create entire module (new directory)
      auth.module.ts
      auth.controller.ts
      auth.service.ts
      session.service.ts
      token.service.ts
      dto/
        register.dto.ts
        login.dto.ts
        refresh-token.dto.ts
        auth-response.dto.ts
      guards/
        jwt-auth.guard.ts
        roles.guard.ts
      decorators/
        current-user.decorator.ts
        roles.decorator.ts
        public.decorator.ts
      strategies/
        jwt.strategy.ts
      interfaces/
        jwt-payload.interface.ts
        request-user.interface.ts
```

## Example/Reference

Reference the existing health module pattern:
- `apps/api/src/health/health.module.ts`
- `apps/api/src/health/health.controller.ts`

Reference Passport.js JWT strategy documentation:
- https://docs.nestjs.com/security/authentication

---

## Related

- Depends on: [[prompts/05-database-package]], [[prompts/09-api-setup]]
- Blocks: Future prompts for protected endpoints
- References: [[initial/er-diagram]]
