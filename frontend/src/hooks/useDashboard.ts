import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';
import { queryKeys } from './queryKeys';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardApi.stats(),
  });
}
