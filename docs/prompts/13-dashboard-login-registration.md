---
title: Dashboard Login & Registration with Zustand Auth State
id: 13-dashboard-login-registration
created: 2026-01-15
updated: 2026-01-15
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: frontend
complexity: moderate
tags:
  - authentication
  - dashboard
  - zustand
  - state-management
  - login
  - registration
dependencies:
  - 11-auth-module
  - 12-auth-swagger-documentation
blocks: []
related_specs:
  - "[[initial/er-diagram]]"
related_planning: []
notes: Implement functional login/registration on dashboard with Zustand state management
---

# 13 - Dashboard Login & Registration with Zustand Auth State

**Date**: 2026-01-15
**Target**: Frontend (Dashboard - B2B Application)
**Related Spec**: [[initial/er-diagram]]

---

## Context

The backend authentication API is complete with endpoints for login, registration, token refresh, and logout. The dashboard application (`apps/dashboard`) has a login page UI but no functional implementation. We need to connect the frontend to the backend API and implement proper state management.

The dashboard is a B2B application for employers/recruiters to manage job advertisements.

## Goal

Implement functional login and registration flows on the dashboard application with:
- Zustand store for authentication state management
- API integration with the NestJS backend
- Token persistence (access token, refresh token)
- Protected route middleware
- Post-auth redirect to job creation placeholder view

## Current State

### Backend API Endpoints (Ready)
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
POST /api/auth/refresh   - Refresh tokens
POST /api/auth/logout    - Logout (requires auth)
GET  /api/auth/me        - Get current user (requires auth)
```

### Dashboard Structure
```
apps/dashboard/src/
├── app/
│   ├── (dashboard)/           # Protected route group
│   │   ├── layout.tsx         # Dashboard layout
│   │   └── overview/page.tsx  # Dashboard overview
│   ├── login/page.tsx         # Login page (UI only, needs logic)
│   ├── providers.tsx          # Chakra theme provider
│   └── layout.tsx             # Root layout
├── components/
│   └── layout/                # Header, Sidebar, etc.
```

### Existing Login Page
- Full UI with glassmorphism design
- Email/password form fields (no state binding)
- Social login buttons (UI only - out of scope)
- No form submission handlers
- No validation

### Missing
- Registration page
- Zustand auth store
- API client service
- Token management
- Protected route middleware
- Job creation placeholder page

## Requirements

### 1. Install Dependencies

```bash
# From monorepo root
pnpm add zustand @tanstack/react-query --filter=@borg/dashboard
```

### 2. Create Auth Types

Create `apps/dashboard/src/types/auth.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  role: string;
  tenantId: string;
  emailVerified: boolean;
  language: string;
  organizationId: string | null;
  createdAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    phone: string | null;
    headline: string | null;
  };
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
```

### 3. Create API Client

Create `apps/dashboard/src/lib/api.ts`:

- Base fetch wrapper with error handling
- Automatic token refresh on 401
- Request/response interceptors
- API base URL from environment variable

Key functions:
```typescript
// Core API client
export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T>

