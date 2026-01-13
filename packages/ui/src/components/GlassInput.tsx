'use client';

import {
  Input,
  Textarea,
  Select,
  forwardRef,
  type InputProps,
  type TextareaProps,
  type SelectProps,
} from '@chakra-ui/react';

export interface GlassInputProps extends InputProps {}

/**
 * GlassInput is an Input component with glassmorphism styling.
 * Uses the 'glass' variant by default.
 *
 * @example
 * ```tsx
 * <GlassInput placeholder="Enter your name" />
 *
 * // Filled glass variant
 * <GlassInput variant="glassFilled" placeholder="Search..." />
 *
 * // With label using FormControl
 * <FormControl>
 *   <FormLabel>Email</FormLabel>
 *   <GlassInput type="email" />
 * </FormControl>
 * ```
 */
export const GlassInput = forwardRef<GlassInputProps, 'input'>(
  ({ variant = 'glass', ...props }, ref) => {
    return <Input ref={ref} variant={variant} {...props} />;
  }
);

GlassInput.displayName = 'GlassInput';

export interface GlassTextareaProps extends TextareaProps {}

/**
 * GlassTextarea is a Textarea component with glassmorphism styling.
 *
 * @example
 * ```tsx
 * <GlassTextarea placeholder="Enter description..." rows={4} />
 * ```
 */
export const GlassTextarea = forwardRef<GlassTextareaProps, 'textarea'>(
  ({ variant = 'glass', ...props }, ref) => {
    return <Textarea ref={ref} variant={variant} {...props} />;
  }
);

GlassTextarea.displayName = 'GlassTextarea';

export interface GlassSelectProps extends SelectProps {}

/**
 * GlassSelect is a Select component with glassmorphism styling.
 *
 * @example
 * ```tsx
 * <GlassSelect placeholder="Select option">
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </GlassSelect>
 * ```
 */
export const GlassSelect = forwardRef<GlassSelectProps, 'select'>(
  ({ variant = 'glass', ...props }, ref) => {
    return <Select ref={ref} variant={variant} {...props} />;
  }
);

GlassSelect.displayName = 'GlassSelect';
