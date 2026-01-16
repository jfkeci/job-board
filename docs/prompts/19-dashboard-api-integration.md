---
title: Dashboard API Integration with Shared Types
id: 19-dashboard-api-integration
created: 2025-01-15
updated: 2025-01-15
status: executed
executed_date: 2025-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: frontend
complexity: moderate
tags:
  - dashboard
  - api-integration
  - shared-types
  - organizations
  - jobs
  - react-query
dependencies:
  - 11-auth-module
  - 13-dashboard-login-registration
  - 14-organizations-module
  - 16-jobs-module
blocks: []
related_specs: []
related_planning: []
notes: Successfully implemented. Extended @job-board/types with comprehensive types matching API DTOs. Added React Query with services and hooks for organizations and jobs. Fixed pre-existing lint issues in dashboard files. Build and type-check pass.
---

# 19 - Dashboard API Integration with Shared Types

**Date**: 2025-01-15
**Target**: Frontend (Dashboard)
**Related Spec**: N/A

---

## Context

The dashboard app (`apps/dashboard`) currently has authentication endpoints connected to the API (`apps/api`). The auth flow works with login, registration, logout, and token refresh. However, the remaining API endpoints (organizations, jobs) are not yet connected to the dashboard.

Additionally, types are currently defined locally in the dashboard app (`apps/dashboard/src/types/auth.ts`) instead of using the shared types package (`@job-board/types`). This needs to be consolidated for type safety across the monorepo.

## Goal

1. **Consolidate types** in `@job-board/types` package for cross-app type safety
2. **Create API service layer** for organizations and jobs endpoints
3. **Implement React Query hooks** for data fetching with proper caching
4. **Ensure proper error handling** and loading states

## Current State

### API Endpoints Available (from `apps/api`)

**Organizations** (`/organizations`) - Bearer auth required:
- `POST /organizations` - Create organization
- `GET /organizations/:id` - Get organization by ID
- `PATCH /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization

**Jobs** (`/jobs`) - Bearer auth required:
- `POST /jobs` - Create job draft
- `GET /jobs` - List all jobs for organization
- `GET /jobs/:id` - Get job by ID
- `PATCH /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job (DRAFT only)
- `POST /jobs/:id/publish` - Publish draft job
- `POST /jobs/:id/close` - Close active job
- `POST /jobs/:id/extend` - Extend job expiry

### Existing Dashboard Setup
- **API Client**: `apps/dashboard/src/lib/api.ts` - Handles auth header injection
- **Auth Store**: `apps/dashboard/src/store/auth.store.ts` - Zustand with localStorage persistence
- **Local Types**: `apps/dashboard/src/types/auth.ts` - Should be moved to `@job-board/types`

### Shared Types Package
- **Location**: `packages/types/src/index.ts`
- **Current Contents**: Basic `ApiResponse`, `PaginatedResponse`, `User`, `Status` types
- **Needs**: Auth DTOs, Organization DTOs, Job DTOs

## Requirements

### 1. **Extend `@job-board/types` Package**

Add comprehensive types mirroring API DTOs:

```typescript
// packages/types/src/index.ts

// === Auth Types ===
export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string | null;
  headline: string | null;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
  emailVerified: boolean;
  language: string;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  PLATFORM_ADMIN = 'platform_admin',
  CLIENT_ADMIN = 'client_admin',
  CLIENT_USER = 'client_user',
  CONSUMER = 'consumer',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse extends AuthTokens {
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

// === Organization Types ===
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  industry: string | null;
  size: OrganizationSize | null;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export enum OrganizationSize {
  STARTUP = '1-10',
  SMALL = '11-50',
  MEDIUM = '51-200',
  LARGE = '201-500',
  ENTERPRISE = '500+',
}

export interface CreateOrganizationDto {
  name: string;
  slug?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: OrganizationSize;
}

export interface UpdateOrganizationDto {
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: OrganizationSize;
}

// === Job Types ===
export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive',
}

export enum RemotePolicy {
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
  REMOTE = 'remote',
}

export enum JobTier {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  location: string;
  salary: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  remotePolicy: RemotePolicy;
  status: JobStatus;
  tier: JobTier | null;
  publishedAt: string | null;
  expiresAt: string | null;
  organizationId: string;
  createdById: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDto {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  remotePolicy: RemotePolicy;
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  remotePolicy?: RemotePolicy;
}

export interface PublishJobDto {
  tier: JobTier;
  featuredUntil?: string;
  highlightColor?: string;
  socialBoost?: boolean;
}

// === API Response Types ===
export interface MessageResponse {
  message: string;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
}
```

### 2. **Update Dashboard to Use `@job-board/types`**

- Update `apps/dashboard/src/types/auth.ts` to re-export from `@job-board/types`
- Update all imports throughout dashboard to use shared types
- Ensure auth store uses shared types

### 3. **Create API Service Functions**

Create service files for organizations and jobs:

**File: `apps/dashboard/src/services/organizations.service.ts`**
```typescript
import { apiClient } from '@/lib/api';
import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto
} from '@job-board/types';

export const organizationsService = {
  create: (data: CreateOrganizationDto) =>
    apiClient<Organization>('/organizations', { method: 'POST', body: data }),

  getById: (id: string) =>
    apiClient<Organization>(`/organizations/${id}`),

  update: (id: string, data: UpdateOrganizationDto) =>
    apiClient<Organization>(`/organizations/${id}`, { method: 'PATCH', body: data }),

  delete: (id: string) =>
    apiClient<void>(`/organizations/${id}`, { method: 'DELETE' }),
};
```

