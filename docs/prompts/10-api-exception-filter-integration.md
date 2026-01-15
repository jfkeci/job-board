---
title: Integrate Exception Filter from Backend-lib into API
id: 10-api-exception-filter-integration
created: 2026-01-13
updated: 2026-01-13
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: backend
complexity: simple
tags:
  - api
  - nestjs
  - exceptions
  - error-handling
  - backend-lib
dependencies:
  - 08-http-exception-filter
  - 09-api-setup
blocks: []
related_specs:
  - "[[initial/backend-architecture]]"
related_planning: []
notes: Verifies and documents the exception filter integration between @borg/api and @borg/backend-lib
---

# 10 - Integrate Exception Filter from Backend-lib into API

**Date**: 2026-01-13
**Target**: Backend
**Related Spec**: [[initial/backend-architecture]]

---

## Context

The `@borg/backend-lib` package provides a comprehensive exception handling system including:
- `HttpExceptionFilter` - Global filter for consistent error responses
- `ApiException` - Custom exception class with i18n support
- `ExceptionCode` - Standardized error codes
- `createValidationExceptionFactory` - Factory for class-validator integration
- `ExceptionsModule` - NestJS module for easy integration

The `@borg/api` application needs to properly integrate this exception handling system to ensure consistent, internationalized error responses across all endpoints.

## Goal

Verify and configure the `@borg/api` application to use the exception handling infrastructure from `@borg/backend-lib`, ensuring:
1. Global HTTP exception filter is active
2. Validation errors use the custom exception factory
3. Custom exceptions can be thrown using `ApiException`
4. Error responses follow the standardized format

## Current State

**@borg/backend-lib Exports** (from `packages/backend-lib/src/index.ts`):
```typescript
// Module
ExceptionsModule

// Exception class and factory
ApiException, ApiExceptions

// Exception codes
ExceptionCode

// Filters
HttpExceptionFilter
createValidationExceptionFactory
flattenValidationErrors
validationErrorsToDetails

// Services
ExceptionI18nService

// Types
ErrorType, SupportedLanguage, ErrorDetail, ApiErrorResponse
```

**Current API Setup** (`apps/api/src/app.module.ts`):
- May or may not have ExceptionsModule imported
- Validation pipe configuration in main.ts

## Requirements

1. **ExceptionsModule Registration**
   - Import `ExceptionsModule` from `@borg/backend-lib`
   - Use `ExceptionsModule.forRootAsync()` for configuration
   - Configure `includeStack` based on environment (false in production)
   - Register as global module

2. **Validation Exception Factory**
   - Import `createValidationExceptionFactory` from `@borg/backend-lib`
   - Configure `ValidationPipe` to use the custom exception factory
   - Ensure validation errors return proper `ApiErrorResponse` format

3. **Verify Filter Registration**
   - `HttpExceptionFilter` should catch all exceptions
   - Standard `HttpException` should be transformed to `ApiErrorResponse`
   - Unknown exceptions should return generic internal error
   - Stack traces should only appear in development

4. **Test Exception Handling**
   - Create test endpoint that throws various exception types
   - Verify `ApiException` works with i18n
   - Verify standard `HttpException` is handled
   - Verify unknown errors are caught

## Constraints

- Do NOT modify `@borg/backend-lib` package
- Use async module configuration for environment-based settings
- Maintain backward compatibility with existing endpoints
- Follow NestJS dependency injection patterns

## Expected Output

- [ ] `apps/api/src/app.module.ts` - ExceptionsModule imported and configured
- [ ] `apps/api/src/main.ts` - ValidationPipe uses createValidationExceptionFactory
- [ ] Verification that all exceptions return consistent format

## Acceptance Criteria

- [ ] All unhandled exceptions return `ApiErrorResponse` format
- [ ] Validation errors include field-level details with codes
- [ ] Stack traces appear only in development mode
- [ ] `x-language` header switches error message language
- [ ] `x-correlation-id` header appears in error responses
- [ ] Custom `ApiException` instances are handled correctly

## Technical Notes

### ExceptionsModule Configuration

```typescript
// app.module.ts
import { ExceptionsModule } from '@borg/backend-lib';
import { ConfigModule, ConfigService } from '@borg/config';

@Module({
  imports: [
    ConfigModule.forRoot(),

    ExceptionsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        includeStack: !config.isProduction,
        defaultLanguage: 'en',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### ValidationPipe with Custom Factory

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';
import { createValidationExceptionFactory } from '@borg/backend-lib';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: createValidationExceptionFactory(),
  }),
);
```

### Throwing Custom Exceptions

```typescript
// In any service or controller
import { ApiException, ApiExceptions, ExceptionCode } from '@borg/backend-lib';

// Using factory methods
throw ApiExceptions.notFound('User', userId);
throw ApiExceptions.unauthorized('Invalid credentials');
throw ApiExceptions.forbidden('Admin access required');
throw ApiExceptions.conflict('Email already registered');

// Using constructor directly
throw new ApiException({
  code: ExceptionCode.RESOURCE_NOT_FOUND,
  statusCode: 404,
  type: 'not_found_error',
  params: { resource: 'User', id: userId },
});
```

### Expected Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID '123' was not found",
    "type": "not_found_error",
    "statusCode": 404,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/api/users/123",
    "requestId": "abc-123-def"
  }
}
```

### Validation Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "type": "validation_error",
    "statusCode": 400,
    "timestamp": "2026-01-13T12:00:00.000Z",
    "path": "/api/users",
    "details": [
      {
        "field": "email",
        "code": "INVALID_EMAIL",
        "message": "Email must be a valid email address"
      },
      {
        "field": "password",
        "code": "MIN_LENGTH",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

## Files to Modify

```
apps/api/src/
├── app.module.ts    - Import ExceptionsModule.forRootAsync()
└── main.ts          - Configure ValidationPipe with createValidationExceptionFactory
```

## Verification Steps

1. Start API: `pnpm dev:api`
2. Test invalid validation:
   ```bash
   curl -X POST http://localhost:3001/api/health \
     -H "Content-Type: application/json" \
     -d '{"invalid": "data"}'
   ```
3. Test with language header:
   ```bash
   curl http://localhost:3001/api/nonexistent \
     -H "X-Language: de"
   ```
4. Verify response matches `ApiErrorResponse` format

---

## Related

- Depends on: [[prompts/08-http-exception-filter]], [[prompts/09-api-setup]]
- Blocks: Feature modules requiring exception handling
- References: [[initial/backend-architecture]]
