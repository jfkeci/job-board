'use client';

import { Center, Spinner } from '@job-board/ui';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth.store';

interface OrganizationGuardProps {
  children: React.ReactNode;
}

// Pages that don't require an organization
const EXEMPT_PATHS = ['/organizations/create'];

export function OrganizationGuard({ children }: OrganizationGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for hydration
    if (!isHydrated) return;

    // Check if current path is exempt
    const isExempt = EXEMPT_PATHS.some((path) => pathname === path);
    if (isExempt) return;

    // If user has no organization, redirect to create one
    if (user && !user.organizationId) {
      router.push('/organizations/create');
    }
  }, [isHydrated, user, pathname, router]);

  // Show loading while checking
  if (!isHydrated) {
    return (
      <Center minH="calc(100vh - 64px)">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  // If user has no organization and not on exempt path, show loading (will redirect)
  const isExempt = EXEMPT_PATHS.some((path) => pathname === path);
  if (user && !user.organizationId && !isExempt) {
    return (
      <Center minH="calc(100vh - 64px)">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  return <>{children}</>;
}
