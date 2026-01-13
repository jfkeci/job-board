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
```

## Architecture

### Monorepo Structure

```
apps/
├── api/           # @borg/api - NestJS backend REST API
├── web/           # @borg/web - Next.js consumer frontend
└── dashboard/     # @borg/dashboard - Next.js B2B admin dashboard

packages/
├── types/         # @borg/types - Shared TypeScript types
├── config/        # @borg/config - Zod-validated env config (NestJS module)
├── backend-lib/   # @borg/backend-lib - Shared backend utilities
├── eslint-config-backend/    # ESLint + Prettier for backend
└── eslint-config-frontend/   # ESLint + Prettier for frontend
```

### Key Patterns

- **Package naming**: All packages use `@borg/*` prefix
- **Workspace dependencies**: Use `"@borg/types": "workspace:*"` in package.json
- **Shared types**: Import from `@borg/types` for cross-app type safety
- **Config service**: Use `@borg/config` for environment validation with Zod schemas
- **ESLint configs**: Backend apps extend `@borg/eslint-config-backend`, frontends extend `@borg/eslint-config-frontend`

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, React 19, TailwindCSS |
| Backend | NestJS 10, TypeORM (PostgreSQL) |
| Build | Turborepo, tsup, pnpm workspaces |
| Validation | Zod (config), class-validator (NestJS DTOs) |

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
- `docs/initial/business-plan.md` - Platform business model and pricing
- `docs/initial/er-diagram.md` - Database entity relationships
