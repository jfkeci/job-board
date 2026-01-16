import type {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@job-board/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { organizationsService } from '@/services/organizations.service';

export const organizationKeys = {
  all: ['organizations'] as const,
  detail: (id: string) => ['organizations', id] as const,
};

export function useOrganization(id: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationDto) =>
      organizationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}

export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationDto) =>
      organizationsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(id) });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all });
    },
  });
}
