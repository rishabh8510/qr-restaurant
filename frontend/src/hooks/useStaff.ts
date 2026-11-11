import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/services/api';
import { queryKeys } from './queryKeys';

export function useStaffList(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: queryKeys.staff.list(params),
    queryFn: () => staffApi.list(params),
  });
}

export function useStaff(id: string) {
  return useQuery({
    queryKey: queryKeys.staff.detail(id),
    queryFn: () => staffApi.get(id),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData | object) => staffApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => staffApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
    },
  });
}

export function useToggleStaffStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
    },
  });
}
