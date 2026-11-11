import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offerApi } from '@/services/api';
import { queryKeys } from './queryKeys';

export function useOffersList(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: queryKeys.offers.list(params),
    queryFn: () => offerApi.list(params),
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: queryKeys.offers.detail(id),
    queryFn: () => offerApi.get(id),
    enabled: !!id,
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => offerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => offerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => offerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all });
    },
  });
}
