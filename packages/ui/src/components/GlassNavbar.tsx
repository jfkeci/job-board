'use client';

import { Box, Flex, forwardRef, type BoxProps, type FlexProps } from '@chakra-ui/react';

export interface GlassNavbarProps extends FlexProps {
  /** Make the navbar sticky at the top */
  sticky?: boolean;
  /** Height of the navbar */
  height?: string | number;
}

/**
 * GlassNavbar is a navigation bar component with glassmorphism styling.
 *
 * @example
 * ```tsx
 * <GlassNavbar sticky>
 *   <Box>Logo</Box>
 *   <HStack spacing={4}>
 *     <Link>Home</Link>
 *     <Link>About</Link>
 *   </HStack>
 *   <GlassButton size="sm">Sign In</GlassButton>
 * </GlassNavbar>
 * ```
 */
export const GlassNavbar = forwardRef<GlassNavbarProps, 'nav'>(
  ({ sticky = false, height = '64px', children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        as="nav"
        layerStyle="glassNavbar"
        align="center"
        justify="space-between"
        px={6}
        h={height}
        position={sticky ? 'sticky' : 'relative'}
        top={sticky ? 0 : undefined}
        zIndex={sticky ? 'sticky' : undefined}
        {...props}
      >
        {children}
      </Flex>
    );
  }
);

GlassNavbar.displayName = 'GlassNavbar';

export interface GlassNavbarItemProps extends BoxProps {
  /** Whether this item is currently active */
  active?: boolean;
}

/**
 * GlassNavbarItem is a navigation item for use within GlassNavbar.
 *
 * @example
 * ```tsx
 * <GlassNavbar>
 *   <GlassNavbarItem active>Home</GlassNavbarItem>
 *   <GlassNavbarItem>About</GlassNavbarItem>
 * </GlassNavbar>
 * ```
 */
export const GlassNavbarItem = forwardRef<GlassNavbarItemProps, 'div'>(
  ({ active = false, children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        px={3}
        py={2}
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
        {children}
      </Box>
    );
  }
);

GlassNavbarItem.displayName = 'GlassNavbarItem';
