'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { BrandConfig, BrandColors, ColorScale } from '../brand/types';
import { generateColorScale } from '../utils/colorScale';
import { createGlassTheme, type GlassThemeConfig } from '../theme/createGlassTheme';

interface BrandContextValue {
  brand: BrandConfig;
  colors: BrandColors;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export interface GlassThemeProviderProps {
  /** Child components to render within the provider */
  children: ReactNode;
  /** Brand configuration for customizing primary colors */
  brandConfig?: BrandConfig;
  /** Initial color mode ('light' or 'dark') */
  initialColorMode?: 'light' | 'dark';
  /** Whether to use the system's color mode preference */
  useSystemColorMode?: boolean;
  /** Reset CSS (default: true) */
  resetCSS?: boolean;
}

/**
 * GlassThemeProvider wraps your application with the glassmorphism theme
 * and provides brand color context.
 *
 * @example
 * ```tsx
 * // Basic usage with default theme
 * <GlassThemeProvider>
 *   <App />
 * </GlassThemeProvider>
 *
 * // With custom brand colors
 * <GlassThemeProvider brandConfig={{ primary: '#10b981' }}>
 *   <App />
 * </GlassThemeProvider>
 *
 * // With preset brand colors
 * import { brandPresets } from '@job-board/ui';
 * <GlassThemeProvider brandConfig={brandPresets.emerald}>
 *   <App />
 * </GlassThemeProvider>
 * ```
 */
export function GlassThemeProvider({
  children,
  brandConfig,
  initialColorMode = 'light',
  useSystemColorMode = true,
  resetCSS = true,
}: GlassThemeProviderProps) {
  // Memoize brand configuration
  const brand = useMemo<BrandConfig>(
    () => ({
      primary: brandConfig?.primary ?? '#6366f1',
      secondary: brandConfig?.secondary,
      accent: brandConfig?.accent,
    }),
    [brandConfig?.primary, brandConfig?.secondary, brandConfig?.accent]
  );

  // Memoize color scales
  const brandColors = useMemo<BrandColors>(() => {
    const primaryScale = generateColorScale(brand.primary);
    const secondaryScale = brand.secondary ? generateColorScale(brand.secondary) : undefined;
    const accentScale = brand.accent ? generateColorScale(brand.accent) : undefined;

    return {
      primary: brand.primary,
      secondary: brand.secondary,
      accent: brand.accent,
      primaryScale,
      secondaryScale,
      accentScale,
    };
  }, [brand.primary, brand.secondary, brand.accent]);

  // Create theme with brand colors
  const theme = useMemo(() => {
    const themeConfig: GlassThemeConfig = {
      brand,
      initialColorMode,
      useSystemColorMode,
    };
    return createGlassTheme(themeConfig);
  }, [brand, initialColorMode, useSystemColorMode]);

  // Brand context value
  const brandContextValue = useMemo<BrandContextValue>(
    () => ({
      brand,
      colors: brandColors,
    }),
    [brand, brandColors]
  );

  return (
    <BrandContext.Provider value={brandContextValue}>
      <ColorModeScript initialColorMode={initialColorMode} />
      <ChakraProvider theme={theme} resetCSS={resetCSS}>
        {children}
      </ChakraProvider>
    </BrandContext.Provider>
  );
}

/**
 * Hook to access the current brand configuration and color scales.
 *
 * @returns Brand colors and configuration
 * @throws Error if used outside of GlassThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { primary, primaryScale } = useBrandColors();
 *
 *   return (
 *     <Box
 *       bg={primaryScale[100]}
 *       borderColor={primaryScale[500]}
 *     >
 *       Primary color: {primary}
 *     </Box>
 *   );
 * }
 * ```
 */
export function useBrandColors(): BrandColors {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandColors must be used within a GlassThemeProvider');
  }
  return context.colors;
}

/**
 * Hook to access the full brand context including configuration.
 *
 * @returns Brand context with configuration and colors
 * @throws Error if used outside of GlassThemeProvider
 */
export function useBrandContext(): BrandContextValue {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandContext must be used within a GlassThemeProvider');
  }
  return context;
}
