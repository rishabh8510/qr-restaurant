"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
function startOfDay(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}
function startOfWeek(d = new Date()) {
    const x = startOfDay(d);
    const day = x.getDay(); // 0 Sun
    const diff = day === 0 ? 6 : day - 1; // Monday start
    x.setDate(x.getDate() - diff);
    return x;
}
function startOfMonth(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function startOfYear(d = new Date()) {
    return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
}
const notCancelled = { status: { [sequelize_1.Op.ne]: 'cancelled' } };
async function orderAggregate(from) {
    const rows = await models_1.Order.findAll({
        where: {
            ...notCancelled,
            createdAt: { [sequelize_1.Op.gte]: from },
        },
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'orderCount'],
            [(0, sequelize_1.fn)('COALESCE', (0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('total')), 0), 'revenue'],
        ],
        raw: true,
    });
    const r = rows[0];
    return {
        orderCount: Number(r?.orderCount || 0),
        revenue: Math.round(Number(r?.revenue || 0) * 100) / 100,
    };
}
class DashboardService {
    async getStats() {
        const now = new Date();
        const [totalStaff, totalCategories, totalProducts, activeProducts, activeOffers, today, week, month, year, allTime, statusBreakdown, topItems, recentOrders, last7Days,] = await Promise.all([
            models_1.User.count({ where: { role: 'staff' } }),
            models_1.Category.count(),
            models_1.Product.count(),
            models_1.Product.count({ where: { isActive: true, isAvailable: true } }),
            models_1.Offer.count({
                where: {
                    isActive: true,
                    startDate: { [sequelize_1.Op.lte]: now },
                    endDate: { [sequelize_1.Op.gte]: now },
                },
            }),
            orderAggregate(startOfDay(now)),
            orderAggregate(startOfWeek(now)),
            orderAggregate(startOfMonth(now)),
            orderAggregate(startOfYear(now)),
            orderAggregate(new Date(0)),
            models_1.Order.findAll({
                attributes: ['status', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
                group: ['status'],
                raw: true,
            }),
            // Top selling items from JSONB items array (PostgreSQL)
            database_1.sequelize.query(`
        SELECT
          item->>'name' AS name,
          item->>'productId' AS "productId",
          SUM((item->>'quantity')::int) AS quantity,
          SUM((item->>'quantity')::numeric * (item->>'price')::numeric) AS revenue
        FROM orders o
        CROSS JOIN LATERAL jsonb_array_elements(o.items) AS item
        WHERE o.status != 'cancelled'
        GROUP BY item->>'name', item->>'productId'
        ORDER BY quantity DESC
        LIMIT 10
        `, { type: sequelize_1.QueryTypes.SELECT }),
            models_1.Order.findAll({
                where: notCancelled,
                order: [['createdAt', 'DESC']],
                limit: 8,
                attributes: [
                    'id',
                    'orderNumber',
                    'status',
                    'total',
                    'customerName',
                    'customerPhone',
                    'orderType',
                    'createdAt',
                ],
            }),
            database_1.sequelize.query(`
        SELECT
          DATE(created_at) AS day,
          COUNT(*)::int AS orders,
          COALESCE(SUM(total), 0)::float AS revenue
        FROM orders
        WHERE status != 'cancelled'
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY day ASC
        `, { type: sequelize_1.QueryTypes.SELECT }),
        ]);
        const byStatus = {};
        for (const row of statusBreakdown) {
            byStatus[row.status] = Number(row.count || 0);
        }
        return {
            totalStaff,
            totalCategories,
            totalProducts,
            activeProducts,
            activeOffers,
            orders: {
                today,
                week,
                month,
                year,
                allTime,
            },
            byStatus,
            topItems: topItems.map((t) => ({
                name: t.name,
                productId: t.productId,
                quantity: Number(t.quantity || 0),
                revenue: Math.round(Number(t.revenue || 0) * 100) / 100,
            })),
            recentOrders: recentOrders.map((o) => o.toJSON()),
            last7Days: last7Days.map((d) => ({
                day: d.day,
                orders: Number(d.orders || 0),
                revenue: Math.round(Number(d.revenue || 0) * 100) / 100,
            })),
        };
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
//# sourceMappingURL=DashboardService.js.map