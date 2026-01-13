import { modalAnatomy, drawerAnatomy, popoverAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyleConfig } from '@chakra-ui/react';

// Modal
const modalHelpers = createMultiStyleConfigHelpers(modalAnatomy.keys);

export const Modal = modalHelpers.defineMultiStyleConfig({
  baseStyle: {
    overlay: {
      bg: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    },
    dialogContainer: {
      p: 4,
    },
    dialog: {
      borderRadius: '2xl',
      overflow: 'hidden',
      bg: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: 'xl',
      _dark: {
        bg: 'rgba(0, 0, 0, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    header: {
      pt: 6,
      px: 6,
      pb: 0,
      fontSize: 'lg',
      fontWeight: 'semibold',
    },
    body: {
      p: 6,
    },
    footer: {
      pt: 0,
      px: 6,
      pb: 6,
    },
    closeButton: {
      top: 4,
      right: 4,
      borderRadius: 'lg',
      _hover: {
        bg: 'glass.light.surfaceHover',
        _dark: {
          bg: 'glass.dark.surfaceHover',
        },
      },
    },
  },
  sizes: {
    xs: {
      dialog: { maxW: 'xs' },
    },
    sm: {
      dialog: { maxW: 'sm' },
    },
    md: {
      dialog: { maxW: 'md' },
    },
    lg: {
      dialog: { maxW: 'lg' },
    },
    xl: {
      dialog: { maxW: 'xl' },
    },
    '2xl': {
      dialog: { maxW: '2xl' },
    },
    '3xl': {
      dialog: { maxW: '3xl' },
    },
    '4xl': {
      dialog: { maxW: '4xl' },
    },
    '5xl': {
      dialog: { maxW: '5xl' },
    },
    '6xl': {
      dialog: { maxW: '6xl' },
    },
    full: {
      dialog: { maxW: '100vw', minH: '100vh', my: 0, borderRadius: 0 },
    },
  },
  defaultProps: {
    size: 'md',
  },
});

// Drawer
const drawerHelpers = createMultiStyleConfigHelpers(drawerAnatomy.keys);

export const Drawer = drawerHelpers.defineMultiStyleConfig({
  baseStyle: {
    overlay: {
      bg: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    },
    dialog: {
      bg: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      borderLeft: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      _dark: {
        bg: 'rgba(0, 0, 0, 0.25)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    header: {
      pt: 6,
      px: 6,
      pb: 0,
      fontSize: 'lg',
      fontWeight: 'semibold',
    },
    body: {
      p: 6,
    },
    footer: {
      pt: 0,
      px: 6,
      pb: 6,
    },
    closeButton: {
      top: 4,
      right: 4,
      borderRadius: 'lg',
      _hover: {
        bg: 'glass.light.surfaceHover',
        _dark: {
          bg: 'glass.dark.surfaceHover',
        },
      },
    },
  },
});

// Popover
const popoverHelpers = createMultiStyleConfigHelpers(popoverAnatomy.keys);

export const Popover = popoverHelpers.defineMultiStyleConfig({
  baseStyle: {
    content: {
      bg: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 'xl',
      boxShadow: 'lg',
      _dark: {
        bg: 'rgba(0, 0, 0, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    header: {
      fontWeight: 'semibold',
      borderBottomWidth: 0,
    },
    body: {
      py: 3,
    },
    arrow: {
      bg: 'rgba(255, 255, 255, 0.15)',
      _dark: {
        bg: 'rgba(0, 0, 0, 0.3)',
      },
    },
  },
});

// Tooltip (single part component)
export const Tooltip = defineStyleConfig({
  baseStyle: {
    bg: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: 'white',
    borderRadius: 'lg',
    px: 3,
    py: 2,
    fontSize: 'sm',
    fontWeight: 'medium',
    boxShadow: 'md',
    _dark: {
      bg: 'rgba(255, 255, 255, 0.9)',
      color: 'neutral.900',
    },
  },
});
