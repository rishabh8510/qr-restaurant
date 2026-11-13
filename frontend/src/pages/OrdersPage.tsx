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
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
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

function getServiceLabel(order: Order) {
  const type = String(order.orderType || '').toLowerCase();
  if (order.tableNumber || type === 'dine-in') {
    return `TABLE ${order.tableNumber || '—'}`;
  }
  if (type === 'drive-in') {
    return `DRIVE-IN · ${order.customerPhone || 'CAR'}`;
  }
  return 'TAKEAWAY';
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
  const when = formatTime(order.createdAt);
  const serviceText = getServiceLabel(order);

  return (
    <article className="order flex flex-col justify-between bg-white border border-[#e8e8e8] rounded-[11px] p-3 shadow-2xs hover:border-gray-300 transition">
      <div>
        {/* Head: Order ID & Service Badge */}
        <div className="order-head flex items-start justify-between gap-2.5">
          <div>
            <div className="oid text-[16px] font-black text-[#222]">
              {order.orderNumber || 'New Order'}
            </div>
            <div className="time text-[11px] text-[#888] mt-1 font-medium">
              {when}
            </div>
          </div>
          <span className="service text-[12px] font-extrabold bg-[#fff2df] text-[#8a4d00] px-2.5 py-1.5 rounded-[8px] shrink-0 tracking-wide">
            {serviceText}
          </span>
        </div>

        {/* Customer Info */}
        <div className="customer text-[12px] leading-relaxed my-2 text-[#444]">
          <span className="font-bold text-[#222]">{order.customerName || 'Customer'}</span>
          <span className="text-[#888]"> · </span>
          <span>{order.customerPhone || 'No phone'}</span>

          {order.notes && (
            <div className="mt-2 p-2 bg-[#fff4d6] border-l-[3px] border-[#ed101c] rounded-[6px] text-[#754b00] text-[11px] leading-snug">
              <b>Customer instruction:</b> {order.notes}
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="items border-t border-b border-[#eee] py-1.5 my-1.5 space-y-1">
          {(order.items || []).map((it, idx) => (
            <div key={idx} className="item flex justify-between gap-2 text-[12px]">
              <span className="text-[#333] truncate">
                {it.name} × {it.quantity}
              </span>
              <b className="text-[#222] shrink-0 tabular-nums font-bold">
                {money(Number(it.price) * Number(it.quantity || 1))}
              </b>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="total flex justify-between text-[14px] font-black py-1.5 text-[#222]">
          <span>Total</span>
          <span className="tabular-nums">{money(order.total)}</span>
        </div>
      </div>

      {/* Action Row */}
      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5">
        {st === 'pending' && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={onAccept}
              className="complete flex-1 bg-[#159447] text-white py-2 px-3 text-[12px] font-black rounded-[8px] hover:bg-green-700 active:scale-98 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              <span>ACCEPT ORDER</span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onReject}
              className="h-8 w-8 shrink-0 flex items-center justify-center rounded-[8px] border border-red-200 text-red-600 hover:bg-red-50 text-xs transition cursor-pointer"
              title="Reject Order"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        {st === 'confirmed' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAdvance('preparing')}
            className="complete flex-1 bg-indigo-600 text-white py-2 px-3 text-[12px] font-black rounded-[8px] hover:bg-indigo-700 active:scale-98 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ChefHat className="h-3.5 w-3.5" />
            <span>START PREPARING</span>
          </button>
        )}

        {st === 'preparing' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAdvance('ready')}
            className="complete flex-1 bg-purple-600 text-white py-2 px-3 text-[12px] font-black rounded-[8px] hover:bg-purple-700 active:scale-98 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BellRing className="h-3.5 w-3.5" />
            <span>MARK AS READY</span>
          </button>
        )}

        {st === 'ready' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAdvance('completed')}
            className="complete flex-1 bg-[#159447] text-white py-2 px-3 text-[12px] font-black rounded-[8px] hover:bg-green-700 active:scale-98 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>✓ COMPLETE ORDER</span>
          </button>
        )}

        {st === 'completed' && (
          <div className="completed-label flex-1 bg-[#e9f7ed] text-[#168343] text-center py-2 px-3 rounded-[8px] font-black text-[12px]">
            ✓ COMPLETED
          </div>
        )}

        {st === 'cancelled' && (
          <div className="flex-1 bg-red-50 text-red-600 text-center py-2 px-3 rounded-[8px] font-black text-[12px]">
            CANCELLED
          </div>
        )}

        {/* Print KOT */}
        <button
          type="button"
          onClick={onPrintKot}
          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-[8px] border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs transition cursor-pointer"
          title="Print Kitchen Ticket (KOT)"
        >
          <Printer className="h-3.5 w-3.5" />
        </button>

        {/* View Details */}
        <button
          type="button"
          onClick={onView}
          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-[8px] border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition cursor-pointer"
          title="View full order details"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
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
          <div className="top flex items-center gap-3">
            <h1 className="text-[22px] font-black tracking-tight text-[#222]">
              {filter === 'completed' ? 'Completed Orders' : 'New Orders'}
            </h1>
            <span className="count bg-[#ed101c] text-white rounded-full px-3 py-1 text-[12px] font-extrabold tracking-wide shadow-xs">
              {counts.pending || 0} NEW
            </span>
          </div>
          <p className="text-xs font-medium text-[#777] mt-1">
            Real-time kitchen order display &amp; fulfillment board
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
            className="gap-1.5 text-xs font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="tabs flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => {
            const active = filter === t.key;
            const count = counts[t.key] || 0;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                className={`tab rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
                  active
                    ? 'bg-[#222] text-white border border-[#222] shadow-xs'
                    : 'border border-[#ddd] bg-white text-[#444] hover:bg-gray-50'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`ml-1.5 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                    active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
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
        <div className="empty bg-white p-12 text-center rounded-[12px] border border-[#e8e8e8] text-[#777] text-sm font-medium">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No orders found</h3>
          <p className="mt-1 text-xs text-gray-500">
            {filter === 'all'
              ? 'New orders from your cafe will stream here in real time.'
              : `No orders currently matching "${filter}" status.`}
          </p>
        </div>
      ) : (
        <div className="orders grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
