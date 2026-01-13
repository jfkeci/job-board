/**
 * Blur tokens for glassmorphism effects.
 * Used with backdrop-filter to create frosted glass appearance.
 */
export const blur = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '40px',

  // Named blur values for specific use cases
  glass: '10px',
  glassLight: '8px',
  glassHeavy: '20px',
  modal: '16px',
  overlay: '4px',
};

/**
 * Backdrop filter presets combining blur with other effects.
 */
export const backdropFilters = {
  glass: 'blur(10px) saturate(180%)',
  glassLight: 'blur(8px) saturate(150%)',
  glassHeavy: 'blur(20px) saturate(200%)',
  modal: 'blur(16px) brightness(0.9)',
  overlay: 'blur(4px)',
  none: 'none',
};
