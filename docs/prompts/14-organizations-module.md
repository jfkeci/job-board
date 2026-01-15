---
title: Organizations Module - CRUD for B2B Clients
id: 14-organizations-module
created: 2026-01-15
updated: 2026-01-15
status: ready
executed_date:
execution_result: pending
deprecated: false
deprecated_reason:
target: backend
complexity: moderate
tags:
  - organizations
  - b2b
  - crud
  - multi-tenant
dependencies:
  - 05-database-package
  - 10-api-exception-filter-integration
  - 11-auth-module
blocks:
  - 15-jobs-module
related_specs:
  - "[[initial/er-diagram]]"
  - "[[initial/business-plan]]"
related_planning:
  - "[[feature-development-roadmap]]"
notes:
---

# 14 - Organizations Module - CRUD for B2B Clients

**Date**: 2026-01-15
**Target**: Backend
**Related Spec**: [[initial/er-diagram]], [[initial/business-plan]]

---

## Context

B2B clients (employers) need the ability to create and manage their organization profile after registering/logging in. The organization is the central entity for job postings, payments, and team management. The `Organization` entity already exists in `@borg/db` with all necessary fields. This prompt implements the CRUD API endpoints for organization management.

## Goal

Implement a complete Organizations module in `apps/api` that provides:
- CRUD operations for organizations (create, read, update, delete)
- Automatic slug generation from organization name
- Multi-tenant isolation (organizations scoped to tenant)
- Role-based access control (CLIENT, CLIENT_ADMIN can manage their org)
- User-organization association on creation
- Swagger documentation following project conventions

## Current State

### Existing Infrastructure

- **Database Entity** (`packages/db/src/entities/organization.entity.ts`):
  ```typescript
  Organization {
    id: string (uuid)
    tenantId: string (uuid)
    name: string
    slug: string (unique)
    description: string | null
    website: string | null
    logoFileId: string | null
    industry: string | null
    size: OrganizationSize | null  // STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
    isVerified: boolean (default: false)
    createdAt: Date
    updatedAt: Date
    // Relations: tenant, logoFile, users, jobs, payments, cvCredits
  }
  ```

- **OrganizationSize Enum** (`packages/db/src/enums/organization-size.enum.ts`):
  ```typescript
  enum OrganizationSize {
    STARTUP = 'STARTUP',
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
    ENTERPRISE = 'ENTERPRISE',
  }
  ```

- **Auth Module** (`apps/api/src/auth/`):
  - `JwtAuthGuard` - Validates JWT tokens
  - `RolesGuard` - Role-based access control
  - `@CurrentUser()` - Extracts authenticated user from request
  - `@Roles()` - Restricts access by role
  - `@Public()` - Marks endpoint as public
  - `RequestUser` interface with `id`, `email`, `role`, `tenantId`, `sessionId`

- **User Entity** has `organizationId` field for linking users to organizations

- **DatabaseService** (`packages/db/src/database.service.ts`) - provides `db.organizations`, `db.users` repositories

- **ApiExceptions** (`@borg/backend-lib`) - Factory methods for throwing exceptions

- **ApiErrorResponseDto** (`apps/api/src/common/dto/api-error-response.dto.ts`) - Standard error response

### Files to Reference

```
packages/db/src/entities/organization.entity.ts
packages/db/src/entities/user.entity.ts
packages/db/src/enums/organization-size.enum.ts
packages/db/src/database.service.ts
apps/api/src/auth/auth.controller.ts
apps/api/src/auth/decorators/
apps/api/src/auth/guards/
apps/api/src/common/dto/api-error-response.dto.ts
docs/references/http-exceptions-usage.md
docs/references/swagger-documentation-usage.md
```

## Requirements

### 1. **Module Structure**

Create the organizations module at `apps/api/src/organizations/` with the following structure:

```
apps/api/src/organizations/
├── organizations.module.ts       # Module definition
├── organizations.controller.ts   # REST endpoints
├── organizations.service.ts      # Business logic
├── dto/
│   ├── create-organization.dto.ts    # Create input
│   ├── update-organization.dto.ts    # Update input (partial)
│   └── organization-response.dto.ts  # Response structure
└── index.ts                      # Barrel export
```

### 2. **API Endpoints**

All endpoints require authentication. Use tenant from authenticated user's `tenantId`.

#### `POST /organizations` - Create Organization

- **Auth**: JWT required, any authenticated user
- **Input**: `CreateOrganizationDto`
  ```typescript
  {
    name: string;           // Required, 2-200 chars
    description?: string;   // Optional, max 5000 chars
    website?: string;       // Optional, valid URL
    industry?: string;      // Optional, max 100 chars
    size?: OrganizationSize; // Optional enum
  }
  ```
