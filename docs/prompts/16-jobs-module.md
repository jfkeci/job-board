---
title: Jobs Module - CRUD API Endpoints for B2B Employers
id: 16-jobs-module
created: 2026-01-15
updated: 2026-01-15
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: backend
complexity: high
tags:
  - jobs
  - crud
  - api
  - b2b
  - employer
dependencies:
  - 11-auth-module
  - 14-organizations-module
blocks: []
related_specs:
  - "[[initial/er-diagram]]"
  - "[[initial/business-plan]]"
related_planning:
  - "[[feature-development-roadmap]]"
notes: B2B clients manage job listings for their organization. Jobs have a lifecycle from DRAFT to ACTIVE to EXPIRED/CLOSED.
---

# 16 - Jobs Module - CRUD API Endpoints for B2B Employers

**Date**: 2026-01-15
**Target**: Backend (API)
**Related Spec**: [[initial/er-diagram]], [[initial/business-plan]]

---

## Context

B2B clients (employers) need to create and manage job listings for their organization. Jobs have a lifecycle that goes from draft creation through publication to expiration or manual closure. The `Job` entity already exists in `@borg/db` with all necessary fields including tier-based pricing, salary information, and status tracking.

This is a core revenue-generating feature - employers pay to publish job listings based on tier selection.

## Goal

