'use client';

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  forwardRef,
  type CardProps,
} from '@chakra-ui/react';

export interface GlassCardProps extends CardProps {
  /** Whether the card is interactive (shows hover effects) */
  interactive?: boolean;
  /** Use primary color tint for the glass effect */
  primaryTint?: boolean;
}

/**
 * GlassCard is a Card component with glassmorphism styling.
 *
 * @example
 * ```tsx
 * <GlassCard>
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content</CardBody>
 * </GlassCard>
 *
 * // Interactive card with hover effects
 * <GlassCard interactive onClick={handleClick}>
 *   <CardBody>Click me</CardBody>
 * </GlassCard>
 *
 * // With primary color tint
 * <GlassCard primaryTint>
 *   <CardBody>Branded content</CardBody>
 * </GlassCard>
 * ```
 */
export const GlassCard = forwardRef<GlassCardProps, 'div'>(
  ({ interactive = false, primaryTint = false, variant, ...props }, ref) => {
    // Determine variant based on props
    let cardVariant = variant;
    if (!cardVariant) {
      if (primaryTint) {
        cardVariant = 'glassPrimary';
      } else if (interactive) {
        cardVariant = 'glassInteractive';
      } else {
        cardVariant = 'glass';
      }
    }

    return <Card ref={ref} variant={cardVariant} {...props} />;
  }
);

GlassCard.displayName = 'GlassCard';

// Re-export Card sub-components for convenience
export { CardBody as GlassCardBody, CardHeader as GlassCardHeader, CardFooter as GlassCardFooter };
