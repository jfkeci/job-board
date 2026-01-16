'use client';

import {
  Box,
  Flex,
  Text,
  forwardRef,
  type BoxProps,
  CloseButton,
  Icon,
} from '@chakra-ui/react';

type AlertStatus = 'error' | 'warning' | 'success' | 'info';

export interface GlassAlertProps extends Omit<BoxProps, 'title'> {
  /** The status of the alert - determines color scheme */
  status?: AlertStatus;
  /** The main title/message of the alert */
  title: string;
  /** Optional description for additional context */
  description?: string;
  /** Whether to show a close button */
  isClosable?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Custom icon component */
  icon?: React.ReactElement;
}

const statusConfig: Record<
  AlertStatus,
  {
    bg: string;
    borderColor: string;
    iconBg: string;
    iconColor: string;
    icon: React.FC<{ size?: number }>;
  }
> = {
  error: {
    bg: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    iconBg: 'rgba(239, 68, 68, 0.15)',
    iconColor: '#f87171',
    icon: ({ size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    iconBg: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#fbbf24',
    icon: ({ size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  success: {
    bg: 'rgba(34, 197, 94, 0.08)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    iconBg: 'rgba(34, 197, 94, 0.15)',
    iconColor: '#4ade80',
    icon: ({ size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    iconBg: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#60a5fa',
    icon: ({ size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

/**
 * GlassAlert is an alert component with glassmorphism styling.
 *
 * @example
 * ```tsx
 * <GlassAlert
 *   status="error"
 *   title="Validation failed"
 *   description="Please check your input and try again"
 *   isClosable
 *   onClose={() => setError(null)}
 * />
 *
 * <GlassAlert
 *   status="success"
 *   title="Account created successfully!"
 * />
 * ```
 */
export const GlassAlert = forwardRef<GlassAlertProps, 'div'>(
  (
    {
      status = 'info',
      title,
      description,
      isClosable = false,
      onClose,
      icon,
      ...props
    },
    ref,
  ) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Box
        ref={ref}
        role="alert"
        position="relative"
        overflow="hidden"
        bg={config.bg}
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor={config.borderColor}
        borderRadius="xl"
        p={4}
        w="full"
        {...props}
      >
        <Flex align="flex-start" gap={3}>
          {/* Icon */}
          <Flex
            align="center"
            justify="center"
            flexShrink={0}
            w={10}
            h={10}
            bg={config.iconBg}
            borderRadius="full"
            color={config.iconColor}
          >
            {icon || <IconComponent size={20} />}
          </Flex>

          {/* Content */}
          <Flex direction="column" flex={1} minW={0} gap={0.5}>
            <Text
              fontWeight="medium"
              fontSize="sm"
              color="neutral.100"
              lineHeight="short"
            >
              {title}
            </Text>
            {description && (
              <Text fontSize="sm" color="neutral.400" lineHeight="short">
                {description}
              </Text>
            )}
          </Flex>

          {/* Close button */}
          {isClosable && onClose && (
            <CloseButton
              size="sm"
              color="neutral.400"
              _hover={{ color: 'neutral.200', bg: 'whiteAlpha.100' }}
              onClick={onClose}
              aria-label="Close alert"
            />
          )}
        </Flex>
      </Box>
    );
  },
);

GlassAlert.displayName = 'GlassAlert';
