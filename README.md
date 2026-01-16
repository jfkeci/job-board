# Job Board

A multi-tenant B2B/B2C job advertisement platform built with TypeScript.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Chakra UI
- **Backend**: NestJS 10, TypeORM, PostgreSQL
- **Build**: Turborepo, pnpm workspaces

## Monorepo Structure

```
apps/
├── api/           # NestJS REST API (port 3001)
├── web/           # Consumer job search frontend (port 3000)
├── dashboard/     # B2B organization dashboard (port 3002)
└── admin/         # Platform admin panel (port 3003)

packages/
├── types/         # Shared TypeScript types
├── config/        # Environment configuration
├── backend-lib/   # Logger, exceptions, utilities
├── db/            # TypeORM entities and database layer
├── ui/            # Glassmorphism design system
└── eslint-config-*/  # Shared ESLint configs
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL

### Installation

```bash
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env` in `apps/api/` and configure your database connection.

### Development

```bash
# Start all apps
pnpm dev

# Start individual apps
pnpm dev:api          # API on port 3001
pnpm dev:web          # Web on port 3000
pnpm dev:dashboard    # Dashboard on port 3002
pnpm dev:admin        # Admin on port 3003
```

### Database

```bash
pnpm db:status    # Check connection and table counts
pnpm db:seed      # Seed with sample data
pnpm db:purge     # Delete all data
pnpm db:reset     # Purge + seed
```

### Build & Validation

```bash
pnpm build        # Build all
pnpm type-check   # TypeScript validation
pnpm lint         # ESLint
pnpm test         # Run tests
```

## License

Private
