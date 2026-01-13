---
title: Setup Main API with Core Infrastructure
id: 09-api-setup
created: 2026-01-13
updated: 2026-01-13
status: executed
executed_date: 2026-01-13
execution_result: success
deprecated: false
deprecated_reason:
target: backend
complexity: moderate
tags:
  - api
  - nestjs
  - swagger
  - healthcheck
  - infrastructure
dependencies:
  - 03-backend-config-service
  - 05-database-package
  - 07-gdpr-logger-middleware
  - 08-http-exception-filter
blocks: []
related_specs:
  - "[[initial/backend-architecture]]"
related_planning: []
notes: Successfully implemented. Fixed TypeORM entity column types in @borg/db package to add explicit types required for bundled packages.
---

# 09 - Setup Main API with Core Infrastructure

**Date**: 2026-01-13
**Target**: Backend
**Related Spec**: [[initial/backend-architecture]]

---

## Context

The `@borg/api` NestJS application currently has a minimal scaffold with basic AppModule, AppController, and AppService. The shared infrastructure packages (`@borg/config`, `@borg/backend-lib`, `@borg/db`) are implemented and ready for integration. The API needs to be properly configured with all core infrastructure to serve as the foundation for feature development.

## Goal

Configure the `@borg/api` application with proper infrastructure integration including environment configuration, database connection, logging middleware, exception handling, Swagger documentation, validation pipes, and a comprehensive healthcheck endpoint.

## Current State

**API Structure** (`apps/api/src/`):
```
src/
├── main.ts           # Basic bootstrap, hardcoded port
├── app.module.ts     # Empty module, no imports
├── app.controller.ts # Basic controller
└── app.service.ts    # Basic service
```

**Available Packages**:
- `@borg/config` - Exports: `ConfigModule`, `ConfigService`, `envSchema`, `validateEnv`
- `@borg/backend-lib` - Exports: `LoggerModule`, `LoggerService`, `LoggerMiddleware`, `LoggingInterceptor`, HTTP exception filter
- `@borg/db` - Exports: `DatabaseModule`, `DatabaseService`, all entities and enums

## Requirements

1. **Environment Configuration**
   - Import and configure `ConfigModule` from `@borg/config`
   - Use `ConfigService` for all environment-dependent values (port, API prefix, etc.)
   - Ensure environment validation runs on startup

2. **Database Connection**
   - Import `DatabaseModule` from `@borg/db`
   - Database should connect on application startup
   - Log connection status

3. **Logger Middleware**
   - Import `LoggerModule` from `@borg/backend-lib`
   - Apply `LoggerMiddleware` globally to all routes
   - Configure structured JSON logging for production, pretty logging for development
   - Include correlation ID support

4. **Exception Handling**
   - Apply global HTTP exception filter from `@borg/backend-lib`
   - Ensure consistent error response format across all endpoints

5. **Swagger Documentation**
   - Install and configure `@nestjs/swagger`
   - Setup Swagger UI at `/api/docs` path
   - Configure API title, description, version from config
   - Include bearer auth security definition
   - Tag endpoints appropriately

6. **Validation Pipes**
   - Configure global `ValidationPipe` with:
     - `whitelist: true` - strip non-whitelisted properties
     - `forbidNonWhitelisted: true` - throw on extra properties
     - `transform: true` - auto-transform payloads to DTO instances
     - `transformOptions.enableImplicitConversion: true`

7. **Healthcheck Endpoint**
   - Create dedicated `HealthModule` with `HealthController`
   - Endpoint: `GET /health`
   - Return verbose status including:
     - Overall status (healthy/unhealthy)
     - Timestamp
     - Uptime
     - Database connection status (via DatabaseService)
     - Memory usage (heap used/total, RSS)
     - Environment (development/production)
     - Version (from package.json)

8. **Main Bootstrap Enhancements**
   - Use ConfigService for port configuration
   - Set global API prefix (e.g., `/api/v1`)
   - Enable CORS with configurable origins
   - Enable shutdown hooks for graceful termination
   - Log startup information using LoggerService

## Constraints

- Do NOT modify the shared packages (`@borg/config`, `@borg/backend-lib`, `@borg/db`)
- Follow existing code patterns from the packages
- Use dependency injection consistently
- Keep healthcheck module self-contained and reusable
- Ensure all configurations are environment-driven where appropriate

## Expected Output

- [ ] `apps/api/src/main.ts` - Enhanced bootstrap with full configuration
- [ ] `apps/api/src/app.module.ts` - Updated with all module imports
- [ ] `apps/api/src/health/health.module.ts` - New health module
- [ ] `apps/api/src/health/health.controller.ts` - Healthcheck endpoint
- [ ] `apps/api/src/health/health.service.ts` - Health check logic
- [ ] `apps/api/src/health/dto/health-response.dto.ts` - Response DTO
- [ ] `apps/api/package.json` - Updated with swagger dependencies

## Acceptance Criteria

- [ ] Application starts successfully with `pnpm dev:api`
- [ ] Environment validation errors are thrown if required vars missing
- [ ] Database connects successfully on startup
- [ ] All requests are logged with correlation IDs
- [ ] Swagger UI accessible at `/api/v1/docs`
- [ ] `/api/v1/health` returns verbose system status
- [ ] Invalid request payloads return proper validation errors
- [ ] Unhandled exceptions return consistent error format
- [ ] Application shuts down gracefully on SIGTERM

## Technical Notes

### ConfigService Usage
```typescript
// Get port from config
const configService = app.get(ConfigService);
const port = configService.get('port');
```

### LoggerModule Configuration
```typescript
LoggerModule.forRoot({
  serviceName: 'borg-api',
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
})
```

### Healthcheck Response Structure
```typescript
{
  status: 'healthy' | 'unhealthy',
  timestamp: string,
  uptime: number,
  version: string,
  environment: string,
  database: {
    status: 'connected' | 'disconnected',
    latency?: number
  },
  memory: {
    heapUsed: number,
    heapTotal: number,
    rss: number
  }
}
```

### Swagger Configuration
```typescript
const config = new DocumentBuilder()
  .setTitle('Borg API')
  .setDescription('Multi-tenant Job Board API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

## Files to Modify

```
apps/api/
├── package.json              - Add @nestjs/swagger, swagger-ui-express
└── src/
    ├── main.ts               - Full bootstrap configuration
    ├── app.module.ts         - Import all infrastructure modules
    └── health/
        ├── health.module.ts      - Create module
        ├── health.controller.ts  - GET /health endpoint
        ├── health.service.ts     - Health check logic
        └── dto/
            └── health-response.dto.ts - Response shape
```

## Example/Reference

Similar healthcheck patterns can be found in NestJS Terminus module, though we implement a lightweight custom version.

---

## Related

- Depends on: [[prompts/03-backend-config-service]], [[prompts/05-database-package]], [[prompts/07-gdpr-logger-middleware]], [[prompts/08-http-exception-filter]]
- Blocks: Future feature modules (auth, jobs, etc.)
- References: [[initial/backend-architecture]]
