---
title: Auth Controller Swagger Documentation and HTTP Exceptions
id: 12-auth-swagger-documentation
created: 2026-01-15
updated: 2026-01-15
status: ready
executed_date:
execution_result: pending
deprecated: false
deprecated_reason:
target: backend
complexity: moderate
tags:
  - authentication
  - swagger
  - documentation
  - exceptions
  - api
dependencies:
  - 11-auth-module
blocks: []
related_specs:
  - "[[initial/er-diagram]]"
related_planning: []
notes: Add comprehensive Swagger docs and proper HTTP exception handling to auth endpoints
---

# 12 - Auth Controller Swagger Documentation and HTTP Exceptions

**Date**: 2026-01-15
**Target**: Backend
**Related Spec**: [[references/swagger-documentation-usage]], [[references/http-exceptions-usage]]

---

## Context

The auth controller (`apps/api/src/auth/auth.controller.ts`) is implemented but lacks Swagger documentation and proper HTTP exception handling. The endpoints need to be documented with request/response schemas and use the standardized `ApiExceptions` factory methods from `@borg/backend-lib` for consistent error responses.

## Goal

Enhance the auth module with:
- Complete Swagger documentation for all endpoints (request body, responses, errors)
- Proper HTTP exceptions using `ApiExceptions` factory methods
- DTO decorators with `@ApiProperty` for request/response documentation
- Error response documentation with examples

## Current State

### Existing Files
```
apps/api/src/auth/
├── auth.controller.ts      # Endpoints without Swagger docs
├── auth.service.ts         # Uses NestJS exceptions (needs ApiExceptions)
├── dto/
│   ├── register.dto.ts     # Has class-validator, needs @ApiProperty
│   ├── login.dto.ts        # Has class-validator, needs @ApiProperty
│   ├── refresh-token.dto.ts # Has class-validator, needs @ApiProperty
│   └── auth-response.dto.ts # Interfaces, needs conversion to classes with @ApiProperty
```

### Current Issues
1. Controller has no `@ApiTags`, `@ApiOperation`, `@ApiResponse` decorators
2. DTOs lack `@ApiProperty` documentation
3. Auth service uses generic NestJS exceptions instead of `ApiExceptions`
4. Response DTOs are interfaces (need to be classes for Swagger)

## Requirements

### 1. **Controller Swagger Decorators**

Add comprehensive Swagger documentation to `auth.controller.ts`:

```typescript
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  // Each endpoint needs full documentation
}
```

### 2. **Endpoint Documentation**

#### `POST /auth/register`
```typescript
@Public()
@Post('register')
@ApiOperation({
  summary: 'Register new user',
  description: 'Creates a new user account with email and password. Returns access and refresh tokens.',
  operationId: 'register',
})
@ApiBody({ type: RegisterDto })
@ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
@ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
@ApiResponse({ status: 409, description: 'Email already registered', type: ApiErrorResponseDto })
```

#### `POST /auth/login`
```typescript
@Public()
@Post('login')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'User login',
  description: 'Authenticates user with email and password. Returns access and refresh tokens.',
  operationId: 'login',
})
@ApiBody({ type: LoginDto })
@ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
@ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
@ApiResponse({ status: 401, description: 'Invalid credentials', type: ApiErrorResponseDto })
```

#### `POST /auth/refresh`
```typescript
@Public()
@Post('refresh')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Refresh tokens',
  description: 'Exchanges a valid refresh token for new access and refresh tokens. Implements token rotation.',
  operationId: 'refreshToken',
})
@ApiBody({ type: RefreshTokenDto })
@ApiResponse({ status: 200, description: 'Tokens refreshed', type: AuthResponseDto })
@ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
@ApiResponse({ status: 401, description: 'Invalid or expired refresh token', type: ApiErrorResponseDto })
```

#### `POST /auth/logout`
```typescript
@Post('logout')
@HttpCode(HttpStatus.OK)
@ApiBearerAuth('access-token')
@ApiOperation({
  summary: 'Logout user',
  description: 'Invalidates the current session and refresh token.',
  operationId: 'logout',
})
@ApiResponse({ status: 200, description: 'Logged out successfully', type: MessageResponseDto })
@ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
```

