---
title: Dashboard Environment Variables Setup
id: 21-dashboard-env-setup
created: 2026-01-15
updated: 2026-01-15
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: frontend
complexity: simple
tags:
  - dashboard
  - environment
  - configuration
  - next.js
dependencies: []
blocks: []
related_specs: []
related_planning: []
notes: Establishes proper env var management pattern for frontend apps
---

# 21 - Dashboard Environment Variables Setup

**Date**: 2026-01-15
**Target**: Frontend (Dashboard)
**Related Spec**: N/A

---

## Context

The dashboard app currently uses environment variables directly via `process.env.NEXT_PUBLIC_*` without proper validation, typing, or documentation. A basic `.env.local` file exists but there's no `.env.example` for onboarding, no type-safe configuration, and no runtime validation.

## Goal

Create a robust environment variable setup for the dashboard frontend with:
- Type-safe configuration using Zod validation
- `.env.example` file for documentation and onboarding
- Centralized config module for consistent access across the app

## Current State

- `apps/dashboard/.env.local` exists with:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001/api
  NEXT_PUBLIC_DEFAULT_TENANT_ID=00000000-0000-0000-0000-000000000001
  ```
- `apps/dashboard/src/lib/api.ts` uses `process.env.NEXT_PUBLIC_API_URL` directly with hardcoded fallback
- No validation or typing for environment variables
- No `.env.example` file for developer onboarding

## Requirements

1. **Create `.env.example` file**
   - Document all required and optional environment variables
   - Include descriptive comments for each variable
   - Follow conventions from root `.env.example`

2. **Create type-safe config module**
   - Use Zod for runtime validation
   - Export typed configuration object
   - Validate on app startup (fail fast on misconfiguration)
   - Handle Next.js client/server split (`NEXT_PUBLIC_` prefix)

3. **Update existing code**
   - Replace direct `process.env` access with config module
   - Update `api.ts` to use centralized config

4. **Environment variables to support**
   - `NEXT_PUBLIC_API_URL` - Backend API base URL (required)
   - `NEXT_PUBLIC_DEFAULT_TENANT_ID` - Default tenant UUID (required for MVP)
   - `NEXT_PUBLIC_APP_NAME` - Application display name (optional, default: "Borg Dashboard")
   - `NEXT_PUBLIC_APP_ENV` - Environment indicator (optional, default: "development")

## Constraints

- Must use `NEXT_PUBLIC_` prefix for client-side variables (Next.js requirement)
- Must not break existing functionality
- Keep the config module lightweight (no external dependencies except Zod)
- Follow existing project patterns from `@borg/config` package

## Expected Output

- [x] `apps/dashboard/.env.example` - Environment template file
- [x] `apps/dashboard/src/lib/env.ts` - Zod schema and typed config
- [x] `apps/dashboard/src/lib/api.ts` - Updated to use config module

## Acceptance Criteria

- [x] `.env.example` file created with all variables documented
- [x] Config module validates environment variables with Zod
- [x] App fails to start with clear error if required env vars missing
- [x] `api.ts` imports API URL from config module
- [x] TypeScript types are properly inferred from Zod schema
- [x] Existing authentication flow continues to work

## Technical Notes

- Next.js only exposes `NEXT_PUBLIC_*` vars to the browser
- Zod validation should run at module load time
- Consider using `z.coerce` for any numeric or boolean values
- The config module pattern should be reusable for other frontend apps

## Files to Modify

```
apps/dashboard/
  .env.example        - Create: environment template
  src/lib/
    env.ts            - Create: Zod config module
    api.ts            - Update: use env config
```

## Example/Reference

Reference the `@borg/config` package for Zod validation patterns:
```typescript
// Example pattern from @borg/config
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_DEFAULT_TENANT_ID: z.string().uuid(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Borg Dashboard'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // ...
});
```

---

## Related

- Depends on: None
- Blocks: None
- References: `packages/config/` for validation patterns
