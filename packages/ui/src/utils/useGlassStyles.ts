'use client';

import { useColorModeValue } from '@chakra-ui/react';
import type { SystemStyleObject } from '@chakra-ui/react';

export interface GlassStyleOptions {
  /** Blur intensity in pixels */
  blur?: number;
  /** Background opacity (0-1) */
  opacity?: number;
  /** Border opacity (0-1) */
  borderOpacity?: number;
  /** Border radius */
  borderRadius?: string;
  /** Whether to use primary color tint */
  primaryTint?: boolean;
}

export interface GlassStyles {
  /** CSS styles object for the glass effect */
  styles: SystemStyleObject;
  /** Individual style properties for custom composition */
  background: string;
  backdropFilter: string;
  border: string;
  borderRadius: string;
  boxShadow: string;
}

/**
 * Hook to generate glass effect styles with customizable options.
 * Useful for applying glass effects to custom components.
 *
 * @param options - Customization options for the glass effect
 * @returns Glass style properties and composed style object
 *
 * @example
 * ```tsx
 * function CustomGlassComponent() {
 *   const { styles } = useGlassStyles({ blur: 12, opacity: 0.15 });
 *
 *   return (
 *     <Box sx={styles}>
 *       Custom glass content
 *     </Box>
 *   );
 * }
 *
 * // With primary tint
 * function BrandedGlass() {
 *   const { styles } = useGlassStyles({ primaryTint: true });
 *   return <Box sx={styles}>Branded glass</Box>;
 * }
 * ```
 */
export function useGlassStyles(options: GlassStyleOptions = {}): GlassStyles {
  const {
    blur = 10,
    opacity = 0.1,
    borderOpacity = 0.2,
    borderRadius = '1rem',
    primaryTint = false,
  } = options;

  // Color mode dependent values
  const lightBg = primaryTint
    ? `rgba(var(--primary-rgb), ${opacity})`
    : `rgba(255, 255, 255, ${opacity})`;

  const darkBg = primaryTint
    ? `rgba(var(--primary-rgb), ${opacity})`
    : `rgba(0, 0, 0, ${opacity * 2})`;

  const background = useColorModeValue(lightBg, darkBg);

  const lightBorder = primaryTint
    ? `rgba(var(--primary-rgb), ${borderOpacity})`
    : `rgba(255, 255, 255, ${borderOpacity})`;

  const darkBorder = primaryTint
    ? `rgba(var(--primary-rgb), ${borderOpacity})`
    : `rgba(255, 255, 255, ${borderOpacity * 0.5})`;

  const borderColor = useColorModeValue(lightBorder, darkBorder);

  const backdropFilter = `blur(${blur}px) saturate(180%)`;
  const border = `1px solid ${borderColor}`;
  const boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';

  const styles: SystemStyleObject = {
    background,
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    border,
    borderRadius,
    boxShadow,
  };

  return {
    styles,
    background,
    backdropFilter,
    border,
    borderRadius,
    boxShadow,
  };
}

/**
 * Pre-defined glass style presets for common use cases.
 */
export const glassStylePresets = {
  /** Subtle glass effect for nested elements */
  subtle: {
    blur: 4,
    opacity: 0.08,
    borderOpacity: 0.15,
  },

  /** Standard glass effect */
  normal: {
    blur: 10,
    opacity: 0.1,
    borderOpacity: 0.2,
  },

  /** Heavy frosted glass effect */
  heavy: {
    blur: 20,
    opacity: 0.2,
    borderOpacity: 0.3,
  },

  /** Modal/overlay glass effect */
  modal: {
    blur: 16,
    opacity: 0.15,
    borderOpacity: 0.2,
  },
} as const;
