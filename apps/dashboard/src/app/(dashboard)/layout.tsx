'use client';

import { Box, Flex } from '@borg/ui';

import { Header, Sidebar } from '@/components/layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
