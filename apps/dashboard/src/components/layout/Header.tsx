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
import { FiMenu, FiSun, FiMoon, FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMobileMenuToggle, showMenuButton = false }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();

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
          <Link href="/dashboard/overview">
            <GlassButton variant="ghost" size="sm">
              Dashboard
            </GlassButton>
          </Link>
        </HStack>

        {/* Right side */}
        <HStack spacing={2}>
          {/* Theme Toggle */}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            variant="ghost"
            onClick={toggleColorMode}
          />

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={GlassButton}
              variant="ghost"
              size="sm"
              rightIcon={<FiChevronDown />}
            >
              <HStack spacing={2}>
                <Avatar size="sm" name="Admin User" bg="primary.500" />
                <Text display={{ base: 'none', md: 'block' }}>Admin</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}
