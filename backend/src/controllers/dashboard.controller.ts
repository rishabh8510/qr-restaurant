import { dashboardService } from '../services/DashboardService';
import { asyncHandler } from '../utils/asyncHandler';

export const getStats = asyncHandler(async (_req, res) => {
  const stats = await dashboardService.getStats();
  res.json({ success: true, data: stats });
});
