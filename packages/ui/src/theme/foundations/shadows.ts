/**
 * Shadow tokens for glassmorphism theme.
 * Soft, subtle shadows that create depth without harsh edges.
 */
export const shadows = {
  // Subtle shadows for glass elements
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Glass-specific shadows
  glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
  glassHover: '0 8px 32px rgba(0, 0, 0, 0.12)',
  glassActive: '0 2px 20px rgba(0, 0, 0, 0.08)',

  // Glow effects for interactive elements
  glowSm: '0 0 10px rgba(var(--primary-rgb), 0.3)',
  glowMd: '0 0 20px rgba(var(--primary-rgb), 0.4)',
  glowLg: '0 0 30px rgba(var(--primary-rgb), 0.5)',

  // Inner shadows for pressed states
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  innerMd: 'inset 0 4px 6px 0 rgba(0, 0, 0, 0.1)',

  // No shadow
  none: 'none',

  // Outline for focus states
  outline: '0 0 0 3px rgba(var(--primary-rgb), 0.4)',
};
