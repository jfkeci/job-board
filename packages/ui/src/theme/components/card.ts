import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys);

export const Card = defineMultiStyleConfig({
  baseStyle: {
    container: {
      borderRadius: '2xl',
      overflow: 'hidden',
    },
    header: {
      pb: 2,
    },
    body: {
      py: 2,
    },
    footer: {
      pt: 2,
    },
  },
  variants: {
    // Glass card variant (default)
    glass: {
      container: {
        bg: 'glass.light.surface',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid',
        borderColor: 'glass.light.border',
        boxShadow: 'glass',
        _dark: {
          bg: 'glass.dark.surface',
          borderColor: 'glass.dark.border',
        },
      },
    },

    // Interactive glass card with hover effects
    glassInteractive: {
      container: {
        bg: 'glass.light.surface',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid',
        borderColor: 'glass.light.border',
        boxShadow: 'glass',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
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
    },

    // Glass card with primary color tint
    glassPrimary: {
      container: {
        bg: 'rgba(var(--primary-rgb), 0.08)',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid',
        borderColor: 'rgba(var(--primary-rgb), 0.2)',
        boxShadow: 'glass',
      },
    },

    // Elevated glass card
    glassElevated: {
      container: {
        bg: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(16px) saturate(200%)',
        WebkitBackdropFilter: 'blur(16px) saturate(200%)',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: 'lg',
        _dark: {
          bg: 'rgba(0, 0, 0, 0.3)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        },
      },
    },

    // Outline card (no glass effect)
    outline: {
      container: {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'neutral.200',
        _dark: {
          borderColor: 'neutral.700',
        },
      },
    },

    // Filled card (solid background)
    filled: {
      container: {
        bg: 'neutral.50',
        _dark: {
          bg: 'neutral.800',
        },
      },
    },
  },
  sizes: {
    sm: {
      container: {
        p: 4,
      },
    },
    md: {
      container: {
        p: 6,
      },
    },
    lg: {
      container: {
        p: 8,
      },
    },
  },
  defaultProps: {
    variant: 'glass',
    size: 'md',
  },
});
