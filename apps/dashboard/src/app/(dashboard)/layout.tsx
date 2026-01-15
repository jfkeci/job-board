'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, Center, Spinner } from '@borg/ui';

import { Header, Sidebar } from '@/components/layout';
import { useAuthStore } from '@/store/auth.store';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Show loading while checking auth
  if (!isHydrated) {
    return (
      <Center minH="100vh" bg="neutral.50" _dark={{ bg: 'neutral.950' }}>
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <Center minH="100vh" bg="neutral.50" _dark={{ bg: 'neutral.950' }}>
        <Spinner size="xl" color="primary.500" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="neutral.50" _dark={{ bg: 'neutral.950' }}>
      {/* Header */}
      <Header />

      {/* Main Content Area with Sidebar */}
      <Flex>
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <Box
          display={{ base: 'none', lg: 'block' }}
          position="sticky"
          top="64px"
          h="calc(100vh - 64px)"
        >
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box
          as="main"
          flex="1"
          minH="calc(100vh - 64px)"
          p={{ base: 4, md: 6, lg: 8 }}
          overflow="auto"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
}
