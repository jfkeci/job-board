---
title: B2B Client Flow UI - Organization & Job Management
id: 20-b2b-client-flow-ui
created: 2025-01-15
updated: 2025-01-15
status: ready
executed_date:
execution_result: pending
deprecated: false
deprecated_reason:
target: frontend
complexity: high
tags:
  - dashboard
  - organization
  - jobs
  - b2b-flow
  - crud
  - forms
dependencies:
  - 13-dashboard-login-registration
  - 19-dashboard-api-integration
blocks: []
related_specs: []
related_planning: []
notes: Backend API is complete. Services and hooks exist. Only UI implementation needed.
---

# 20 - B2B Client Flow UI: Organization & Job Management

**Date**: 2025-01-15
**Target**: Frontend (Dashboard)
**Related Spec**: N/A

---

## Context

The B2B dashboard (`apps/dashboard`) needs UI implementation for the core client flow:
1. **Register** → Already implemented (signup page works)
2. **Create Organization** → API + hooks ready, needs UI
3. **Manage Jobs** (create/update/delete) → API + hooks ready, needs UI

The backend (`apps/api`) has all required endpoints. The dashboard has services (`organizationsService`, `jobsService`) and React Query hooks (`useOrganizations`, `useJobs`) ready. Only the UI pages and forms need to be built.

**Tenant Assumption**: A tenant must exist in the database. The app will be tested with one pre-existing tenant.

## Goal

Implement the complete B2B client flow UI so a user can:
1. Register on the dashboard (✓ already works)
2. Create their organization after registration
3. View their organization's jobs
4. Create new job postings (drafts)
5. Edit existing job postings
6. Delete draft jobs
7. Publish jobs (change from DRAFT to ACTIVE)
8. Close active jobs

## Current State

### What Already Exists

**Backend API** (`apps/api`) - All endpoints working:
- `POST /organizations` - Create organization
- `GET /organizations/:id` - Get organization
- `PATCH /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization
- `POST /jobs` - Create job draft
- `GET /jobs` - List organization's jobs
- `GET /jobs/:id` - Get job
- `PATCH /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job (DRAFT only)
- `POST /jobs/:id/publish` - Publish job
- `POST /jobs/:id/close` - Close job

**Dashboard Services** (`apps/dashboard/src/services/`):
- `organizations.service.ts` - create, getById, update, delete
- `jobs.service.ts` - create, list, getById, update, delete, publish, close, extend

**Dashboard Hooks** (`apps/dashboard/src/hooks/`):
- `use-organizations.ts` - useOrganization, useCreateOrganization, useUpdateOrganization, useDeleteOrganization
- `use-jobs.ts` - useJobs, useJob, useCreateJob, useUpdateJob, useDeleteJob, usePublishJob, useCloseJob

**Shared Types** (`@borg/types`):
- Organization, CreateOrganizationDto, UpdateOrganizationDto
- Job, JobListItem, CreateJobDto, UpdateJobDto, PublishJobDto
- JobStatus, JobType (EmploymentType), ExperienceLevel, RemoteOption (RemotePolicy), JobTier
- OrganizationSize

**Existing Pages**:
- `/signup` - Registration form (working)
- `/login` - Login form (working)
- `/(dashboard)/overview` - Dashboard with mock data
- `/(dashboard)/jobs/create` - Empty stub page

### What's Missing

- Organization creation form/page
- Organization onboarding redirect after signup
- Jobs list page with filtering
- Job creation form with all fields
- Job edit page
- Job detail view
- Publish job modal with tier selection
- Close job confirmation

## Requirements

### 1. **Organization Creation Flow**

After a user registers and has no organization, they should:
1. Be redirected to organization creation page (`/organizations/create`)
2. See a form to create their organization
3. On success, be redirected to the dashboard overview

