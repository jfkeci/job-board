'use client';

import { Spinner, Center } from '@borg/ui';
import { type ReactNode } from 'react';

import { useAuthStore } from '@/store/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Show loading spinner while hydrating from localStorage
  if (!isHydrated) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  return <>{children}</>;
}

// Hook to check if user is on client and hydrated
export function useIsHydrated() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  return isHydrated;
}
