---
title: Stripe-Inspired HTTP Exception Filter with i18n Support
id: 08-http-exception-filter
created: 2026-01-13
updated: 2026-01-13
status: executed
executed_date: 2026-01-13
execution_result: success
deprecated: false
deprecated_reason:
target: backend
complexity: high
tags:
  - exception-handling
  - error-codes
  - i18n
  - nestjs
  - http-filter
  - validation
  - stripe-inspired
dependencies:
  - 07-gdpr-logger-middleware
blocks: []
related_specs: []
related_planning: []
notes: Stripe-inspired exception handling with internationalized error messages for HR, BS, EN, MK languages
---

# 08 - Stripe-Inspired HTTP Exception Filter with i18n Support

**Date**: 2026-01-13
**Target**: Backend
**Package**: `@borg/backend-lib`

---

## Context

APIs need consistent, developer-friendly error responses similar to Stripe's error handling pattern. Errors should include machine-readable codes, human-readable messages in multiple languages, and debugging information. The system must support Croatian (HR), Bosnian (BS), English (EN), and Macedonian (MK) languages, with language selection based on the `X-Language` request header.

## Goal

Create a robust HTTP exception filter system in `@borg/backend-lib` that provides:
1. Stripe-inspired error response format with consistent structure
2. Comprehensive exception codes enum covering common error scenarios
3. Internationalized error messages (HR, BS, EN, MK)
4. Language detection from `X-Language` header with fallback to EN
5. Separate handling for validation errors with field-level messages
6. Stack traces included in non-production environments

## Current State

- `@borg/backend-lib` exists with logging infrastructure
- No standardized exception handling exists
- NestJS apps use default exception responses
- No i18n support for error messages

## Requirements

### 1. **Error Response Format (Stripe-Inspired)**

All API errors should return a consistent JSON structure:

```typescript
interface ApiErrorResponse {
  error: {
    code: string;           // Machine-readable error code (e.g., 'RESOURCE_NOT_FOUND')
    message: string;        // Human-readable message in requested language
    type: ErrorType;        // Error category (e.g., 'validation_error', 'api_error')
    statusCode: number;     // HTTP status code
    timestamp: string;      // ISO 8601 timestamp
    path: string;           // Request path
    requestId?: string;     // Correlation ID for tracing
    details?: ErrorDetail[];// Additional error details (for validation)
    stack?: string;         // Stack trace (non-production only)
  };
}

interface ErrorDetail {
  field: string;           // Field name (e.g., 'email', 'user.address.city')
  code: string;            // Field-specific error code
  message: string;         // Field-specific error message (i18n)
  value?: unknown;         // Invalid value (redacted if sensitive)
}

type ErrorType =
  | 'validation_error'     // Input validation failures
  | 'authentication_error' // Auth failures
  | 'authorization_error'  // Permission denied
  | 'not_found_error'      // Resource not found
  | 'conflict_error'       // Resource conflicts
  | 'rate_limit_error'     // Too many requests
  | 'api_error'            // General API errors
  | 'internal_error';      // Server errors
```

### 2. **Exception Codes Enum**

Create comprehensive exception codes covering common scenarios:

