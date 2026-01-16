# HTTP Exceptions Usage Reference

Quick reference for adding, throwing, and handling HTTP exceptions using `@job-board/backend-lib`.

---

## Table of Contents

1. [Setup](#setup)
2. [Throwing Exceptions](#throwing-exceptions)
3. [Adding New Exception Codes](#adding-new-exception-codes)
4. [Validation Exceptions](#validation-exceptions)
5. [Frontend Error Handling](#frontend-error-handling)
6. [Exception Codes Quick Reference](#exception-codes-quick-reference)

---

## Setup

### 1. Import Module in App

```typescript
// app.module.ts
import { ExceptionsModule } from '@job-board/backend-lib';

@Module({
  imports: [
    ExceptionsModule.forRoot({
      defaultLanguage: 'en',      // Fallback language
      includeStack: false,        // true for development
    }),
  ],
})
export class AppModule {}
```

### 2. Configure Validation Pipe

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';
import { createValidationExceptionFactory } from '@job-board/backend-lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: createValidationExceptionFactory(),
    }),
  );

  await app.listen(3000);
}
```

---

## Throwing Exceptions

### Using Factory Methods (Recommended)

```typescript
import { ApiExceptions } from '@job-board/backend-lib';

@Injectable()
export class JobService {
  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } });

    if (!job) {
      throw ApiExceptions.jobNotFound();
    }

    return job;
  }

  async create(dto: CreateJobDto, userId: string): Promise<Job> {
    const existing = await this.jobRepository.findOne({
      where: { title: dto.title, organizationId: dto.organizationId }
    });

    if (existing) {
      throw ApiExceptions.alreadyExists('Job');
    }

    return this.jobRepository.save(dto);
  }

  async apply(jobId: string, userId: string): Promise<Application> {
    const job = await this.findOne(jobId);

    if (job.status === 'expired') {
      throw ApiExceptions.jobExpired();
    }

    if (job.status === 'closed') {
      throw ApiExceptions.jobClosed();
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: { jobId, userId },
    });

    if (existingApplication) {
      throw ApiExceptions.applicationAlreadyExists();
    }

    return this.applicationRepository.save({ jobId, userId });
  }
}
```

### Available Factory Methods

```typescript
// Authentication
ApiExceptions.invalidCredentials()
ApiExceptions.tokenExpired()
ApiExceptions.tokenInvalid()
ApiExceptions.tokenMissing()
ApiExceptions.refreshTokenExpired()
ApiExceptions.refreshTokenInvalid()
ApiExceptions.sessionExpired()
ApiExceptions.accountDisabled()
ApiExceptions.accountLocked()
ApiExceptions.emailNotVerified()
ApiExceptions.mfaRequired()
ApiExceptions.mfaInvalid()

// Authorization
ApiExceptions.permissionDenied()
ApiExceptions.roleRequired()
ApiExceptions.resourceAccessDenied()
ApiExceptions.tenantAccessDenied()
ApiExceptions.organizationAccessDenied()

// Resources (Generic)
ApiExceptions.notFound(resource?: string)
ApiExceptions.alreadyExists(resource?: string)
ApiExceptions.conflict(resource?: string)
ApiExceptions.gone()
ApiExceptions.locked()

// Resources (Specific)
ApiExceptions.userNotFound()
ApiExceptions.userAlreadyExists()
ApiExceptions.jobNotFound()
ApiExceptions.jobExpired()
ApiExceptions.jobClosed()
ApiExceptions.applicationNotFound()
ApiExceptions.applicationAlreadyExists()
ApiExceptions.organizationNotFound()
ApiExceptions.tenantNotFound()
ApiExceptions.fileNotFound()
ApiExceptions.categoryNotFound()

// Validation
ApiExceptions.validationFailed(details: ErrorDetail[])

// Rate Limiting
ApiExceptions.rateLimitExceeded()
ApiExceptions.tooManyRequests()
ApiExceptions.quotaExceeded()

// Payment
ApiExceptions.paymentRequired()
ApiExceptions.paymentFailed()
ApiExceptions.paymentDeclined()
ApiExceptions.insufficientFunds()
ApiExceptions.subscriptionExpired()
ApiExceptions.subscriptionRequired()

// File/Upload
ApiExceptions.fileTooLarge(maxSize?: number)
ApiExceptions.fileTypeNotAllowed(allowedTypes?: string)
ApiExceptions.fileUploadFailed()
ApiExceptions.fileCorrupted()

// External Services
ApiExceptions.externalServiceError(service?: string)
ApiExceptions.externalServiceTimeout(service?: string)
ApiExceptions.externalServiceUnavailable(service?: string)

