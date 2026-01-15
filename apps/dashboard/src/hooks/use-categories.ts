import { useQuery } from '@tanstack/react-query';

import { categoriesService } from '@/services/categories.service';

export const categoryKeys = {
  all: ['categories'] as const,
  list: (tenantId?: string) => ['categories', { tenantId }] as const,
};

export function useCategories(tenantId?: string) {
  return useQuery({
    queryKey: categoryKeys.list(tenantId),
    queryFn: () => categoriesService.list(tenantId),
    staleTime: 5 * 60 * 1000, // Categories don't change often, cache for 5 minutes
  });
}
