import {
  Users,
  Tags,
  UtensilsCrossed,
  Percent,
  Package,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useDashboardStats } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/components/ui/Loader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type Period = 'today' | 'week' | 'month' | 'year' | 'allTime';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'year', label: 'This year' },
  { key: 'allTime', label: 'All time' },
];

function money(n: number | undefined) {
  return `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboardStats();
  const [period, setPeriod] = useState<Period>('today');

  const stats = data?.data;
  const periodData = stats?.orders?.[period] || { orderCount: 0, revenue: 0 };
  const topItems = stats?.topItems || [];
  const byStatus = stats?.byStatus || {};
  const recent = stats?.recentOrders || [];
  const last7 = stats?.last7Days || [];
  const maxDayOrders = Math.max(1, ...last7.map((d) => d.orders));

  const catalogCards = [
    { label: 'Staff On Duty', value: stats?.totalStaff ?? 0, icon: Users, color: 'text-blue-500 bg-blue-50/80 ring-1 ring-blue-100' },
    { label: 'Categories', value: stats?.totalCategories ?? 0, icon: Tags, color: 'text-purple-500 bg-purple-50/80 ring-1 ring-purple-100' },
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'text-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-100' },
    { label: 'Active Menu', value: stats?.activeProducts ?? 0, icon: UtensilsCrossed, color: 'text-amber-500 bg-amber-50/80 ring-1 ring-amber-100' },
    { label: 'Active Deals', value: stats?.activeOffers ?? 0, icon: Percent, color: 'text-pink-500 bg-pink-50/80 ring-1 ring-pink-100' },
  ];

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Operations &amp; Sales Dashboard
            </h1>
            <span className="hidden sm:inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
              ● Live Feed
            </span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Welcome, {user?.name} · Restaurant POS Console
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                period === p.key
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Hero Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Orders */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-6 text-white shadow-xl shadow-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Total Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight">{periodData.orderCount}</p>
            <p className="mt-1 text-xs text-amber-100 font-semibold">
              Filter: {PERIODS.find((p) => p.key === period)?.label}
            </p>
          </div>
        </div>

        {/* Card 2: Period Revenue */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-xl shadow-emerald-600/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Gross Revenue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs">
              <IndianRupee className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight">{money(periodData.revenue)}</p>
            <p className="mt-1 text-xs text-emerald-100 font-semibold">
              Avg ticket: {periodData.orderCount ? money(periodData.revenue / periodData.orderCount) : '₹0'}
            </p>
          </div>
        </div>

        {/* Card 3: Today's Orders */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 text-white shadow-xl shadow-slate-900/15 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today&apos;s Run Rate
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xs">
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight">
              {stats?.orders?.today.orderCount ?? 0}
            </p>
            <p className="mt-1 text-xs text-emerald-400 font-bold">
              {money(stats?.orders?.today.revenue)} generated today
            </p>
          </div>
        </div>

        {/* Card 4: All-Time Revenue */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 text-white shadow-xl shadow-indigo-600/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">
              Lifetime Sales
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black tracking-tight">
              {money(stats?.orders?.allTime.revenue)}
            </p>
            <p className="mt-1 text-xs text-indigo-100 font-semibold">
              {stats?.orders?.allTime.orderCount ?? 0} orders processed
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Quick Count Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {catalogCards.map((c) => (
          <Card key={c.label} className="border-slate-100 bg-white">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500 font-semibold">{c.label}</p>
                <p className="text-lg font-black text-slate-900">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown & 7-Day Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-100 bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold">Live Kitchen Fulfillment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { key: 'pending', label: 'New Incoming', badge: 'warning' },
                { key: 'confirmed', label: 'Accepted', badge: 'info' },
                { key: 'preparing', label: 'Cooking / Barista', badge: 'secondary' },
                { key: 'ready', label: 'Ready to Serve', badge: 'secondary' },
                { key: 'completed', label: 'Delivered', badge: 'success' },
                { key: 'cancelled', label: 'Cancelled', badge: 'destructive' },
              ].map((s) => (
                <div
                  key={s.key}
                  className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-100/60"
                >
                  <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                  <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-2xl font-black tabular-nums text-slate-900">
                      {byStatus[s.key] || 0}
                    </span>
                    <Badge variant={s.badge as any}>{s.key}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold">Last 7 Days Sales Trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            {last7.length === 0 ? (
              <p className="py-12 text-center text-xs text-slate-400">No recent orders recorded</p>
            ) : (
              <div className="flex h-44 items-end gap-3 pt-4">
                {last7.map((d) => (
                  <div key={String(d.day)} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-slate-800">{d.orders}</span>
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 transition-all cursor-pointer shadow-xs"
                      style={{ height: `${Math.max(14, (d.orders / maxDayOrders) * 100)}%` }}
                      title={`${money(d.revenue)}`}
                    />
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(d.day).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Items & Recent Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top selling items */}
        <Card className="border-slate-100 bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold">Top Selling Cafe Items</CardTitle>
          </CardHeader>
          <CardContent>
            {topItems.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No sales recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pr-4">#</th>
                      <th className="pb-3 pr-4">Item Name</th>
                      <th className="pb-3 pr-4">Qty</th>
                      <th className="pb-3">Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topItems.map((item, i) => (
                      <tr key={`${item.productId}-${item.name}`} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 pr-4 text-xs font-bold text-slate-400">{i + 1}</td>
                        <td className="py-3 pr-4 font-bold text-slate-900">{item.name}</td>
                        <td className="py-3 pr-4 tabular-nums text-slate-600 font-semibold">{item.quantity}</td>
                        <td className="py-3 font-black tabular-nums text-emerald-600">
                          {money(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Orders Feed */}
        <Card className="border-slate-100 bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold">Recent Live Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No orders placed yet</p>
            ) : (
              <div className="space-y-3">
                {recent.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 hover:bg-slate-100/50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 text-sm">{o.orderNumber}</p>
                        {o.tableNumber && (
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
                            Table #{o.tableNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {o.customerName || 'Guest'} · {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">{money(Number(o.total))}</p>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {o.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
