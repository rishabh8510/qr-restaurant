import { User, Category, Product, Offer, Order } from '../models';
import { Op, fn, col, literal, QueryTypes } from 'sequelize';
import { sequelize } from '../config/database';

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

const notCancelled = { status: { [Op.ne]: 'cancelled' } };

async function orderAggregate(from: Date) {
  const rows = await Order.findAll({
    where: {
      ...notCancelled,
      createdAt: { [Op.gte]: from },
    },
    attributes: [
      [fn('COUNT', col('id')), 'orderCount'],
      [fn('COALESCE', fn('SUM', col('total')), 0), 'revenue'],
    ],
    raw: true,
  });
  const r = rows[0] as unknown as { orderCount: string; revenue: string };
  return {
    orderCount: Number(r?.orderCount || 0),
    revenue: Math.round(Number(r?.revenue || 0) * 100) / 100,
  };
}

export class DashboardService {
  async getStats() {
    const now = new Date();
    const [
      totalStaff,
      totalCategories,
      totalProducts,
      activeProducts,
      activeOffers,
      today,
      week,
      month,
      year,
      allTime,
      statusBreakdown,
      topItems,
      recentOrders,
      last7Days,
    ] = await Promise.all([
      User.count({ where: { role: 'staff' } }),
      Category.count(),
      Product.count(),
      Product.count({ where: { isActive: true, isAvailable: true } }),
      Offer.count({
        where: {
          isActive: true,
          startDate: { [Op.lte]: now },
          endDate: { [Op.gte]: now },
        },
      }),
      orderAggregate(startOfDay(now)),
      orderAggregate(startOfWeek(now)),
      orderAggregate(startOfMonth(now)),
      orderAggregate(startOfYear(now)),
      orderAggregate(new Date(0)),
      Order.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),
      // Top selling items from JSONB items array (PostgreSQL)
      sequelize.query(
        `
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
        `,
        { type: QueryTypes.SELECT }
      ),
      Order.findAll({
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
      sequelize.query(
        `
        SELECT
          DATE(created_at) AS day,
          COUNT(*)::int AS orders,
          COALESCE(SUM(total), 0)::float AS revenue
        FROM orders
        WHERE status != 'cancelled'
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY day ASC
        `,
        { type: QueryTypes.SELECT }
      ),
    ]);

    const byStatus: Record<string, number> = {};
    for (const row of statusBreakdown as unknown as { status: string; count: string }[]) {
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

      topItems: (topItems as { name: string; productId: string; quantity: string; revenue: string }[]).map(
        (t) => ({
          name: t.name,
          productId: t.productId,
          quantity: Number(t.quantity || 0),
          revenue: Math.round(Number(t.revenue || 0) * 100) / 100,
        })
      ),

      recentOrders: recentOrders.map((o) => o.toJSON()),

      last7Days: (last7Days as { day: string; orders: number; revenue: number }[]).map((d) => ({
        day: d.day,
        orders: Number(d.orders || 0),
        revenue: Math.round(Number(d.revenue || 0) * 100) / 100,
      })),
    };
  }
}

export const dashboardService = new DashboardService();