```typescript
// exception-codes.enum.ts
export enum ExceptionCode {
  // Authentication (1xxx)
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',
  AUTH_REFRESH_TOKEN_EXPIRED = 'AUTH_REFRESH_TOKEN_EXPIRED',
  AUTH_REFRESH_TOKEN_INVALID = 'AUTH_REFRESH_TOKEN_INVALID',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_ACCOUNT_DISABLED = 'AUTH_ACCOUNT_DISABLED',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_MFA_REQUIRED = 'AUTH_MFA_REQUIRED',
  AUTH_MFA_INVALID = 'AUTH_MFA_INVALID',

  // Authorization (2xxx)
  AUTHZ_PERMISSION_DENIED = 'AUTHZ_PERMISSION_DENIED',
  AUTHZ_ROLE_REQUIRED = 'AUTHZ_ROLE_REQUIRED',
  AUTHZ_RESOURCE_ACCESS_DENIED = 'AUTHZ_RESOURCE_ACCESS_DENIED',
  AUTHZ_TENANT_ACCESS_DENIED = 'AUTHZ_TENANT_ACCESS_DENIED',
  AUTHZ_ORGANIZATION_ACCESS_DENIED = 'AUTHZ_ORGANIZATION_ACCESS_DENIED',

  // Resource (3xxx)
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_GONE = 'RESOURCE_GONE',
  RESOURCE_LOCKED = 'RESOURCE_LOCKED',

  // Specific Resources
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  JOB_NOT_FOUND = 'JOB_NOT_FOUND',
  JOB_EXPIRED = 'JOB_EXPIRED',
  JOB_CLOSED = 'JOB_CLOSED',
  APPLICATION_NOT_FOUND = 'APPLICATION_NOT_FOUND',
  APPLICATION_ALREADY_EXISTS = 'APPLICATION_ALREADY_EXISTS',
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',

  // Validation (4xxx)
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  VALIDATION_FIELD_REQUIRED = 'VALIDATION_FIELD_REQUIRED',
  VALIDATION_FIELD_INVALID = 'VALIDATION_FIELD_INVALID',
  VALIDATION_FIELD_TOO_SHORT = 'VALIDATION_FIELD_TOO_SHORT',
  VALIDATION_FIELD_TOO_LONG = 'VALIDATION_FIELD_TOO_LONG',
  VALIDATION_FIELD_FORMAT = 'VALIDATION_FIELD_FORMAT',
  VALIDATION_EMAIL_INVALID = 'VALIDATION_EMAIL_INVALID',
  VALIDATION_PHONE_INVALID = 'VALIDATION_PHONE_INVALID',
  VALIDATION_URL_INVALID = 'VALIDATION_URL_INVALID',
  VALIDATION_DATE_INVALID = 'VALIDATION_DATE_INVALID',
  VALIDATION_NUMBER_INVALID = 'VALIDATION_NUMBER_INVALID',
  VALIDATION_ENUM_INVALID = 'VALIDATION_ENUM_INVALID',
  VALIDATION_ARRAY_INVALID = 'VALIDATION_ARRAY_INVALID',
  VALIDATION_PASSWORD_WEAK = 'VALIDATION_PASSWORD_WEAK',
  VALIDATION_PASSWORDS_MISMATCH = 'VALIDATION_PASSWORDS_MISMATCH',

  // Rate Limiting (5xxx)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_TOO_MANY_REQUESTS = 'RATE_LIMIT_TOO_MANY_REQUESTS',
  RATE_LIMIT_QUOTA_EXCEEDED = 'RATE_LIMIT_QUOTA_EXCEEDED',

  // Payment (6xxx)
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_DECLINED = 'PAYMENT_DECLINED',
  PAYMENT_INSUFFICIENT_FUNDS = 'PAYMENT_INSUFFICIENT_FUNDS',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',

  // File/Upload (7xxx)
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED = 'FILE_TYPE_NOT_ALLOWED',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  FILE_CORRUPTED = 'FILE_CORRUPTED',

  // External Services (8xxx)
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  EXTERNAL_SERVICE_TIMEOUT = 'EXTERNAL_SERVICE_TIMEOUT',
  EXTERNAL_SERVICE_UNAVAILABLE = 'EXTERNAL_SERVICE_UNAVAILABLE',

  // Internal (9xxx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INTERNAL_DATABASE_ERROR = 'INTERNAL_DATABASE_ERROR',
  INTERNAL_CONFIGURATION_ERROR = 'INTERNAL_CONFIGURATION_ERROR',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
}
```

### 3. **Internationalized Messages**

Create message translations for all exception codes:

```typescript
// i18n/messages.ts
export type SupportedLanguage = 'en' | 'hr' | 'bs' | 'mk';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const exceptionMessages: Record<ExceptionCode, Record<SupportedLanguage, string>> = {
  // Authentication
  [ExceptionCode.AUTH_INVALID_CREDENTIALS]: {
    en: 'Invalid email or password',
    hr: 'Neispravna email adresa ili lozinka',
    bs: 'Neispravna email adresa ili lozinka',
    mk: 'Невалидна е-пошта или лозинка',
  },
  [ExceptionCode.AUTH_TOKEN_EXPIRED]: {
    en: 'Your session has expired. Please log in again',
    hr: 'Vaša sesija je istekla. Molimo prijavite se ponovno',
    bs: 'Vaša sesija je istekla. Molimo prijavite se ponovo',
    mk: 'Вашата сесија истече. Ве молиме најавете се повторно',
  },
  // ... all other codes
};

// Validation messages with placeholders
export const validationMessages: Record<string, Record<SupportedLanguage, string>> = {
  required: {
    en: '{{field}} is required',
    hr: '{{field}} je obavezno polje',
    bs: '{{field}} je obavezno polje',
    mk: '{{field}} е задолжително поле',
  },
  minLength: {
    en: '{{field}} must be at least {{min}} characters',
    hr: '{{field}} mora imati najmanje {{min}} znakova',
    bs: '{{field}} mora imati najmanje {{min}} znakova',
    mk: '{{field}} мора да има најмалку {{min}} карактери',
  },
  maxLength: {
    en: '{{field}} must not exceed {{max}} characters',
    hr: '{{field}} ne smije imati više od {{max}} znakova',
    bs: '{{field}} ne smije imati više od {{max}} znakova',
    mk: '{{field}} не смее да надмине {{max}} карактери',
  },
  email: {
    en: 'Please enter a valid email address',
    hr: 'Molimo unesite ispravnu email adresu',
    bs: 'Molimo unesite ispravnu email adresu',
    mk: 'Ве молиме внесете валидна е-пошта',
  },
  // ... more validation messages
};
```

