import type { SystemStyleObject } from '@chakra-ui/react';

/**
 * Pre-defined layer styles for common glass effects.
 * These can be applied to any Chakra component using the `layerStyle` prop.
 */
export const layerStyles: Record<string, SystemStyleObject> = {
  // Base glass panel
  glass: {
    bg: 'glass.light.surface',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid',
    borderColor: 'glass.light.border',
    borderRadius: 'xl',
    boxShadow: 'glass',
    _dark: {
      bg: 'glass.dark.surface',
      borderColor: 'glass.dark.border',
    },
  },

  // Glass with hover effect
  glassInteractive: {
    bg: 'glass.light.surface',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid',
    borderColor: 'glass.light.border',
    borderRadius: 'xl',
    boxShadow: 'glass',
    transition: 'all 0.2s ease-in-out',
    _hover: {
      bg: 'glass.light.surfaceHover',
      borderColor: 'glass.light.borderHover',
      boxShadow: 'glassHover',
      transform: 'translateY(-2px)',
    },
    _active: {
      bg: 'glass.light.surfaceActive',
      boxShadow: 'glassActive',
      transform: 'translateY(0)',
    },
    _dark: {
      bg: 'glass.dark.surface',
      borderColor: 'glass.dark.border',
      _hover: {
        bg: 'glass.dark.surfaceHover',
        borderColor: 'glass.dark.borderHover',
      },
      _active: {
        bg: 'glass.dark.surfaceActive',
      },
    },
  },

  // Glass card variant
  glassCard: {
    bg: 'glass.light.surface',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid',
    borderColor: 'glass.light.border',
    borderRadius: '2xl',
    boxShadow: 'glass',
    p: 6,
    _dark: {
      bg: 'glass.dark.surface',
      borderColor: 'glass.dark.border',
    },
  },

  // Glass panel with brand color tint
  glassPrimary: {
    bg: 'rgba(var(--primary-rgb), 0.08)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid',
    borderColor: 'rgba(var(--primary-rgb), 0.2)',
    borderRadius: 'xl',
    boxShadow: 'glass',
  },

  // Subtle glass for nested elements
  glassSubtle: {
    bg: 'glass.light.surface',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: '1px solid',
    borderColor: 'glass.light.border',
    borderRadius: 'lg',
    _dark: {
      bg: 'glass.dark.surface',
      borderColor: 'glass.dark.border',
    },
  },

  // Heavy frosted glass
  glassHeavy: {
    bg: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px) saturate(200%)',
    WebkitBackdropFilter: 'blur(20px) saturate(200%)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 'xl',
    boxShadow: 'lg',
    _dark: {
      bg: 'rgba(0, 0, 0, 0.35)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
  },

  // Modal/overlay glass
  glassModal: {
    bg: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(16px) brightness(0.95)',
    WebkitBackdropFilter: 'blur(16px) brightness(0.95)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '2xl',
    boxShadow: 'xl',
    _dark: {
      bg: 'rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  },

  // Navbar glass
  glassNavbar: {
    bg: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    borderBottom: '1px solid',
    borderColor: 'glass.light.border',
    boxShadow: 'sm',
    _dark: {
      bg: 'rgba(0, 0, 0, 0.2)',
      borderColor: 'glass.dark.border',
    },
  },

  // Sidebar glass
  glassSidebar: {
    bg: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px) saturate(150%)',
    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
    borderRight: '1px solid',
    borderColor: 'glass.light.border',
    _dark: {
      bg: 'rgba(0, 0, 0, 0.15)',
      borderColor: 'glass.dark.border',
    },
  },
};
