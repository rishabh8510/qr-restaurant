import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/api/client';
import type { Order } from '@/types/index';
import { OrderDetailPanel } from '@/components/OrderDetailPanel';
import { ThermalPrintModal } from '@/components/ThermalPrintModal';
import { soundEngine } from '@/utils/audioAlert';
import { Loader } from '@/components/ui/Loader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Receipt,
  Check,
  X,
  ChefHat,
  BellRing,
  CheckCircle2,
  Clock,
  Inbox,
  Search,
  RefreshCw,
  Eye,
  Utensils,
  Volume2,
  VolumeX,
  Printer,
} from 'lucide-react';

const STATUS_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'New' },
  { key: 'confirmed', label: 'Accepted' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS: Record<
  string,
  {
    label: string;
    variant: 'warning' | 'info' | 'secondary' | 'success' | 'destructive';
    dotColor: string;
  }
> = {
  pending: {
    label: 'New Order',
    variant: 'warning',
    dotColor: 'bg-amber-500',
  },
  confirmed: {
    label: 'Accepted',
    variant: 'info',
    dotColor: 'bg-blue-500',
  },
  preparing: {
    label: 'Preparing',
    variant: 'secondary',
    dotColor: 'bg-indigo-500',
  },
  ready: {
    label: 'Ready',
    variant: 'secondary',
    dotColor: 'bg-purple-500',
  },
  completed: {
    label: 'Completed',
    variant: 'success',
    dotColor: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive',
    dotColor: 'bg-red-500',
  },
};

function getSocketUrl() {
  const env = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL;
  if (env) return env.replace(/\/api\/?$/, '');
  return window.location.origin;
}

function money(n: number | string | undefined | null) {
  return `₹${Number(n || 0).toFixed(2)}`;
}

function formatTime(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderCard({
  order,
  busy,
  onView,
  onAccept,
  onReject,
  onAdvance,
  onPrintKot,
}: {
  order: Order;
  busy: boolean;
  onView: () => void;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: (status: string) => void;
  onPrintKot: () => void;
}) {
  const st = String(order.status || 'pending').toLowerCase();
  const cfg = STATUS[st] || STATUS.pending;
  const itemCount = (order.items || []).reduce(
    (s, i) => s + Number(i.quantity || 0),
    0
  );

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-gray-100 bg-white transition-all duration-200 hover:shadow-md hover:border-gray-200">
      <CardContent className="flex flex-1 flex-col p-4">
        {/* Top bar: Order ID & Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-black tracking-tight text-gray-900">
              {order.orderNumber}
            </h4>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="h-3 w-3 text-gray-400" />
              <span>{formatTime(order.createdAt)}</span>
              {order.orderType && (
                <>
                  <span>•</span>
                  <span className="capitalize font-medium">{order.orderType}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant={cfg.variant} className="text-[10px] font-bold">
            {cfg.label}
          </Badge>
        </div>

        {/* Customer & Table Information */}
        <div className="mt-3 rounded-xl bg-gray-50/80 p-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 truncate">
              {order.customerName || 'Guest Customer'}
            </span>
            {order.tableNumber ? (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-900 shrink-0">
                Table #{order.tableNumber}
              </span>
            ) : (
              <span className="font-semibold text-gray-500 tabular-nums">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between text-gray-500">
            <span>{order.customerPhone || (order.tableNumber ? `${itemCount} items` : 'No phone')}</span>
            {order.tableNumber && (
              <span className="font-medium text-gray-400 tabular-nums">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </div>

        {/* Item preview snippet */}
        <div className="mt-3 flex-1 space-y-1">
          {(order.items || []).slice(0, 3).map((it, idx) => (
            <div key={idx} className="flex justify-between text-xs text-gray-600">
              <span className="truncate pr-2 font-medium">
                {it.quantity}× {it.name}
              </span>
              <span className="shrink-0 tabular-nums text-gray-900 font-semibold">
                {money(Number(it.price) * Number(it.quantity || 1))}
              </span>
            </div>
          ))}
          {(order.items || []).length > 3 && (
            <p className="text-[11px] font-medium text-gray-400">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>

        {/* Total & Action Row */}
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total</span>
            <span className="text-base font-black tabular-nums text-gray-900">
              {money(order.total)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {st === 'pending' && !order.assignedStaffId && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={busy}
                  onClick={onAccept}
                  className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700 text-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Accept</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={onReject}
                  className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            )}

            {st === 'confirmed' && (
              <Button
                size="sm"
                variant="default"
                disabled={busy}
                onClick={() => onAdvance('preparing')}
                className="flex-1 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs text-white"
              >
                <ChefHat className="h-3.5 w-3.5" />
                <span>Prepare</span>
              </Button>
            )}

            {st === 'preparing' && (
              <Button
                size="sm"
                variant="default"
                disabled={busy}
                onClick={() => onAdvance('ready')}
                className="flex-1 gap-1.5 bg-purple-600 hover:bg-purple-700 text-xs text-white"
              >
                <BellRing className="h-3.5 w-3.5" />
                <span>Ready</span>
              </Button>
            )}

            {st === 'ready' && (
              <Button
                size="sm"
                variant="primary"
                disabled={busy}
                onClick={() => onAdvance('completed')}
                className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Complete</span>
              </Button>
            )}

            {/* Quick Print KOT Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={onPrintKot}
              className="h-8 px-2 text-xs text-amber-700 hover:bg-amber-50 hover:text-amber-900 border-amber-200"
              title="Print Kitchen Ticket (KOT)"
            >
              <Printer className="h-3.5 w-3.5" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onView}
              className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900"
              title="View full order details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [wsStatus, setWsStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [printOrder, setPrintOrder] = useState<{ order: Order; type: 'kot' | 'bill' } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => soundEngine.enabled);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const upsertOrder = useCallback((order: Order) => {
    if (!order?.id) return;
    // Play alert sound when new order or status update arrives
    soundEngine.playNewOrderChime();
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === order.id);
      if (idx === -1) return [order, ...prev];
      const next = [...prev];
      next[idx] = { ...next[idx], ...order };
      return next;
    });
    setViewOrder((cur) => (cur?.id === order.id ? { ...cur, ...order } : cur));
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/orders', { params: { limit: 100 } });
      const list = res.data?.data ?? res.data ?? [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    let s: Socket | null = null;

    (async () => {
      setWsStatus('connecting');
      let token: string | undefined;
      try {
        const res = await api.get('/auth/ws-token');
        token = res.data?.data?.token;
      } catch (e) {
        console.warn('[WS] ws-token failed', e);
      }
      if (cancelled) return;

      s = io(getSocketUrl(), {
        path: '/socket.io',
        withCredentials: true,
        auth: token ? { token } : undefined,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 30,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
      });
      socketRef.current = s;

      s.on('connect', () => {
        setWsStatus('connected');
        load();
      });
      s.on('disconnect', () => setWsStatus('disconnected'));
      s.on('connect_error', () => setWsStatus('disconnected'));
      s.on('order:created', upsertOrder);
      s.on('order:accepted', upsertOrder);
      s.on('order:updated', upsertOrder);
    })();

    return () => {
      cancelled = true;
      s?.removeAllListeners();
      s?.disconnect();
      socketRef.current = null;
    };
  }, [load, upsertOrder]);

  const accept = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await api.post(`/orders/${id}/accept`);
      upsertOrder(res.data?.data ?? res.data);
    } catch (e) {
      console.error('Failed to accept order', e);
    } finally {
      setActionLoading(null);
    }
  };

  const setStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      upsertOrder(res.data?.data ?? res.data);
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setActionLoading(null);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const o of orders) {
      const st = String(o.status || '').toLowerCase();
      c[st] = (c[st] || 0) + 1;
    }
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const st = String(o.status || '').toLowerCase();
      if (filter !== 'all' && st !== filter) return false;
      if (!q) return true;
      return (
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.toLowerCase().includes(q) ||
        (o.tableNumber && String(o.tableNumber).toLowerCase().includes(q))
      );
    });
  }, [orders, filter, search]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Live Connection Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Live Orders</h1>
          <p className="text-xs font-medium text-gray-500">
            Real-time kitchen order display & fulfillment board
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Chime Toggle Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const next = !soundEnabled;
              soundEngine.setEnabled(next);
              setSoundEnabled(next);
              if (next) soundEngine.playNewOrderChime();
            }}
            className="gap-1.5 text-xs font-bold"
            title="Toggle kitchen bell chime for new orders"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Sound: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500">Sound: OFF</span>
              </>
            )}
          </Button>

          {/* WS Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              wsStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : wsStatus === 'connecting'
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                  : 'bg-red-50 text-red-700 ring-1 ring-red-200'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                wsStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : wsStatus === 'connecting'
                    ? 'bg-amber-400'
                    : 'bg-red-500'
              }`}
            />
            {wsStatus === 'connected' ? 'LIVE' : wsStatus === 'connecting' ? 'SYNCING' : 'OFFLINE'}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => load()}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((t) => {
            const active = filter === t.key;
            const count = counts[t.key] || 0;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                  active
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search order #, table, customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-xs font-medium text-gray-900 shadow-2xs outline-none placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Orders Grid */}
      {filtered.length === 0 ? (
        <Card className="border-dashed p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">No orders found</h3>
          <p className="mt-1 text-xs text-gray-500">
            {filter === 'all'
              ? 'New orders from your cafe will stream here in real time.'
              : `No orders currently matching "${filter}" status.`}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              busy={actionLoading === o.id}
              onView={() => setViewOrder(o)}
              onAccept={() => accept(o.id)}
              onReject={() => setStatus(o.id, 'cancelled')}
              onAdvance={(status) => setStatus(o.id, status)}
              onPrintKot={() => setPrintOrder({ order: o, type: 'kot' })}
            />
          ))}
        </div>
      )}

      {/* Order Detail Drawer Panel */}
      {viewOrder && (
        <OrderDetailPanel
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          busy={actionLoading === viewOrder.id}
          onAccept={() => accept(viewOrder.id)}
          onReject={() => setStatus(viewOrder.id, 'cancelled')}
          onStatus={(status) => setStatus(viewOrder.id, status)}
        />
      )}

      {/* Quick Thermal KOT & Bill Printing Modal */}
      {printOrder && (
        <ThermalPrintModal
          order={printOrder.order}
          initialType={printOrder.type}
          onClose={() => setPrintOrder(null)}
        />
      )}
    </div>
  );
}
