import { defineStyleConfig } from '@chakra-ui/react';

export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'lg',
    transition: 'all 0.2s ease-in-out',
  },
  variants: {
    // Solid glass button (default)
    solid: {
      bg: 'primary.500',
      color: 'white',
      _hover: {
        bg: 'primary.600',
        transform: 'translateY(-1px)',
        boxShadow: 'md',
        _disabled: {
          bg: 'primary.500',
          transform: 'none',
        },
      },
      _active: {
        bg: 'primary.700',
        transform: 'translateY(0)',
      },
    },

    // Glass button variant
    glass: {
      bg: 'glass.light.surface',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid',
      borderColor: 'glass.light.border',
      color: 'neutral.800',
      _hover: {
        bg: 'glass.light.surfaceHover',
        borderColor: 'glass.light.borderHover',
        transform: 'translateY(-1px)',
        boxShadow: 'glass',
      },
      _active: {
        bg: 'glass.light.surfaceActive',
        transform: 'translateY(0)',
      },
      _dark: {
        bg: 'glass.dark.surface',
        borderColor: 'glass.dark.border',
        color: 'neutral.100',
        _hover: {
          bg: 'glass.dark.surfaceHover',
          borderColor: 'glass.dark.borderHover',
        },
        _active: {
          bg: 'glass.dark.surfaceActive',
        },
      },
    },

    // Glass button with primary color tint
    glassPrimary: {
      bg: 'rgba(var(--primary-rgb), 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid',
      borderColor: 'rgba(var(--primary-rgb), 0.2)',
      color: 'primary.600',
      _hover: {
        bg: 'rgba(var(--primary-rgb), 0.15)',
        borderColor: 'rgba(var(--primary-rgb), 0.3)',
        transform: 'translateY(-1px)',
        boxShadow: 'glass',
      },
      _active: {
        bg: 'rgba(var(--primary-rgb), 0.2)',
        transform: 'translateY(0)',
      },
      _dark: {
        color: 'primary.300',
      },
    },

    // Outline variant
    outline: {
      bg: 'transparent',
      border: '2px solid',
      borderColor: 'primary.500',
      color: 'primary.500',
      _hover: {
        bg: 'primary.50',
        transform: 'translateY(-1px)',
        _dark: {
          bg: 'rgba(var(--primary-rgb), 0.1)',
        },
      },
      _active: {
        bg: 'primary.100',
        transform: 'translateY(0)',
        _dark: {
          bg: 'rgba(var(--primary-rgb), 0.15)',
        },
      },
    },

    // Ghost variant
    ghost: {
      bg: 'transparent',
      color: 'primary.500',
      _hover: {
        bg: 'primary.50',
        _dark: {
          bg: 'rgba(var(--primary-rgb), 0.1)',
        },
      },
      _active: {
        bg: 'primary.100',
        _dark: {
          bg: 'rgba(var(--primary-rgb), 0.15)',
        },
      },
    },

    // Link variant
    link: {
      color: 'primary.500',
      _hover: {
        textDecoration: 'underline',
        _disabled: {
          textDecoration: 'none',
        },
      },
    },
  },
  sizes: {
    xs: {
      h: 7,
      minW: 7,
      fontSize: 'xs',
      px: 2,
    },
    sm: {
      h: 8,
      minW: 8,
      fontSize: 'sm',
      px: 3,
    },
    md: {
      h: 10,
      minW: 10,
      fontSize: 'md',
      px: 4,
    },
    lg: {
      h: 12,
      minW: 12,
      fontSize: 'lg',
      px: 6,
    },
    xl: {
      h: 14,
      minW: 14,
      fontSize: 'xl',
      px: 8,
    },
  },
  defaultProps: {
    variant: 'solid',
    size: 'md',
    colorScheme: 'primary',
  },
});