// Internal
ApiExceptions.internalError()
ApiExceptions.databaseError()
ApiExceptions.configurationError()
ApiExceptions.maintenanceMode()
```

### Using ApiException Directly

For custom scenarios not covered by factory methods:

```typescript
import { ApiException, ExceptionCode } from '@job-board/backend-lib';

// Basic usage
throw new ApiException(
  ExceptionCode.RESOURCE_NOT_FOUND,  // code
  404,                                // statusCode
  'not_found_error',                  // type
);

// With i18n params (for message interpolation)
throw new ApiException(
  ExceptionCode.RESOURCE_NOT_FOUND,
  404,
  'not_found_error',
  undefined,                          // details
  { resource: 'Invoice' },            // params - used in i18n: "{{resource}} not found"
);

// With validation details
throw new ApiException(
  ExceptionCode.VALIDATION_FAILED,
  400,
  'validation_error',
  [
    { field: 'email', code: 'VALIDATION_EMAIL_INVALID', message: 'Invalid email' },
    { field: 'age', code: 'VALIDATION_NUMBER_INVALID', message: 'Must be a number' },
  ],
);
```

---

## Adding New Exception Codes

### Step 1: Add to Enum

```typescript
// packages/backend-lib/src/exceptions/exception-codes.enum.ts

export enum ExceptionCode {
  // ... existing codes ...

  // Add your new code in the appropriate category
  INVOICE_NOT_FOUND = 'INVOICE_NOT_FOUND',
  INVOICE_ALREADY_PAID = 'INVOICE_ALREADY_PAID',
  INVOICE_CANCELLED = 'INVOICE_CANCELLED',
}
```

### Step 2: Add i18n Messages

```typescript
// packages/backend-lib/src/exceptions/i18n/messages.ts

export const exceptionMessages: Record<ExceptionCode, Record<SupportedLanguage, string>> = {
  // ... existing messages ...

  [ExceptionCode.INVOICE_NOT_FOUND]: {
    en: 'Invoice not found',
    hr: 'Račun nije pronađen',
    bs: 'Račun nije pronađen',
    mk: 'Фактурата не е пронајдена',
  },
  [ExceptionCode.INVOICE_ALREADY_PAID]: {
    en: 'This invoice has already been paid',
    hr: 'Ovaj račun je već plaćen',
    bs: 'Ovaj račun je već plaćen',
    mk: 'Оваа фактура е веќе платена',
  },
  [ExceptionCode.INVOICE_CANCELLED]: {
    en: 'This invoice has been cancelled',
    hr: 'Ovaj račun je otkazan',
    bs: 'Ovaj račun je otkazan',
    mk: 'Оваа фактура е откажана',
  },
};
```

### Step 3: Add Factory Method (Optional)

```typescript
// packages/backend-lib/src/exceptions/api.exception.ts

export class ApiExceptions {
  // ... existing methods ...

  static invoiceNotFound(): ApiException {
    return new ApiException(
      ExceptionCode.INVOICE_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static invoiceAlreadyPaid(): ApiException {
    return new ApiException(
      ExceptionCode.INVOICE_ALREADY_PAID,
      409,
      'conflict_error',
    );
  }

  static invoiceCancelled(): ApiException {
    return new ApiException(
      ExceptionCode.INVOICE_CANCELLED,
      410,
      'conflict_error',
    );
  }
}
```

### Step 4: Rebuild Package

```bash
pnpm build --filter=@job-board/backend-lib
```

---

## Validation Exceptions

### Automatic (via ValidationPipe)

When using `class-validator` decorators, validation errors are automatically converted:

```typescript
// dto
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;
}

// Automatic error response when validation fails:
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed. Please check your input",
    "type": "validation_error",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "code": "VALIDATION_EMAIL_INVALID",
        "message": "email must be an email"
      },
      {
        "field": "password",
        "code": "VALIDATION_PASSWORD_WEAK",
        "message": "password is not strong enough"
      }
    ]
  }
}
```

### Manual Validation Exceptions

```typescript
import { ApiExceptions, ErrorDetail } from '@job-board/backend-lib';

async function validateBusinessRules(dto: CreateOrderDto): Promise<void> {
  const errors: ErrorDetail[] = [];

  if (dto.quantity > availableStock) {
    errors.push({
      field: 'quantity',
      code: 'VALIDATION_FIELD_INVALID',
      message: `Only ${availableStock} items available`,
      value: dto.quantity,
    });
  }

  if (dto.deliveryDate < new Date()) {
    errors.push({
      field: 'deliveryDate',
      code: 'VALIDATION_DATE_INVALID',
      message: 'Delivery date must be in the future',
      value: dto.deliveryDate,
    });
  }

  if (errors.length > 0) {
    throw ApiExceptions.validationFailed(errors);
  }
}
```

---

## Frontend Error Handling

### TypeScript Types

```typescript
// types/api-error.ts