### 4. **Custom Exception Classes**

Create typed exception classes:

```typescript
// exceptions/api.exception.ts
export class ApiException extends Error {
  constructor(
    public readonly code: ExceptionCode,
    public readonly statusCode: number,
    public readonly type: ErrorType,
    public readonly details?: ErrorDetail[],
    message?: string,
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Convenience factory methods
export class ApiExceptions {
  // Authentication
  static invalidCredentials(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_INVALID_CREDENTIALS,
      401,
      'authentication_error',
    );
  }

  static tokenExpired(): ApiException {
    return new ApiException(
      ExceptionCode.AUTH_TOKEN_EXPIRED,
      401,
      'authentication_error',
    );
  }

  // Authorization
  static permissionDenied(resource?: string): ApiException {
    return new ApiException(
      ExceptionCode.AUTHZ_PERMISSION_DENIED,
      403,
      'authorization_error',
    );
  }

  // Resources
  static notFound(resource: string): ApiException {
    return new ApiException(
      ExceptionCode.RESOURCE_NOT_FOUND,
      404,
      'not_found_error',
    );
  }

  static alreadyExists(resource: string): ApiException {
    return new ApiException(
      ExceptionCode.RESOURCE_ALREADY_EXISTS,
      409,
      'conflict_error',
    );
  }

  // Validation
  static validationFailed(details: ErrorDetail[]): ApiException {
    return new ApiException(
      ExceptionCode.VALIDATION_FAILED,
      400,
      'validation_error',
      details,
    );
  }

  // Rate limiting
  static rateLimitExceeded(): ApiException {
    return new ApiException(
      ExceptionCode.RATE_LIMIT_EXCEEDED,
      429,
      'rate_limit_error',
    );
  }

  // Internal
  static internalError(): ApiException {
    return new ApiException(
      ExceptionCode.INTERNAL_ERROR,
      500,
      'internal_error',
    );
  }
}
```

### 5. **HTTP Exception Filter**

Create the NestJS exception filter:

```typescript
// filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18nService: ExceptionI18nService,
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const language = this.extractLanguage(request);
    const correlationId = request.headers['x-correlation-id'] as string;
    const isProduction = process.env.NODE_ENV === 'production';

    const errorResponse = this.buildErrorResponse(
      exception,
      request,
      language,
      correlationId,
      isProduction,
    );

    this.logger.error(
      `${errorResponse.error.code}: ${errorResponse.error.message}`,
      exception instanceof Error ? exception.stack : undefined,
      'HttpExceptionFilter',
      { correlationId, path: request.path, statusCode: errorResponse.error.statusCode },
    );

    response.status(errorResponse.error.statusCode).json(errorResponse);
  }

  private extractLanguage(request: Request): SupportedLanguage {
    const header = request.headers['x-language'] as string;
    if (header && ['en', 'hr', 'bs', 'mk'].includes(header.toLowerCase())) {
      return header.toLowerCase() as SupportedLanguage;
    }
    return DEFAULT_LANGUAGE;
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
    language: SupportedLanguage,
    correlationId: string,
    isProduction: boolean,
  ): ApiErrorResponse {
    // Handle ApiException
    if (exception instanceof ApiException) {
      return this.handleApiException(exception, request, language, correlationId, isProduction);
    }

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, request, language, correlationId, isProduction);
    }

    // Handle validation errors (class-validator)
    if (this.isValidationError(exception)) {
      return this.handleValidationException(exception, request, language, correlationId, isProduction);
    }

    // Handle unknown errors
    return this.handleUnknownException(exception, request, language, correlationId, isProduction);
  }
}
```

### 6. **Validation Error Handling**

Special handling for class-validator errors:

