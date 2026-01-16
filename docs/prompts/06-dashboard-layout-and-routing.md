---
title: Dashboard App Layout and Routing Setup
id: 06-dashboard-layout-and-routing
created: 2026-01-13
updated: 2026-01-13
status: ready
executed_date:
execution_result: pending
deprecated: false
deprecated_reason:
target: frontend
complexity: moderate
tags:
  - dashboard
  - layout
  - routing
  - chakra-ui
  - glassmorphism
dependencies:
  - 04-chakra-ui-design-system
blocks: []
related_specs: []
related_planning: []
notes: Integrate @job-board/ui design system into dashboard app with glassmorphism layout and basic routing
---

# 06 - Dashboard App Layout and Routing Setup

**Date**: 2026-01-13
**Target**: Frontend
**Related Spec**: N/A

---

## Context

The `@job-board/dashboard` app currently uses Tailwind CSS with a basic layout. The `@job-board/ui` glassmorphism design system package has been created and needs to be integrated into the dashboard app. The app needs a proper layout structure with header, footer, and collapsible sidebar, along with routing for multiple views.

## Goal

Integrate the `@job-board/ui` design system into the dashboard app and establish:
1. A consistent layout structure with glassmorphism styling
2. Collapsible sidebar navigation
3. Header and footer components
4. Next.js App Router routing for multiple pages
5. Homepage, Pricing, and Login views

## Current State

- Dashboard app exists at `apps/dashboard/`
- Uses Next.js 15 with App Router
- Currently styled with Tailwind CSS (to be replaced with Chakra UI)
- Basic layout implemented in `page.tsx`
- No proper routing structure
- `@job-board/ui` package available with glassmorphism components

## Requirements

### 1. Install and Configure @job-board/ui

- Add `@job-board/ui` and Chakra UI dependencies to dashboard app
- Remove/minimize Tailwind CSS usage (keep for utility classes if needed)
- Configure `GlassThemeProvider` in root layout
- Set appropriate brand colors for dashboard (e.g., `brandPresets.indigo` or custom)

### 2. Layout Structure

Create a responsive layout with the following structure:

```
┌─────────────────────────────────────────────────────┐
│                     Header                          │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │              Main Content                │
│ (collap- │                                          │
│  sible)  │                                          │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│                     Footer                          │
└─────────────────────────────────────────────────────┘
```

**Header Component** (`components/layout/Header.tsx`):
- App logo/branding
- Navigation links (Home, Pricing)
- User menu (avatar, dropdown)
- Theme toggle (light/dark mode)
- Mobile menu toggle

**Sidebar Component** (`components/layout/Sidebar.tsx`):
- Collapsible (toggle button to expand/collapse)
- Navigation items with icons
- Section grouping
- Active state indication
- Persist collapse state (localStorage)

**Footer Component** (`components/layout/Footer.tsx`):
- Copyright information
- Links (Privacy, Terms, Contact)
- Minimal glassmorphism styling

**MainLayout Component** (`components/layout/MainLayout.tsx`):
- Combines Header, Sidebar, Footer
- Manages sidebar collapse state
- Responsive behavior (sidebar hidden on mobile, shown in drawer)

### 3. Routing Structure

Set up Next.js App Router with the following routes:

```
apps/dashboard/src/app/
├── layout.tsx              # Root layout with GlassThemeProvider
├── page.tsx                # Homepage (/)
├── pricing/
│   └── page.tsx            # Pricing page (/pricing)
├── login/
│   └── page.tsx            # Login page (/login)
└── (dashboard)/            # Route group for authenticated pages
    ├── layout.tsx          # Dashboard layout with sidebar
    ├── page.tsx            # Dashboard home (/dashboard) - optional redirect
    ├── overview/
    │   └── page.tsx        # Overview page
    └── settings/
        └── page.tsx        # Settings page
```

**Public Pages** (no sidebar):
- `/` - Homepage (landing page)
- `/pricing` - Pricing page
- `/login` - Login page

**Dashboard Pages** (with sidebar):
- `/dashboard` or route group pages

### 4. Page Views

**Homepage (`/`)**:
- Hero section with glassmorphism cards
- Feature highlights
- Call-to-action buttons
- Responsive design

**Pricing Page (`/pricing`)**:
- Pricing tiers in glass cards
- Feature comparison
- CTA buttons for each tier

**Login Page (`/login`)**:
- Centered glass card
- Email/password form inputs
- Social login buttons (placeholder)
- Link to signup/forgot password

### 5. Shared Components

Create reusable components:

- `components/layout/Header.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/Footer.tsx`
- `components/layout/MainLayout.tsx`
- `components/layout/MobileNav.tsx` (for mobile drawer)

