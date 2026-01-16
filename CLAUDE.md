# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**job-board** is a full-stack TypeScript Turborepo monorepo for a multi-tenant B2B/B2C job advertisement platform.

## Commands

```bash
# Development
pnpm dev              # Start all apps concurrently
pnpm dev:api          # Start NestJS API only (port 3001)
pnpm dev:web          # Start Next.js web app only (port 3000)
pnpm dev:dashboard    # Start Next.js dashboard only (port 3002)
pnpm dev:admin        # Start Next.js admin panel only (port 3003)

# Build & Validation
pnpm build            # Build all packages and apps
pnpm type-check       # TypeScript validation across all packages
pnpm lint             # ESLint across monorepo
pnpm format           # Prettier formatting
pnpm test             # Run tests

# Database CLI commands
pnpm db:status        # Check database connection and table counts
pnpm db:seed          # Seed database with sample data
pnpm db:purge         # Delete all data from database
pnpm db:reset         # Purge + seed (full reset)

# Filtered commands (single package)
pnpm build --filter=@job-board/api
pnpm type-check --filter=@job-board/config

# Package-specific (run from package directory)
pnpm test:watch       # Jest watch mode (api)
pnpm test:cov         # Jest with coverage (api)
```

## Architecture

### Monorepo Structure

```
apps/
├── api/           # @job-board/api - NestJS backend REST API (port 3001)
├── web/           # @job-board/web - Next.js consumer frontend (port 3000)
├── dashboard/     # @job-board/dashboard - Next.js B2B organization dashboard (port 3002)
└── admin/         # @job-board/admin - Next.js platform admin panel (port 3003)

packages/
├── types/         # @job-board/types - Shared TypeScript types
├── config/        # @job-board/config - Zod-validated env config (NestJS module)
├── backend-lib/   # @job-board/backend-lib - Logger, exceptions, utilities
├── db/            # @job-board/db - TypeORM entities and DatabaseModule
├── ui/            # @job-board/ui - Glassmorphism design system (Chakra UI)
├── eslint-config-backend/    # ESLint + Prettier for backend
└── eslint-config-frontend/   # ESLint + Prettier for frontend
```

### Key Patterns

- **Package naming**: All packages use `@job-board/*` prefix
- **Workspace dependencies**: Use `"@job-board/types": "workspace:*"` in package.json
- **Import aliases**: All apps use `@/*` for src directory imports
- **Multi-tenancy**: All major entities have a `tenant` relation; tenant isolation happens at query level
- **Auth**: JWT-based auth with `@UseGuards(JwtAuthGuard)` and `@CurrentUser()` decorator

### API Module Structure

Each API feature follows the pattern:
```
src/feature/
├── feature.module.ts      # NestJS module
├── feature.controller.ts  # HTTP endpoints
├── feature.service.ts     # Business logic
├── dto/                   # class-validator DTOs
└── index.ts               # Barrel export
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, React 19 |
| Dashboard/Admin UI | Chakra UI 2, @job-board/ui (glassmorphism) |
| Web UI | TailwindCSS |
| Backend | NestJS 10, TypeORM (PostgreSQL) |
| State (Frontend) | Zustand, TanStack Query |
| Build | Turborepo, tsup, pnpm workspaces |
| Validation | Zod (config), class-validator (NestJS DTOs) |
| CLI | nest-commander for db:* commands |

### @job-board/backend-lib

Provides NestJS modules and utilities:
- `LoggerModule` - Structured logging with correlation IDs
- `ExceptionsModule` - Global HTTP exception filter with i18n
- `ApiException`, `ApiExceptions` - Standardized error responses

### @job-board/ui Design System

Glassmorphism components with customizable brand colors:

```tsx
import { GlassThemeProvider, brandPresets } from '@job-board/ui';
<GlassThemeProvider brandConfig={brandPresets.indigo}>

// Components: GlassCard, GlassButton, GlassInput, GlassModal, GlassNavbar, GlassSidebar, GlassPanel
// Re-exports all Chakra UI components
// Brand presets: indigo, emerald, rose, blue, violet, amber, cyan, slate
```

## Documentation

- `docs/initial/backend-architecture.md` - Multi-tenant NestJS architecture design
- `docs/initial/business-plan.md` - Platform business model and pricing tiers
- `docs/initial/er-diagram.md` - Database entity relationships
