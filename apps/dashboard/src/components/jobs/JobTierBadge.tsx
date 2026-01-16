'use client';

import { JobTier } from '@job-board/types';
import { Badge } from '@job-board/ui';

interface JobTierBadgeProps {
  tier: JobTier;
}

const tierConfig: Record<JobTier, { colorScheme: string; label: string }> = {
  [JobTier.BASIC]: { colorScheme: 'gray', label: 'Basic' },
  [JobTier.STANDARD]: { colorScheme: 'blue', label: 'Standard' },
  [JobTier.PREMIUM]: { colorScheme: 'purple', label: 'Premium' },
};

export function JobTierBadge({ tier }: JobTierBadgeProps) {
  const config = tierConfig[tier] || { colorScheme: 'gray', label: tier };

  return (
    <Badge
      colorScheme={config.colorScheme}
      variant="outline"
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="medium"
    >
      {config.label}
    </Badge>
  );
}