#### `GET /auth/me`
```typescript
@Get('me')
@ApiBearerAuth('access-token')
@ApiOperation({
  summary: 'Get current user',
  description: 'Returns the authenticated user profile information.',
  operationId: 'getCurrentUser',
})
@ApiResponse({ status: 200, description: 'User profile retrieved', type: UserResponseDto })
@ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
```

### 3. **DTO Documentation**

Convert DTOs to classes with `@ApiProperty` decorators:

#### `RegisterDto`
```typescript
export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User password (min 8 chars, must contain uppercase, lowercase, and number)',
    example: 'SecurePass123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  lastName!: string;

  @ApiProperty({
    description: 'Tenant ID (country/region)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  tenantId!: string;
}
```

#### `LoginDto`
```typescript
export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123',
  })
  @IsString()
  @MinLength(1)
  password!: string;

  @ApiProperty({
    description: 'Tenant ID (country/region)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  tenantId!: string;
}
```

#### `RefreshTokenDto`
```typescript
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token from previous login/refresh',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  @MinLength(1)
  refreshToken!: string;
}
```

#### `AuthResponseDto` (convert from interface to class)
```typescript
export class UserProfileDto {
  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiPropertyOptional({ example: '+385911234567', nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ example: 'Senior Developer', nullable: true })
  headline!: string | null;
}

export class UserResponseDto {
  @ApiProperty({ format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ format: 'email', example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole', example: 'USER' })
  role!: UserRole;

  @ApiProperty({ format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  tenantId!: string;

  @ApiProperty({ example: false })
  emailVerified!: boolean;

  @ApiProperty({ example: 'en' })
  language!: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  organizationId!: string | null;

  @ApiProperty({ format: 'date-time', example: '2026-01-15T10:00:00.000Z' })
  createdAt!: Date;

  @ApiPropertyOptional({ type: UserProfileDto })
  profile?: UserProfileDto;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token (15 min expiry)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: 'a1b2c3d4e5f6789...',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Access token expiry in seconds',
    example: 900,
  })
  expiresIn!: number;

  @ApiPropertyOptional({
    description: 'User data (included on register/login, omitted on refresh)',
    type: UserResponseDto,
  })
  user?: UserResponseDto;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Logged out successfully' })
  message!: string;
}
```

### 4. **HTTP Exception Handling**

Update `auth.service.ts` to use `ApiExceptions` from `@borg/backend-lib`:

```typescript
import { ApiExceptions } from '@borg/backend-lib';

@Injectable()
export class AuthService {
  async register(dto: RegisterDto, request: Request): Promise<AuthResponseDto> {
    // Check if email exists
    const existingUser = await this.db.users.findOne({...});
    if (existingUser) {
      throw ApiExceptions.userAlreadyExists(); // Instead of ConflictException
    }
    // ...
  }

  async login(dto: LoginDto, request: Request): Promise<AuthResponseDto> {
    const user = await this.db.users.findOne({...});
    if (!user || !user.passwordHash) {
      throw ApiExceptions.invalidCredentials(); // Instead of UnauthorizedException
    }

    const isPasswordValid = await this.verifyPassword(...);
    if (!isPasswordValid) {
      throw ApiExceptions.invalidCredentials();
    }
    // ...
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    const sessionId = await this.tokenService.validateRefreshToken(refreshToken);
    if (!sessionId) {
      throw ApiExceptions.refreshTokenInvalid(); // Instead of UnauthorizedException
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session || session.expiresAt < new Date()) {
      throw ApiExceptions.sessionExpired();
    }

    const user = await this.db.users.findOne({...});
    if (!user) {
      throw ApiExceptions.userNotFound();
    }
    // ...
  }

  async getCurrentUser(requestUser: RequestUser): Promise<UserResponseDto> {
    const user = await this.db.users.findOne({...});
    if (!user) {
      throw ApiExceptions.userNotFound(); // Instead of UnauthorizedException
    }
    // ...
  }
}
```

### 5. **ApiErrorResponseDto**

Create or import the standard error response DTO for Swagger documentation:

