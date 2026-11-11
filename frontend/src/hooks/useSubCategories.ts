import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subCategoryApi } from '@/services/api';
import { queryKeys } from './queryKeys';

export function useSubCategoriesList(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: queryKeys.subCategories.list(params),
    queryFn: () => subCategoryApi.list(params),
    enabled: !!params?.categoryId,
  });
}

export function useCreateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => subCategoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.all });
    },
  });
}

export function useUpdateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => subCategoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.all });
    },
  });
}

export function useDeleteSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subCategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subCategories.all });
    },
  });
}
