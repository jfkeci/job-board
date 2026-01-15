import type {
  Job,
  JobListResponse,
  CreateJobDto,
  UpdateJobDto,
  PublishJobDto,
} from '@borg/types';

import { apiClient } from '@/lib/api';

export const jobsService = {
  create: (data: CreateJobDto) =>
    apiClient<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: () => apiClient<JobListResponse>('/jobs'),

  getById: (id: string) => apiClient<Job>(`/jobs/${id}`),

  update: (id: string, data: UpdateJobDto) =>
    apiClient<Job>(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) => apiClient<void>(`/jobs/${id}`, { method: 'DELETE' }),

  publish: (id: string, data: PublishJobDto) =>
    apiClient<Job>(`/jobs/${id}/publish`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  close: (id: string) =>
    apiClient<Job>(`/jobs/${id}/close`, { method: 'POST' }),

  extend: (id: string) =>
    apiClient<Job>(`/jobs/${id}/extend`, { method: 'POST' }),
};