- **Process**:
  1. Check user doesn't already belong to an organization
  2. Generate unique slug from name (slugify + handle collisions)
  3. Create Organization with `tenantId` from authenticated user
  4. Update User record to set `organizationId`
  5. Update User role to `CLIENT` if currently `USER`
  6. Return created organization
- **Response**: `201 Created` with `OrganizationResponseDto`
- **Errors**:
  - `409 Conflict` - User already belongs to an organization (`RESOURCE_ALREADY_EXISTS`)
  - `409 Conflict` - Organization slug already exists (handle gracefully with suffix)

#### `GET /organizations/:id` - Get Organization by ID

- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Authorization**:
  - User must belong to this organization, OR
  - User must be ADMIN role
- **Response**: `200 OK` with `OrganizationResponseDto`
- **Errors**:
  - `404 Not Found` - Organization not found (`ORGANIZATION_NOT_FOUND`)
  - `403 Forbidden` - User doesn't have access (`AUTHZ_ORGANIZATION_ACCESS_DENIED`)

#### `PATCH /organizations/:id` - Update Organization

- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Authorization**:
  - User must belong to this organization with role `CLIENT_ADMIN`, OR
  - User must be ADMIN role
- **Input**: `UpdateOrganizationDto` (all fields optional)
  ```typescript
  {
    name?: string;
    description?: string;
    website?: string;
    industry?: string;
    size?: OrganizationSize;
  }
  ```
- **Process**:
  1. Verify authorization
  2. If name changes, regenerate slug
  3. Update organization fields
  4. Return updated organization
- **Response**: `200 OK` with `OrganizationResponseDto`
- **Errors**:
  - `404 Not Found` - Organization not found
  - `403 Forbidden` - User not authorized to update

#### `DELETE /organizations/:id` - Delete Organization

- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Authorization**:
  - User must be ADMIN role only (organization owners cannot delete)
- **Process**:
  1. Verify user is ADMIN
  2. Check organization has no active jobs (optional: soft delete consideration)
  3. Delete organization (cascade handled by DB)
  4. Unlink all users from organization
- **Response**: `204 No Content`
- **Errors**:
  - `404 Not Found` - Organization not found
  - `403 Forbidden` - Only admins can delete organizations
  - `409 Conflict` - Organization has active jobs (optional)

#### `GET /organizations/me` - Get Current User's Organization

- **Auth**: JWT required
- **Process**: Return organization for current user's `organizationId`
- **Response**: `200 OK` with `OrganizationResponseDto`
- **Errors**:
  - `404 Not Found` - User doesn't belong to any organization

### 3. **DTO Definitions**

#### CreateOrganizationDto

```typescript
export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corporation',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    description: 'Organization description (supports Markdown)',
    example: 'Leading provider of innovative solutions...',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Company website URL',
    example: 'https://acme.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Industry sector',
    example: 'Technology',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({
    description: 'Organization size',
    enum: OrganizationSize,
    enumName: 'OrganizationSize',
    example: OrganizationSize.MEDIUM,
  })
  @IsOptional()
  @IsEnum(OrganizationSize)
  size?: OrganizationSize;
}
```

#### UpdateOrganizationDto

Use `PartialType(CreateOrganizationDto)` from `@nestjs/swagger` to make all fields optional.

#### OrganizationResponseDto

```typescript
export class OrganizationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Acme Corporation' })
  name: string;

  @ApiProperty({ example: 'acme-corporation' })
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true })
  website: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  logoFileId: string | null;

  @ApiPropertyOptional({ nullable: true })
  industry: string | null;

  @ApiPropertyOptional({ enum: OrganizationSize, nullable: true })
  size: OrganizationSize | null;

  @ApiProperty({ example: false })
  isVerified: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}
```

### 4. **Slug Generation**

Implement a utility for generating URL-safe slugs:

```typescript
// utils/slug.util.ts
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/-+/g, '-')           // Replace multiple - with single -
    .substring(0, 100);            // Limit length
}

export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(newSlug)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }
  return newSlug;
}
```

### 5. **Service Implementation**

