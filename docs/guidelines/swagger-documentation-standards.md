# Swagger/OpenAPI Documentation Standards

## Purpose

This document defines guidelines for creating consistent, detailed Swagger/OpenAPI documentation across all backend services. The primary goals are:

1. **AI-assisted frontend development** - AI tools can accurately generate API calls, types, and error handling
2. **Frontend error handling decisions** - Clear exception documentation enables frontend to decide whether to show backend messages or custom UI
3. **Type generation** - Automated TypeScript type generation from OpenAPI specs
4. **Contract clarity** - Explicit contracts between frontend and backend

---

## Core Documentation Requirements

Every endpoint MUST document:

1. **Request Body** - Complete schema with validation rules and examples
2. **Response** - Success response structure with all possible shapes
3. **Exceptions** - All possible error codes, when they occur, and display guidance

---

## Request Body Documentation

### Required Elements

Every request body must include:

```typescript
@ApiBody({
  type: CreateJobDto,
  description: 'Detailed description of the payload purpose',
  required: true,
  examples: {
    minimal: {
      summary: 'Minimum required fields',
      value: { /* minimal example */ },
    },
    complete: {
      summary: 'All fields populated',
      value: { /* complete example */ },
    },
  },
})
```

### DTO Property Documentation

```typescript
export class CreateJobDto {
  @ApiProperty({
    description: 'Job posting title displayed to candidates',
    example: 'Senior Software Engineer',
    minLength: 3,
    maxLength: 200,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Full job description (supports Markdown)',
    example: '## About the Role\n\nWe are looking for...',
    minLength: 100,
    maxLength: 50000,
    required: true,
  })
  @IsString()
  @MinLength(100)
  @MaxLength(50000)
  description: string;

  @ApiProperty({
    description: 'Job category identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Salary range for the position',
    type: SalaryRangeDto,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryRangeDto)
  salary?: SalaryRangeDto;

  @ApiProperty({
    description: 'Job posting status',
    enum: JobStatus,
    enumName: 'JobStatus',
    default: JobStatus.DRAFT,
    example: JobStatus.ACTIVE,
  })
  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.DRAFT;
}
```

### Nested Object Documentation

```typescript
export class SalaryRangeDto {
  @ApiProperty({
    description: 'Minimum salary amount',
    minimum: 0,
    example: 80000,
  })
  @IsNumber()
  @Min(0)
  min: number;

  @ApiProperty({
    description: 'Maximum salary amount (must be >= min)',
    minimum: 0,
    example: 120000,
  })
  @IsNumber()
  @Min(0)
  max: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'EUR',
    pattern: '^[A-Z]{3}$',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency: string;
}
```

---

## Response Documentation

### Success Response Structure

```typescript
@ApiResponse({
  status: 200,
  description: 'Job retrieved successfully',
  type: JobResponseDto,
})

@ApiResponse({
  status: 201,
  description: 'Job created successfully',
  type: JobResponseDto,
  headers: {
    Location: {
      description: 'URL of the created resource',
      schema: { type: 'string', example: '/v1/jobs/550e8400-e29b-41d4-a716-446655440000' },
    },
  },
})

@ApiResponse({
  status: 204,
  description: 'Job deleted successfully (no content returned)',
})
```

### Response DTO Documentation

```typescript
export class JobResponseDto {
  @ApiProperty({
    description: 'Unique job identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Job posting title',
    example: 'Senior Software Engineer',
  })
  title: string;

  @ApiProperty({
    description: 'Current job status',
    enum: JobStatus,
    enumName: 'JobStatus',
    example: JobStatus.ACTIVE,
  })
  status: JobStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
    example: '2026-01-13T12:00:00.000Z',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Salary range (null if not disclosed)',
    type: SalaryRangeDto,
    nullable: true,
  })
  salary: SalaryRangeDto | null;
}
```

### Paginated Response

```typescript
export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number (1-indexed)', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 150 })
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 8 })
  totalPages: number;

  @ApiProperty({ description: 'Has more pages after current', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Has pages before current', example: false })
  hasPrevPage: boolean;
}

export class PaginatedJobResponseDto {
  @ApiProperty({ type: [JobListItemDto] })
  data: JobListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
```

---

## Exception Documentation (Critical for Frontend)

### Why Exception Documentation Matters