**Form Fields** (from `CreateOrganizationDto`):
- `name` (required) - Organization name
- `slug` (optional) - Auto-generated if not provided
- `description` (optional) - Company description (textarea)
- `website` (optional) - Company website URL
- `industry` (optional) - Industry category
- `size` (optional) - Organization size (dropdown with OrganizationSize enum)

**File**: `apps/dashboard/src/app/(dashboard)/organizations/create/page.tsx`

### 2. **Organization Guard/Redirect**

Users without an organization should be redirected to create one:
- Check `user.organizationId` from auth store
- If null, redirect to `/organizations/create`
- Apply this to dashboard routes that require organization

**Implementation Options**:
- Middleware in dashboard layout
- Custom hook `useRequireOrganization()`
- Guard component wrapping dashboard routes

### 3. **Jobs List Page**

Display all jobs for the user's organization with management actions.

**File**: `apps/dashboard/src/app/(dashboard)/jobs/page.tsx`

**Features**:
- Table/list view of all jobs
- Columns: Title, Status, Location, Created Date, Actions
- Status badges (DRAFT=gray, ACTIVE=green, CLOSED=red, EXPIRED=orange)
- Filter by status
- Sort by date/title
- Actions per job:
  - Edit (all statuses)
  - Delete (DRAFT only)
  - Publish (DRAFT only)
  - Close (ACTIVE only)
- "Create New Job" button
- Empty state when no jobs

### 4. **Job Creation Form**

Full form for creating a job draft.

**File**: `apps/dashboard/src/app/(dashboard)/jobs/create/page.tsx` (replace stub)

**Form Fields** (from `CreateJobDto`):
- `title` (required) - Job title
- `description` (required) - Full job description (rich textarea)
- `requirements` (optional) - Job requirements (textarea)
- `responsibilities` (optional) - Job responsibilities (textarea)
- `benefits` (optional) - Benefits offered (textarea)
- `location` (required) - Job location
- `jobType` (required) - Employment type (dropdown: EmploymentType enum)
- `experienceLevel` (required) - Experience level (dropdown: ExperienceLevel enum)
- `remotePolicy` (required) - Remote option (dropdown: RemoteOption enum)
- `salary` (optional) - Salary display string
- `salaryMin` (optional) - Minimum salary (number)
- `salaryMax` (optional) - Maximum salary (number)
- `salaryCurrency` (optional) - Currency code (default: "USD")

**Behavior**:
- Save as DRAFT status
- Redirect to job detail or jobs list on success
- Show validation errors

### 5. **Job Edit Page**

Edit existing job details.

**File**: `apps/dashboard/src/app/(dashboard)/jobs/[id]/edit/page.tsx`

**Features**:
- Pre-populate form with existing job data
- Same fields as creation form
- Save changes button
- Cancel/back button
- Delete button (DRAFT only, with confirmation)

### 6. **Job Detail View**

View job details with action buttons.

**File**: `apps/dashboard/src/app/(dashboard)/jobs/[id]/page.tsx`

**Features**:
- Display all job information
- Status badge
- Edit button
- Publish button (DRAFT only) - opens tier selection modal
- Close button (ACTIVE only)
- Delete button (DRAFT only)
- Back to jobs list

### 7. **Publish Job Modal**

Modal for selecting tier when publishing a job.

**Component**: `apps/dashboard/src/components/jobs/PublishJobModal.tsx`

**Fields** (from `PublishJobDto`):
- `tier` (required) - JobTier selection (BASIC, STANDARD, PREMIUM)
- `featuredUntil` (optional) - Featured end date
- `highlightColor` (optional) - Highlight color
- `socialBoost` (optional) - Social media boost

**Behavior**:
- Display tier options with descriptions/pricing
- On confirm, call `usePublishJob()` mutation
- Close modal and refresh job list on success

### 8. **Update Sidebar Navigation**

Ensure sidebar links point to correct routes.

**File**: `apps/dashboard/src/components/Sidebar.tsx`

**Links**:
- Overview → `/(dashboard)/overview`
- Jobs → `/(dashboard)/jobs`
- Create Job → `/(dashboard)/jobs/create`
- Settings → `/(dashboard)/settings` (can remain placeholder)

