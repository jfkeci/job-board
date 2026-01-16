'use client';

import { Box, Flex, IconButton, VStack, Text, Tooltip } from '@job-board/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  FiHome,
  FiBriefcase,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiHelpCircle,
} from 'react-icons/fi';

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const STORAGE_KEY = 'sidebar-collapsed';

const navItems = [
  { href: '/overview', label: 'Overview', icon: FiHome },
  { href: '/jobs', label: 'Jobs', icon: FiBriefcase },
  { href: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { href: '/billing', label: 'Billing', icon: FiCreditCard },
];

const settingsItems = [
  { href: '/settings', label: 'Settings', icon: FiSettings },
  { href: '/help', label: 'Help', icon: FiHelpCircle },
];

export function Sidebar({
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use controlled or uncontrolled collapsed state
  const collapsed = controlledCollapsed ?? internalCollapsed;

  // Load saved state from localStorage on mount
  useEffect(() => {
    if (controlledCollapsed === undefined) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setInternalCollapsed(JSON.parse(saved));
      }
    }
  }, [controlledCollapsed]);

  const toggleCollapsed = () => {
    const newValue = !collapsed;
    if (onCollapsedChange) {
      onCollapsedChange(newValue);
    } else {
      setInternalCollapsed(newValue);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <Box
      as="aside"
      position="relative"
      h="calc(100vh - 64px)"
      bg="rgba(255, 255, 255, 0.05)"
      backdropFilter="blur(10px)"
      borderRight="1px solid"
      borderColor="glass.light.border"
      transition="width 0.2s ease-in-out"
      w={collapsed ? '64px' : '240px'}
      flexShrink={0}
      _dark={{
        bg: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'glass.dark.border',
      }}
    >
      {/* Collapse Toggle Button */}
      <IconButton
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        size="sm"
        variant="ghost"
        position="absolute"
        right="-12px"
        top="20px"
        zIndex={10}
        bg="white"
        borderRadius="full"
        boxShadow="md"
        _dark={{ bg: 'neutral.800' }}
        onClick={toggleCollapsed}
      />

      <VStack align="stretch" spacing={6} py={4} h="full" overflow="hidden">
        {/* Main Navigation */}
        <Box px={collapsed ? 2 : 3}>
          {!collapsed && (
            <Text
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="neutral.500"
              mb={2}
              px={3}
            >
              Main
            </Text>
          )}
          <VStack align="stretch" spacing={1}>
            {navItems.map((item) => (
              <Tooltip
                key={item.href}
                label={item.label}
                placement="right"
                isDisabled={!collapsed}
              >
                <Link href={item.href}>
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={2.5}
                    borderRadius="lg"
                    fontWeight="medium"
                    cursor="pointer"
                    transition="all 0.2s"
                    bg={isActive(item.href) ? 'primary.50' : 'transparent'}
                    color={isActive(item.href) ? 'primary.600' : 'neutral.600'}
                    _hover={{
                      bg: isActive(item.href)
                        ? 'primary.100'
                        : 'glass.light.surfaceHover',
                    }}
                    _dark={{
                      bg: isActive(item.href)
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'transparent',
                      color: isActive(item.href)
                        ? 'primary.300'
                        : 'neutral.300',
                      _hover: {
                        bg: isActive(item.href)
                          ? 'rgba(99, 102, 241, 0.25)'
                          : 'glass.dark.surfaceHover',
                      },
                    }}
                    justifyContent={collapsed ? 'center' : 'flex-start'}
                  >
                    <Box as={item.icon} boxSize={5} flexShrink={0} />
                    {!collapsed && (
                      <Text
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {item.label}
                      </Text>
                    )}
                  </Flex>
                </Link>
              </Tooltip>
            ))}
          </VStack>
        </Box>

        {/* Spacer */}
        <Box flex={1} />

        {/* Settings Navigation */}
        <Box px={collapsed ? 2 : 3}>
          {!collapsed && (
            <Text
              fontSize="xs"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="neutral.500"
              mb={2}
              px={3}
            >
              Settings
            </Text>
          )}
          <VStack align="stretch" spacing={1}>
            {settingsItems.map((item) => (
              <Tooltip
                key={item.href}
                label={item.label}
                placement="right"
                isDisabled={!collapsed}
              >
                <Link href={item.href}>
                  <Flex
                    align="center"
                    gap={3}
                    px={3}
                    py={2.5}
                    borderRadius="lg"
                    fontWeight="medium"
                    cursor="pointer"
                    transition="all 0.2s"
                    bg={isActive(item.href) ? 'primary.50' : 'transparent'}
                    color={isActive(item.href) ? 'primary.600' : 'neutral.600'}
                    _hover={{
                      bg: isActive(item.href)
                        ? 'primary.100'
                        : 'glass.light.surfaceHover',
                    }}
                    _dark={{
                      bg: isActive(item.href)
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'transparent',
                      color: isActive(item.href)
                        ? 'primary.300'
                        : 'neutral.300',
                      _hover: {
                        bg: isActive(item.href)
                          ? 'rgba(99, 102, 241, 0.25)'
                          : 'glass.dark.surfaceHover',
                      },
                    }}
                    justifyContent={collapsed ? 'center' : 'flex-start'}
                  >
                    <Box as={item.icon} boxSize={5} flexShrink={0} />
                    {!collapsed && (
                      <Text
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {item.label}
                      </Text>
                    )}
                  </Flex>
                </Link>
              </Tooltip>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
