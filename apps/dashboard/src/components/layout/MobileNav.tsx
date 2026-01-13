'use client';

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Flex,
  Box,
  Text,
  Divider,
} from '@borg/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiCreditCard,
  FiHelpCircle,
  FiDollarSign,
  FiLogIn,
} from 'react-icons/fi';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const publicNavItems = [
  { href: '/', label: 'Home', icon: FiHome },
  { href: '/pricing', label: 'Pricing', icon: FiDollarSign },
  { href: '/login', label: 'Login', icon: FiLogIn },
];

const dashboardNavItems = [
  { href: '/dashboard/overview', label: 'Overview', icon: FiHome },
  { href: '/dashboard/analytics', label: 'Analytics', icon: FiBarChart2 },
  { href: '/dashboard/users', label: 'Users', icon: FiUsers },
  { href: '/dashboard/billing', label: 'Billing', icon: FiCreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: FiSettings },
  { href: '/dashboard/help', label: 'Help', icon: FiHelpCircle },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
    <Link href={href} onClick={onClose}>
      <Flex
        align="center"
        gap={3}
        px={4}
        py={3}
        borderRadius="lg"
        fontWeight="medium"
        cursor="pointer"
        transition="all 0.2s"
        bg={isActive(href) ? 'primary.50' : 'transparent'}
        color={isActive(href) ? 'primary.600' : 'neutral.600'}
        _hover={{
          bg: isActive(href) ? 'primary.100' : 'glass.light.surfaceHover',
        }}
        _dark={{
          bg: isActive(href) ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
          color: isActive(href) ? 'primary.300' : 'neutral.300',
          _hover: {
            bg: isActive(href) ? 'rgba(99, 102, 241, 0.25)' : 'glass.dark.surfaceHover',
          },
        }}
      >
        <Box as={Icon} boxSize={5} />
        <Text>{label}</Text>
      </Flex>
    </Link>
  );

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(20px)"
        _dark={{
          bg: 'rgba(23, 23, 23, 0.95)',
        }}
      >
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor="glass.light.border">
          <Flex align="center" gap={2}>
            <Box
              w={8}
              h={8}
              bg="primary.500"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
            >
              B
            </Box>
            <Text fontSize="lg" fontWeight="bold">
              Borg Dashboard
            </Text>
          </Flex>
        </DrawerHeader>

        <DrawerBody py={4}>
          <VStack align="stretch" spacing={6}>
            {/* Public Navigation */}
            <Box>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wider"
                color="neutral.500"
                mb={2}
                px={4}
              >
                Navigation
              </Text>
              <VStack align="stretch" spacing={1}>
                {publicNavItems.map((item) => (
                  <NavItem key={item.href} {...item} />
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Dashboard Navigation */}
            <Box>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                textTransform="uppercase"
                letterSpacing="wider"
                color="neutral.500"
                mb={2}
                px={4}
              >
                Dashboard
              </Text>
              <VStack align="stretch" spacing={1}>
                {dashboardNavItems.map((item) => (
                  <NavItem key={item.href} {...item} />
                ))}
              </VStack>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
