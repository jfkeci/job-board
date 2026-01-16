---
title: GDPR-Compliant Logger Middleware for Backend
id: 07-gdpr-logger-middleware
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
  - logging
  - gdpr
  - middleware
  - security
  - nestjs
  - privacy
dependencies:
  - 03-backend-config-service
blocks: []
related_specs: []
related_planning: []
notes: Core logging infrastructure for all backend services with GDPR compliance
---

# 07 - GDPR-Compliant Logger Middleware

**Date**: 2026-01-13
**Target**: Backend
**Package**: `@job-board/backend-lib`

---

## Context

All backend applications require robust logging for debugging, monitoring, and auditing. However, logging must comply with GDPR regulations, which means:
- Personal Identifiable Information (PII) must be redacted or masked
- Sensitive data should never be stored in logs
- Logs should support data minimization principles
- Request tracing must be possible without exposing user data

## Goal

Create a comprehensive, GDPR-compliant logging system in `@job-board/backend-lib` that includes:
1. A NestJS LoggerMiddleware for HTTP request/response logging
2. A custom LoggerService wrapping NestJS Logger with PII redaction
3. Configurable sensitive field detection and masking
4. Request correlation ID support for distributed tracing
5. Structured JSON logging for production environments

## Current State

- `@job-board/backend-lib` exists with basic utility functions
- No logging infrastructure exists
- `@job-board/config` provides environment configuration
- Backend apps use default NestJS console logging

## Requirements

### 1. **Logger Service**

Create a `LoggerService` class that wraps NestJS Logger with GDPR compliance:

```typescript
// logger.service.ts
@Injectable()
export class LoggerService {
  private readonly logger: Logger;
  private readonly sensitiveFields: Set<string>;
  private readonly isProduction: boolean;

  constructor(context?: string);

  // Standard log levels
  log(message: string, context?: string, meta?: Record<string, unknown>): void;
  error(message: string, trace?: string, context?: string, meta?: Record<string, unknown>): void;
  warn(message: string, context?: string, meta?: Record<string, unknown>): void;
  debug(message: string, context?: string, meta?: Record<string, unknown>): void;
  verbose(message: string, context?: string, meta?: Record<string, unknown>): void;

  // Create child logger with specific context
  createChildLogger(context: string): LoggerService;
}
```

### 2. **PII Redaction Utilities**

Create utilities for detecting and redacting sensitive data:

```typescript
// pii-redactor.ts
export interface RedactorConfig {
  sensitiveFields: string[];      // Field names to always redact
  sensitivePatterns: RegExp[];    // Patterns to detect (email, phone, etc.)
  maskChar: string;               // Character to use for masking (default: '*')
  preserveLength: boolean;        // Keep original length when masking
  customRedactors?: Record<string, (value: unknown) => unknown>;
}

export const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'secret',
  'apiKey',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
  'socialSecurityNumber',
  'bankAccount',
  'iban',
];

export const DEFAULT_PII_FIELDS = [
  'email',
  'phone',
  'phoneNumber',
  'mobile',
  'address',
  'street',
  'city',
  'zipCode',
  'postalCode',
  'dateOfBirth',
  'dob',
  'birthDate',
  'firstName',
  'lastName',
  'fullName',
  'name',
  'ipAddress',
  'ip',
];

export function redactObject<T extends Record<string, unknown>>(
  obj: T,
  config?: Partial<RedactorConfig>
): T;

export function redactString(value: string, config?: Partial<RedactorConfig>): string;

export function maskValue(value: string, visibleChars?: number): string;

export function maskEmail(email: string): string;  // user@domain.com -> u***@d***.com

export function maskPhone(phone: string): string;  // +1234567890 -> +1******90

export function maskIP(ip: string): string;        // 192.168.1.100 -> 192.168.xxx.xxx
```

### 3. **Logger Middleware**

Create a NestJS middleware for HTTP request/response logging:

```typescript
// logger.middleware.ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService);

  use(req: Request, res: Response, next: NextFunction): void;
}
```

**Logged Request Data** (with PII redacted):
- Correlation ID (generated or from header `X-Correlation-ID`)
- HTTP method
- URL path (query params redacted)
- User agent
- Timestamp
- Tenant ID (from header or context)
- User ID (if authenticated, masked)
- Request duration
- Response status code
- Response size

**NOT Logged** (GDPR compliance):
- Request body (may contain PII)
- Response body (may contain PII)
- Full headers (may contain tokens)
- Raw IP addresses (masked)

### 4. **Logging Interceptor**

Create an interceptor for more detailed logging when needed:

```typescript
// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
```

Features:
- Log request handling time
- Log errors with stack traces (sanitized)
- Support for excluding specific routes
- Configurable log levels per route

### 5. **Correlation ID Support**

Create utilities for request correlation:

```typescript
// correlation.ts
export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

export function generateCorrelationId(): string;

export function getCorrelationId(req: Request): string;

// AsyncLocalStorage-based context for correlation ID
export class CorrelationContext {
  static run<T>(correlationId: string, fn: () => T): T;
  static get(): string | undefined;
}
```

### 6. **Structured Log Format**

Define the structured log format for JSON output:

```typescript
// log-format.ts
export interface StructuredLog {
  timestamp: string;           // ISO 8601 format
  level: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  message: string;
  context?: string;            // Logger context (e.g., 'UserService')
  correlationId?: string;      // Request correlation ID
  tenantId?: string;           // Multi-tenant identifier
  requestId?: string;          // Unique request identifier
  duration?: number;           // Request duration in ms
  meta?: Record<string, unknown>;  // Additional metadata (redacted)
  error?: {
    name: string;
    message: string;
    stack?: string;            // Only in non-production
  };
}

export function formatLog(log: StructuredLog): string;
```

