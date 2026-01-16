'use client';

import { JobStatus } from '@job-board/types';
import { Badge } from '@job-board/ui';

interface JobStatusBadgeProps {
  status: JobStatus;
}

const statusConfig: Record<JobStatus, { colorScheme: string; label: string }> =
  {
    [JobStatus.DRAFT]: { colorScheme: 'gray', label: 'Draft' },
    [JobStatus.PENDING_PAYMENT]: {
      colorScheme: 'yellow',
      label: 'Pending Payment',
    },
    [JobStatus.ACTIVE]: { colorScheme: 'green', label: 'Active' },
    [JobStatus.CLOSED]: { colorScheme: 'red', label: 'Closed' },
    [JobStatus.EXPIRED]: { colorScheme: 'orange', label: 'Expired' },
  };

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const config = statusConfig[status] || { colorScheme: 'gray', label: status };

  return (
    <Badge
      colorScheme={config.colorScheme}
      variant="subtle"
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