```typescript
// apps/api/src/common/dto/api-error-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDetailDto {
  @ApiProperty({ example: 'email' })
  field!: string;

  @ApiProperty({ example: 'VALIDATION_EMAIL_INVALID' })
  code!: string;

  @ApiProperty({ example: 'Please enter a valid email address' })
  message!: string;
}

export class ApiErrorDto {
  @ApiProperty({ example: 'AUTH_INVALID_CREDENTIALS' })
  code!: string;

  @ApiProperty({ example: 'Invalid email or password' })
  message!: string;

  @ApiProperty({
    enum: ['validation_error', 'authentication_error', 'authorization_error',
           'not_found_error', 'conflict_error', 'rate_limit_error',
           'api_error', 'internal_error'],
    example: 'authentication_error',
  })
  type!: string;

  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ format: 'date-time', example: '2026-01-15T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/auth/login' })
  path!: string;

  @ApiPropertyOptional({ type: [ErrorDetailDto] })
  details?: ErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: ApiErrorDto })
  error!: ApiErrorDto;
}
```

## Constraints

- Use existing `@borg/backend-lib` exception system - don't create new exception classes
- Follow Swagger patterns from `docs/references/swagger-documentation-usage.md`
- Follow exception patterns from `docs/references/http-exceptions-usage.md`
- Keep DTO validation decorators (`class-validator`) alongside `@ApiProperty`
- Maintain backward compatibility with existing auth functionality

## Expected Output

- [ ] **Controller Updates**:
  - [ ] `apps/api/src/auth/auth.controller.ts` - Add Swagger decorators

- [ ] **DTO Updates**:
  - [ ] `apps/api/src/auth/dto/register.dto.ts` - Add @ApiProperty
  - [ ] `apps/api/src/auth/dto/login.dto.ts` - Add @ApiProperty
  - [ ] `apps/api/src/auth/dto/refresh-token.dto.ts` - Add @ApiProperty
  - [ ] `apps/api/src/auth/dto/auth-response.dto.ts` - Convert to classes with @ApiProperty

- [ ] **Service Updates**:
  - [ ] `apps/api/src/auth/auth.service.ts` - Use ApiExceptions

- [ ] **New Files**:
  - [ ] `apps/api/src/common/dto/api-error-response.dto.ts` - Error response DTO
  - [ ] `apps/api/src/common/dto/index.ts` - Export barrel

## Acceptance Criteria

- [ ] Swagger UI (`/api/docs`) shows all auth endpoints with full documentation
- [ ] Request body schemas are documented with examples
- [ ] Response schemas include success and error responses
- [ ] All error responses use `ApiErrorResponseDto` type
- [ ] Auth service uses `ApiExceptions` factory methods
- [ ] Error responses follow the standard format from `http-exceptions-usage.md`
- [ ] TypeScript compiles without errors (`pnpm type-check`)
- [ ] API starts successfully (`pnpm dev:api`)

## Technical Notes

### Exception Mapping

| Scenario | Exception | HTTP Status |
|----------|-----------|-------------|
| Email already exists | `ApiExceptions.userAlreadyExists()` | 409 |
| Invalid email/password | `ApiExceptions.invalidCredentials()` | 401 |
| Invalid refresh token | `ApiExceptions.refreshTokenInvalid()` | 401 |
| Refresh token expired | `ApiExceptions.refreshTokenExpired()` | 401 |
| Session expired | `ApiExceptions.sessionExpired()` | 401 |
| User not found | `ApiExceptions.userNotFound()` | 404 |

### Swagger Error Examples

```typescript
@ApiResponse({
  status: 409,
  description: 'Email already registered',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      example: {
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: 'A user with this email already exists',
          type: 'conflict_error',
          statusCode: 409,
          timestamp: '2026-01-15T10:00:00.000Z',
          path: '/api/auth/register',
        },
      },
    },
  },
})
```

## Files to Modify

```
apps/api/src/
  auth/
    auth.controller.ts        - Add Swagger decorators
    auth.service.ts           - Use ApiExceptions
    dto/
      register.dto.ts         - Add @ApiProperty
      login.dto.ts            - Add @ApiProperty
      refresh-token.dto.ts    - Add @ApiProperty
      auth-response.dto.ts    - Convert to classes with @ApiProperty
      index.ts                - Update exports
  common/
    dto/
      api-error-response.dto.ts  - Create error DTO (new)
      index.ts                   - Create export barrel (new)
```

---

## Related

- Depends on: [[prompts/11-auth-module]]
- References: [[references/swagger-documentation-usage]], [[references/http-exceptions-usage]]
