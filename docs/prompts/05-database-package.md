---
title: Create Database Package with TypeORM Entities
id: 05-database-package
created: 2026-01-13
updated: 2026-01-13
status: executed
executed_date: 2026-01-13
execution_result: success
deprecated: false
deprecated_reason:
target: backend
complexity: high
tags:
  - database
  - typeorm
  - postgresql
  - entities
  - facade-pattern
  - nestjs
dependencies:
  - 03-backend-config-service
blocks: []
related_specs:
  - "[[initial/er-diagram]]"
related_planning: []
notes: Core database package with all entities and facade DatabaseService
---

# 05 - Create Database Package with TypeORM Entities

**Date**: 2026-01-13
**Target**: Backend
**Related Spec**: [[initial/er-diagram]]

---

## Context

The application requires a centralized database package that contains all TypeORM entities based on the ER diagram, a TypeORM configuration service, and a facade DatabaseService that encapsulates all repositories. This allows backend services to access any repository through a single injected service.

## Goal

1. Update `@job-board/config` to support PostgreSQL and add `getTypeOrmConfig()` method
2. Create `@job-board/db` package with all TypeORM entities
3. Implement DatabaseService facade pattern for repository access
4. Setup local development environment variables

## Current State

- `@job-board/config` exists with MySQL configuration
- No database entities exist
- No TypeORM integration
- Local PostgreSQL running with `jobboard_db` database created

## Requirements

### 1. **Update @job-board/config Package**

#### 1.1 Update env.interface.ts
Change database type from MySQL to PostgreSQL:

```typescript
export interface EnvConfig {
  // ... existing app config ...

  // Database Configuration (TypeORM PostgreSQL)
  DB_TYPE: 'postgres';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SYNCHRONIZE: boolean;
  DB_LOGGING: boolean;
}
```

#### 1.2 Update env.schema.ts
Update Zod schema for PostgreSQL:

```typescript
DB_TYPE: z.literal('postgres').default('postgres'),
```

#### 1.3 Add getTypeOrmConfig() to ConfigService
```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

getTypeOrmConfig(entities: Function[]): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: this.config.DB_HOST,
    port: this.config.DB_PORT,
    username: this.config.DB_USERNAME,
    password: this.config.DB_PASSWORD,
    database: this.config.DB_DATABASE,
    synchronize: this.config.DB_SYNCHRONIZE,
    logging: this.config.DB_LOGGING,
    entities,
  };
}
```

#### 1.4 Setup Local Dev Environment
Create `packages/config/src/env/.env` with local PostgreSQL credentials:
```env
NODE_ENV=development
PORT=3001
API_PREFIX=api

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=jobboard_db
DB_SYNCHRONIZE=true
DB_LOGGING=true
```

### 2. **Create @job-board/db Package**

#### 2.1 Package Structure
```
packages/db/
├── src/
│   ├── index.ts
│   ├── entities/
│   │   ├── index.ts
│   │   ├── tenant.entity.ts
│   │   ├── user.entity.ts
│   │   ├── user-profile.entity.ts
│   │   ├── session.entity.ts
│   │   ├── refresh-token.entity.ts
│   │   ├── organization.entity.ts
│   │   ├── job.entity.ts
│   │   ├── application.entity.ts
│   │   ├── saved-job.entity.ts
│   │   ├── job-view.entity.ts
│   │   ├── category.entity.ts
│   │   ├── category-translation.entity.ts
│   │   ├── location.entity.ts
│   │   ├── payment.entity.ts
│   │   ├── cv-credit.entity.ts
│   │   └── file.entity.ts
│   ├── enums/
│   │   ├── index.ts
│   │   ├── user-role.enum.ts
│   │   ├── job-status.enum.ts
│   │   ├── job-tier.enum.ts
│   │   ├── employment-type.enum.ts
│   │   ├── remote-option.enum.ts
│   │   ├── experience-level.enum.ts
│   │   ├── salary-period.enum.ts
│   │   ├── application-status.enum.ts
│   │   ├── payment-status.enum.ts
│   │   ├── organization-size.enum.ts
│   │   ├── location-type.enum.ts
│   │   └── promotion-type.enum.ts
│   ├── database.service.ts
│   └── database.module.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .eslintrc.js
└── prettier.config.js
```

#### 2.2 Entity Requirements

All entities must:
- Use UUID primary keys (`@PrimaryGeneratedColumn('uuid')`)
- Include `createdAt` and `updatedAt` timestamps where specified
- Define proper relations with cascade options
- Use PostgreSQL-compatible column types

#### 2.3 Enums (based on ER diagram)

```typescript
// user-role.enum.ts
export enum UserRole {
  USER = 'USER',
  CLIENT = 'CLIENT',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  ADMIN = 'ADMIN',
}

// job-status.enum.ts
export enum JobStatus {
  DRAFT = 'DRAFT',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
}

// job-tier.enum.ts
export enum JobTier {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  EXCLUSIVE = 'EXCLUSIVE',
}

// employment-type.enum.ts
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

// remote-option.enum.ts
export enum RemoteOption {
  ON_SITE = 'ON_SITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

// experience-level.enum.ts
export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

// salary-period.enum.ts
export enum SalaryPeriod {
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// application-status.enum.ts
export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

// payment-status.enum.ts
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// organization-size.enum.ts
export enum OrganizationSize {
  STARTUP = 'STARTUP',       // 1-10
  SMALL = 'SMALL',           // 11-50
  MEDIUM = 'MEDIUM',         // 51-200
  LARGE = 'LARGE',           // 201-1000
  ENTERPRISE = 'ENTERPRISE', // 1000+
}

// location-type.enum.ts
export enum LocationType {
  COUNTRY = 'COUNTRY',
  REGION = 'REGION',
  CITY = 'CITY',
}

// promotion-type.enum.ts
export enum PromotionType {
  FEATURED = 'FEATURED',
  HIGHLIGHTED = 'HIGHLIGHTED',
  TOP_POSITION = 'TOP_POSITION',
  SOCIAL_SHARE = 'SOCIAL_SHARE',
}
```

