export interface BrandConfig {
  /** Primary brand color (hex format, e.g., '#6366f1') */
  primary: string;
  /** Optional secondary brand color */
  secondary?: string;
  /** Optional accent color for highlights */
  accent?: string;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface BrandColors {
  primary: string;
  secondary?: string;
  accent?: string;
  primaryScale: ColorScale;
  secondaryScale?: ColorScale;
  accentScale?: ColorScale;
}
