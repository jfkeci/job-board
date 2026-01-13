'use client';

import { Box, forwardRef, type BoxProps } from '@chakra-ui/react';

export interface GlassPanelProps extends BoxProps {
  /** Intensity of the glass effect */
  intensity?: 'light' | 'normal' | 'heavy';
  /** Whether the panel is interactive (shows hover effects) */
  interactive?: boolean;
  /** Use primary color tint for the glass effect */
  primaryTint?: boolean;
}

/**
 * GlassPanel is a generic container with glassmorphism styling.
 * Use this for custom layouts that need the glass effect.
 *
 * @example
 * ```tsx
 * // Basic glass panel
 * <GlassPanel p={6}>
 *   Content here
 * </GlassPanel>
 *
 * // Heavy blur effect
 * <GlassPanel intensity="heavy" p={8}>
 *   Important content
 * </GlassPanel>
 *
 * // Interactive panel
 * <GlassPanel interactive onClick={handleClick}>
 *   Clickable content
 * </GlassPanel>
 *
 * // Primary color tinted
 * <GlassPanel primaryTint p={4}>
 *   Branded section
 * </GlassPanel>
 * ```
 */
export const GlassPanel = forwardRef<GlassPanelProps, 'div'>(
  ({ intensity = 'normal', interactive = false, primaryTint = false, ...props }, ref) => {
    // Determine layer style based on props
    let layerStyle = 'glass';

    if (primaryTint) {
      layerStyle = 'glassPrimary';
    } else if (interactive) {
      layerStyle = 'glassInteractive';
    } else {
      switch (intensity) {
        case 'light':
          layerStyle = 'glassSubtle';
          break;
        case 'heavy':
          layerStyle = 'glassHeavy';
          break;
        default:
          layerStyle = 'glass';
      }
    }

    return <Box ref={ref} layerStyle={layerStyle} {...props} />;
  }
);

GlassPanel.displayName = 'GlassPanel';