```typescript
@Injectable()
export class OrganizationsService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateOrganizationDto, user: RequestUser): Promise<Organization> {
    // Check if user already has an organization
    const existingUser = await this.db.users.findOne({
      where: { id: user.id },
    });

    if (existingUser?.organizationId) {
      throw ApiExceptions.alreadyExists('User already belongs to an organization');
    }

    // Generate unique slug
    const baseSlug = generateSlug(dto.name);
    const existingOrgs = await this.db.organizations.find({
      where: { tenantId: user.tenantId },
      select: ['slug'],
    });
    const slug = generateUniqueSlug(baseSlug, existingOrgs.map(o => o.slug));

    // Create organization
    const organization = await this.db.organizations.save({
      ...dto,
      slug,
      tenantId: user.tenantId,
    });

    // Link user to organization and upgrade role
    await this.db.users.update(user.id, {
      organizationId: organization.id,
      role: existingUser.role === UserRole.USER ? UserRole.CLIENT : existingUser.role,
    });

    return organization;
  }

  async findOne(id: string, user: RequestUser): Promise<Organization> {
    const organization = await this.db.organizations.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!organization) {
      throw ApiExceptions.organizationNotFound();
    }

    return organization;
  }

  async findByUser(user: RequestUser): Promise<Organization> {
    const dbUser = await this.db.users.findOne({
      where: { id: user.id },
      relations: ['organization'],
    });

    if (!dbUser?.organization) {
      throw ApiExceptions.organizationNotFound();
    }

    return dbUser.organization;
  }

  async update(id: string, dto: UpdateOrganizationDto, user: RequestUser): Promise<Organization> {
    const organization = await this.findOne(id, user);

    // Authorization check
    await this.verifyWriteAccess(organization, user);

    // Regenerate slug if name changed
    if (dto.name && dto.name !== organization.name) {
      const baseSlug = generateSlug(dto.name);
      const existingOrgs = await this.db.organizations.find({
        where: { tenantId: user.tenantId },
        select: ['slug'],
      });
      dto['slug'] = generateUniqueSlug(
        baseSlug,
        existingOrgs.filter(o => o.id !== id).map(o => o.slug)
      );
    }

    await this.db.organizations.update(id, dto);
    return this.findOne(id, user);
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    // Only ADMIN can delete organizations
    if (user.role !== UserRole.ADMIN) {
      throw ApiExceptions.permissionDenied();
    }

    const organization = await this.findOne(id, user);

    // Unlink all users from organization
    await this.db.users.update(
      { organizationId: id },
      { organizationId: null }
    );

    await this.db.organizations.delete(id);
  }

  private async verifyWriteAccess(organization: Organization, user: RequestUser): Promise<void> {
    // ADMIN can always access
    if (user.role === UserRole.ADMIN) {
      return;
    }

    // User must belong to this organization
    const dbUser = await this.db.users.findOne({ where: { id: user.id } });
    if (dbUser?.organizationId !== organization.id) {
      throw ApiExceptions.organizationAccessDenied();
    }

    // User must be CLIENT_ADMIN to update
    if (user.role !== UserRole.CLIENT_ADMIN) {
      throw ApiExceptions.permissionDenied();
    }
  }
}
```

### 6. **Controller with Swagger Documentation**

Follow the patterns from `docs/references/swagger-documentation-usage.md`:

```typescript
@ApiTags('Organizations')
@ApiBearerAuth('access-token')
@ApiExtraModels(ApiErrorResponseDto)
@UseGuards(JwtAuthGuard)
@Controller('v1/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create organization',
    description: 'Creates a new organization and links the current user to it.',
    operationId: 'createOrganization',
  })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({ status: 201, description: 'Organization created', type: OrganizationResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, description: 'User already has organization', type: ApiErrorResponseDto })
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.create(dto, user);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current user organization',
    description: 'Returns the organization the current user belongs to.',
    operationId: 'getMyOrganization',
  })
  @ApiResponse({ status: 200, description: 'Organization found', type: OrganizationResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'User has no organization', type: ApiErrorResponseDto })
  async findMine(@CurrentUser() user: RequestUser): Promise<OrganizationResponseDto> {
    return this.organizationsService.findByUser(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization by ID',
    operationId: 'getOrganization',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Organization found', type: OrganizationResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found', type: ApiErrorResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update organization',
    description: 'Updates organization details. Only CLIENT_ADMIN or ADMIN can update.',
    operationId: 'updateOrganization',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Organization ID' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({ status: 200, description: 'Organization updated', type: OrganizationResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Permission denied', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found', type: ApiErrorResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {
    return this.organizationsService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Deletes an organization. Only ADMIN users can perform this action.',
    operationId: 'deleteOrganization',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Organization ID' })
  @ApiResponse({ status: 204, description: 'Organization deleted' })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Admin access required', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found', type: ApiErrorResponseDto })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return this.organizationsService.remove(id, user);
  }
}
```

### 7. **Exception Handling**

Use existing `ApiExceptions` factory methods from `@borg/backend-lib`:

