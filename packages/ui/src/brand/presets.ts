import type { BrandConfig } from './types';

/**
 * Pre-defined brand color palettes for common use cases.
 * Each preset provides a primary color that will be used to generate
 * a full color scale (50-900) for the theme.
 */
export const brandPresets = {
  /** Indigo - Professional, trustworthy */
  indigo: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
  },

  /** Emerald - Growth, success, health */
  emerald: {
    primary: '#10b981',
    secondary: '#14b8a6',
    accent: '#f59e0b',
  },

  /** Rose - Bold, energetic, creative */
  rose: {
    primary: '#f43f5e',
    secondary: '#ec4899',
    accent: '#8b5cf6',
  },

  /** Blue - Classic, reliable, corporate */
  blue: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#14b8a6',
  },

  /** Violet - Creative, luxurious, innovative */
  violet: {
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#ec4899',
  },

  /** Amber - Warm, friendly, optimistic */
  amber: {
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#10b981',
  },

  /** Cyan - Tech, modern, fresh */
  cyan: {
    primary: '#06b6d4',
    secondary: '#0ea5e9',
    accent: '#8b5cf6',
  },

  /** Slate - Neutral, minimal, professional */
  slate: {
    primary: '#64748b',
    secondary: '#475569',
    accent: '#3b82f6',
  },
} as const satisfies Record<string, BrandConfig>;

export type BrandPresetName = keyof typeof brandPresets;