interface ErrorDetail {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

interface ApiError {
  code: string;
  message: string;
  type: 'validation_error' | 'authentication_error' | 'authorization_error' |
        'not_found_error' | 'conflict_error' | 'rate_limit_error' |
        'api_error' | 'internal_error';
  statusCode: number;
  timestamp: string;
  path: string;
  requestId?: string;
  details?: ErrorDetail[];
}

interface ApiErrorResponse {
  error: ApiError;
}
```

### Error Handler Utility

```typescript
// utils/api-error-handler.ts

type ErrorAction =
  | { type: 'show_message'; message: string }
  | { type: 'show_field_errors'; errors: Record<string, string> }
  | { type: 'redirect'; path: string }
  | { type: 'refresh_token' }
  | { type: 'silent' };

const SHOW_BACKEND_MESSAGE = new Set([
  'AUTH_INVALID_CREDENTIALS',
  'AUTH_ACCOUNT_LOCKED',
  'AUTH_ACCOUNT_DISABLED',
  'AUTH_EMAIL_NOT_VERIFIED',
  'AUTH_MFA_INVALID',
  'AUTHZ_PERMISSION_DENIED',
  'AUTHZ_ROLE_REQUIRED',
  'RESOURCE_ALREADY_EXISTS',
  'RESOURCE_CONFLICT',
  'RESOURCE_LOCKED',
  'USER_ALREADY_EXISTS',
  'APPLICATION_ALREADY_EXISTS',
  'JOB_EXPIRED',
  'JOB_CLOSED',
  'FILE_TOO_LARGE',
  'FILE_TYPE_NOT_ALLOWED',
]);

const REDIRECT_TO_LOGIN = new Set([
  'AUTH_TOKEN_EXPIRED',
  'AUTH_TOKEN_INVALID',
  'AUTH_TOKEN_MISSING',
  'AUTH_SESSION_EXPIRED',
]);

const TRY_REFRESH_TOKEN = new Set([
  'AUTH_TOKEN_EXPIRED',
]);

export function handleApiError(error: ApiErrorResponse): ErrorAction {
  const { code, message, type, details } = error.error;

  // Validation errors - show field-level messages
  if (code === 'VALIDATION_FAILED' && details?.length) {
    const fieldErrors: Record<string, string> = {};
    for (const detail of details) {
      fieldErrors[detail.field] = detail.message;
    }
    return { type: 'show_field_errors', errors: fieldErrors };
  }

  // Token refresh attempt
  if (TRY_REFRESH_TOKEN.has(code)) {
    return { type: 'refresh_token' };
  }

  // Redirect to login
  if (REDIRECT_TO_LOGIN.has(code)) {
    return { type: 'redirect', path: '/login' };
  }

  // MFA required - redirect to MFA page
  if (code === 'AUTH_MFA_REQUIRED') {
    return { type: 'redirect', path: '/mfa' };
  }

  // Show backend message
  if (SHOW_BACKEND_MESSAGE.has(code)) {
    return { type: 'show_message', message };
  }

  // Rate limiting
  if (type === 'rate_limit_error') {
    return { type: 'show_message', message: 'Too many requests. Please wait and try again.' };
  }

  // Not found - could show custom message or redirect
  if (type === 'not_found_error') {
    return { type: 'show_message', message: 'The requested item was not found.' };
  }

  // Internal/External errors - generic message
  if (type === 'internal_error' || code.startsWith('EXTERNAL_')) {
    return { type: 'show_message', message: 'Something went wrong. Please try again later.' };
  }

  // Default: show backend message
  return { type: 'show_message', message };
}
```

### React Hook Example

```typescript
// hooks/useApiError.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { handleApiError, ApiErrorResponse } from '@/utils/api-error-handler';
import { useAuth } from '@/contexts/auth';

export function useApiError() {
  const router = useRouter();
  const { refreshToken, logout } = useAuth();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleError = useCallback(async (error: ApiErrorResponse) => {
    const action = handleApiError(error);

    switch (action.type) {
      case 'show_message':
        toast.error(action.message);
        break;

      case 'show_field_errors':
        setFieldErrors(action.errors);
        break;

      case 'redirect':
        router.push(action.path);
        break;

      case 'refresh_token':
        try {
          await refreshToken();
          // Retry original request here if needed
        } catch {
          logout();
          router.push('/login');
        }
        break;

      case 'silent':
        // Do nothing
        break;
    }
  }, [router, refreshToken, logout]);

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  return { handleError, fieldErrors, clearFieldErrors };
}
```

### Usage in Component

```typescript
// components/CreateJobForm.tsx
import { useApiError } from '@/hooks/useApiError';
import { createJob } from '@/api/jobs';

export function CreateJobForm() {
  const { handleError, fieldErrors, clearFieldErrors } = useApiError();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateJobDto) => {
    setLoading(true);
    clearFieldErrors();

    try {
      const job = await createJob(data);
      toast.success('Job created successfully');
      router.push(`/jobs/${job.id}`);
    } catch (error) {
      if (isApiError(error)) {
        handleError(error);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="title"
        label="Job Title"
        error={fieldErrors.title}
      />
      <Input
        name="email"
        label="Contact Email"
        error={fieldErrors.email}
      />
      <Button type="submit" loading={loading}>
        Create Job
      </Button>
    </form>
  );
}
```

### API Client with Error Extraction

```typescript
// lib/api-client.ts

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    method: string,
    path: string,
    options?: { body?: unknown; headers?: Record<string, string> }
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Language': getCurrentLanguage(), // 'en' | 'hr' | 'bs' | 'mk'
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorResponse: ApiErrorResponse = await response.json();
      throw errorResponse;
    }