### 6. State Management

- Sidebar collapse state (React useState + localStorage)
- Color mode (Chakra's useColorMode)
- Mobile menu open state (useDisclosure)

## Constraints

- Must use `@job-board/ui` components (GlassCard, GlassButton, GlassNavbar, etc.)
- Must maintain glassmorphism aesthetic
- Must be responsive (mobile-first)
- Must support dark mode
- Keep Tailwind CSS only for utility classes if absolutely needed
- Use Next.js App Router conventions
- No authentication logic yet (just UI)

## Expected Output

- [ ] `@job-board/ui` and Chakra dependencies added to `package.json`
- [ ] Root layout updated with `GlassThemeProvider`
- [ ] Layout components created (`Header`, `Sidebar`, `Footer`, `MainLayout`)
- [ ] Homepage view (`/`)
- [ ] Pricing page view (`/pricing`)
- [ ] Login page view (`/login`)
- [ ] Routing structure established
- [ ] Dark mode toggle working
- [ ] Collapsible sidebar working
- [ ] Responsive mobile navigation

## Acceptance Criteria

- [ ] Dashboard app runs without errors (`pnpm dev`)
- [ ] All pages render with glassmorphism styling
- [ ] Sidebar collapses and expands correctly
- [ ] Collapse state persists across page refreshes
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive (sidebar becomes drawer on mobile)
- [ ] Navigation between pages works
- [ ] Components use `@job-board/ui` exports

## Technical Notes

### Provider Setup

```tsx
// app/layout.tsx
import { GlassThemeProvider, brandPresets } from '@job-board/ui';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GlassThemeProvider
          brandConfig={brandPresets.indigo}
          useSystemColorMode
        >
          {children}
        </GlassThemeProvider>
      </body>
    </html>
  );
}
```

### Sidebar Collapse Pattern

```tsx
// components/layout/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { GlassSidebar, GlassSidebarItem, IconButton } from '@job-board/ui';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setCollapsed(JSON.parse(saved));
  }, []);

  const toggle = () => {
    setCollapsed(prev => {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <GlassSidebar collapsed={collapsed} collapsible>
      {/* ... */}
    </GlassSidebar>
  );
}
```

### Chakra UI with Next.js App Router

Ensure all client components that use Chakra hooks have `'use client'` directive.

## Files to Create/Modify

```
apps/dashboard/
├── package.json                          # Add @job-board/ui dependencies
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Update with GlassThemeProvider
│   │   ├── page.tsx                      # Homepage
│   │   ├── pricing/
│   │   │   └── page.tsx                  # Pricing page
│   │   ├── login/
│   │   │   └── page.tsx                  # Login page
│   │   └── (dashboard)/
│   │       ├── layout.tsx                # Dashboard layout with sidebar
│   │       └── overview/
│   │           └── page.tsx              # Dashboard overview
│   └── components/
│       └── layout/
│           ├── Header.tsx
│           ├── Sidebar.tsx
│           ├── Footer.tsx
│           ├── MainLayout.tsx
│           ├── MobileNav.tsx
│           └── index.ts
```

## Example/Reference

### Homepage Hero Section

```tsx
import { Box, Container, Heading, Text, HStack } from '@job-board/ui';
import { GlassCard, GlassButton } from '@job-board/ui';

export default function HomePage() {
  return (
    <Box minH="100vh" bg="neutral.50" _dark={{ bg: 'neutral.950' }}>
      <Container maxW="container.xl" py={20}>
        <GlassCard p={12} textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome to job-board Dashboard
          </Heading>
          <Text fontSize="xl" color="neutral.600" mb={8}>
            Manage your business with our powerful B2B platform
          </Text>
          <HStack justify="center" spacing={4}>
            <GlassButton size="lg">Get Started</GlassButton>
            <GlassButton size="lg" variant="outline">Learn More</GlassButton>
          </HStack>
        </GlassCard>
      </Container>
    </Box>
  );
}
```

### Pricing Card

```tsx
<GlassCard>
  <Heading size="md">Pro Plan</Heading>
  <Text fontSize="3xl" fontWeight="bold">$49/mo</Text>
  <VStack align="start" spacing={2}>
    <Text>✓ Unlimited users</Text>
    <Text>✓ Advanced analytics</Text>
    <Text>✓ Priority support</Text>
  </VStack>
  <GlassButton w="full">Choose Plan</GlassButton>
</GlassCard>
```

---

## Related

- Depends on: [[prompts/04-chakra-ui-design-system]]
- Blocks: Authentication implementation, Dashboard features
- References: `@job-board/ui` README, Next.js App Router documentation
