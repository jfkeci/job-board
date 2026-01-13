'use client';

import { Box, Flex, VStack, forwardRef, type BoxProps, type FlexProps } from '@chakra-ui/react';

export interface GlassSidebarProps extends FlexProps {
  /** Width of the sidebar */
  width?: string | number;
  /** Whether the sidebar is collapsible */
  collapsible?: boolean;
  /** Whether the sidebar is currently collapsed (controlled) */
  collapsed?: boolean;
  /** Collapsed width (only applies when collapsible) */
  collapsedWidth?: string | number;
}

/**
 * GlassSidebar is a sidebar component with glassmorphism styling.
 *
 * @example
 * ```tsx
 * <Flex>
 *   <GlassSidebar width="240px">
 *     <GlassSidebarItem icon={<HomeIcon />}>Home</GlassSidebarItem>
 *     <GlassSidebarItem icon={<SettingsIcon />}>Settings</GlassSidebarItem>
 *   </GlassSidebar>
 *   <Box flex={1}>Main content</Box>
 * </Flex>
 * ```
 */
export const GlassSidebar = forwardRef<GlassSidebarProps, 'aside'>(
  (
    {
      width = '240px',
      collapsible = false,
      collapsed = false,
      collapsedWidth = '64px',
      children,
      ...props
    },
    ref
  ) => {
    const sidebarWidth = collapsible && collapsed ? collapsedWidth : width;

    return (
      <Flex
        ref={ref}
        as="aside"
        layerStyle="glassSidebar"
        direction="column"
        w={sidebarWidth}
        minH="100vh"
        py={4}
        transition="width 0.2s ease-in-out"
        overflow="hidden"
        {...props}
      >
        <VStack align="stretch" spacing={1} px={2}>
          {children}
        </VStack>
      </Flex>
    );
  }
);

GlassSidebar.displayName = 'GlassSidebar';

export interface GlassSidebarItemProps extends BoxProps {
  /** Icon to display before the label */
  icon?: React.ReactNode;
  /** Whether this item is currently active */
  active?: boolean;
  /** Whether to show only the icon (for collapsed sidebar) */
  iconOnly?: boolean;
}

/**
 * GlassSidebarItem is a navigation item for use within GlassSidebar.
 *
 * @example
 * ```tsx
 * <GlassSidebar>
 *   <GlassSidebarItem icon={<HomeIcon />} active>
 *     Home
 *   </GlassSidebarItem>
 *   <GlassSidebarItem icon={<UsersIcon />}>
 *     Users
 *   </GlassSidebarItem>
 * </GlassSidebar>
 * ```
 */
export const GlassSidebarItem = forwardRef<GlassSidebarItemProps, 'div'>(
  ({ icon, active = false, iconOnly = false, children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        align="center"
        gap={3}
        px={3}
        py={2.5}
        borderRadius="lg"
        fontWeight="medium"
        cursor="pointer"
        transition="all 0.2s ease-in-out"
        bg={active ? 'glass.light.surfaceActive' : 'transparent'}
        color={active ? 'primary.600' : 'inherit'}
        _hover={{
          bg: 'glass.light.surfaceHover',
        }}
        _dark={{
          bg: active ? 'glass.dark.surfaceActive' : 'transparent',
          color: active ? 'primary.300' : 'inherit',
          _hover: {
            bg: 'glass.dark.surfaceHover',
          },
        }}
        {...props}
      >
        {icon && (
          <Box flexShrink={0} w={5} h={5}>
            {icon}
          </Box>
        )}
        {!iconOnly && (
          <Box flex={1} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {children}
          </Box>
        )}
      </Flex>
    );
  }
);

GlassSidebarItem.displayName = 'GlassSidebarItem';

export interface GlassSidebarSectionProps extends BoxProps {
  /** Section title */
  title?: string;
}

/**
 * GlassSidebarSection groups sidebar items with an optional title.
 *
 * @example
 * ```tsx
 * <GlassSidebar>
 *   <GlassSidebarSection title="Main">
 *     <GlassSidebarItem>Dashboard</GlassSidebarItem>
 *   </GlassSidebarSection>
 *   <GlassSidebarSection title="Settings">
 *     <GlassSidebarItem>Profile</GlassSidebarItem>
 *   </GlassSidebarSection>
 * </GlassSidebar>
 * ```
 */
export const GlassSidebarSection = forwardRef<GlassSidebarSectionProps, 'div'>(
  ({ title, children, ...props }, ref) => {
    return (
      <Box ref={ref} {...props}>
        {title && (
          <Box
            px={3}
            py={2}
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            color="neutral.500"
          >
            {title}
          </Box>
        )}
        <VStack align="stretch" spacing={1}>
          {children}
        </VStack>
      </Box>
    );
  }
);

GlassSidebarSection.displayName = 'GlassSidebarSection';