Frontend error handling must decide:
- **Show backend message?** - User-friendly messages from backend (e.g., "Email already registered")
- **Show custom message?** - Frontend-defined messages for better UX
- **Show nothing?** - Silent handling (e.g., retry logic)
- **Redirect?** - Auth errors might redirect to login

This requires knowing **which errors can occur** and **what they mean**.

### Standard Error Response Format

All errors follow this structure (from `@job-board/backend-lib` exception filter):

```typescript
export class ErrorDetailDto {
  @ApiProperty({
    description: 'Field that caused the error (for validation)',
    example: 'email',
  })
  field: string;

  @ApiProperty({
    description: 'Machine-readable error code for frontend logic',
    example: 'VALIDATION_EMAIL_INVALID',
  })
  code: string;

  @ApiProperty({
    description: 'Localized human-readable message (based on X-Language header)',
    example: 'Please enter a valid email address',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'The invalid value (redacted if sensitive)',
  })
  value?: unknown;
}

export class ApiErrorDto {
  @ApiProperty({
    description: 'Machine-readable error code - USE THIS for frontend error handling logic',
    example: 'AUTH_INVALID_CREDENTIALS',
  })
  code: string;

  @ApiProperty({
    description: 'Localized message safe to display to users (based on X-Language header)',
    example: 'Invalid email or password',
  })
  message: string;

  @ApiProperty({
    description: 'Error category for grouping similar errors',
    enum: ['validation_error', 'authentication_error', 'authorization_error', 'not_found_error', 'conflict_error', 'rate_limit_error', 'api_error', 'internal_error'],
    example: 'authentication_error',
  })
  type: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'ISO 8601 timestamp of when error occurred',
    example: '2026-01-13T12:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path that caused the error',
    example: '/v1/auth/login',
  })
  path: string;

  @ApiPropertyOptional({
    description: 'Request ID for support/debugging',
    example: 'req_abc123xyz',
  })
  requestId?: string;

  @ApiPropertyOptional({
    description: 'Field-level errors for validation failures',
    type: [ErrorDetailDto],
  })
  details?: ErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: ApiErrorDto })
  error: ApiErrorDto;
}
```

### Exception Documentation Template

For EACH endpoint, document ALL possible exceptions with frontend handling guidance:

