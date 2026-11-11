import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi } from '@/services/api';
import { queryKeys } from './queryKeys';

export function useRestaurant() {
  return useQuery({
    queryKey: queryKeys.restaurant.all,
    queryFn: () => restaurantApi.get(),
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => restaurantApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurant.all });
    },
  });
}
