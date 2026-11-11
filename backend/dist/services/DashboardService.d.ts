export declare class DashboardService {
    getStats(): Promise<{
        totalStaff: number;
        totalCategories: number;
        totalProducts: number;
        activeProducts: number;
        activeOffers: number;
        orders: {
            today: {
                orderCount: number;
                revenue: number;
            };
            week: {
                orderCount: number;
                revenue: number;
            };
            month: {
                orderCount: number;
                revenue: number;
            };
            year: {
                orderCount: number;
                revenue: number;
            };
            allTime: {
                orderCount: number;
                revenue: number;
            };
        };
        byStatus: Record<string, number>;
        topItems: {
            name: string;
            productId: string;
            quantity: number;
            revenue: number;
        }[];
        recentOrders: import("../models/Order").OrderAttributes[];
        last7Days: {
            day: string;
            orders: number;
            revenue: number;
        }[];
    }>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=DashboardService.d.ts.map