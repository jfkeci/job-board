'use client';

import { Button, forwardRef, type ButtonProps } from '@chakra-ui/react';

export interface GlassButtonProps extends ButtonProps {
  /** Use glass variant (default: true for solid, false for other variants) */
  glass?: boolean;
}

/**
 * GlassButton is a Button component with glassmorphism styling options.
 *
 * @example
 * ```tsx
 * // Solid primary button (default)
 * <GlassButton>Click me</GlassButton>
 *
 * // Glass effect button
 * <GlassButton variant="glass">Glass Button</GlassButton>
 *
 * // Glass with primary tint
 * <GlassButton variant="glassPrimary">Primary Glass</GlassButton>
 *
 * // Outline button
 * <GlassButton variant="outline">Outline</GlassButton>
 *
 * // Different sizes
 * <GlassButton size="sm">Small</GlassButton>
 * <GlassButton size="lg">Large</GlassButton>
 * ```
 */
export const GlassButton = forwardRef<GlassButtonProps, 'button'>(
  ({ glass, variant, ...props }, ref) => {
    // If glass prop is explicitly true, use glass variant
    const buttonVariant = glass ? 'glass' : variant;

    return <Button ref={ref} variant={buttonVariant} {...props} />;
  }
);

GlassButton.displayName = 'GlassButton';