```typescript
@ApiResponse({
  status: 400,
  description: 'Validation Error',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      examples: {
        validation_failed: {
          summary: 'VALIDATION_FAILED - Input validation errors',
          description: `
            **When:** Request body fails validation rules
            **Frontend Action:** Display field-level errors from 'details' array
            **Show Backend Message:** Yes - use detail.message for each field
          `,
          value: {
            error: {
              code: 'VALIDATION_FAILED',
              message: 'Validation failed. Please check your input',
              type: 'validation_error',
              statusCode: 400,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/jobs',
              details: [
                { field: 'title', code: 'VALIDATION_FIELD_REQUIRED', message: 'Title is required' },
                { field: 'email', code: 'VALIDATION_EMAIL_INVALID', message: 'Please enter a valid email address' },
              ],
            },
          },
        },
      },
    },
  },
})
@ApiResponse({
  status: 401,
  description: 'Authentication Error',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      examples: {
        token_expired: {
          summary: 'AUTH_TOKEN_EXPIRED - Session expired',
          description: `
            **When:** JWT access token has expired
            **Frontend Action:** Attempt token refresh, redirect to login if refresh fails
            **Show Backend Message:** No - show "Session expired, please log in again"
          `,
          value: {
            error: {
              code: 'AUTH_TOKEN_EXPIRED',
              message: 'Your session has expired. Please log in again',
              type: 'authentication_error',
              statusCode: 401,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/jobs',
            },
          },
        },
        token_invalid: {
          summary: 'AUTH_TOKEN_INVALID - Invalid token',
          description: `
            **When:** JWT token is malformed or signature invalid
            **Frontend Action:** Clear stored tokens, redirect to login
            **Show Backend Message:** No - show generic auth error
          `,
          value: {
            error: {
              code: 'AUTH_TOKEN_INVALID',
              message: 'Invalid authentication token',
              type: 'authentication_error',
              statusCode: 401,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/jobs',
            },
          },
        },
      },
    },
  },
})
@ApiResponse({
  status: 403,
  description: 'Authorization Error',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      examples: {
        permission_denied: {
          summary: 'AUTHZ_PERMISSION_DENIED - Insufficient permissions',
          description: `
            **When:** User lacks required permission for this action
            **Frontend Action:** Show access denied message, optionally hide UI element
            **Show Backend Message:** Yes - message is user-friendly
          `,
          value: {
            error: {
              code: 'AUTHZ_PERMISSION_DENIED',
              message: 'You do not have permission to perform this action',
              type: 'authorization_error',
              statusCode: 403,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/jobs',
            },
          },
        },
      },
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'Resource Not Found',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      examples: {
        job_not_found: {
          summary: 'JOB_NOT_FOUND - Job does not exist',
          description: `
            **When:** Requested job ID does not exist or was deleted
            **Frontend Action:** Show not found page or redirect to list
            **Show Backend Message:** Yes - or use custom "Job not found" message
          `,
          value: {
            error: {
              code: 'JOB_NOT_FOUND',
              message: 'The requested job was not found',
              type: 'not_found_error',
              statusCode: 404,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/jobs/invalid-id',
            },
          },
        },
      },
    },
  },
})
@ApiResponse({
  status: 409,
  description: 'Conflict Error',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      examples: {
        already_exists: {
          summary: 'APPLICATION_ALREADY_EXISTS - Duplicate application',
          description: `
            **When:** User already applied to this job
            **Frontend Action:** Show message, update UI to reflect existing application
            **Show Backend Message:** Yes - "You have already applied to this job"
          `,
          value: {
            error: {
              code: 'APPLICATION_ALREADY_EXISTS',
              message: 'You have already applied to this job',
              type: 'conflict_error',
              statusCode: 409,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/applications',
            },
          },
        },
      },
    },
  },
})
@ApiResponse({
  status: 429,
  description: 'Rate Limit Error',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      examples: {
        rate_limited: {
          summary: 'RATE_LIMIT_EXCEEDED - Too many requests',
          description: `
            **When:** User exceeded allowed request rate
            **Frontend Action:** Show temporary error, implement backoff retry
            **Show Backend Message:** No - show "Please wait before trying again"
          `,
          value: {
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests. Please try again later',
              type: 'rate_limit_error',
              statusCode: 429,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/jobs',
            },
          },
        },
      },
    },
  },
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error',
  type: ApiErrorResponseDto,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(ApiErrorResponseDto) },
      examples: {
        internal_error: {
          summary: 'INTERNAL_ERROR - Unexpected server error',
          description: `
            **When:** Unhandled server exception
            **Frontend Action:** Show generic error, log requestId for support
            **Show Backend Message:** No - show "Something went wrong. Please try again"
          `,
          value: {
            error: {
              code: 'INTERNAL_ERROR',
              message: 'An unexpected error occurred',
              type: 'internal_error',
              statusCode: 500,
              timestamp: '2026-01-13T12:00:00.000Z',
              path: '/v1/jobs',
              requestId: 'req_abc123',
            },
          },
        },
      },
    },
  },
})
```

### Exception Documentation by Endpoint Type

#### Authentication Endpoints

```typescript
// POST /v1/auth/login
@ApiResponse({
  status: 400,
  description: 'Validation errors',
  /* VALIDATION_FAILED with details */
})
@ApiResponse({
  status: 401,
  description: 'Invalid credentials',
  content: {
    'application/json': {
      examples: {
        invalid_credentials: {
          summary: 'AUTH_INVALID_CREDENTIALS',
          description: `
            **When:** Email/password combination is incorrect
            **Frontend Action:** Show error on form
            **Show Backend Message:** Yes - "Invalid email or password"
          `,
          value: { error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid email or password', /* ... */ } },
        },
        account_locked: {
          summary: 'AUTH_ACCOUNT_LOCKED',
          description: `
            **When:** Too many failed login attempts
            **Frontend Action:** Show lockout message with unlock instructions
            **Show Backend Message:** Yes - includes unlock time if applicable
          `,
          value: { error: { code: 'AUTH_ACCOUNT_LOCKED', message: 'Account locked due to multiple failed attempts', /* ... */ } },
        },
        account_disabled: {
          summary: 'AUTH_ACCOUNT_DISABLED',
          description: `
            **When:** Account has been disabled by admin
            **Frontend Action:** Show contact support message
            **Show Backend Message:** Yes
          `,
          value: { error: { code: 'AUTH_ACCOUNT_DISABLED', message: 'Your account has been disabled', /* ... */ } },
        },
        email_not_verified: {
          summary: 'AUTH_EMAIL_NOT_VERIFIED',
          description: `
            **When:** Email verification required before login
            **Frontend Action:** Show verification prompt, offer resend option
            **Show Backend Message:** Yes
          `,
          value: { error: { code: 'AUTH_EMAIL_NOT_VERIFIED', message: 'Please verify your email address', /* ... */ } },
        },
        mfa_required: {
          summary: 'AUTH_MFA_REQUIRED',
          description: `
            **When:** Multi-factor authentication step needed
            **Frontend Action:** Redirect to MFA input screen
            **Show Backend Message:** No - show MFA UI
          `,
          value: { error: { code: 'AUTH_MFA_REQUIRED', message: 'Multi-factor authentication required', /* ... */ } },
        },
      },
    },
  },
})
```

