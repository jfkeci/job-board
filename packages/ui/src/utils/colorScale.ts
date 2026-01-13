import type { ColorScale } from '../brand/types';

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToHSL(hex: string): HSL {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates a full color scale (50-900) from a single base color.
 * The base color is used as the 500 value, with lighter shades (50-400)
 * and darker shades (600-900) generated automatically.
 */
export function generateColorScale(baseColor: string): ColorScale {
  const hsl = hexToHSL(baseColor);

  // Lightness values for each shade
  // 500 is the base, 50 is lightest, 900 is darkest
  const lightnessMap: Record<keyof ColorScale, number> = {
    50: 97,
    100: 94,
    200: 86,
    300: 77,
    400: 66,
    500: hsl.l, // Keep original lightness for base
    600: 47,
    700: 39,
    800: 32,
    900: 24,
  };

  // Adjust saturation slightly for lighter/darker shades
  const saturationAdjust = (shade: number, baseSaturation: number): number => {
    if (shade < 500) {
      // Reduce saturation for lighter shades
      return Math.max(0, baseSaturation - (500 - shade) / 20);
    } else if (shade > 500) {
      // Slightly increase saturation for darker shades
      return Math.min(100, baseSaturation + (shade - 500) / 40);
    }
    return baseSaturation;
  };

  const scale: Record<string, string> = {};

  for (const [shade, lightness] of Object.entries(lightnessMap)) {
    const shadeNum = parseInt(shade);
    const adjustedSaturation = saturationAdjust(shadeNum, hsl.s);
    scale[shade] = hslToHex(hsl.h, adjustedSaturation, lightness);
  }

  return scale as unknown as ColorScale;
}

/**
 * Converts a hex color to an rgba string with the given alpha value.
 */
export function hexToRgba(hex: string, alpha: number): string {
  hex = hex.replace(/^#/, '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
