---
title: Organizations Module - CRUD API Endpoints
id: 14-organizations-module
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
  - organizations
  - crud
  - api
  - b2b
dependencies:
  - 11-auth-module
  - 12-auth-swagger-documentation
blocks: []
related_specs:
  - "[[initial/er-diagram]]"
related_planning: []
notes: B2B clients need to create and manage their organization after registration
---

# 14 - Organizations Module - CRUD API Endpoints

**Date**: 2026-01-15
**Target**: Backend (API)
**Related Spec**: [[initial/er-diagram]]

---

## Context

B2B clients (employers/recruiters) need to create and manage their organization profile after registering on the dashboard. The Organization entity already exists in \`@borg/db\`. We need to create the Organizations module with CRUD endpoints.

Organizations are tied to a tenant and can have multiple users (CLIENT, CLIENT_ADMIN roles). After a user registers, they should be able to create an organization and become its admin.

## Goal

Create a fully functional Organizations module with:
- CRUD endpoints for organization management
- Proper authorization (only organization admins can modify)
- Swagger documentation following established patterns
- Exception handling using \`@borg/backend-lib\`

## Current State

### Organization Entity (exists in @borg/db)

\`\`\`typescript
// packages/db/src/entities/organization.entity.ts
@Entity('organizations')
export class Organization {
  id: string;                    // UUID
  tenantId: string;              // FK to Tenant
  name: string;
  slug: string;                  // Unique, URL-friendly
  description: string | null;
  website: string | null;
  logoFileId: string | null;     // FK to File
  industry: string | null;
  size: OrganizationSize | null; // STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
  isVerified: boolean;           // Admin verification
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

### OrganizationSize Enum (exists)

\`\`\`typescript
export enum OrganizationSize {
  STARTUP = 'STARTUP',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE',
}
\`\`\`

### DatabaseService (has organizations repository)

The \`DatabaseService\` in \`@borg/db\` provides access to \`db.organizations\` repository.

## Requirements

### 1. Create Organizations Module Structure

\`\`\`
apps/api/src/organizations/
├── dto/
│   ├── create-organization.dto.ts
│   ├── update-organization.dto.ts
│   ├── organization-response.dto.ts
│   └── index.ts
├── organizations.controller.ts
├── organizations.service.ts
└── organizations.module.ts
\`\`\`

### 2. Create DTOs

#### CreateOrganizationDto

\`\`\`typescript
export class CreateOrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'Acme Corporation' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ description: 'Organization description', example: 'Leading tech company...' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ description: 'Company website URL', example: 'https://acme.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Industry sector', example: 'Technology' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({
    description: 'Company size',
    enum: OrganizationSize,
    enumName: 'OrganizationSize',
    example: OrganizationSize.MEDIUM,
  })
  @IsOptional()
  @IsEnum(OrganizationSize)
  size?: OrganizationSize;
}
\`\`\`

Note: \`slug\` is auto-generated from \`name\`, \`tenantId\` comes from authenticated user.

#### UpdateOrganizationDto

Same fields as CreateOrganizationDto but all optional (use PartialType or manually define).

#### OrganizationResponseDto

\`\`\`typescript
export class OrganizationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  website!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoFileId!: string | null;

  @ApiPropertyOptional({ nullable: true })
  industry!: string | null;

  @ApiPropertyOptional({ enum: OrganizationSize, nullable: true })
  size!: OrganizationSize | null;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: Date;
}
\`\`\`

### 3. Create Organizations Service

\`\`\`typescript
@Injectable()
export class OrganizationsService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateOrganizationDto, user: RequestUser): Promise<Organization> {
    // Check if user already has an organization
    // Generate slug from name
    // Check slug uniqueness within tenant
    // Create organization
    // Update user's organizationId and role to CLIENT_ADMIN
    // Return created organization
  }

  async findOne(id: string, user: RequestUser): Promise<Organization> {
    // Find organization
    // Verify user has access (same tenant, belongs to org or is admin)
    // Throw ApiExceptions.organizationNotFound() if not found
  }

  async update(id: string, dto: UpdateOrganizationDto, user: RequestUser): Promise<Organization> {
    // Find organization
    // Verify user is organization admin
    // Update fields
    // If name changed, regenerate slug (check uniqueness)
    // Return updated organization
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    // Find organization
    // Verify user is organization admin
    // Delete organization
  }

  private generateSlug(name: string): string {
    // Convert to lowercase, replace spaces with hyphens, remove special chars
  }

  private async ensureUniqueSlug(baseSlug: string, tenantId: string, excludeId?: string): Promise<string> {
    // If slug exists, append number (acme-corp, acme-corp-1, acme-corp-2)
  }
}
\`\`\`

### 4. Create Organizations Controller

\`\`\`typescript
@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create organization',
    description: 'Creates a new organization. The authenticated user becomes the organization admin.',
  })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({ status: 201, description: 'Organization created', type: OrganizationResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 409, description: 'User already has organization or slug exists', type: ApiErrorResponseDto })
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {}

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Organization found', type: OrganizationResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found', type: ApiErrorResponseDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Organization ID' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({ status: 200, description: 'Organization updated', type: OrganizationResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Not organization admin', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found', type: ApiErrorResponseDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() user: RequestUser,
  ): Promise<OrganizationResponseDto> {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete organization' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Organization ID' })
  @ApiResponse({ status: 204, description: 'Organization deleted' })
  @ApiResponse({ status: 401, description: 'Not authenticated', type: ApiErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Not organization admin', type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Organization not found', type: ApiErrorResponseDto })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {}
}
\`\`\`

### 5. Create Organizations Module

\`\`\`typescript
@Module({
  imports: [],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
\`\`\`

### 6. Register Module in AppModule

Add \`OrganizationsModule\` to the imports array in \`app.module.ts\`.

### 7. Authorization Logic

For this initial implementation, use simple checks in the service:

\`\`\`typescript
// User can view organization if:
// - They belong to the organization (user.organizationId === org.id)
// - They are a platform admin (user.role === UserRole.ADMIN)
// - The organization is in the same tenant

// User can modify organization if:
// - They are the organization admin (user.organizationId === org.id && user.role === UserRole.CLIENT_ADMIN)
// - They are a platform admin
\`\`\`

### 8. Slug Generation

Implement a simple slug generator:

\`\`\`typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single
}
\`\`\`

### 9. User Role Update on Organization Creation

When a user creates an organization:
1. Create the organization
2. Update the user's \`organizationId\` to the new organization's ID
3. Update the user's \`role\` to \`CLIENT_ADMIN\`

## Constraints

- Do NOT implement file upload for logo (logoFileId is for future use)
- Do NOT implement organization listing/search (future feature)
- Do NOT implement organization verification (admin feature)
- Keep authorization simple (no complex RBAC yet)
- Use existing \`@borg/backend-lib\` exceptions
- Follow Swagger documentation patterns from reference

## Expected Output

### New Files
- [ ] \`apps/api/src/organizations/dto/create-organization.dto.ts\`
- [ ] \`apps/api/src/organizations/dto/update-organization.dto.ts\`
- [ ] \`apps/api/src/organizations/dto/organization-response.dto.ts\`
- [ ] \`apps/api/src/organizations/dto/index.ts\`
- [ ] \`apps/api/src/organizations/organizations.service.ts\`
- [ ] \`apps/api/src/organizations/organizations.controller.ts\`
- [ ] \`apps/api/src/organizations/organizations.module.ts\`

### Modified Files
- [ ] \`apps/api/src/app.module.ts\` - Register OrganizationsModule

## Acceptance Criteria

- [ ] POST /api/organizations - Creates organization, user becomes CLIENT_ADMIN
- [ ] GET /api/organizations/:id - Returns organization if user has access
- [ ] PATCH /api/organizations/:id - Updates organization (admin only)
- [ ] DELETE /api/organizations/:id - Deletes organization (admin only)
- [ ] Slug is auto-generated and unique within tenant
- [ ] Proper error responses using ApiExceptions
- [ ] Swagger documentation complete
- [ ] Type-check passes: \`pnpm type-check --filter=@borg/api\`
- [ ] API starts without errors

## Technical Notes

### Exception Mapping

| Scenario | Exception |
|----------|-----------|
| Organization not found | \`ApiExceptions.organizationNotFound()\` |
| Duplicate slug/name | \`ApiExceptions.alreadyExists('Organization')\` |
| Not organization admin | \`ApiExceptions.organizationAccessDenied()\` |
| User already has organization | \`ApiExceptions.conflict('Organization')\` |

### Response Mapping

Create a helper method to map Organization entity to OrganizationResponseDto:

\`\`\`typescript
private mapToResponse(org: Organization): OrganizationResponseDto {
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    description: org.description,
    website: org.website,
    logoFileId: org.logoFileId,
    industry: org.industry,
    size: org.size,
    isVerified: org.isVerified,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
  };
}
\`\`\`

### Database Considerations

- Slug must be unique within a tenant
- When checking uniqueness, filter by \`tenantId\`
- Use TypeORM's \`save()\` for both create and update

## Files to Modify

\`\`\`
apps/api/src/
├── organizations/
│   ├── dto/
│   │   ├── create-organization.dto.ts   # NEW
│   │   ├── update-organization.dto.ts   # NEW
│   │   ├── organization-response.dto.ts # NEW
│   │   └── index.ts                     # NEW
│   ├── organizations.controller.ts      # NEW
│   ├── organizations.service.ts         # NEW
│   └── organizations.module.ts          # NEW
└── app.module.ts                        # UPDATE: Import OrganizationsModule
\`\`\`

## Example/Reference

### Successful Create Response

\`\`\`json
POST /api/organizations
{
  "name": "Acme Corporation",
  "description": "Leading tech company specializing in innovative solutions",
  "website": "https://acme.com",
  "industry": "Technology",
  "size": "MEDIUM"
}

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corporation",
  "slug": "acme-corporation",
  "description": "Leading tech company specializing in innovative solutions",
  "website": "https://acme.com",
  "logoFileId": null,
  "industry": "Technology",
  "size": "MEDIUM",
  "isVerified": false,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-15T10:00:00.000Z"
}
\`\`\`

### Error Response Example

\`\`\`json
POST /api/organizations
{
  "name": "Acme Corporation"
}

Response 409 (if user already has organization):
{
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "A conflict occurred with the Organization",
    "type": "conflict_error",
    "statusCode": 409,
    "timestamp": "2026-01-15T10:00:00.000Z",
    "path": "/api/organizations"
  }
}
\`\`\`

---

## Related
- Depends on: [[prompts/11-auth-module]], [[prompts/12-auth-swagger-documentation]]
- Blocks: None
- References: [[initial/er-diagram]], [[references/http-exceptions-usage]], [[references/swagger-documentation-usage]]