#### CRUD Endpoints

```typescript
// POST /v1/jobs (Create)
@ApiResponse({ status: 201, description: 'Job created', type: JobResponseDto })
@ApiResponse({ status: 400, description: 'Validation failed', /* VALIDATION_FAILED */ })
@ApiResponse({ status: 401, description: 'Not authenticated', /* AUTH_TOKEN_* */ })
@ApiResponse({ status: 403, description: 'No permission', /* AUTHZ_PERMISSION_DENIED */ })
@ApiResponse({
  status: 409,
  description: 'Duplicate job',
  content: {
    'application/json': {
      examples: {
        duplicate: {
          summary: 'RESOURCE_ALREADY_EXISTS',
          description: `
            **When:** Job with same title exists in organization
            **Frontend Action:** Show error, suggest editing existing job
            **Show Backend Message:** Yes
          `,
          value: { error: { code: 'RESOURCE_ALREADY_EXISTS', /* ... */ } },
        },
      },
    },
  },
})

// GET /v1/jobs/:id (Read)
@ApiResponse({ status: 200, description: 'Job found', type: JobResponseDto })
@ApiResponse({ status: 401, description: 'Not authenticated' })
@ApiResponse({
  status: 404,
  description: 'Job not found',
  content: {
    'application/json': {
      examples: {
        not_found: {
          summary: 'JOB_NOT_FOUND',
          description: `
            **When:** Job ID does not exist
            **Frontend Action:** Redirect to job list or show 404 page
            **Show Backend Message:** Optional
          `,
          value: { error: { code: 'JOB_NOT_FOUND', /* ... */ } },
        },
        expired: {
          summary: 'JOB_EXPIRED',
          description: `
            **When:** Job posting has expired
            **Frontend Action:** Show expired message, hide apply button
            **Show Backend Message:** Yes - "This job posting has expired"
          `,
          value: { error: { code: 'JOB_EXPIRED', /* ... */ } },
        },
      },
    },
  },
})

// PUT /v1/jobs/:id (Update)
@ApiResponse({ status: 200, description: 'Job updated', type: JobResponseDto })
@ApiResponse({ status: 400, description: 'Validation failed' })
@ApiResponse({ status: 401, description: 'Not authenticated' })
@ApiResponse({ status: 403, description: 'No permission' })
@ApiResponse({ status: 404, description: 'Job not found' })
@ApiResponse({
  status: 409,
  description: 'Conflict',
  content: {
    'application/json': {
      examples: {
        locked: {
          summary: 'RESOURCE_LOCKED',
          description: `
            **When:** Job is being edited by another user
            **Frontend Action:** Show locked message, offer refresh
            **Show Backend Message:** Yes
          `,
          value: { error: { code: 'RESOURCE_LOCKED', /* ... */ } },
        },
      },
    },
  },
})

// DELETE /v1/jobs/:id (Delete)
@ApiResponse({ status: 204, description: 'Job deleted' })
@ApiResponse({ status: 401, description: 'Not authenticated' })
@ApiResponse({ status: 403, description: 'No permission' })
@ApiResponse({ status: 404, description: 'Job not found' })
@ApiResponse({
  status: 409,
  description: 'Cannot delete',
  content: {
    'application/json': {
      examples: {
        has_applications: {
          summary: 'RESOURCE_CONFLICT',
          description: `
            **When:** Job has active applications and cannot be deleted
            **Frontend Action:** Show error, suggest archiving instead
            **Show Backend Message:** Yes - explains why deletion failed
          `,
          value: { error: { code: 'RESOURCE_CONFLICT', message: 'Cannot delete job with active applications', /* ... */ } },
        },
      },
    },
  },
})
```