**File: `apps/dashboard/src/services/jobs.service.ts`**
```typescript
import { apiClient } from '@/lib/api';
import type {
  Job,
  JobListResponse,
  CreateJobDto,
  UpdateJobDto,
  PublishJobDto
} from '@job-board/types';

export const jobsService = {
  create: (data: CreateJobDto) =>
    apiClient<Job>('/jobs', { method: 'POST', body: data }),

  list: () =>
    apiClient<JobListResponse>('/jobs'),

  getById: (id: string) =>
    apiClient<Job>(`/jobs/${id}`),

  update: (id: string, data: UpdateJobDto) =>
    apiClient<Job>(`/jobs/${id}`, { method: 'PATCH', body: data }),

  delete: (id: string) =>
    apiClient<void>(`/jobs/${id}`, { method: 'DELETE' }),

  publish: (id: string, data: PublishJobDto) =>
    apiClient<Job>(`/jobs/${id}/publish`, { method: 'POST', body: data }),

  close: (id: string) =>
    apiClient<Job>(`/jobs/${id}/close`, { method: 'POST' }),

  extend: (id: string) =>
    apiClient<Job>(`/jobs/${id}/extend`, { method: 'POST' }),
};
```

### 4. **Create React Query Hooks**

Install and configure TanStack Query (React Query):

**File: `apps/dashboard/src/hooks/use-organizations.ts`**
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationsService } from '@/services/organizations.service';
import type { CreateOrganizationDto, UpdateOrganizationDto } from '@job-board/types';

export const organizationKeys = {
  all: ['organizations'] as const,
  detail: (id: string) => ['organizations', id] as const,
};

export function useOrganization(id: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationDto) => organizationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}

export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationDto) => organizationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(id) });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}
```

**File: `apps/dashboard/src/hooks/use-jobs.ts`**
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobsService } from '@/services/jobs.service';
import type { CreateJobDto, UpdateJobDto, PublishJobDto } from '@job-board/types';

export const jobKeys = {
  all: ['jobs'] as const,
  list: () => ['jobs', 'list'] as const,
  detail: (id: string) => ['jobs', id] as const,
};

export function useJobs() {
  return useQuery({
    queryKey: jobKeys.list(),
    queryFn: () => jobsService.list(),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDto) => jobsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useUpdateJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateJobDto) => jobsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function usePublishJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PublishJobDto) => jobsService.publish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useCloseJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => jobsService.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useExtendJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => jobsService.extend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
}
```

### 5. **Setup React Query Provider**

**Update: `apps/dashboard/src/app/providers.tsx`**
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GlassThemeProvider, brandPresets } from '@job-board/ui';
import { AuthProvider } from '@/providers/auth-provider';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <GlassThemeProvider brandConfig={brandPresets.indigo}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </GlassThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Constraints

- **Don't modify** the API backend code
- **Don't modify** existing auth flow - it's working correctly
- **Maintain compatibility** with existing Zustand auth store
- **Follow existing patterns** in the dashboard codebase
- **Use workspace imports** for `@job-board/types` package

## Expected Output

- [ ] `packages/types/src/index.ts` - Extended with all auth, organization, and job types
- [ ] `packages/types/package.json` - Ensure proper exports
- [ ] `apps/dashboard/package.json` - Add `@tanstack/react-query` dependency
- [ ] `apps/dashboard/src/types/auth.ts` - Updated to re-export from `@job-board/types`
- [ ] `apps/dashboard/src/services/organizations.service.ts` - New file
- [ ] `apps/dashboard/src/services/jobs.service.ts` - New file
- [ ] `apps/dashboard/src/hooks/use-organizations.ts` - New file
- [ ] `apps/dashboard/src/hooks/use-jobs.ts` - New file
- [ ] `apps/dashboard/src/app/providers.tsx` - Updated with React Query provider

## Acceptance Criteria

- [ ] All types are defined in `@job-board/types` and importable in dashboard
- [ ] Dashboard type-checks successfully (`pnpm type-check --filter=@job-board/dashboard`)
- [ ] API service functions properly typed and callable
- [ ] React Query hooks working with proper cache invalidation
- [ ] No breaking changes to existing auth functionality
- [ ] Build succeeds (`pnpm build`)

## Technical Notes

- The API client in `apps/dashboard/src/lib/api.ts` already handles:
  - Bearer token injection from auth store
  - Error handling with `ApiClientError`
  - JSON body serialization
- React Query provides:
  - Automatic caching and background refetching
  - Loading/error states
  - Optimistic updates capability
  - DevTools for debugging
- Zustand auth store should remain for auth state; React Query handles server state

## Files to Modify

```
packages/types/
  src/
    index.ts - Add all shared types

apps/dashboard/
  package.json - Add @tanstack/react-query
  src/
    types/
      auth.ts - Re-export from @job-board/types
    services/
      organizations.service.ts - Create new
      jobs.service.ts - Create new
    hooks/
      use-organizations.ts - Create new
      use-jobs.ts - Create new
    app/
      providers.tsx - Add React Query provider
```

## Example Usage

After implementation, dashboard components can use the hooks like:

```tsx
// In a jobs list component
import { useJobs, useDeleteJob } from '@/hooks/use-jobs';

export function JobsList() {
  const { data, isLoading, error } = useJobs();
  const deleteJob = useDeleteJob();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <VStack>
      {data?.jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onDelete={() => deleteJob.mutate(job.id)}
        />
      ))}
    </VStack>
  );
}
```

---

## Related

- Depends on: [[prompts/11-auth-module]], [[prompts/13-dashboard-login-registration]], [[prompts/14-organizations-module]], [[prompts/16-jobs-module]]
- Blocks: None
- References: None