```typescript
import { ApiExceptions } from '@borg/backend-lib';

// Already available:
ApiExceptions.organizationNotFound()      // 404
ApiExceptions.organizationAccessDenied()  // 403
ApiExceptions.permissionDenied()          // 403
ApiExceptions.alreadyExists(resource)     // 409
ApiExceptions.validationFailed(details)   // 400
```

## Constraints

- **Do NOT** implement logo file upload (separate Files module needed)
- **Do NOT** implement organization verification (admin feature)
- **Do NOT** implement team member management (separate prompt)
- **Do NOT** implement organization listing/search (admin feature)
- Use existing `DatabaseService` facade - don't inject repositories directly
- Use existing auth guards and decorators from `apps/api/src/auth/`
- Follow Swagger documentation patterns from reference docs
- Ensure multi-tenant isolation (always filter by `tenantId`)

## Expected Output

- [ ] **Organizations Module Files** (all new):
  - [ ] `apps/api/src/organizations/organizations.module.ts`
  - [ ] `apps/api/src/organizations/organizations.controller.ts`
  - [ ] `apps/api/src/organizations/organizations.service.ts`
  - [ ] `apps/api/src/organizations/dto/create-organization.dto.ts`
  - [ ] `apps/api/src/organizations/dto/update-organization.dto.ts`
  - [ ] `apps/api/src/organizations/dto/organization-response.dto.ts`
  - [ ] `apps/api/src/organizations/dto/index.ts`
  - [ ] `apps/api/src/organizations/index.ts`

- [ ] **Utility Files**:
  - [ ] `apps/api/src/common/utils/slug.util.ts`
  - [ ] `apps/api/src/common/utils/index.ts`

- [ ] **App Module Update**:
  - [ ] `apps/api/src/app.module.ts` - Import OrganizationsModule

## Acceptance Criteria

- [ ] `POST /v1/organizations` creates organization and links user
- [ ] `GET /v1/organizations/me` returns current user's organization
- [ ] `GET /v1/organizations/:id` returns organization (with access check)
- [ ] `PATCH /v1/organizations/:id` updates organization (CLIENT_ADMIN or ADMIN only)
- [ ] `DELETE /v1/organizations/:id` deletes organization (ADMIN only)
- [ ] User's role is upgraded to CLIENT when creating organization
- [ ] Slugs are unique within tenant and URL-safe
- [ ] Multi-tenant isolation enforced (users can't access other tenant's orgs)
- [ ] Swagger documentation is complete with examples
- [ ] All endpoints return proper error responses using ApiExceptions
- [ ] TypeScript compiles without errors (`pnpm type-check`)
- [ ] API starts successfully (`pnpm dev:api`)

## Technical Notes

### Slug Handling Edge Cases

- Empty name after sanitization: fallback to `org-{random}`
- Very long names: truncate slug to 100 chars before adding suffix
- Unicode names: transliterate or remove non-ASCII chars

### Role Upgrade Logic

When user creates an organization:
- If role is `USER` → upgrade to `CLIENT`
- If role is `CLIENT` → keep as `CLIENT` (they may have been invited)
- If role is `CLIENT_ADMIN` or `ADMIN` → keep current role

### Authorization Matrix

| Endpoint | USER | CLIENT | CLIENT_ADMIN | ADMIN |
|----------|------|--------|--------------|-------|
| POST /organizations | Yes (creates) | No (has org) | No (has org) | Yes |
| GET /organizations/me | No (no org) | Yes | Yes | Yes |
| GET /organizations/:id | No | Own org | Own org | Any |
| PATCH /organizations/:id | No | No | Own org | Any |
| DELETE /organizations/:id | No | No | No | Yes |

## Files to Modify

```
apps/api/
  src/
    app.module.ts                          - Import OrganizationsModule
    organizations/                         - Create entire module (new directory)
      organizations.module.ts
      organizations.controller.ts
      organizations.service.ts
      dto/
        create-organization.dto.ts
        update-organization.dto.ts
        organization-response.dto.ts
        index.ts
      index.ts
    common/
      utils/
        slug.util.ts                       - Slug generation utility
        index.ts
```

## Example/Reference

Reference the existing auth module pattern:
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/auth.service.ts`

Reference Swagger documentation patterns:
- `docs/references/swagger-documentation-usage.md`

Reference exception handling:
- `docs/references/http-exceptions-usage.md`

---

## Related

- Depends on: [[prompts/05-database-package]], [[prompts/11-auth-module]]
- Blocks: [[prompts/15-jobs-module]] (jobs require organization)
- References: [[initial/er-diagram]], [[initial/business-plan]]
