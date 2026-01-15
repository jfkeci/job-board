---
title: Header Component - Auth-Aware Navigation
id: 15-header-auth-state
created: 2026-01-15
updated: 2026-01-15
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: frontend
complexity: low
tags:
  - dashboard
  - header
  - navigation
  - auth
  - ux
dependencies:
  - 13-dashboard-login-registration
blocks: []
related_specs: []
related_planning: []
notes: Header should reflect user authentication state - show Login CTA for guests, user menu for authenticated users
---

# 15 - Header Component - Auth-Aware Navigation

**Date**: 2026-01-15
**Target**: Frontend (Dashboard)
**Related Spec**: None

---

## Context

The current Header component in the dashboard app is designed with a static logged-in user state. It always displays:
- A user avatar with hardcoded "Admin User" text
- A dropdown menu with Profile, Settings, and Logout options
- A "Login" link in the middle navigation (redundant when showing user menu)

This creates a confusing UX where new visitors see what appears to be a logged-in interface. The header should be auth-aware and display different UI based on authentication state.

## Goal

Refactor the Header component to:
1. Show a **Login CTA button** for unauthenticated visitors
2. Show the **user menu** (avatar + dropdown) only for authenticated users
3. Remove the Login link from center navigation (replaced by CTA)
4. Remove Dashboard link from center navigation (only relevant when logged in)
5. Use the existing `useAuthStore` for authentication state

## Current State

### Current Header Issues

```tsx
// apps/dashboard/src/components/layout/Header.tsx

// Problem 1: Login link in center nav (should be CTA on right)
<Link href="/login">
  <GlassButton variant="ghost" size="sm">
    Login
  </GlassButton>
</Link>

// Problem 2: Dashboard link visible to non-authenticated users
<Link href="/dashboard/overview">
  <GlassButton variant="ghost" size="sm">
    Dashboard
  </GlassButton>
</Link>

// Problem 3: User menu always visible with hardcoded data
<Menu>
  <MenuButton>
    <Avatar size="sm" name="Admin User" bg="primary.500" />
    <Text>Admin</Text>
  </MenuButton>
  <MenuList>
    <MenuItem>Profile</MenuItem>
    <MenuItem>Settings</MenuItem>
    <MenuItem>Logout</MenuItem>
  </MenuList>
</Menu>
```

### Auth Store Available

```tsx
// apps/dashboard/src/store/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;  // Important: wait for hydration before rendering auth-dependent UI
  logout: () => Promise<void>;
}

// Usage
const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
```

## Requirements

### 1. Import Auth Store

```tsx
import { useAuthStore } from '@/store/auth.store';
```

### 2. Conditional Rendering Based on Auth State

```tsx
export function Header({ onMobileMenuToggle, showMenuButton = false }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    // ... header structure
  );
}
```

### 3. Center Navigation - Simplified

Remove Login and Dashboard links. Keep only public pages:

```tsx
{/* Center - Navigation Links */}
<HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
  <Link href="/">
    <GlassButton variant="ghost" size="sm">
      Home
    </GlassButton>
  </Link>
  <Link href="/pricing">
    <GlassButton variant="ghost" size="sm">
      Pricing
    </GlassButton>
  </Link>
</HStack>
```

### 4. Right Side - Auth-Aware UI

```tsx
{/* Right side */}
<HStack spacing={2}>
  {/* Theme Toggle - Always visible */}
  <IconButton
    aria-label="Toggle color mode"
    icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
    variant="ghost"
    onClick={toggleColorMode}
  />

  {/* Auth-dependent UI */}
  {isHydrated && (
    <>
      {isAuthenticated ? (
        // Logged in: Show user menu
        <Menu>
          <MenuButton
            as={GlassButton}
            variant="ghost"
            size="sm"
            rightIcon={<FiChevronDown />}
          >
            <HStack spacing={2}>
              <Avatar
                size="sm"
                name={user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user?.email}
                bg="primary.500"
              />
              <Text display={{ base: 'none', md: 'block' }}>
                {user?.profile?.firstName || 'Account'}
              </Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} href="/dashboard/overview" icon={<FiGrid />}>
              Dashboard
            </MenuItem>
            <MenuItem as={Link} href="/profile" icon={<FiUser />}>
              Profile
            </MenuItem>
            <MenuItem as={Link} href="/settings" icon={<FiSettings />}>
              Settings
            </MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        // Not logged in: Show Login CTA
        <Link href="/login">
          <GlassButton size="sm">
            Login
          </GlassButton>
        </Link>
      )}
    </>
  )}
</HStack>
```

### 5. Handle Hydration State

Important: The auth store uses `persist` middleware which loads from localStorage. Before hydration completes, `isAuthenticated` will be `false` even if user is logged in.

Use `isHydrated` to prevent flash of wrong UI:

```tsx
{/* Only render auth UI after hydration to prevent flash */}
{isHydrated && (
  // ... auth-dependent UI
)}
```

Optionally, show a skeleton/placeholder while hydrating:

```tsx
{!isHydrated && (
  <Box w="80px" h="32px" bg="gray.200" borderRadius="md" />
)}
```

### 6. Add Missing Import

```tsx
import { useRouter } from 'next/navigation';
import { FiGrid } from 'react-icons/fi';  // Add for Dashboard icon
```

## Constraints

- Do NOT add registration CTA (accessible via login page)
- Do NOT change the overall header layout/styling
- Do NOT modify the mobile menu toggle functionality
- Keep the theme toggle always visible (not auth-dependent)
- Use existing `useAuthStore` - do not create new auth logic

## Expected Output

### Modified Files
- [ ] `apps/dashboard/src/components/layout/Header.tsx`

### Changes Summary
1. Import `useAuthStore` and `useRouter`
2. Remove "Login" and "Dashboard" from center navigation
3. Add conditional rendering for right side based on `isAuthenticated`
4. Use real user data from store instead of hardcoded "Admin"
5. Add Dashboard link to user dropdown menu
6. Implement logout handler with redirect
7. Handle hydration state to prevent UI flash

## Acceptance Criteria

- [ ] Unauthenticated users see "Login" button on the right
- [ ] Authenticated users see avatar with dropdown menu
- [ ] User's actual name displayed (from profile or email fallback)
- [ ] Logout works and redirects to homepage
- [ ] No flash of wrong UI state on page load (hydration handled)
- [ ] Center navigation only shows Home and Pricing
- [ ] Dashboard accessible via user dropdown when logged in
- [ ] Type-check passes: `pnpm type-check --filter=@borg/dashboard`

## Technical Notes

### User Object Structure

```typescript
interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}
```

### Avatar Name Fallback Logic

```tsx
// Best: Full name from profile
// Fallback: Email address
// Final fallback: "Account"

const displayName = user?.profile
  ? `${user.profile.firstName} ${user.profile.lastName}`
  : user?.email || 'Account';

const shortName = user?.profile?.firstName || 'Account';
```

## Files to Modify

```
apps/dashboard/src/components/layout/Header.tsx  # UPDATE
```

## Example/Reference

### Before (Current)
- Login link in center nav ❌
- Dashboard link visible to guests ❌
- Hardcoded "Admin User" always shown ❌

### After (Expected)
- Guest: [Home] [Pricing] ... [Theme Toggle] [Login Button]
- Logged in: [Home] [Pricing] ... [Theme Toggle] [Avatar ▼ Menu]

---

## Related
- Depends on: [[prompts/13-dashboard-login-registration]]
- Blocks: None
- References: None