---

## Exception Code Reference

### Frontend Handling Decision Matrix

| Error Code | Show Backend Message | Frontend Action |
|------------|---------------------|-----------------|
| `VALIDATION_FAILED` | Yes (use `details[].message`) | Display field errors |
| `AUTH_INVALID_CREDENTIALS` | Yes | Show on login form |
| `AUTH_TOKEN_EXPIRED` | No | Refresh token or redirect to login |
| `AUTH_TOKEN_INVALID` | No | Clear tokens, redirect to login |
| `AUTH_ACCOUNT_LOCKED` | Yes | Show lockout info |
| `AUTH_ACCOUNT_DISABLED` | Yes | Show contact support |
| `AUTH_EMAIL_NOT_VERIFIED` | Yes | Show verification prompt |
| `AUTH_MFA_REQUIRED` | No | Show MFA input UI |
| `AUTH_MFA_INVALID` | Yes | Show on MFA form |
| `AUTHZ_PERMISSION_DENIED` | Yes | Show access denied |
| `AUTHZ_ROLE_REQUIRED` | Yes | Show upgrade prompt |
| `RESOURCE_NOT_FOUND` | Optional | Show 404 or redirect |
| `RESOURCE_ALREADY_EXISTS` | Yes | Show duplicate error |
| `RESOURCE_CONFLICT` | Yes | Explain conflict |
| `RESOURCE_LOCKED` | Yes | Show locked message |
| `RATE_LIMIT_EXCEEDED` | No | Show "try again later" |
| `FILE_TOO_LARGE` | Yes | Show size limit |
| `FILE_TYPE_NOT_ALLOWED` | Yes | Show allowed types |
| `EXTERNAL_SERVICE_*` | No | Show generic error |
| `INTERNAL_ERROR` | No | Show generic error |

### Exception Codes Enum (Complete Reference)

```typescript
enum ExceptionCode {
  // Authentication - Show message: Varies
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',  // Yes
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',              // No - redirect
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',              // No - redirect
  AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',              // No - redirect
  AUTH_REFRESH_TOKEN_EXPIRED = 'AUTH_REFRESH_TOKEN_EXPIRED', // No - redirect
  AUTH_REFRESH_TOKEN_INVALID = 'AUTH_REFRESH_TOKEN_INVALID', // No - redirect
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',          // No - redirect
  AUTH_ACCOUNT_DISABLED = 'AUTH_ACCOUNT_DISABLED',        // Yes
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',            // Yes
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',    // Yes
  AUTH_MFA_REQUIRED = 'AUTH_MFA_REQUIRED',                // No - show MFA UI
  AUTH_MFA_INVALID = 'AUTH_MFA_INVALID',                  // Yes

  // Authorization - Show message: Yes
  AUTHZ_PERMISSION_DENIED = 'AUTHZ_PERMISSION_DENIED',
  AUTHZ_ROLE_REQUIRED = 'AUTHZ_ROLE_REQUIRED',
  AUTHZ_RESOURCE_ACCESS_DENIED = 'AUTHZ_RESOURCE_ACCESS_DENIED',
  AUTHZ_TENANT_ACCESS_DENIED = 'AUTHZ_TENANT_ACCESS_DENIED',
  AUTHZ_ORGANIZATION_ACCESS_DENIED = 'AUTHZ_ORGANIZATION_ACCESS_DENIED',

  // Resource - Show message: Usually yes
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_GONE = 'RESOURCE_GONE',
  RESOURCE_LOCKED = 'RESOURCE_LOCKED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  JOB_NOT_FOUND = 'JOB_NOT_FOUND',
  JOB_EXPIRED = 'JOB_EXPIRED',
  JOB_CLOSED = 'JOB_CLOSED',
  APPLICATION_NOT_FOUND = 'APPLICATION_NOT_FOUND',
  APPLICATION_ALREADY_EXISTS = 'APPLICATION_ALREADY_EXISTS',

  // Validation - Show message: Yes (from details)
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  VALIDATION_FIELD_REQUIRED = 'VALIDATION_FIELD_REQUIRED',
  VALIDATION_FIELD_INVALID = 'VALIDATION_FIELD_INVALID',
  VALIDATION_FIELD_TOO_SHORT = 'VALIDATION_FIELD_TOO_SHORT',
  VALIDATION_FIELD_TOO_LONG = 'VALIDATION_FIELD_TOO_LONG',
  VALIDATION_EMAIL_INVALID = 'VALIDATION_EMAIL_INVALID',
  VALIDATION_PHONE_INVALID = 'VALIDATION_PHONE_INVALID',
  VALIDATION_PASSWORD_WEAK = 'VALIDATION_PASSWORD_WEAK',

  // Rate Limiting - Show message: No
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_TOO_MANY_REQUESTS = 'RATE_LIMIT_TOO_MANY_REQUESTS',

  // File - Show message: Yes
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED = 'FILE_TYPE_NOT_ALLOWED',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',

  // External/Internal - Show message: No
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  EXTERNAL_SERVICE_TIMEOUT = 'EXTERNAL_SERVICE_TIMEOUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INTERNAL_DATABASE_ERROR = 'INTERNAL_DATABASE_ERROR',
}
```