// Auth-specific API calls
export const authApi = {
  login: (credentials: LoginCredentials) => apiClient<AuthResponse>('/auth/login', {...}),
  register: (credentials: RegisterCredentials) => apiClient<AuthResponse>('/auth/register', {...}),
  refresh: (refreshToken: string) => apiClient<AuthResponse>('/auth/refresh', {...}),
  logout: () => apiClient<{ message: string }>('/auth/logout', {...}),
  me: () => apiClient<User>('/auth/me'),
};
```

### 4. Create Zustand Auth Store

Create `apps/dashboard/src/store/auth.store.ts`:

State shape:
```typescript
interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  hydrate: () => void; // Load from localStorage on mount
}
```

Implementation requirements:
- Persist tokens to `localStorage` on login/register
- Clear tokens from `localStorage` on logout
- `hydrate()` function to restore state from `localStorage` on app load
- Handle API errors and set error state
- Automatic token refresh when access token expires

### 5. Update Login Page

Update `apps/dashboard/src/app/login/page.tsx`:

- Add form state with `useState` hooks
- Bind form inputs to state
- Add form submission handler using auth store
- Add loading state during submission
- Display error messages from store
- Redirect to `/jobs/create` on successful login
- Add basic client-side validation
- **Hardcode tenantId** for now (use a constant or env variable)

### 6. Create Registration Page

Create `apps/dashboard/src/app/signup/page.tsx`:

Form fields:
- First name (required)
- Last name (required)
- Email (required, email format)
- Password (required, min 8 characters)
- Confirm password (required, must match)
- Terms acceptance checkbox (required)

Features:
- Similar glassmorphism design to login page
- Form validation with error messages
- Loading state during submission
- Redirect to `/jobs/create` on success
- Link to login page
- **Hardcode tenantId** for now

### 7. Create Protected Route Middleware

Create `apps/dashboard/src/middleware.ts`:

- Check for access token in cookies or redirect to login
- Protect all `/dashboard/*` and `/jobs/*` routes
- Allow public routes: `/`, `/login`, `/signup`, `/pricing`
- Redirect authenticated users away from `/login` and `/signup`

Note: Since we're using localStorage for tokens, middleware can check for a session cookie that we set alongside localStorage.

### 8. Create Auth Provider

Create `apps/dashboard/src/providers/auth-provider.tsx`:

- Wrap app with auth hydration on mount
- Check authentication status
- Provide loading state during hydration
- Handle token refresh on app load if access token expired

### 9. Create Jobs Placeholder Page

Create `apps/dashboard/src/app/(dashboard)/jobs/create/page.tsx`:

- Simple placeholder page with glassmorphism card
- Heading: "Create Job Advertisement"
- Placeholder text: "Job creation form coming soon..."
- This serves as the redirect target after login/registration

### 10. Update Dashboard Layout

Update `apps/dashboard/src/app/(dashboard)/layout.tsx`:

- Add auth check
- Show loading state while checking auth
- Redirect to login if not authenticated

### 11. Update Root Layout

Update `apps/dashboard/src/app/layout.tsx`:

- Wrap with AuthProvider
- Ensure providers are properly ordered

### 12. Environment Configuration

Create/update `apps/dashboard/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_DEFAULT_TENANT_ID=<uuid-from-database>
```

## Constraints

- Do NOT modify backend code
- Do NOT implement social login (Google/GitHub) - keep buttons as UI placeholders
- Do NOT implement forgot password flow
- Do NOT add email verification UI
- Use existing `@borg/ui` components (GlassCard, GlassButton, GlassInput)
- Follow existing code patterns in dashboard app
- Keep implementation simple - no over-engineering
- Hardcode tenantId for MVP (will be dynamic later)

## Expected Output

### New Files
- [ ] `apps/dashboard/src/types/auth.ts` - Auth type definitions
- [ ] `apps/dashboard/src/lib/api.ts` - API client with auth endpoints
- [ ] `apps/dashboard/src/store/auth.store.ts` - Zustand auth store
- [ ] `apps/dashboard/src/app/signup/page.tsx` - Registration page
- [ ] `apps/dashboard/src/app/(dashboard)/jobs/create/page.tsx` - Jobs placeholder
- [ ] `apps/dashboard/src/providers/auth-provider.tsx` - Auth provider component
- [ ] `apps/dashboard/src/middleware.ts` - Route protection middleware
- [ ] `apps/dashboard/.env.local` - Environment variables

### Modified Files
- [ ] `apps/dashboard/package.json` - Add zustand dependency
- [ ] `apps/dashboard/src/app/login/page.tsx` - Add form logic
- [ ] `apps/dashboard/src/app/layout.tsx` - Add AuthProvider
- [ ] `apps/dashboard/src/app/(dashboard)/layout.tsx` - Add auth check

## Acceptance Criteria

- [ ] User can register with email/password
- [ ] User can login with email/password
- [ ] Tokens are persisted to localStorage
- [ ] User is redirected to `/jobs/create` after login/registration
- [ ] Protected routes redirect to login when not authenticated
- [ ] Login/signup redirect to dashboard when already authenticated
- [ ] Form validation shows appropriate error messages
- [ ] API errors are displayed to user
- [ ] Loading states show during API calls
- [ ] Logout clears tokens and redirects to login
- [ ] App hydrates auth state from localStorage on reload
- [ ] Type-check passes: `pnpm type-check --filter=@borg/dashboard`

## Technical Notes

### Token Storage Strategy
Use `localStorage` for simplicity in this MVP:
- Store `accessToken`, `refreshToken`, and basic user info
- The middleware can't read localStorage, so for route protection we rely on client-side checks in the layout component

### Tenant ID
For MVP, hardcode a default tenant ID. This will be:
1. Set in environment variable `NEXT_PUBLIC_DEFAULT_TENANT_ID`
2. Used in all auth requests
3. Later replaced with dynamic tenant selection

### Error Handling
The backend returns errors in this format:
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "type": "authentication_error",
    "statusCode": 401
  }
}
```

Parse the `error.message` field for user-friendly error display.

### Token Refresh Flow
1. Store token expiry time alongside access token
2. Before API calls, check if token is about to expire (within 1 minute)
3. If expiring, call refresh endpoint first
4. If refresh fails (invalid refresh token), logout user

## Files to Modify

```
apps/dashboard/
├── src/
│   ├── types/
│   │   └── auth.ts              # NEW: Auth types
│   ├── lib/
│   │   └── api.ts               # NEW: API client
│   ├── store/
│   │   └── auth.store.ts        # NEW: Zustand store
│   ├── providers/
│   │   └── auth-provider.tsx    # NEW: Auth provider
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx         # UPDATE: Add form logic
│   │   ├── signup/
│   │   │   └── page.tsx         # NEW: Registration page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx       # UPDATE: Add auth check
│   │   │   └── jobs/
│   │   │       └── create/
│   │   │           └── page.tsx # NEW: Placeholder page
│   │   └── layout.tsx           # UPDATE: Add AuthProvider
│   └── middleware.ts            # NEW: Route protection
├── package.json                 # UPDATE: Add dependencies
└── .env.local                   # NEW: Environment config
```

## Example/Reference

### Zustand Store Pattern
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      // ... state and actions
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
```

### Form Submission Pattern
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login({ email, password, tenantId });
    router.push('/jobs/create');
  } catch (error) {
    // Error is set in store
  }
};
```

---

## Related
- Depends on: [[prompts/11-auth-module]], [[prompts/12-auth-swagger-documentation]]
- Blocks: None
- References: [[initial/er-diagram]]
