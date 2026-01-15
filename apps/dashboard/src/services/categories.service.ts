import type { Category } from '@borg/types';

import { apiClient } from '@/lib/api';

export const categoriesService = {
  list: (tenantId?: string, language = 'en') => {
    const params = new URLSearchParams();
    if (tenantId) params.append('tenantId', tenantId);
    if (language) params.append('language', language);
    const queryString = params.toString();
    return apiClient<Category[]>(`/categories${queryString ? `?${queryString}` : ''}`);
  },
};