---

## Complete Endpoint Documentation Example

```typescript
@ApiTags('Jobs')
@Controller('v1/jobs')
@ApiBearerAuth('access-token')
@ApiExtraModels(ApiErrorResponseDto, JobResponseDto, JobListItemDto)
export class JobsController {

  @Post()
  @ApiOperation({
    summary: 'Create a new job posting',
    description: `
      Creates a new job posting for the authenticated organization.

      **Required Permission:** \`jobs:create\`

      **Business Rules:**
      - Job title must be unique within organization
      - Draft jobs are not visible to candidates
      - Publishing requires all required fields

      **Side Effects:**
      - Sends notification to organization admins
      - Triggers search index update (async)
    `,
    operationId: 'createJob',
  })
  @ApiBody({
    type: CreateJobDto,
    description: 'Job posting data',
    examples: {
      draft: {
        summary: 'Draft job (minimal)',
        value: {
          title: 'Software Engineer',
          description: 'We are looking for a talented engineer...',
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          status: 'draft',
        },
      },
      published: {
        summary: 'Published job (complete)',
        value: {
          title: 'Senior Software Engineer',
          description: '## About Us\n\nWe are a growing startup...',
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          status: 'active',
          salary: { min: 80000, max: 120000, currency: 'EUR' },
          location: { city: 'Zagreb', country: 'HR', remote: true },
          requirements: ['5+ years experience', 'TypeScript', 'NestJS'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Job created successfully',
    type: JobResponseDto,
    headers: {
      Location: {
        description: 'URL of created job',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation Error',
    type: ApiErrorResponseDto,
    content: {
      'application/json': {
        examples: {
          validation_failed: {
            summary: 'VALIDATION_FAILED',
            description: `
              **When:** Request body fails validation
              **Frontend Action:** Display errors from details array next to form fields
              **Show Backend Message:** Yes - use details[].message for each field
            `,
            value: {
              error: {
                code: 'VALIDATION_FAILED',
                message: 'Validation failed. Please check your input',
                type: 'validation_error',
                statusCode: 400,
                timestamp: '2026-01-13T12:00:00.000Z',
                path: '/v1/jobs',
                details: [
                  { field: 'title', code: 'VALIDATION_FIELD_REQUIRED', message: 'Title is required' },
                  { field: 'description', code: 'VALIDATION_FIELD_TOO_SHORT', message: 'Description must be at least 100 characters' },
                ],
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication Error',
    type: ApiErrorResponseDto,
    content: {
      'application/json': {
        examples: {
          token_expired: {
            summary: 'AUTH_TOKEN_EXPIRED',
            description: `
              **When:** JWT access token has expired
              **Frontend Action:** Attempt silent token refresh, redirect to login if fails
              **Show Backend Message:** No
            `,
            value: {
              error: {
                code: 'AUTH_TOKEN_EXPIRED',
                message: 'Your session has expired',
                type: 'authentication_error',
                statusCode: 401,
                timestamp: '2026-01-13T12:00:00.000Z',
                path: '/v1/jobs',
              },
            },
          },
          token_invalid: {
            summary: 'AUTH_TOKEN_INVALID',
            description: `
              **When:** JWT token is malformed or tampered
              **Frontend Action:** Clear auth state, redirect to login
              **Show Backend Message:** No
            `,
            value: {
              error: {
                code: 'AUTH_TOKEN_INVALID',
                message: 'Invalid authentication token',
                type: 'authentication_error',
                statusCode: 401,
                timestamp: '2026-01-13T12:00:00.000Z',
                path: '/v1/jobs',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Authorization Error',
    type: ApiErrorResponseDto,
    content: {
      'application/json': {
        examples: {
          permission_denied: {
            summary: 'AUTHZ_PERMISSION_DENIED',
            description: `
              **When:** User lacks jobs:create permission
              **Frontend Action:** Show access denied, hide create button in UI
              **Show Backend Message:** Yes
            `,
            value: {
              error: {
                code: 'AUTHZ_PERMISSION_DENIED',
                message: 'You do not have permission to create jobs',
                type: 'authorization_error',
                statusCode: 403,
                timestamp: '2026-01-13T12:00:00.000Z',
                path: '/v1/jobs',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict Error',
    type: ApiErrorResponseDto,
    content: {
      'application/json': {
        examples: {
          duplicate_title: {
            summary: 'RESOURCE_ALREADY_EXISTS',
            description: `
              **When:** Job with same title exists in organization
              **Frontend Action:** Show error, suggest editing existing or changing title
              **Show Backend Message:** Yes
            `,
            value: {
              error: {
                code: 'RESOURCE_ALREADY_EXISTS',
                message: 'A job with this title already exists',
                type: 'conflict_error',
                statusCode: 409,
                timestamp: '2026-01-13T12:00:00.000Z',
                path: '/v1/jobs',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Rate Limit Error',
    type: ApiErrorResponseDto,
    content: {
      'application/json': {
        examples: {
          rate_limited: {
            summary: 'RATE_LIMIT_EXCEEDED',
            description: `
              **When:** Too many job creation requests
              **Frontend Action:** Disable submit button, show cooldown timer
              **Show Backend Message:** No - show "Please wait before creating another job"
            `,
            value: {
              error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests',
                type: 'rate_limit_error',
                statusCode: 429,
                timestamp: '2026-01-13T12:00:00.000Z',
                path: '/v1/jobs',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ApiErrorResponseDto,
    content: {
      'application/json': {
        examples: {
          internal_error: {
            summary: 'INTERNAL_ERROR',
            description: `
              **When:** Unexpected server error
              **Frontend Action:** Show generic error, offer retry, log requestId
              **Show Backend Message:** No - show "Something went wrong. Please try again"
            `,
            value: {
              error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred',
                type: 'internal_error',
                statusCode: 500,
                timestamp: '2026-01-13T12:00:00.000Z',
                path: '/v1/jobs',
                requestId: 'req_abc123',
              },
            },
          },
        },
      },
    },
  })
  async create(@Body() dto: CreateJobDto): Promise<JobResponseDto> {}
}
```

---

## Endpoint Documentation Checklist

Before an endpoint is considered documented, verify:

### Request
- [ ] `@ApiOperation` with summary, description, and operationId
- [ ] `@ApiBody` with type, description, and realistic examples
- [ ] All DTO properties have `@ApiProperty` with description, example, and constraints
- [ ] Nested objects are fully documented
- [ ] Enums have `enumName` for proper type generation

### Response
- [ ] Success response with correct status code and type
- [ ] Response DTO properties fully documented
- [ ] Paginated responses include meta structure

### Exceptions (Critical)
- [ ] All possible error status codes documented (400, 401, 403, 404, 409, 429, 500)
- [ ] Each error code has example with realistic values
- [ ] Each example includes:
  - `summary` - Error code name
  - `description` with:
    - **When** - Condition that triggers this error
    - **Frontend Action** - What UI should do
    - **Show Backend Message** - Yes/No guidance

---

## References

- [Exception Codes Enum](/packages/backend-lib/src/exceptions/exception-codes.enum.ts)
- [i18n Messages](/packages/backend-lib/src/exceptions/i18n/messages.ts)
- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
