---
title: Rename Package Prefix and Add B2B Dashboard
id: 02-prefix-rename-and-b2b-dashboard
created: 2026-01-13
updated: 2026-01-13
status: executed
executed_date: 2026-01-13
execution_result: success
deprecated: false
deprecated_reason:
target: infrastructure
complexity: moderate
tags:
  - refactoring
  - naming
  - dashboard
  - b2b
  - dev-scripts
dependencies:
  - 01-turborepo-monorepo-setup
blocks: []
related_specs: []
related_planning: []
notes: Establishes consistent @borg naming convention and adds B2B dashboard app
---

# 02 - Rename Package Prefix and Add B2B Dashboard

**Date**: 2026-01-13
**Target**: Infrastructure
**Related Spec**: N/A

---

## Context

The monorepo was initially set up with `@mp` package prefix. The project requires a consistent `@borg` prefix across all packages and apps. Additionally, a new B2B dashboard application is needed alongside the existing consumer-facing website.

## Goal

1. Rename all package prefixes from `@mp` to `@borg`
2. Add convenient local development scripts for running individual apps
3. Create a new B2B dashboard Next.js application

## Current State

Existing structure with `@mp` prefix:
```
apps/
  api/          # @mp/api
  web/          # @mp/web
packages/
  types/                    # @mp/types
  backend-lib/              # @mp/backend-lib
  eslint-config-backend/    # @mp/eslint-config-backend
  eslint-config-frontend/   # @mp/eslint-config-frontend
```

## Requirements

### 1. **Rename Package Prefix**

Update all package names from `@mp/*` to `@borg/*`:

| Current | New |
|---------|-----|
| `@mp/api` | `@borg/api` |
| `@mp/web` | `@borg/web` |
| `@mp/types` | `@borg/types` |
| `@mp/backend-lib` | `@borg/backend-lib` |
| `@mp/eslint-config-backend` | `@borg/eslint-config-backend` |
| `@mp/eslint-config-frontend` | `@borg/eslint-config-frontend` |

Update all references:
- All `package.json` files (name field and dependencies)
- All import statements
- All ESLint/Prettier config references

### 2. **Add Local Development Scripts**

Add convenience scripts to root `package.json` for running individual apps:

```json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:api": "turbo dev --filter=@borg/api",
    "dev:web": "turbo dev --filter=@borg/web",
    "dev:dashboard": "turbo dev --filter=@borg/dashboard"
  }
}
```

### 3. **Create B2B Dashboard App**

Create a new Next.js application at `apps/dashboard`:

- **Purpose**: B2B dashboard for business clients/admin functionality
- **Tech Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Port**: 3002 (to avoid conflicts with web on 3000 and api on 3001)
- **Package Name**: `@borg/dashboard`
- **Configuration**: Use `@borg/eslint-config-frontend` and `@borg/types`

#### Dashboard Structure
```
apps/dashboard/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── .eslintrc.js
└── prettier.config.js
```

#### Dashboard Features
- Basic layout with sidebar navigation placeholder
- Dashboard home page with placeholder content
- Configured for B2B styling (professional/minimal aesthetic)

## Constraints

- Maintain all existing functionality after rename
- Ensure Turborepo caching still works correctly
- Keep consistent configuration patterns between `web` and `dashboard` apps
- Dashboard runs on port 3002 to avoid conflicts

## Expected Output

- [ ] All packages renamed from `@mp/*` to `@borg/*`
- [ ] All import statements updated
- [ ] Root `package.json` has individual dev scripts
- [ ] New `apps/dashboard/` created and configured
- [ ] All builds pass after changes
- [ ] Type checking passes across all packages

## Acceptance Criteria

- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` successfully builds all packages (including new dashboard)
- [ ] `pnpm dev:api` starts only the API on port 3001
- [ ] `pnpm dev:web` starts only the web app on port 3000
- [ ] `pnpm dev:dashboard` starts only the dashboard on port 3002
- [ ] `pnpm dev` starts all apps concurrently
- [ ] No references to `@mp` prefix remain in the codebase
- [ ] Shared types are importable in the dashboard app
- [ ] ESLint configs work correctly with new prefix

## Technical Notes

### Files to Modify

```
package.json                              # Add dev scripts
apps/api/package.json                     # Rename + update deps
apps/api/src/app.controller.ts            # Update imports
apps/api/src/app.service.ts               # Update imports
apps/web/package.json                     # Rename + update deps
apps/web/next.config.ts                   # Update transpilePackages
apps/web/src/app/page.tsx                 # Update imports
apps/web/.eslintrc.js                     # Update extends
apps/web/prettier.config.js               # Update require
packages/types/package.json               # Rename
packages/backend-lib/package.json         # Rename + update deps
packages/backend-lib/src/index.ts         # Update imports
packages/backend-lib/.eslintrc.js         # Update extends
packages/backend-lib/prettier.config.js   # Update require
packages/eslint-config-backend/package.json   # Rename
packages/eslint-config-frontend/package.json  # Rename
```

### New Files to Create

```
apps/dashboard/                           # New B2B dashboard app
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── .eslintrc.js
├── prettier.config.js
├── next-env.d.ts
└── src/app/
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

### Port Allocation

| App | Port |
|-----|------|
| Web (Consumer) | 3000 |
| API | 3001 |
| Dashboard (B2B) | 3002 |

---

## Related

- Depends on: [[prompts/01-turborepo-monorepo-setup]]
- Blocks: Subsequent feature development
- References: N/A
