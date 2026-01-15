import type { CreateJobDto, UpdateJobDto, PublishJobDto } from '@borg/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { jobsService } from '@/services/jobs.service';

export const jobKeys = {
  all: ['jobs'] as const,
  list: () => ['jobs', 'list'] as const,
  detail: (id: string) => ['jobs', id] as const,
};

export function useJobs() {
  return useQuery({
    queryKey: jobKeys.list(),
    queryFn: () => jobsService.list(),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDto) => jobsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useUpdateJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateJobDto) => jobsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function usePublishJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PublishJobDto) => jobsService.publish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useCloseJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => jobsService.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.list() });
    },
  });
}

export function useExtendJob(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => jobsService.extend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
}
