# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**borg-clone** is a full-stack TypeScript Turborepo monorepo for a multi-tenant B2B/B2C job advertisement platform.

## Commands

```bash
# Development
pnpm dev              # Start all apps concurrently
pnpm dev:api          # Start NestJS API only (port 3001)
pnpm dev:web          # Start Next.js web app only (port 3000)
pnpm dev:dashboard    # Start Next.js dashboard only (port 3002)

# Build & Validation
pnpm build            # Build all packages and apps
pnpm type-check       # TypeScript validation across all packages
pnpm lint             # ESLint across monorepo
pnpm format           # Prettier formatting
pnpm test             # Run tests

# Filtered commands (single package)
pnpm build --filter=@borg/api
pnpm type-check --filter=@borg/config

# Package-specific (run from package directory)
pnpm test:watch       # Jest watch mode (api)
pnpm test:cov         # Jest with coverage (api)
```

## Architecture

### Monorepo Structure

```
apps/
├── api/           # @borg/api - NestJS backend REST API (port 3001)
├── web/           # @borg/web - Next.js consumer frontend (port 3000)
└── dashboard/     # @borg/dashboard - Next.js B2B admin dashboard (port 3002)

packages/
├── types/         # @borg/types - Shared TypeScript types
├── config/        # @borg/config - Zod-validated env config (NestJS module)
├── backend-lib/   # @borg/backend-lib - Shared backend utilities
├── db/            # @borg/db - TypeORM database layer (PostgreSQL)
├── ui/            # @borg/ui - Glassmorphism design system (Chakra UI)
├── eslint-config-backend/    # ESLint + Prettier for backend
└── eslint-config-frontend/   # ESLint + Prettier for frontend
```

### Key Patterns

- **Package naming**: All packages use `@borg/*` prefix
- **Workspace dependencies**: Use `"@borg/types": "workspace:*"` in package.json
- **Shared types**: Import from `@borg/types` for cross-app type safety
- **Config service**: Use `@borg/config` for environment validation with Zod schemas
- **ESLint configs**: Backend apps extend `@borg/eslint-config-backend`, frontends extend `@borg/eslint-config-frontend`
- **Import aliases**: All apps use `@/*` for src directory imports

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, React 19 |
| Dashboard UI | Chakra UI 2, @borg/ui (glassmorphism) |
| Web UI | TailwindCSS |
| Backend | NestJS 10, TypeORM (PostgreSQL) |
| Build | Turborepo, tsup, pnpm workspaces |
| Validation | Zod (config), class-validator (NestJS DTOs) |

### @borg/ui Design System

Glassmorphism components with customizable brand colors:

```tsx
// Setup with brand preset
import { GlassThemeProvider, brandPresets } from '@borg/ui';
<GlassThemeProvider brandConfig={brandPresets.indigo}>

// Components: GlassCard, GlassButton, GlassInput, GlassModal, GlassNavbar, GlassSidebar, GlassPanel
// Re-exports all Chakra UI components (Box, Flex, VStack, etc.)
// Brand presets: indigo, emerald, rose, blue, violet, amber, cyan, slate
```

## AI-Assisted Development Workflow

This project uses a structured prompt-based workflow documented in `docs/ai-task-execution-workflow.md`.

### Prompt System

- **Location**: `docs/prompts/` contains refined prompts with YAML frontmatter
- **Template**: `docs/prompts/template-prompt.md` defines the standard prompt structure
- **Header reference**: `docs/prompts/00-prompt-header-reference.md` defines metadata properties

### Prompt Lifecycle

1. Draft rough prompt in `docs/rough-prompts/`
2. Refine using template structure
3. Save to `docs/prompts/` with naming: `NN-descriptive-slug.md`
4. Execute with Claude Code
5. Update status properties (`status: executed`, `execution_result: success|partial|failed`)

## Documentation

- `docs/initial/backend-architecture.md` - Multi-tenant NestJS architecture design
- `docs/initial/business-plan.md` - Platform business model and pricing tiers
- `docs/initial/er-diagram.md` - Database entity relationships
