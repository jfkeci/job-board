---
title: Database Seeder Service and CLI Script
id: 07-database-seeder-service
created: 2026-01-15
updated: 2026-01-15
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: backend
complexity: moderate
tags:
  - database
  - seeder
  - cli
  - reference-data
  - typeorm
dependencies: []
blocks: []
related_specs:
  - "[[initial/er-diagram]]"
  - "[[initial/business-plan]]"
related_planning: []
notes: Seeds reference/lookup data only, excludes user-generated content. Successfully implemented with nest-commander CLI.
---

# 07 - Database Seeder Service and CLI Script

**Date**: 2026-01-15
**Target**: Backend
**Related Spec**: [[initial/er-diagram]], [[initial/business-plan]]

---

## Context

The job-board-clone platform is a multi-tenant job board that requires reference/lookup data to function properly. Currently, there is no seeding mechanism in place, meaning new database instances cannot operate without manually inserting required reference data.

Reference data includes tenants, job categories (with translations), and geographic locations. This data is system-managed and distinct from user-generated content (users, organizations, jobs, applications, payments).

## Goal

Create a database seeder service and CLI script that can:
1. **Purge** all data from the database (with safety confirmation)
2. **Seed** all required reference/lookup data for the application to function
3. Be executed via CLI command with options for selective operations

## Current State

**Database Layer**: `packages/db/src/`
- 16 entities defined in `entities/` directory
- 12 enum types in `enums/` directory
- `DatabaseService` facade provides repository access
- `DatabaseModule.forRoot()` handles global database connection

**API Layer**: `apps/api/src/`
- NestJS 10 application
- Services use `DatabaseService` for repository access
- No existing seed scripts or migrations

**Entities Requiring Seed Data**:
- `Tenant` - Multi-tenant platform instances
- `Category` - Job categories (hierarchical, tenant-scoped or global)
- `CategoryTranslation` - Multilingual category names
- `Location` - Geographic hierarchy (COUNTRY → REGION → CITY)

**Entities NOT to Seed** (user-generated):
- User, UserProfile, Organization, Job, Application, Payment, CvCredit, SavedJob, JobView, Session, RefreshToken, File

## Requirements

### 1. **Seeder Service** (`apps/api/src/seeder/`)

Create a NestJS module with seeder service:

```
apps/api/src/seeder/
├── seeder.module.ts
├── seeder.service.ts
├── data/
│   ├── tenants.data.ts
│   ├── categories.data.ts
│   └── locations.data.ts
└── index.ts
```

**SeederService Methods**:
- `purge(): Promise<void>` - Truncate all tables in correct order (respecting FK constraints)
- `seedTenants(): Promise<Tenant[]>` - Seed tenant records
- `seedCategories(): Promise<Category[]>` - Seed categories with translations
- `seedLocations(): Promise<Location[]>` - Seed location hierarchy
- `seedAll(): Promise<void>` - Run all seeders in correct order
- `getStatus(): Promise<SeederStatus>` - Return current seed status (counts)

### 2. **Seed Data Files**

#### `tenants.data.ts`
Seed default tenants based on business plan:
```typescript
export const tenantsData = [
  {
    code: 'HR',
    name: 'job-board Croatia',
    domain: 'job-board.hr',
    defaultLanguage: 'hr',
    supportedLanguages: ['hr', 'en'],
    currency: 'EUR',
    timezone: 'Europe/Zagreb',
    isActive: true,
  },
  {
    code: 'SI',
    name: 'job-board Slovenia',
    domain: 'job-board.si',
    defaultLanguage: 'sl',
    supportedLanguages: ['sl', 'en'],
    currency: 'EUR',
    timezone: 'Europe/Ljubljana',
    isActive: true,
  },
  // Add more as needed
];
```

#### `categories.data.ts`
Seed hierarchical job categories with translations:
```typescript
export const categoriesData = [
  {
    slug: 'technology',
    parentSlug: null,
    translations: {
      en: 'Technology',
      hr: 'Tehnologija',
      sl: 'Tehnologija',
    },
    children: [
      {
        slug: 'software-development',
        translations: {
          en: 'Software Development',
          hr: 'Razvoj softvera',
          sl: 'Razvoj programske opreme',
        },
      },
      {
        slug: 'data-science',
        translations: { en: 'Data Science', hr: 'Znanost o podacima', sl: 'Podatkovna znanost' },
      },
      // ... more subcategories
    ],
  },
  // Core categories: Technology, Finance, Healthcare, Sales, Marketing,
  // HR, Legal, Engineering, Design, Operations, Customer Service, Education
];
```