    return response.json();
  }

  get<T>(path: string) {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>('POST', path, { body });
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>('PUT', path, { body });
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}

export const api = new ApiClient('/api/v1');

// Type guard
export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as ApiErrorResponse).error.code === 'string'
  );
}
```

---

## Exception Codes Quick Reference

### By HTTP Status

| Status | Codes |
|--------|-------|
| 400 | `VALIDATION_FAILED`, `VALIDATION_*`, `FILE_CORRUPTED` |
| 401 | `AUTH_INVALID_CREDENTIALS`, `AUTH_TOKEN_*`, `AUTH_MFA_INVALID` |
| 402 | `PAYMENT_*`, `SUBSCRIPTION_*` |
| 403 | `AUTH_ACCOUNT_*`, `AUTH_EMAIL_NOT_VERIFIED`, `AUTH_MFA_REQUIRED`, `AUTHZ_*` |
| 404 | `*_NOT_FOUND`, `RESOURCE_NOT_FOUND` |
| 409 | `*_ALREADY_EXISTS`, `RESOURCE_CONFLICT`, `RESOURCE_LOCKED`, `JOB_EXPIRED`, `JOB_CLOSED` |
| 410 | `RESOURCE_GONE` |
| 413 | `FILE_TOO_LARGE` |
| 415 | `FILE_TYPE_NOT_ALLOWED` |
| 429 | `RATE_LIMIT_*` |
| 500 | `INTERNAL_*`, `FILE_UPLOAD_FAILED` |
| 502 | `EXTERNAL_SERVICE_ERROR` |
| 503 | `EXTERNAL_SERVICE_UNAVAILABLE`, `MAINTENANCE_MODE` |
| 504 | `EXTERNAL_SERVICE_TIMEOUT` |

### By Error Type

| Type | Use Case |
|------|----------|
| `validation_error` | Input validation failures |
| `authentication_error` | Login/token issues |
| `authorization_error` | Permission denied |
| `not_found_error` | Resource doesn't exist |
| `conflict_error` | Duplicate or state conflict |
| `rate_limit_error` | Too many requests |
| `api_error` | General API errors (payment, file) |
| `internal_error` | Server errors |

### Frontend Display Decision

| Code Pattern | Show Backend Message |
|--------------|---------------------|
| `VALIDATION_*` | Yes (use `details`) |
| `AUTH_TOKEN_*` | No (redirect) |
| `AUTH_INVALID_CREDENTIALS` | Yes |
| `AUTH_ACCOUNT_*` | Yes |
| `AUTHZ_*` | Yes |
| `*_NOT_FOUND` | Optional |
| `*_ALREADY_EXISTS` | Yes |
| `RATE_LIMIT_*` | No (use custom) |
| `INTERNAL_*` | No (use generic) |
| `EXTERNAL_*` | No (use generic) |

---

## Response Format Reference

### Success Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Software Engineer",
  "status": "active",
  "createdAt": "2026-01-13T12:00:00.000Z"
}
```

### Error Response

```json
{
  "error": {
    "code": "JOB_NOT_FOUND",
    "message": "The requested job was not found",
    "type": "not_found_error",
    "statusCode": 404,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/v1/jobs/invalid-id",
    "requestId": "req_abc123"
  }
}
```

### Validation Error Response

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed. Please check your input",
    "type": "validation_error",
    "statusCode": 400,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/v1/jobs",
    "details": [
      {
        "field": "title",
        "code": "VALIDATION_FIELD_REQUIRED",
        "message": "Title is required"
      },
      {
        "field": "salary.min",
        "code": "VALIDATION_NUMBER_INVALID",
        "message": "Minimum salary must be a number"
      }
    ]
  }
}
```