### 9. **Update Dashboard Overview**

Replace mock data with real API data.

**File**: `apps/dashboard/src/app/(dashboard)/overview/page.tsx`

**Features**:
- Use `useJobs()` hook for real data
- Display recent jobs
- Show job count statistics by status
- Quick actions: Create Job, View All Jobs

## Constraints

- **Don't modify** backend API code
- **Don't modify** existing services or hooks (they're complete)
- **Don't modify** auth flow (it's working)
- **Use existing** `@borg/ui` components (GlassCard, GlassButton, GlassInput, etc.)
- **Use existing** shared types from `@borg/types`
- **Follow existing** patterns in dashboard codebase
- **Maintain** mobile responsiveness

## Expected Output

- [ ] `apps/dashboard/src/app/(dashboard)/organizations/create/page.tsx` - New
- [ ] `apps/dashboard/src/app/(dashboard)/jobs/page.tsx` - New (jobs list)
- [ ] `apps/dashboard/src/app/(dashboard)/jobs/create/page.tsx` - Replace stub
- [ ] `apps/dashboard/src/app/(dashboard)/jobs/[id]/page.tsx` - New (job detail)
- [ ] `apps/dashboard/src/app/(dashboard)/jobs/[id]/edit/page.tsx` - New
- [ ] `apps/dashboard/src/components/jobs/JobsTable.tsx` - New component
- [ ] `apps/dashboard/src/components/jobs/JobForm.tsx` - New component (reusable)
- [ ] `apps/dashboard/src/components/jobs/PublishJobModal.tsx` - New component
- [ ] `apps/dashboard/src/components/jobs/JobStatusBadge.tsx` - New component
- [ ] `apps/dashboard/src/components/organizations/OrganizationForm.tsx` - New component
- [ ] `apps/dashboard/src/hooks/use-require-organization.ts` - New hook (optional)
- [ ] `apps/dashboard/src/components/Sidebar.tsx` - Updated navigation
- [ ] `apps/dashboard/src/app/(dashboard)/overview/page.tsx` - Updated with real data

## Acceptance Criteria

- [ ] New user can register → create organization → land on dashboard
- [ ] User without organization is redirected to create one
- [ ] Jobs list page shows all organization jobs with correct statuses
- [ ] Can create a new job draft with all required fields
- [ ] Can edit an existing job
- [ ] Can delete a DRAFT job (with confirmation)
- [ ] Can publish a DRAFT job (tier selection modal)
- [ ] Can close an ACTIVE job
- [ ] Dashboard overview shows real job data
- [ ] All forms show validation errors
- [ ] Loading states displayed during API calls
- [ ] Error states handled gracefully
- [ ] Type-check passes: `pnpm type-check --filter=@borg/dashboard`
- [ ] Build succeeds: `pnpm build`

## Technical Notes

### Type Imports

```typescript
import type {
  Organization,
  CreateOrganizationDto,
  OrganizationSize,
  Job,
  JobListItem,
  CreateJobDto,
  UpdateJobDto,
  PublishJobDto,
  JobStatus,
  EmploymentType,    // Note: API uses EmploymentType, types may vary
  ExperienceLevel,
  RemoteOption,      // Note: API may use RemotePolicy
  JobTier,
} from '@borg/types';
```

### Hook Usage Examples

```typescript
// Organizations
const { mutate: createOrg, isPending } = useCreateOrganization();
const { data: org } = useOrganization(orgId);

// Jobs
const { data: jobsData, isLoading } = useJobs();
const { data: job } = useJob(jobId);
const { mutate: createJob } = useCreateJob();
const { mutate: updateJob } = useUpdateJob(jobId);
const { mutate: deleteJob } = useDeleteJob();
const { mutate: publishJob } = usePublishJob(jobId);
const { mutate: closeJob } = useCloseJob(jobId);
```

### Form Validation

