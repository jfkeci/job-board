'use client';

import { Box, useDisclosure } from '@job-board/ui';

import { Footer } from './Footer';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="neutral.50" _dark={{ bg: 'neutral.950' }}>
      {/* Header */}
      <Header onMobileMenuToggle={onOpen} showMenuButton />

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isOpen} onClose={onClose} />

      {/* Main Content */}
      <Box as="main" minH="calc(100vh - 64px - 80px)">
        {children}
      </Box>

      {/* Footer */}
      {showFooter && <Footer />}
    </Box>
  );
}
