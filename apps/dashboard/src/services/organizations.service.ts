import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@job-board/types';

import { apiClient } from '@/lib/api';

export const organizationsService = {
  create: (data: CreateOrganizationDto) =>
    apiClient<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: string) => apiClient<Organization>(`/organizations/${id}`),

  update: (id: string, data: UpdateOrganizationDto) =>
    apiClient<Organization>(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiClient<void>(`/organizations/${id}`, { method: 'DELETE' }),
};
