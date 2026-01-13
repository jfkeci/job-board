import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import type { BrandConfig, ColorScale } from '../brand/types';
import { generateColorScale, hexToRgba } from '../utils/colorScale';
import { colors } from './foundations/colors';
import {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
} from './foundations/typography';
import { shadows } from './foundations/shadows';
import { blur } from './foundations/blur';
import { layerStyles } from './layerStyles';
import { Button } from './components/button';
import { Card } from './components/card';
import { Input, Textarea, Select } from './components/input';
import { Modal, Drawer, Popover, Tooltip } from './components/modal';

export interface GlassThemeConfig {
  brand?: BrandConfig;
  initialColorMode?: 'light' | 'dark';
  useSystemColorMode?: boolean;
}

const defaultBrand: BrandConfig = {
  primary: '#6366f1', // Indigo
  secondary: '#8b5cf6',
  accent: '#06b6d4',
};

/**
 * Extracts RGB values from a hex color for use in CSS custom properties.
 */
function hexToRgbValues(hex: string): string {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/**
 * Creates a Chakra UI theme with glassmorphism styling and custom brand colors.
 *
 * @param config - Theme configuration including brand colors
 * @returns A Chakra UI theme object
 *
 * @example
 * ```tsx
 * const theme = createGlassTheme({
 *   brand: { primary: '#6366f1' }
 * });
 * ```
 */
export function createGlassTheme(config: GlassThemeConfig = {}): ReturnType<typeof extendTheme> {
  const { brand = defaultBrand, initialColorMode = 'light', useSystemColorMode = true } = config;

  // Generate color scales from brand colors
  const primaryScale = generateColorScale(brand.primary);
  const secondaryScale = brand.secondary ? generateColorScale(brand.secondary) : undefined;
  const accentScale = brand.accent ? generateColorScale(brand.accent) : undefined;

  // Color mode configuration
  const colorModeConfig: ThemeConfig = {
    initialColorMode,
    useSystemColorMode,
  };

  return extendTheme({
    config: colorModeConfig,

    colors: {
      ...colors,
      primary: primaryScale,
      brand: primaryScale, // Alias
      secondary: secondaryScale || colors.neutral,
      accent: accentScale || colors.info,
    },

    fonts,
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacings,

    shadows,
    blur,

    radii: {
      none: '0',
      sm: '0.25rem',
      base: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      full: '9999px',
    },

    layerStyles,

    styles: {
      global: (props: { colorMode: string }) => ({
        ':root': {
          '--primary-rgb': hexToRgbValues(brand.primary),
          '--secondary-rgb': brand.secondary ? hexToRgbValues(brand.secondary) : hexToRgbValues(defaultBrand.secondary!),
          '--accent-rgb': brand.accent ? hexToRgbValues(brand.accent) : hexToRgbValues(defaultBrand.accent!),
        },
        body: {
          bg: props.colorMode === 'dark' ? 'neutral.950' : 'neutral.50',
          color: props.colorMode === 'dark' ? 'neutral.100' : 'neutral.900',
          fontFamily: 'body',
          lineHeight: 'normal',
        },
        '*::selection': {
          bg: hexToRgba(brand.primary, 0.3),
        },
        // Focus outline styles
        '*:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 3px ${hexToRgba(brand.primary, 0.4)}`,
        },
      }),
    },

    components: {
      Button,
      Card,
      Input,
      Textarea,
      Select,
      Modal,
      Drawer,
      Popover,
      Tooltip,

      // Link component
      Link: {
        baseStyle: {
          color: 'primary.500',
          _hover: {
            textDecoration: 'underline',
          },
        },
      },

      // Heading component
      Heading: {
        baseStyle: {
          fontWeight: 'semibold',
        },
      },

      // Badge component with glass variant
      Badge: {
        variants: {
          glass: {
            bg: 'glass.light.surface',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid',
            borderColor: 'glass.light.border',
            _dark: {
              bg: 'glass.dark.surface',
              borderColor: 'glass.dark.border',
            },
          },
          glassPrimary: {
            bg: 'rgba(var(--primary-rgb), 0.1)',
            color: 'primary.600',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid',
            borderColor: 'rgba(var(--primary-rgb), 0.2)',
            _dark: {
              color: 'primary.300',
            },
          },
        },
      },

      // Menu with glass styling
      Menu: {
        baseStyle: {
          list: {
            bg: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 'xl',
            boxShadow: 'lg',
            py: 2,
            _dark: {
              bg: 'rgba(0, 0, 0, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
          item: {
            bg: 'transparent',
            _hover: {
              bg: 'glass.light.surfaceHover',
              _dark: {
                bg: 'glass.dark.surfaceHover',
              },
            },
            _focus: {
              bg: 'glass.light.surfaceHover',
              _dark: {
                bg: 'glass.dark.surfaceHover',
              },
            },
          },
        },
      },

      // Tabs with glass styling
      Tabs: {
        variants: {
          glass: {
            tablist: {
              bg: 'glass.light.surface',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'glass.light.border',
              borderRadius: 'xl',
              p: 1,
              _dark: {
                bg: 'glass.dark.surface',
                borderColor: 'glass.dark.border',
              },
            },
            tab: {
              borderRadius: 'lg',
              fontWeight: 'medium',
              _selected: {
                bg: 'primary.500',
                color: 'white',
                boxShadow: 'sm',
              },
              _hover: {
                bg: 'glass.light.surfaceHover',
                _dark: {
                  bg: 'glass.dark.surfaceHover',
                },
              },
            },
            tabpanel: {
              p: 4,
            },
          },
        },
      },
    },
  });
}

/**
 * Default glass theme with indigo primary color.
 */
export const glassTheme = createGlassTheme();