```typescript
// filters/validation-exception.filter.ts
export interface ValidationExceptionFactory {
  (errors: ValidationError[]): ApiException;
}

export function createValidationExceptionFactory(
  i18nService: ExceptionI18nService,
): ValidationExceptionFactory {
  return (errors: ValidationError[]): ApiException => {
    const details = flattenValidationErrors(errors).map((error) => ({
      field: error.property,
      code: mapConstraintToCode(Object.keys(error.constraints || {})[0]),
      message: error.constraints ? Object.values(error.constraints)[0] : '',
      value: error.value,
    }));

    return ApiExceptions.validationFailed(details);
  };
}

function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationError[] {
  const result: ValidationError[] = [];

  for (const error of errors) {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      result.push({ ...error, property: path });
    }

    if (error.children && error.children.length > 0) {
      result.push(...flattenValidationErrors(error.children, path));
    }
  }

  return result;
}
```

### 7. **i18n Service**

Service for message translation:

```typescript
// services/exception-i18n.service.ts
@Injectable()
export class ExceptionI18nService {
  getMessage(
    code: ExceptionCode,
    language: SupportedLanguage,
    params?: Record<string, string | number>,
  ): string {
    const messages = exceptionMessages[code];
    if (!messages) {
      return code; // Fallback to code if no message found
    }

    let message = messages[language] || messages[DEFAULT_LANGUAGE];

    // Replace placeholders
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
    }

    return message;
  }

  getValidationMessage(
    constraint: string,
    language: SupportedLanguage,
    params?: Record<string, string | number>,
  ): string {
    const messages = validationMessages[constraint];
    if (!messages) {
      return constraint;
    }

    let message = messages[language] || messages[DEFAULT_LANGUAGE];

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
    }

    return message;
  }
}
```

### 8. **Module Configuration**

```typescript
// exceptions.module.ts
export interface ExceptionsModuleOptions {
  defaultLanguage?: SupportedLanguage;
  includeStack?: boolean;  // Override for stack traces
  customMessages?: Partial<Record<ExceptionCode, Record<SupportedLanguage, string>>>;
}

@Module({})
export class ExceptionsModule {
  static forRoot(options?: ExceptionsModuleOptions): DynamicModule {
    return {
      module: ExceptionsModule,
      global: true,
      providers: [
        {
          provide: EXCEPTIONS_MODULE_OPTIONS,
          useValue: options || {},
        },
        ExceptionI18nService,
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
      exports: [ExceptionI18nService],
    };
  }
}
```

### 9. **Package Exports**

```typescript
// index.ts additions
export {
  // Exception classes
  ApiException,
  ApiExceptions,
  // Enums
  ExceptionCode,
  type ErrorType,
  // Interfaces
  type ApiErrorResponse,
  type ErrorDetail,
  // i18n
  ExceptionI18nService,
  type SupportedLanguage,
  DEFAULT_LANGUAGE,
  exceptionMessages,
  validationMessages,
  // Filters
  HttpExceptionFilter,
  // Validation
  createValidationExceptionFactory,
  // Module
  ExceptionsModule,
  type ExceptionsModuleOptions,
} from './exceptions';
```

## Constraints

- Must be compatible with NestJS exception handling
- Must integrate with existing LoggerService for error logging
- Must support correlation IDs from LoggerMiddleware
- Stack traces must only appear in non-production environments
- Validation errors must preserve field paths for nested objects
- Messages must support placeholder substitution
- Must handle both ApiException and standard NestJS HttpException

## Expected Output

- [x] `packages/backend-lib/src/exceptions/index.ts` - Module exports
- [x] `packages/backend-lib/src/exceptions/exception-codes.enum.ts` - Exception codes
- [x] `packages/backend-lib/src/exceptions/types.ts` - TypeScript interfaces
- [x] `packages/backend-lib/src/exceptions/api.exception.ts` - Custom exception class + Factory methods
- [x] `packages/backend-lib/src/exceptions/filters/http-exception.filter.ts` - Main filter
- [x] `packages/backend-lib/src/exceptions/filters/validation.utils.ts` - Validation utilities
- [x] `packages/backend-lib/src/exceptions/i18n/messages.ts` - Exception messages (all languages)
- [x] `packages/backend-lib/src/exceptions/i18n/validation-messages.ts` - Validation messages
- [x] `packages/backend-lib/src/exceptions/services/exception-i18n.service.ts` - i18n service
- [x] `packages/backend-lib/src/exceptions/exceptions.module.ts` - NestJS module
- [x] Updated `packages/backend-lib/src/index.ts` with new exports

