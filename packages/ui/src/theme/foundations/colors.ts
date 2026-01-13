/**
 * Base color tokens for glassmorphism theme.
 * These are semantic colors used across the design system.
 */
export const colors = {
  // Glass surface colors (semi-transparent)
  glass: {
    light: {
      surface: 'rgba(255, 255, 255, 0.1)',
      surfaceHover: 'rgba(255, 255, 255, 0.15)',
      surfaceActive: 'rgba(255, 255, 255, 0.2)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(255, 255, 255, 0.3)',
    },
    dark: {
      surface: 'rgba(0, 0, 0, 0.2)',
      surfaceHover: 'rgba(0, 0, 0, 0.25)',
      surfaceActive: 'rgba(0, 0, 0, 0.3)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'rgba(255, 255, 255, 0.15)',
    },
  },

  // Neutral colors for text and backgrounds
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
};
