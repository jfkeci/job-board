---
title: Setup Turborepo Monorepo Structure
id: 01-turborepo-monorepo-setup
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
  - turborepo
  - monorepo
  - nextjs
  - nestjs
  - typescript
  - eslint
  - prettier
dependencies: []
blocks: []
related_specs: []
related_planning: []
notes: Successfully created Turborepo monorepo with Next.js 15 frontend, NestJS backend, shared types, backend-lib, and ESLint/Prettier configs. All builds and type-checks pass.
---

# 01 - Setup Turborepo Monorepo Structure

**Date**: 2026-01-13
**Target**: Infrastructure
**Related Spec**: N/A (foundational setup)

---

## Context

Setting up a new Turborepo monorepo from scratch to support a full-stack TypeScript application. The monorepo will house both frontend and backend applications along with shared packages for code reuse, type safety, and consistent tooling across the codebase.

## Goal

Create a fully configured Turborepo monorepo with properly structured apps and packages, including all necessary configuration for TypeScript, ESLint, Prettier, and package dependencies.

## Current State

- Empty or minimal project directory
- No existing monorepo structure
- Starting fresh with Turborepo

## Requirements

### 1. **Turborepo Root Configuration**
   - Initialize Turborepo with pnpm workspaces
   - Configure `turbo.json` with appropriate pipelines for:
     - `build` - Build all packages and apps
     - `dev` - Development mode
     - `lint` - Run ESLint across all packages
     - `format` - Run Prettier formatting
     - `type-check` - TypeScript type checking
     - `test` - Run tests
   - Root `package.json` with workspace scripts
   - Root `pnpm-workspace.yaml` configuration

### 2. **Apps**

#### 2.1 Frontend App (`apps/web`)
   - Next.js 14+ with App Router
   - TypeScript configuration
   - Tailwind CSS setup
   - References shared types package
   - Uses frontend ESLint/Prettier config

#### 2.2 Backend API App (`apps/api`)
   - NestJS framework
   - TypeScript configuration
   - References shared types package
   - References shared backend library package
   - Uses backend ESLint/Prettier config

### 3. **Packages**

#### 3.1 Shared Types (`packages/types`)
   - TypeScript type definitions shared across frontend and backend
   - Exports common interfaces, types, and enums
   - No runtime dependencies (types only)
   - Configured for both CJS and ESM output

#### 3.2 Shared Backend Library (`packages/backend-lib`)
   - Common backend utilities and helpers
   - Shared NestJS modules, decorators, guards, etc.
   - Database utilities if needed
   - Uses backend ESLint/Prettier config
   - References shared types package

#### 3.3 Backend ESLint/Prettier Config (`packages/eslint-config-backend`)
   - ESLint configuration for NestJS/Node.js
   - Prettier configuration
   - TypeScript ESLint rules
   - Exported as shareable config
   - Rules optimized for backend development

#### 3.4 Frontend ESLint/Prettier Config (`packages/eslint-config-frontend`)
   - ESLint configuration for Next.js/React
   - Prettier configuration
   - TypeScript ESLint rules
   - React hooks rules
   - Next.js specific rules
   - Exported as shareable config

## Constraints

- Use pnpm as the package manager (required for Turborepo)
- TypeScript strict mode enabled across all packages
- All packages must have proper `exports` field in package.json
- Follow Turborepo best practices for internal packages (use `"workspace:*"` for dependencies)
- ESLint configs should extend from a common base where possible
- No circular dependencies between packages

## Expected Output

- [ ] Root configuration files created:
  - `package.json`
  - `pnpm-workspace.yaml`
  - `turbo.json`
  - `tsconfig.json` (base config)
  - `.gitignore`
  - `.npmrc`

- [ ] Apps created and configured:
  - `apps/web/` - Next.js frontend
  - `apps/api/` - NestJS backend

- [ ] Packages created and configured:
  - `packages/types/`
  - `packages/backend-lib/`
  - `packages/eslint-config-backend/`
  - `packages/eslint-config-frontend/`

- [ ] All TypeScript configurations properly set up
- [ ] All ESLint/Prettier configurations working
- [ ] Basic `turbo dev` and `turbo build` commands functional

## Acceptance Criteria

- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` successfully builds all packages and apps
- [ ] `pnpm dev` starts both frontend and backend in development mode
- [ ] `pnpm lint` runs ESLint across the entire monorepo
- [ ] `pnpm format` formats code with Prettier
- [ ] `pnpm type-check` validates TypeScript across all packages
- [ ] Shared types are importable in both apps
- [ ] Backend library is importable in the API app
- [ ] ESLint configs are properly applied to their respective apps
- [ ] No TypeScript errors in any package
- [ ] Turborepo caching works correctly

## Technical Notes

### Directory Structure
```
/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   └── app/           # App Router
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   └── tailwind.config.js
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── main.ts
│       │   └── app.module.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend-lib/            # Shared backend utilities
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── eslint-config-backend/  # Backend ESLint config
│   │   ├── index.js
│   │   └── package.json
│   │
│   └── eslint-config-frontend/ # Frontend ESLint config
│       ├── index.js
│       └── package.json
│
├── package.json                # Root package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json               # Base TypeScript config
└── .gitignore
```

### Package Naming Convention
- Apps: `@mp/web`, `@mp/api`
- Packages: `@mp/types`, `@mp/backend-lib`, `@mp/eslint-config-backend`, `@mp/eslint-config-frontend`

### Key Dependencies
- **Root**: `turbo`, `typescript`
- **Frontend**: `next`, `react`, `react-dom`, `tailwindcss`
- **Backend**: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
- **ESLint Configs**: `eslint`, `prettier`, `@typescript-eslint/*`, relevant plugins

### Turborepo Pipeline Configuration
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## Related

- Depends on: None (initial setup)
- Blocks: All subsequent development prompts
- References: N/A