#### `locations.data.ts`
Seed geographic hierarchy per tenant:
```typescript
export const locationsData = {
  HR: [
    {
      type: 'COUNTRY',
      slug: 'croatia',
      name: 'Croatia',
      children: [
        {
          type: 'REGION',
          slug: 'grad-zagreb',
          name: 'Grad Zagreb',
          children: [
            { type: 'CITY', slug: 'zagreb', name: 'Zagreb' },
          ],
        },
        {
          type: 'REGION',
          slug: 'splitsko-dalmatinska',
          name: 'Splitsko-dalmatinska županija',
          children: [
            { type: 'CITY', slug: 'split', name: 'Split' },
            { type: 'CITY', slug: 'makarska', name: 'Makarska' },
          ],
        },
        // ... more regions/cities
      ],
    },
  ],
  SI: [
    // Slovenia locations...
  ],
};
```

### 3. **CLI Script** (`apps/api/src/cli.ts`)

Create a standalone CLI entry point using NestJS application context:

```typescript
// apps/api/src/cli.ts
import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli/cli.module';

async function bootstrap() {
  await CommandFactory.run(CliModule, ['warn', 'error']);
}
bootstrap();
```

**CLI Commands**:
- `pnpm cli db:purge` - Purge all data (with confirmation prompt)
- `pnpm cli db:seed` - Seed all reference data
- `pnpm cli db:seed --only=tenants` - Seed only tenants
- `pnpm cli db:seed --only=categories` - Seed only categories
- `pnpm cli db:seed --only=locations` - Seed only locations
- `pnpm cli db:reset` - Purge then seed (with confirmation)
- `pnpm cli db:status` - Show current seed status

### 4. **CLI Module Structure**

```
apps/api/src/cli/
├── cli.module.ts
├── commands/
│   ├── db-purge.command.ts
│   ├── db-seed.command.ts
│   ├── db-reset.command.ts
│   └── db-status.command.ts
└── index.ts
```

### 5. **Package.json Scripts**

Add to `apps/api/package.json`:
```json
{
  "scripts": {
    "cli": "ts-node -r tsconfig-paths/register src/cli.ts"
  }
}
```

Add to root `package.json`:
```json
{
  "scripts": {
    "cli": "pnpm --filter=@job-board/api cli"
  }
}
```

## Constraints

- **DO NOT** seed user-generated data (users, organizations, jobs, applications, etc.)
- **DO NOT** modify existing entity definitions
- **MUST** respect foreign key constraints during purge (correct truncation order)
- **MUST** use existing `DatabaseService` pattern for repository access
- **MUST** handle idempotent seeding (check existing data before inserting)
- **MUST** require confirmation for destructive operations (purge/reset)
- **FOLLOW** existing NestJS patterns and coding conventions in the project

## Expected Output

- [ ] `apps/api/src/seeder/seeder.module.ts` - Seeder module
- [ ] `apps/api/src/seeder/seeder.service.ts` - Seeder service with all methods
- [ ] `apps/api/src/seeder/data/tenants.data.ts` - Tenant seed data
- [ ] `apps/api/src/seeder/data/categories.data.ts` - Category seed data (10-15 categories with subcategories)
- [ ] `apps/api/src/seeder/data/locations.data.ts` - Location seed data (HR, SI regions/cities)
- [ ] `apps/api/src/seeder/data/index.ts` - Barrel export
- [ ] `apps/api/src/seeder/index.ts` - Barrel export
- [ ] `apps/api/src/cli/cli.module.ts` - CLI module
- [ ] `apps/api/src/cli/commands/db-purge.command.ts` - Purge command
- [ ] `apps/api/src/cli/commands/db-seed.command.ts` - Seed command
- [ ] `apps/api/src/cli/commands/db-reset.command.ts` - Reset command
- [ ] `apps/api/src/cli/commands/db-status.command.ts` - Status command
- [ ] `apps/api/src/cli/index.ts` - Barrel export
- [ ] `apps/api/src/cli.ts` - CLI entry point
- [ ] Updated `apps/api/package.json` with cli script
- [ ] Updated root `package.json` with cli script