Use simple client-side validation or integrate with existing patterns:
- Required field checks
- Email/URL format validation
- Minimum/maximum lengths where appropriate

### Enum Display Values

Create display mappings for enums:

```typescript
const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Internship',
};

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  ENTRY: 'Entry Level',
  JUNIOR: 'Junior',
  MID: 'Mid Level',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  EXECUTIVE: 'Executive',
};

const jobStatusColors: Record<JobStatus, string> = {
  DRAFT: 'gray',
  ACTIVE: 'green',
  CLOSED: 'red',
  EXPIRED: 'orange',
  PENDING_PAYMENT: 'yellow',
};
```

## Files to Modify

```
apps/dashboard/src/
├── app/(dashboard)/
│   ├── organizations/
│   │   └── create/
│   │       └── page.tsx          # NEW - Organization creation form
│   ├── jobs/
│   │   ├── page.tsx              # NEW - Jobs list
│   │   ├── create/
│   │   │   └── page.tsx          # REPLACE - Job creation form
│   │   └── [id]/
│   │       ├── page.tsx          # NEW - Job detail
│   │       └── edit/
│   │           └── page.tsx      # NEW - Job edit form
│   └── overview/
│       └── page.tsx              # UPDATE - Use real data
├── components/
│   ├── jobs/
│   │   ├── JobsTable.tsx         # NEW
│   │   ├── JobForm.tsx           # NEW
│   │   ├── PublishJobModal.tsx   # NEW
│   │   └── JobStatusBadge.tsx    # NEW
│   ├── organizations/
│   │   └── OrganizationForm.tsx  # NEW
│   └── Sidebar.tsx               # UPDATE - Fix navigation
└── hooks/
    └── use-require-organization.ts  # NEW (optional)
```

## Example UI Patterns

### Jobs Table Row

```tsx
<Tr>
  <Td>{job.title}</Td>
  <Td><JobStatusBadge status={job.status} /></Td>
  <Td>{job.location}</Td>
  <Td>{formatDate(job.createdAt)}</Td>
  <Td>
    <HStack>
      <GlassButton size="sm" onClick={() => router.push(`/jobs/${job.id}/edit`)}>
        Edit
      </GlassButton>
      {job.status === 'DRAFT' && (
        <>
          <GlassButton size="sm" colorScheme="green" onClick={() => openPublishModal(job)}>
            Publish
          </GlassButton>
          <GlassButton size="sm" colorScheme="red" onClick={() => handleDelete(job.id)}>
            Delete
          </GlassButton>
        </>
      )}
      {job.status === 'ACTIVE' && (
        <GlassButton size="sm" colorScheme="orange" onClick={() => handleClose(job.id)}>
          Close
        </GlassButton>
      )}
    </HStack>
  </Td>
</Tr>
```

### Organization Form

```tsx
<VStack spacing={4}>
  <FormControl isRequired>
    <FormLabel>Organization Name</FormLabel>
    <GlassInput
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      placeholder="Acme Corporation"
    />
  </FormControl>

  <FormControl>
    <FormLabel>Description</FormLabel>
    <Textarea
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      placeholder="Tell us about your company..."
    />
  </FormControl>

  <FormControl>
    <FormLabel>Company Size</FormLabel>
    <Select
      value={form.size}
      onChange={(e) => setForm({ ...form, size: e.target.value as OrganizationSize })}
    >
      <option value="">Select size...</option>
      {Object.entries(OrganizationSize).map(([key, value]) => (
        <option key={key} value={value}>{value}</option>
      ))}
    </Select>
  </FormControl>

  <GlassButton
    colorScheme="blue"
    onClick={handleSubmit}
    isLoading={isPending}
  >
    Create Organization
  </GlassButton>
</VStack>
```

---

## Related

- Depends on: [[prompts/13-dashboard-login-registration]], [[prompts/19-dashboard-api-integration]]
- Blocks: None
- References: [[prompts/14-organizations-module]], [[prompts/16-jobs-module]]
