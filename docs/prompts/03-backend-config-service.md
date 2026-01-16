---
title: Create Backend Config Service Package
id: 03-backend-config-service
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
  - config
  - validation
  - zod
  - nestjs
  - typeorm
  - mysql
  - environment
dependencies:
  - 02-prefix-rename-and-b2b-dashboard
blocks: []
related_specs: []
related_planning: []
notes: Foundational config package for all backend services
---

# 03 - Create Backend Config Service Package

**Date**: 2026-01-13
**Target**: Backend
**Related Spec**: N/A

---

## Context

Backend applications need a robust, type-safe configuration system that validates environment variables at startup. This package will provide a centralized configuration service that can be used by all NestJS backend apps in the monorepo, ensuring consistent configuration handling and early failure detection for missing or invalid environment variables.

## Goal

Create a shared backend configuration package (`@job-board/config`) that provides:
1. TypeScript interfaces defining all environment variable types
2. Zod schemas for runtime validation
3. A NestJS-compatible ConfigService
4. Built-in `.env` file loading from the package directory
5. Initial configuration for app settings and TypeORM MySQL connection

## Current State

- Monorepo has `@job-board/backend-lib` for shared utilities
- No centralized configuration management
- Each app would need to implement its own env validation

## Requirements

### 1. **Package Structure**

Create `packages/config` with the following structure:

```
packages/config/
├── src/
│   ├── index.ts                 # Main exports
│   ├── env.interface.ts         # TypeScript interface for env vars
│   ├── env.schema.ts            # Zod validation schema
│   ├── config.service.ts        # NestJS ConfigService wrapper
│   ├── config.module.ts         # NestJS module
│   └── env/
│       ├── .env.example         # Example env file
│       └── .env                  # Default env (gitignored)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .eslintrc.js
└── prettier.config.js
```

### 2. **Environment Interface**

Define a TypeScript interface (`EnvConfig`) with the following sections:

```typescript
interface EnvConfig {
  // App Configuration
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  API_PREFIX: string;

  // Database Configuration (TypeORM MySQL)
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SYNCHRONIZE: boolean;  // Should be false in production
  DB_LOGGING: boolean;
}
```

### 3. **Zod Validation Schema**

Create a Zod schema that:
- Validates all environment variables
- Provides meaningful error messages
- Coerces string values to appropriate types (numbers, booleans)
- Sets sensible defaults where appropriate

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  API_PREFIX: z.string().default('api'),

  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USERNAME: z.string().min(1, 'DB_USERNAME is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_DATABASE: z.string().min(1, 'DB_DATABASE is required'),
  DB_SYNCHRONIZE: z.coerce.boolean().default(false),
  DB_LOGGING: z.coerce.boolean().default(false),
});
```

### 4. **Config Service**

Create a NestJS-compatible service that:
- Loads `.env` files from the package's `env/` directory
- Validates configuration using Zod schema on initialization
- Throws descriptive errors if validation fails
- Provides typed getters for configuration values
- Is injectable into NestJS apps

```typescript
@Injectable()
export class ConfigService {
  private readonly config: EnvConfig;

  constructor() {
    this.loadEnvFiles();
    this.config = this.validateEnv();
  }

  get<K extends keyof EnvConfig>(key: K): EnvConfig[K];

  get database(): TypeOrmModuleOptions;
}
```

### 5. **Config Module**

Create a NestJS dynamic module that:
- Provides the ConfigService globally
- Can be imported with `ConfigModule.forRoot()`
- Supports optional configuration overrides

### 6. **Env File Loading**

The package should:
- Use `dotenv` to load `.env` files
- Load from `packages/config/src/env/.env` by default
- Support environment-specific files (`.env.development`, `.env.production`)
- Allow apps to override with their own `.env` files

## Constraints

- Must work with NestJS dependency injection
- Must validate configuration synchronously on app startup
- Must fail fast with clear error messages
- Use `@job-board/eslint-config-backend` for linting
- Keep the package focused (config only, no other utilities)
- The `.env` file inside the package should be gitignored
- The `.env.example` should document all required variables

## Expected Output

- [ ] New package created at `packages/config/`
- [ ] `package.json` with correct dependencies (`zod`, `dotenv`, `@nestjs/common`)
- [ ] TypeScript interface for environment variables
- [ ] Zod schema with validation and coercion
- [ ] NestJS ConfigService with typed getters
- [ ] NestJS ConfigModule for dependency injection
- [ ] `.env.example` file with documented variables
- [ ] Package exports all necessary types and classes
- [ ] Build passes without errors

## Acceptance Criteria

- [ ] `pnpm build` succeeds for the new package
- [ ] `pnpm type-check` passes
- [ ] Package can be imported in `@job-board/api`
- [ ] ConfigService validates env vars on instantiation
- [ ] Invalid/missing env vars throw descriptive errors
- [ ] TypeORM configuration helper returns correct options object
- [ ] Zod schema correctly coerces string values to numbers/booleans
- [ ] `.env.example` documents all required variables

## Technical Notes

### Package Dependencies

```json
{
  "dependencies": {
    "zod": "^3.24.0",
    "dotenv": "^16.4.0"
  },
  "peerDependencies": {
    "@nestjs/common": "^10.0.0"
  },
  "devDependencies": {
    "@job-board/eslint-config-backend": "workspace:*",
    "@nestjs/common": "^10.4.15",
    "@types/node": "^22.10.5",
    "tsup": "^8.3.5",
    "typescript": "^5.7.2"
  }
}
```

### Usage Example in API App

```typescript
// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@job-board/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.database,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Env File Loading Order

1. `packages/config/src/env/.env` (base defaults)
2. `packages/config/src/env/.env.{NODE_ENV}` (environment-specific)
3. Process environment variables (highest priority)

### Error Message Example

```
Configuration validation failed:
  - DB_HOST: Required
  - DB_PASSWORD: String must contain at least 1 character(s)
  - PORT: Expected number, received "invalid"
```

---

## Files to Create

```
packages/config/
├── src/
│   ├── index.ts
│   ├── env.interface.ts
│   ├── env.schema.ts
│   ├── config.service.ts
│   ├── config.module.ts
│   └── env/
│       └── .env.example
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .eslintrc.js
├── prettier.config.js
└── .gitignore
```

---

## Related

- Depends on: [[prompts/02-prefix-rename-and-b2b-dashboard]]
- Blocks: Database integration, authentication setup
- References: N/A