Create a complete Jobs module in `apps/api` that provides:
- Full CRUD operations for job listings
- Job lifecycle management (draft → publish → close/expire)
- Organization-scoped job access (users can only manage their org's jobs)
- Swagger documentation following established patterns
- Exception handling using `@borg/backend-lib`

## Current State

### Job Entity (exists in @borg/db)

```typescript
@Entity('jobs')
export class Job {
  id: string;                          // UUID
  tenantId: string;                    // FK to Tenant
  organizationId: string;              // FK to Organization
  title: string;
  slug: string;                        // Unique, URL-friendly
  description: string;                 // Main job description (Markdown)
  requirements: string | null;         // Job requirements
  benefits: string | null;             // Benefits offered
  categoryId: string;                  // FK to Category
  locationId: string | null;           // FK to Location (optional for remote)
  employmentType: EmploymentType;      // FULL_TIME, PART_TIME, CONTRACT, etc.
  remoteOption: RemoteOption;          // ON_SITE, REMOTE, HYBRID
  experienceLevel: ExperienceLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;              // Default: 'EUR'
  salaryPeriod: SalaryPeriod;          // HOURLY, MONTHLY, YEARLY
  tier: JobTier;                       // BASIC, STANDARD, PREMIUM, EXCLUSIVE
  promotions: PromotionType[];         // LINKEDIN, INSTAGRAM, FACEBOOK
  status: JobStatus;                   // DRAFT, PENDING_PAYMENT, ACTIVE, EXPIRED, CLOSED
  publishedAt: Date | null;
  expiresAt: Date | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Related Enums

```typescript
enum JobStatus {
  DRAFT = 'DRAFT',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
}

enum JobTier {
  BASIC = 'BASIC',         // €68
  STANDARD = 'STANDARD',   // €387
  PREMIUM = 'PREMIUM',     // €570
  EXCLUSIVE = 'EXCLUSIVE', // €1,022
}

enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

enum RemoteOption {
  ON_SITE = 'ON_SITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

enum ExperienceLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

enum SalaryPeriod {
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

enum PromotionType {
  LINKEDIN = 'LINKEDIN',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
}
```

### DatabaseService

The `DatabaseService` in `@borg/db` provides `db.jobs` repository.

## Requirements

### 1. Create Jobs Module Structure

```
apps/api/src/jobs/
├── dto/
│   ├── create-job.dto.ts
│   ├── update-job.dto.ts
│   ├── publish-job.dto.ts
│   ├── job-response.dto.ts
│   ├── job-list-response.dto.ts
│   └── index.ts
├── jobs.controller.ts
├── jobs.service.ts
├── jobs.module.ts
└── index.ts
```

### 2. Create DTOs

#### CreateJobDto

```typescript
export class CreateJobDto {
  @ApiProperty({ description: 'Job title', example: 'Senior Software Engineer' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Job description (Markdown supported)', example: '## About the Role\n\nWe are looking for...' })
  @IsString()
  @MinLength(100)
  @MaxLength(50000)
  description: string;

  @ApiPropertyOptional({ description: 'Job requirements', example: '- 5+ years experience\n- TypeScript expertise' })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  requirements?: string;

  @ApiPropertyOptional({ description: 'Benefits offered', example: '- Competitive salary\n- Remote work' })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  benefits?: string;

  @ApiProperty({ description: 'Category ID', format: 'uuid' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ description: 'Location ID (optional for remote jobs)', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiProperty({ description: 'Employment type', enum: EmploymentType, example: EmploymentType.FULL_TIME })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty({ description: 'Remote work option', enum: RemoteOption, example: RemoteOption.HYBRID })
  @IsEnum(RemoteOption)
  remoteOption: RemoteOption;

  @ApiPropertyOptional({ description: 'Experience level', enum: ExperienceLevel })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({ description: 'Minimum salary', example: 60000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({ description: 'Maximum salary', example: 90000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({ description: 'Salary currency (ISO 4217)', example: 'EUR', default: 'EUR' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  salaryCurrency?: string;

  @ApiPropertyOptional({ description: 'Salary period', enum: SalaryPeriod, default: SalaryPeriod.MONTHLY })
  @IsOptional()
  @IsEnum(SalaryPeriod)
  salaryPeriod?: SalaryPeriod;
}
```

Note: `slug`, `tenantId`, `organizationId` are auto-generated. `tier`, `promotions`, `status` are set during publish.

#### UpdateJobDto

Same fields as CreateJobDto but all optional. Use `PartialType(CreateJobDto)` from `@nestjs/swagger`.

#### PublishJobDto

```typescript
export class PublishJobDto {
  @ApiProperty({ description: 'Job tier for pricing', enum: JobTier, example: JobTier.STANDARD })
  @IsEnum(JobTier)
  tier: JobTier;

  @ApiPropertyOptional({
    description: 'Social media promotions',
    enum: PromotionType,
    isArray: true,
    example: [PromotionType.LINKEDIN],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PromotionType, { each: true })
  promotions?: PromotionType[];
}
```

#### JobResponseDto

```typescript
export class JobResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional({ nullable: true })
  requirements: string | null;

  @ApiPropertyOptional({ nullable: true })
  benefits: string | null;

  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  locationId: string | null;

  @ApiProperty({ enum: EmploymentType })
  employmentType: EmploymentType;

  @ApiProperty({ enum: RemoteOption })
  remoteOption: RemoteOption;

  @ApiPropertyOptional({ enum: ExperienceLevel, nullable: true })
  experienceLevel: ExperienceLevel | null;

  @ApiPropertyOptional({ nullable: true })
  salaryMin: number | null;

  @ApiPropertyOptional({ nullable: true })
  salaryMax: number | null;

  @ApiProperty()
  salaryCurrency: string;

  @ApiProperty({ enum: SalaryPeriod })
  salaryPeriod: SalaryPeriod;

  @ApiProperty({ enum: JobTier })
  tier: JobTier;

  @ApiProperty({ enum: PromotionType, isArray: true })
  promotions: PromotionType[];

  @ApiProperty({ enum: JobStatus })
  status: JobStatus;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  publishedAt: Date | null;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  expiresAt: Date | null;

  @ApiProperty()
  viewCount: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;
}
```

#### JobListResponseDto

```typescript
export class JobListItemDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: JobStatus })
  status: JobStatus;

  @ApiProperty({ enum: JobTier })
  tier: JobTier;

  @ApiProperty({ enum: EmploymentType })
  employmentType: EmploymentType;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  publishedAt: Date | null;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  expiresAt: Date | null;

  @ApiProperty()
  viewCount: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;
}

export class JobListResponseDto {
  @ApiProperty({ type: [JobListItemDto] })
  data: JobListItemDto[];

  @ApiProperty({ example: 15 })
  total: number;
}
```

### 3. Create Jobs Service

```typescript
@Injectable()
export class JobsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new job draft
   */
  async create(dto: CreateJobDto, user: RequestUser): Promise<Job> {
    // 1. Verify user belongs to an organization
    // 2. Generate unique slug from title
    // 3. Create job with status DRAFT
    // 4. Set tenantId from user, organizationId from user's org
    // Return created job
  }

  /**
   * List all jobs for user's organization
   */
  async findAll(user: RequestUser): Promise<{ data: Job[]; total: number }> {
    // 1. Get user's organizationId
    // 2. Find all jobs for that organization
    // 3. Order by createdAt DESC
    // Return jobs with count
  }

  /**
   * Get single job by ID
   */
  async findOne(id: string, user: RequestUser): Promise<Job> {
    // 1. Find job by ID
    // 2. Verify job belongs to user's organization (or user is ADMIN)
    // 3. Throw JOB_NOT_FOUND if not found
    // 4. Throw AUTHZ_ORGANIZATION_ACCESS_DENIED if not authorized
    // Return job
  }

  /**
   * Update job (only DRAFT or ACTIVE status)
   */
  async update(id: string, dto: UpdateJobDto, user: RequestUser): Promise<Job> {
    // 1. Find job and verify access
    // 2. Verify job status allows editing (DRAFT or ACTIVE)
    // 3. If title changed, regenerate slug
    // 4. Update job fields
    // Return updated job
  }

  /**
   * Delete job (only DRAFT status)
   */
  async remove(id: string, user: RequestUser): Promise<void> {
    // 1. Find job and verify access
    // 2. Verify job status is DRAFT (can't delete published jobs)
    // 3. Delete job
  }

  /**
   * Publish job (DRAFT → PENDING_PAYMENT or ACTIVE)
   * For MVP: Skip payment and go directly to ACTIVE
   */
  async publish(id: string, dto: PublishJobDto, user: RequestUser): Promise<Job> {
    // 1. Find job and verify access
    // 2. Verify job status is DRAFT
    // 3. Validate required fields are filled (title, description, category, employmentType, remoteOption)
    // 4. Set tier and promotions from dto
    // 5. Set status to ACTIVE (MVP: skip payment)
    // 6. Set publishedAt to now
    // 7. Set expiresAt to 30 days from now
    // Return updated job
  }

  /**
   * Close job listing (ACTIVE → CLOSED)
   */
  async close(id: string, user: RequestUser): Promise<Job> {
    // 1. Find job and verify access
    // 2. Verify job status is ACTIVE
    // 3. Set status to CLOSED
    // Return updated job
  }

  /**
   * Extend job expiration (adds 30 days)
   * For MVP: Free extension, future: may require payment
   */
  async extend(id: string, user: RequestUser): Promise<Job> {
    // 1. Find job and verify access
    // 2. Verify job status is ACTIVE or EXPIRED
    // 3. If EXPIRED, set status back to ACTIVE
    // 4. Add 30 days to expiresAt (from now if expired, from current if active)
    // Return updated job
  }

  // Private helpers
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  }

  private async ensureUniqueSlug(baseSlug: string, tenantId: string, excludeId?: string): Promise<string> {
    // Check if slug exists, if so append -1, -2, etc.
  }

  private async verifyJobAccess(job: Job, user: RequestUser): Promise<void> {
    // Verify user has access to this job (belongs to org or is ADMIN)
  }
}
```

### 4. Create Jobs Controller

```typescript
@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create job draft',
    description: 'Creates a new job listing in DRAFT status for the user\'s organization.',
  })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, description: 'Job created', type: JobResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'User has no organization', type: ApiErrorResponseDto })
  async create(
    @Body() dto: CreateJobDto,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {}

  @Get()
  @ApiOperation({
    summary: 'List organization jobs',
    description: 'Returns all jobs for the authenticated user\'s organization.',
  })
  @ApiResponse({ status: 200, description: 'Jobs list', type: JobListResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  async findAll(@CurrentUser() user: RequestUser): Promise<JobListResponseDto> {}

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job found', type: JobResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found', type: ApiErrorResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {}

  @Patch(':id')
  @ApiOperation({
    summary: 'Update job',
    description: 'Updates a job listing. Only DRAFT and ACTIVE jobs can be edited.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Job ID' })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({ status: 200, description: 'Job updated', type: JobResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found', type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, description: 'Job cannot be edited in current status', type: ApiErrorResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobDto,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete job',
    description: 'Deletes a job listing. Only DRAFT jobs can be deleted.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Job ID' })
  @ApiResponse({ status: 204, description: 'Job deleted' })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found', type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, description: 'Only draft jobs can be deleted', type: ApiErrorResponseDto })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {}

  @Post(':id/publish')
  @ApiOperation({
    summary: 'Publish job',
    description: 'Publishes a draft job. Sets tier and optional promotions. Job becomes ACTIVE with 30-day expiry.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Job ID' })
  @ApiBody({ type: PublishJobDto })
  @ApiResponse({ status: 200, description: 'Job published', type: JobResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or missing required fields', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found', type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, description: 'Job is not in draft status', type: ApiErrorResponseDto })
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PublishJobDto,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {}

  @Post(':id/close')
  @ApiOperation({
    summary: 'Close job listing',
    description: 'Closes an active job listing. Use when position is filled.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job closed', type: JobResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found', type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, description: 'Job is not active', type: ApiErrorResponseDto })
  async close(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {}

  @Post(':id/extend')
  @ApiOperation({
    summary: 'Extend job expiration',
    description: 'Extends job listing by 30 days. Can be used on ACTIVE or EXPIRED jobs.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job extended', type: JobResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found', type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, description: 'Job cannot be extended in current status', type: ApiErrorResponseDto })
  async extend(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<JobResponseDto> {}
}
```

### 5. Create Jobs Module

```typescript
@Module({
  imports: [],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
```

### 6. Register Module in AppModule

Add `JobsModule` to the imports array in `app.module.ts`.

### 7. Job Status Lifecycle

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
┌─────────┐     ┌───────────────┐     ┌─────────┐     ┌───────┐
│  DRAFT  │────▶│PENDING_PAYMENT│────▶│ ACTIVE  │────▶│EXPIRED│
└─────────┘     └───────────────┘     └─────────┘     └───────┘
     │               (future)              │              │
     │                                     │              │
     │                                     ▼              │
     │                                ┌─────────┐         │
     │                                │ CLOSED  │         │
     │                                └─────────┘         │
     │                                                    │
     └────────────────────────────────────────────────────┘
                        (extend reactivates)

MVP: DRAFT → ACTIVE (skip PENDING_PAYMENT)
```

### 8. Authorization Logic

```typescript
// User can manage jobs if:
// - User belongs to an organization (user.organizationId is set)
// - Job belongs to user's organization (job.organizationId === user.organizationId)
// - OR user is platform admin (user.role === UserRole.ADMIN)

// User must have organization to create jobs
if (!user.organizationId) {
  throw ApiExceptions.organizationAccessDenied(); // or custom exception
}
```

### 9. Exception Handling

Use existing `ApiExceptions` factory methods:

```typescript
import { ApiExceptions } from '@borg/backend-lib';

// Available exceptions:
ApiExceptions.jobNotFound()              // 404 - Job not found
ApiExceptions.jobExpired()               // 409 - Job has expired
ApiExceptions.jobClosed()                // 409 - Job is closed
ApiExceptions.organizationAccessDenied() // 403 - No access to organization
ApiExceptions.permissionDenied()         // 403 - General permission denied
ApiExceptions.conflict('Job')            // 409 - General conflict
ApiExceptions.validationFailed(details)  // 400 - Validation errors
```

For status-related conflicts, use `ApiExceptions.conflict()` with descriptive message.

## Constraints

- Do NOT implement payment integration (MVP: publish is free)
- Do NOT implement job search/filtering (public API, separate prompt)
- Do NOT implement pagination (keep simple for MVP)
- Do NOT implement category/location validation (assume valid UUIDs)
- Do NOT implement job expiration cron job (separate prompt)
- Users must belong to an organization to manage jobs
- Only organization members can access their org's jobs
- Use existing `DatabaseService` facade
- Follow Swagger documentation patterns from reference docs

## Expected Output

### New Files

- [ ] `apps/api/src/jobs/dto/create-job.dto.ts`
- [ ] `apps/api/src/jobs/dto/update-job.dto.ts`
- [ ] `apps/api/src/jobs/dto/publish-job.dto.ts`
- [ ] `apps/api/src/jobs/dto/job-response.dto.ts`
- [ ] `apps/api/src/jobs/dto/job-list-response.dto.ts`
- [ ] `apps/api/src/jobs/dto/index.ts`
- [ ] `apps/api/src/jobs/jobs.service.ts`
- [ ] `apps/api/src/jobs/jobs.controller.ts`
- [ ] `apps/api/src/jobs/jobs.module.ts`
- [ ] `apps/api/src/jobs/index.ts`

### Modified Files

- [ ] `apps/api/src/app.module.ts` - Register JobsModule

## Acceptance Criteria

- [ ] POST /jobs - Creates job draft for user's organization
- [ ] GET /jobs - Lists all jobs for user's organization
- [ ] GET /jobs/:id - Returns job if user has access
- [ ] PATCH /jobs/:id - Updates job (DRAFT/ACTIVE only)
- [ ] DELETE /jobs/:id - Deletes job (DRAFT only)
- [ ] POST /jobs/:id/publish - Publishes draft job with tier selection
- [ ] POST /jobs/:id/close - Closes active job
- [ ] POST /jobs/:id/extend - Extends job by 30 days
- [ ] Slug is auto-generated and unique within tenant
- [ ] Jobs scoped to organization (users only see their org's jobs)
- [ ] Proper status transitions enforced
- [ ] Swagger documentation complete with examples
- [ ] All exceptions use ApiExceptions factory
- [ ] Type-check passes: `pnpm type-check --filter=@borg/api`
- [ ] API starts without errors

## Technical Notes

### Job Expiration

- Default expiration: 30 days from publish
- Extension adds 30 days from current date (if expired) or from current expiresAt (if active)

### Slug Generation

Reuse pattern from OrganizationsService:

```typescript
private generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}
```

### Status Validation Helper

```typescript
private assertStatus(job: Job, allowedStatuses: JobStatus[], message: string): void {
  if (!allowedStatuses.includes(job.status)) {
    throw ApiExceptions.conflict(message);
  }
}
```

## Files to Modify

```
apps/api/src/
├── jobs/                              # NEW directory
│   ├── dto/
│   │   ├── create-job.dto.ts
│   │   ├── update-job.dto.ts
│   │   ├── publish-job.dto.ts
│   │   ├── job-response.dto.ts
│   │   ├── job-list-response.dto.ts
│   │   └── index.ts
│   ├── jobs.controller.ts
│   ├── jobs.service.ts
│   ├── jobs.module.ts
│   └── index.ts
└── app.module.ts                      # UPDATE: Import JobsModule
```

## Example/Reference

### Create Job Request

```json
POST /jobs
{
  "title": "Senior Software Engineer",
  "description": "## About the Role\n\nWe're looking for an experienced...",
  "requirements": "- 5+ years of experience\n- TypeScript/Node.js",
  "benefits": "- Competitive salary\n- Remote-first",
  "categoryId": "550e8400-e29b-41d4-a716-446655440000",
  "employmentType": "FULL_TIME",
  "remoteOption": "HYBRID",
  "experienceLevel": "SENIOR",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "salaryCurrency": "EUR",
  "salaryPeriod": "YEARLY"
}
```

### Create Job Response (201)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Senior Software Engineer",
  "slug": "senior-software-engineer",
  "description": "## About the Role\n\nWe're looking for an experienced...",
  "requirements": "- 5+ years of experience\n- TypeScript/Node.js",
  "benefits": "- Competitive salary\n- Remote-first",
  "categoryId": "550e8400-e29b-41d4-a716-446655440000",
  "locationId": null,
  "employmentType": "FULL_TIME",
  "remoteOption": "HYBRID",
  "experienceLevel": "SENIOR",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "salaryCurrency": "EUR",
  "salaryPeriod": "YEARLY",
  "tier": "BASIC",
  "promotions": [],
  "status": "DRAFT",
  "publishedAt": null,
  "expiresAt": null,
  "viewCount": 0,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T10:00:00.000Z"
}
```

### Publish Job Request

```json
POST /jobs/660e8400-e29b-41d4-a716-446655440001/publish
{
  "tier": "STANDARD",
  "promotions": ["LINKEDIN"]
}
```

### Publish Job Response (200)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "ACTIVE",
  "tier": "STANDARD",
  "promotions": ["LINKEDIN"],
  "publishedAt": "2026-01-15T10:05:00.000Z",
  "expiresAt": "2026-02-14T10:05:00.000Z",
  ...
}
```

---

## Related

- Depends on: [[prompts/11-auth-module]], [[prompts/14-organizations-module]]
- Blocks: Public job search API, Applications module
- References: [[initial/er-diagram]], [[initial/business-plan]], [[references/http-exceptions-usage]], [[references/swagger-documentation-usage]]