### 7. **Logger Module**

Create a NestJS module for easy integration:

```typescript
// logger.module.ts
export interface LoggerModuleOptions {
  serviceName: string;
  environment?: string;
  sensitiveFields?: string[];
  piiFields?: string[];
  enableRequestLogging?: boolean;
  enableCorrelationId?: boolean;
  logLevel?: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
  excludeRoutes?: string[];    // Routes to exclude from logging
  redactQueryParams?: string[]; // Query params to always redact
}

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule;
  static forRootAsync(options: {
    imports?: any[];
    useFactory: (...args: any[]) => LoggerModuleOptions | Promise<LoggerModuleOptions>;
    inject?: any[];
  }): DynamicModule;
}
```

### 8. **Package Exports**

Update `@job-board/backend-lib` exports:

```typescript
// index.ts additions
export {
  LoggerService,
  LoggerMiddleware,
  LoggingInterceptor,
  LoggerModule,
  type LoggerModuleOptions,
} from './logger';

export {
  redactObject,
  redactString,
  maskValue,
  maskEmail,
  maskPhone,
  maskIP,
  DEFAULT_SENSITIVE_FIELDS,
  DEFAULT_PII_FIELDS,
  type RedactorConfig,
} from './logger/pii-redactor';

export {
  CorrelationContext,
  generateCorrelationId,
  getCorrelationId,
  CORRELATION_ID_HEADER,
} from './logger/correlation';

export { type StructuredLog, formatLog } from './logger/log-format';
```

## Constraints

- Must not log any raw PII data
- Must work with NestJS dependency injection
- Must support multi-tenant architecture (tenant isolation in logs)
- Must be performant (minimal overhead on request handling)
- Must work with existing `@job-board/config` for environment detection
- Redaction must be recursive (handle nested objects)
- Must handle circular references in objects safely

## Expected Output

- [ ] `packages/backend-lib/src/logger/index.ts` - Logger module exports
- [ ] `packages/backend-lib/src/logger/logger.service.ts` - Core logger service
- [ ] `packages/backend-lib/src/logger/logger.middleware.ts` - HTTP logging middleware
- [ ] `packages/backend-lib/src/logger/logging.interceptor.ts` - NestJS interceptor
- [ ] `packages/backend-lib/src/logger/pii-redactor.ts` - PII redaction utilities
- [ ] `packages/backend-lib/src/logger/correlation.ts` - Correlation ID support
- [ ] `packages/backend-lib/src/logger/log-format.ts` - Structured log format
- [ ] `packages/backend-lib/src/logger/logger.module.ts` - NestJS module
- [ ] `packages/backend-lib/src/logger/types.ts` - TypeScript interfaces
- [ ] Updated `packages/backend-lib/src/index.ts` with new exports
- [ ] Updated `packages/backend-lib/package.json` with new dependencies

## Acceptance Criteria

- [ ] `pnpm build` succeeds for `@job-board/backend-lib`
- [ ] `pnpm type-check` passes
- [ ] All sensitive fields are properly redacted in logs
- [ ] Email addresses are masked (u***@d***.com format)
- [ ] Phone numbers are masked (+1******90 format)
- [ ] IP addresses are partially masked (192.168.xxx.xxx)
- [ ] Passwords and tokens are completely redacted ([REDACTED])
- [ ] Correlation IDs are generated and propagated
- [ ] Nested objects are recursively redacted
- [ ] Circular references don't cause errors
- [ ] Production logs are JSON formatted
- [ ] Development logs are human-readable
- [ ] Request/response logging works via middleware
- [ ] Can be imported and used in `@job-board/api` app

## Technical Notes

### GDPR Compliance Checklist

1. **Data Minimization**: Only log what's necessary for debugging/auditing
2. **Purpose Limitation**: Logs are for operational purposes only
3. **Storage Limitation**: This middleware doesn't handle retention (separate concern)
4. **Accuracy**: Timestamps and correlation IDs ensure log accuracy
5. **Confidentiality**: PII is redacted before logging

### Usage Example

```typescript
// app.module.ts
import { LoggerModule } from '@job-board/backend-lib';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        serviceName: 'api',
        environment: config.env.NODE_ENV,
        enableRequestLogging: true,
        enableCorrelationId: true,
        excludeRoutes: ['/health', '/metrics'],
        redactQueryParams: ['token', 'apiKey'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

// user.service.ts
@Injectable()
export class UserService {
  private readonly logger: LoggerService;

  constructor(loggerService: LoggerService) {
    this.logger = loggerService.createChildLogger('UserService');
  }

  async findUser(id: string) {
    this.logger.log('Finding user', undefined, { userId: id });
    // userId will be logged as-is (it's a UUID, not PII)

    const user = await this.db.users.findOne(id);

    // This would redact email and phone automatically
    this.logger.debug('User found', undefined, { user });

    return user;
  }
}
```

### Package Dependencies to Add

```json
{
  "dependencies": {
    "@nestjs/common": "^10.4.15"
  },
  "peerDependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0"
  }
}
```

### Redaction Examples

```typescript
// Input
{
  id: "uuid-123",
  email: "john.doe@example.com",
  password: "secret123",
  profile: {
    phone: "+1234567890",
    address: "123 Main St"
  }
}

// Output (redacted)
{
  id: "uuid-123",
  email: "j***@e***.com",
  password: "[REDACTED]",
  profile: {
    phone: "+1******90",
    address: "[REDACTED]"
  }
}
```

---

## Related

- Depends on: [[prompts/03-backend-config-service]]
- Blocks: API authentication logging, Audit trail implementation
- References: GDPR Article 5 (Principles), Article 25 (Data protection by design)