## Acceptance Criteria

- [ ] `pnpm cli db:status` shows counts for tenants, categories, locations
- [ ] `pnpm cli db:seed` successfully seeds all reference data
- [ ] `pnpm cli db:seed --only=tenants` seeds only tenants
- [ ] `pnpm cli db:purge` prompts for confirmation, then truncates all tables
- [ ] `pnpm cli db:reset` purges and re-seeds in one command
- [ ] Seeding is idempotent (running twice doesn't create duplicates)
- [ ] Categories have proper translations for all tenant languages
- [ ] Locations are properly linked to their tenants
- [ ] All TypeScript compiles without errors (`pnpm type-check`)
- [ ] CLI commands provide helpful output and error messages

## Technical Notes

### Dependencies to Install

```bash
pnpm --filter=@job-board/api add nest-commander
```

### Purge Order (FK constraints)

Tables must be truncated in this order to respect foreign keys:
1. `refresh_tokens` (depends on sessions)
2. `sessions` (depends on users)
3. `job_views`, `saved_jobs` (depend on users, jobs)
4. `applications` (depends on jobs)
5. `cv_credits`, `payments` (depend on jobs, organizations)
6. `jobs` (depends on organizations, categories, locations)
7. `user_profiles` (depends on users)
8. `users` (depends on tenants, organizations)
9. `organizations` (depends on tenants)
10. `category_translations` (depends on categories)
11. `categories` (depends on tenants)
12. `locations` (depends on tenants)
13. `files` (no dependencies)
14. `tenants` (root)

### Seed Order

Seed in this order to satisfy dependencies:
1. Tenants (required by all other entities)
2. Categories + CategoryTranslations (global first, then tenant-specific)
3. Locations (linked to tenants)

### Idempotent Seeding Pattern

```typescript
async seedTenants(): Promise<Tenant[]> {
  const existing = await this.db.tenants.find();
  if (existing.length > 0) {
    console.log('Tenants already seeded, skipping...');
    return existing;
  }
  // ... seed logic
}
```

## Files to Modify

```
apps/api/
├── src/
│   ├── seeder/
│   │   ├── seeder.module.ts      - CREATE
│   │   ├── seeder.service.ts     - CREATE
│   │   ├── data/
│   │   │   ├── tenants.data.ts   - CREATE
│   │   │   ├── categories.data.ts - CREATE
│   │   │   ├── locations.data.ts - CREATE
│   │   │   └── index.ts          - CREATE
│   │   └── index.ts              - CREATE
│   ├── cli/
│   │   ├── cli.module.ts         - CREATE
│   │   ├── commands/
│   │   │   ├── db-purge.command.ts  - CREATE
│   │   │   ├── db-seed.command.ts   - CREATE
│   │   │   ├── db-reset.command.ts  - CREATE
│   │   │   └── db-status.command.ts - CREATE
│   │   └── index.ts              - CREATE
│   └── cli.ts                    - CREATE
└── package.json                  - MODIFY (add cli script)

package.json                      - MODIFY (add root cli script)
```

## Example/Reference

### nest-commander Usage

```typescript
import { Command, CommandRunner, Option } from 'nest-commander';

@Command({ name: 'db:seed', description: 'Seed reference data' })
export class DbSeedCommand extends CommandRunner {
  constructor(private readonly seeder: SeederService) {
    super();
  }

  async run(passedParams: string[], options: { only?: string }): Promise<void> {
    if (options.only) {
      await this.seeder[`seed${capitalize(options.only)}`]();
    } else {
      await this.seeder.seedAll();
    }
  }

  @Option({ flags: '--only <type>', description: 'Seed only specific data' })
  parseOnly(val: string): string {
    return val;
  }
}
```

---

## Related

- Depends on: None (foundational task)
- Blocks: Any future prompts requiring test data
- References: [[initial/er-diagram]], [[initial/business-plan]]
