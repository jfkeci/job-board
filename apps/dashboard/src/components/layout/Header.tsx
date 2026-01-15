'use client';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Text,
  useColorMode,
  GlassButton,
} from '@borg/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiGrid,
} from 'react-icons/fi';

import { useAuthStore } from '@/store/auth.store';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMobileMenuToggle, showMenuButton = false }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const displayName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email || 'Account';

  const shortName = user?.profile?.firstName || 'Account';

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg="rgba(255, 255, 255, 0.8)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="glass.light.border"
      _dark={{
        bg: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'glass.dark.border',
      }}
    >
      <Flex h="64px" px={6} align="center" justify="space-between">
        {/* Left side */}
        <HStack spacing={4}>
          {showMenuButton && (
            <IconButton
              aria-label="Toggle menu"
              icon={<FiMenu />}
              variant="ghost"
              onClick={onMobileMenuToggle}
              display={{ base: 'flex', lg: 'none' }}
            />
          )}
          <Link href="/">
            <HStack spacing={2}>
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
              <Text fontSize="xl" fontWeight="bold" display={{ base: 'none', sm: 'block' }}>
                Borg Dashboard
              </Text>
            </HStack>
          </Link>
        </HStack>

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
                <Menu>
                  <MenuButton
                    as={GlassButton}
                    variant="ghost"
                    size="sm"
                    rightIcon={<FiChevronDown />}
                  >
                    <HStack spacing={2}>
                      <Avatar size="sm" name={displayName} bg="primary.500" />
                      <Text display={{ base: 'none', md: 'block' }}>{shortName}</Text>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <Link href="/dashboard/overview">
                      <MenuItem icon={<FiGrid />}>Dashboard</MenuItem>
                    </Link>
                    <Link href="/profile">
                      <MenuItem icon={<FiUser />}>Profile</MenuItem>
                    </Link>
                    <Link href="/settings">
                      <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                    </Link>
                    <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Link href="/login">
                  <GlassButton size="sm">Login</GlassButton>
                </Link>
              )}
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