### 3. **DatabaseService (Facade Pattern)**

The DatabaseService provides access to all repositories through a single injectable service:

```typescript
@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    // ... all other repositories
  ) {}

  // Getters for each repository
  get tenants(): Repository<Tenant> {
    return this.tenantRepo;
  }

  get users(): Repository<User> {
    return this.userRepo;
  }

  get userProfiles(): Repository<UserProfile> {
    return this.userProfileRepo;
  }

  get sessions(): Repository<Session> {
    return this.sessionRepo;
  }

  get refreshTokens(): Repository<RefreshToken> {
    return this.refreshTokenRepo;
  }

  get organizations(): Repository<Organization> {
    return this.organizationRepo;
  }

  get jobs(): Repository<Job> {
    return this.jobRepo;
  }

  get applications(): Repository<Application> {
    return this.applicationRepo;
  }

  get savedJobs(): Repository<SavedJob> {
    return this.savedJobRepo;
  }

  get jobViews(): Repository<JobView> {
    return this.jobViewRepo;
  }

  get categories(): Repository<Category> {
    return this.categoryRepo;
  }

  get categoryTranslations(): Repository<CategoryTranslation> {
    return this.categoryTranslationRepo;
  }

  get locations(): Repository<Location> {
    return this.locationRepo;
  }

  get payments(): Repository<Payment> {
    return this.paymentRepo;
  }

  get cvCredits(): Repository<CvCredit> {
    return this.cvCreditRepo;
  }

  get files(): Repository<File> {
    return this.fileRepo;
  }
}
```

### 4. **DatabaseModule**

```typescript
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forFeature([
          Tenant,
          User,
          UserProfile,
          Session,
          RefreshToken,
          Organization,
          Job,
          Application,
          SavedJob,
          JobView,
          Category,
          CategoryTranslation,
          Location,
          Payment,
          CvCredit,
          File,
        ]),
      ],
      providers: [DatabaseService],
      exports: [DatabaseService, TypeOrmModule],
    };
  }
}
```

### 5. **Package Exports**

```typescript
// index.ts
// Entities
export * from './entities';

// Enums
export * from './enums';

// Service and Module
export { DatabaseService } from './database.service';
export { DatabaseModule } from './database.module';
```

## Constraints

- Use PostgreSQL-specific features where beneficial (e.g., `uuid` type)
- All entities must match the ER diagram schema exactly
- Use `@job-board/eslint-config-backend` for linting
- DatabaseService must be injectable and provide typed repository access
- Entities should use lazy relations where appropriate to avoid circular imports

## Expected Output

- [ ] `@job-board/config` updated for PostgreSQL with `getTypeOrmConfig()` method
- [ ] Local dev `.env` file created with PostgreSQL credentials
- [ ] `@job-board/db` package created with all entities
- [ ] All enums defined matching ER diagram
- [ ] DatabaseService facade implemented
- [ ] DatabaseModule with forRoot() method
- [ ] All exports properly configured
- [ ] Build passes without errors

## Acceptance Criteria

- [ ] `pnpm build` succeeds for both packages
- [ ] `pnpm type-check` passes
- [ ] All 16 entities created matching ER diagram
- [ ] All 12 enums defined
- [ ] DatabaseService provides typed access to all 16 repositories
- [ ] ConfigService.getTypeOrmConfig() returns valid TypeORM options
- [ ] Can import and use in `@job-board/api` app

## Technical Notes

### Entity Example (Tenant)

```typescript
@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ unique: true })
  domain: string;

  @Column({ name: 'default_language' })
  defaultLanguage: string;

  @Column('simple-array', { name: 'supported_languages' })
  supportedLanguages: string[];

  @Column()
  currency: string;

  @Column()
  timezone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Organization, (org) => org.tenant)
  organizations: Organization[];

  @OneToMany(() => Job, (job) => job.tenant)
  jobs: Job[];

  @OneToMany(() => Location, (loc) => loc.tenant)
  locations: Location[];

  @OneToMany(() => Category, (cat) => cat.tenant)
  categories: Category[];
}
```

### Usage in API App

```typescript
// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@job-board/config';
import { DatabaseModule, entities } from '@job-board/db';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.getTypeOrmConfig(entities),
      inject: [ConfigService],
    }),
    DatabaseModule.forRoot(),
  ],
})
export class AppModule {}

// Using DatabaseService in a service
@Injectable()
export class JobService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(tenantId: string) {
    return this.db.jobs.find({ where: { tenantId } });
  }

  async findByOrg(organizationId: string) {
    return this.db.jobs.find({
      where: { organizationId },
      relations: ['organization', 'category', 'location'],
    });
  }
}
```

### Package Dependencies

```json
{
  "dependencies": {
    "@job-board/config": "workspace:*",
    "typeorm": "^0.3.20"
  },
  "peerDependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0"
  },
  "devDependencies": {
    "@job-board/eslint-config-backend": "workspace:*",
    "@nestjs/common": "^10.4.15",
    "@nestjs/typeorm": "^10.0.2",
    "@types/node": "^22.10.5",
    "pg": "^8.13.0",
    "tsup": "^8.3.5",
    "typescript": "^5.7.2"
  }
}
```

---

## Related

- Depends on: [[prompts/03-backend-config-service]]
- Blocks: Authentication, Job posting features
- References: [[initial/er-diagram]]