## Acceptance Criteria

- [x] `pnpm build` succeeds for `@borg/backend-lib`
- [x] All exception codes have translations for EN, HR, BS, MK
- [x] `X-Language` header correctly switches response language
- [x] Default language is English when header is missing/invalid
- [x] Validation errors include field-level details with i18n messages
- [x] Stack traces appear only in non-production environments
- [x] Correlation IDs are included in error responses
- [x] Unknown exceptions are caught and return 500 with generic message
- [x] ApiExceptions factory methods create correct exceptions
- [x] Can be imported and used in `@borg/api` app

## Technical Notes

### Example API Error Responses

**Authentication Error (English):**
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "type": "authentication_error",
    "statusCode": 401,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/api/auth/login",
    "requestId": "req_abc123"
  }
}
```

**Authentication Error (Croatian - X-Language: hr):**
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Neispravna email adresa ili lozinka",
    "type": "authentication_error",
    "statusCode": 401,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/api/auth/login",
    "requestId": "req_abc123"
  }
}
```

**Validation Error with Details:**
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "type": "validation_error",
    "statusCode": 400,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/api/users",
    "requestId": "req_abc123",
    "details": [
      {
        "field": "email",
        "code": "VALIDATION_EMAIL_INVALID",
        "message": "Please enter a valid email address"
      },
      {
        "field": "password",
        "code": "VALIDATION_FIELD_TOO_SHORT",
        "message": "Password must be at least 8 characters"
      },
      {
        "field": "profile.phone",
        "code": "VALIDATION_PHONE_INVALID",
        "message": "Please enter a valid phone number"
      }
    ]
  }
}
```

**Development Error (with stack):**
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "type": "internal_error",
    "statusCode": 500,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/api/jobs",
    "requestId": "req_abc123",
    "stack": "Error: Database connection failed\n    at JobService.findAll..."
  }
}
```

### Usage in NestJS App

```typescript
// app.module.ts
import { ExceptionsModule } from '@borg/backend-lib';

@Module({
  imports: [
    ExceptionsModule.forRoot({
      defaultLanguage: 'en',
    }),
  ],
})
export class AppModule {}

// main.ts - Configure validation pipe
import { createValidationExceptionFactory } from '@borg/backend-lib';

app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: createValidationExceptionFactory(app.get(ExceptionI18nService)),
  }),
);

// job.service.ts - Throwing exceptions
import { ApiExceptions } from '@borg/backend-lib';

@Injectable()
export class JobService {
  async findOne(id: string): Promise<Job> {
    const job = await this.db.jobs.findOne({ where: { id } });
    if (!job) {
      throw ApiExceptions.notFound('Job');
    }
    return job;
  }
}
```

### Complete Messages for Key Codes

```typescript
// Ensure all critical messages have proper translations
const criticalMessages = {
  AUTH_INVALID_CREDENTIALS: {
    en: 'Invalid email or password',
    hr: 'Neispravna email adresa ili lozinka',
    bs: 'Neispravna email adresa ili lozinka',
    mk: 'Невалидна е-пошта или лозинка',
  },
  RESOURCE_NOT_FOUND: {
    en: 'The requested resource was not found',
    hr: 'Traženi resurs nije pronađen',
    bs: 'Traženi resurs nije pronađen',
    mk: 'Бараниот ресурс не е пронајден',
  },
  VALIDATION_FAILED: {
    en: 'Validation failed. Please check your input',
    hr: 'Validacija nije uspjela. Molimo provjerite unos',
    bs: 'Validacija nije uspjela. Molimo provjerite unos',
    mk: 'Валидацијата не успеа. Ве молиме проверете го вносот',
  },
  AUTHZ_PERMISSION_DENIED: {
    en: 'You do not have permission to perform this action',
    hr: 'Nemate dozvolu za izvršenje ove akcije',
    bs: 'Nemate dozvolu za izvršenje ove akcije',
    mk: 'Немате дозвола за оваа акција',
  },
  INTERNAL_ERROR: {
    en: 'An unexpected error occurred. Please try again later',
    hr: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo kasnije',
    bs: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo kasnije',
    mk: 'Се случи неочекувана грешка. Ве молиме обидете се повторно подоцна',
  },
};
```

---

## Related

- Depends on: [[prompts/07-gdpr-logger-middleware]]
- Blocks: API authentication, Business logic error handling
- References: Stripe API Error Handling, NestJS Exception Filters
