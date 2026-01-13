import { inputAnatomy, selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyleConfig } from '@chakra-ui/react';

// Input
const inputHelpers = createMultiStyleConfigHelpers(inputAnatomy.keys);

export const Input = inputHelpers.defineMultiStyleConfig({
  variants: {
    // Glass input variant
    glass: {
      field: {
        bg: 'glass.light.surface',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'glass.light.border',
        borderRadius: 'lg',
        color: 'neutral.800',
        transition: 'all 0.2s ease-in-out',
        _hover: {
          borderColor: 'glass.light.borderHover',
        },
        _focus: {
          borderColor: 'primary.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
          bg: 'glass.light.surfaceHover',
        },
        _placeholder: {
          color: 'neutral.400',
        },
        _dark: {
          bg: 'glass.dark.surface',
          borderColor: 'glass.dark.border',
          color: 'neutral.100',
          _hover: {
            borderColor: 'glass.dark.borderHover',
          },
          _focus: {
            bg: 'glass.dark.surfaceHover',
          },
          _placeholder: {
            color: 'neutral.500',
          },
        },
      },
    },

    // Filled glass variant
    glassFilled: {
      field: {
        bg: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid transparent',
        borderRadius: 'lg',
        color: 'neutral.800',
        transition: 'all 0.2s ease-in-out',
        _hover: {
          bg: 'rgba(255, 255, 255, 0.2)',
        },
        _focus: {
          bg: 'rgba(255, 255, 255, 0.2)',
          borderColor: 'primary.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
        },
        _placeholder: {
          color: 'neutral.400',
        },
        _dark: {
          bg: 'rgba(0, 0, 0, 0.25)',
          color: 'neutral.100',
          _hover: {
            bg: 'rgba(0, 0, 0, 0.3)',
          },
          _focus: {
            bg: 'rgba(0, 0, 0, 0.3)',
          },
          _placeholder: {
            color: 'neutral.500',
          },
        },
      },
    },

    // Standard outline (Chakra default, but with primary color focus)
    outline: {
      field: {
        borderColor: 'neutral.200',
        _hover: {
          borderColor: 'neutral.300',
        },
        _focus: {
          borderColor: 'primary.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
        },
        _dark: {
          borderColor: 'neutral.600',
          _hover: {
            borderColor: 'neutral.500',
          },
        },
      },
    },
  },
  defaultProps: {
    variant: 'glass',
  },
});

// Textarea (single-part component)
export const Textarea = defineStyleConfig({
  variants: {
    glass: {
      bg: 'glass.light.surface',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid',
      borderColor: 'glass.light.border',
      borderRadius: 'lg',
      color: 'neutral.800',
      transition: 'all 0.2s ease-in-out',
      _hover: {
        borderColor: 'glass.light.borderHover',
      },
      _focus: {
        borderColor: 'primary.500',
        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
        bg: 'glass.light.surfaceHover',
      },
      _placeholder: {
        color: 'neutral.400',
      },
      _dark: {
        bg: 'glass.dark.surface',
        borderColor: 'glass.dark.border',
        color: 'neutral.100',
        _hover: {
          borderColor: 'glass.dark.borderHover',
        },
        _focus: {
          bg: 'glass.dark.surfaceHover',
        },
        _placeholder: {
          color: 'neutral.500',
        },
      },
    },
  },
  defaultProps: {
    variant: 'glass',
  },
});

// Select
const selectHelpers = createMultiStyleConfigHelpers(selectAnatomy.keys);

export const Select = selectHelpers.defineMultiStyleConfig({
  variants: {
    glass: {
      field: {
        bg: 'glass.light.surface',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'glass.light.border',
        borderRadius: 'lg',
        color: 'neutral.800',
        transition: 'all 0.2s ease-in-out',
        _hover: {
          borderColor: 'glass.light.borderHover',
        },
        _focus: {
          borderColor: 'primary.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
        },
        _dark: {
          bg: 'glass.dark.surface',
          borderColor: 'glass.dark.border',
          color: 'neutral.100',
          _hover: {
            borderColor: 'glass.dark.borderHover',
          },
        },
      },
    },
  },
  defaultProps: {
    variant: 'glass',
  },
});
