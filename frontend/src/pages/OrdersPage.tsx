import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/api/client';
import type { Order } from '@/types/index';
import { soundEngine } from '@/utils/audioAlert';
import { Loader } from '@/components/ui/Loader';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';

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
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

function formatTime(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getServiceLabel(order: Order) {
  const type = String(order.orderType || '').toLowerCase();
  if (order.tableNumber || type === 'dine-in' || type === 'dining') {
    return `TABLE ${order.tableNumber || '—'}`;
  }
  if (type === 'drive-in') {
    return `DRIVE-IN · ${order.customerPhone || 'CAR'}`;
  }
  return 'TAKEAWAY';
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'received' | 'completed'>('received');
  const [soundEnabled, setSoundEnabled] = useState(() => soundEngine.enabled);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const upsertOrder = useCallback((order: Order) => {
    if (!order?.id) return;
    soundEngine.playNewOrderChime();
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === order.id);
      if (idx === -1) return [order, ...prev];
      const next = [...prev];
      next[idx] = { ...next[idx], ...order };
      return next;
    });
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
        load();
      });
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

  const markCompleted = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await api.patch(`/orders/${id}/status`, { status: 'completed' });
      const updated = res.data?.data ?? res.data;
      if (updated) {
        upsertOrder(updated);
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: 'completed' } : o))
        );
      }
    } catch (e) {
      console.error('Failed to mark order completed', e);
    } finally {
      setActionLoading(null);
    }
  };

  const freshOrders = useMemo(
    () => orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled'),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'completed'),
    [orders]
  );

  const displayedOrders = tab === 'received' ? freshOrders : completedOrders;

  const toggleSound = () => {
    const next = !soundEnabled;
    soundEngine.setEnabled(next);
    setSoundEnabled(next);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto p-3 sm:p-4 pb-12 font-sans text-[#222]">
      {/* Top Bar matching HTML Template */}
      <div className="flex items-center justify-between my-1.5 mb-3.5">
        <h1 className="text-[22px] font-black text-[#222] m-0">
          {tab === 'received' ? 'New Orders' : 'Completed Orders'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="p-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-black cursor-pointer shadow-2xs"
            title={soundEnabled ? 'Mute alert chime' : 'Unmute alert chime'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            type="button"
            onClick={load}
            className="p-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-black cursor-pointer shadow-2xs"
            title="Refresh Orders"
          >
            <RefreshCw size={15} />
          </button>
          <span className="bg-[#ed101c] text-white rounded-[20px] px-3 py-1.5 text-xs font-extrabold tracking-wide">
            {freshOrders.length} NEW
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3.5">
        <button
          type="button"
          onClick={() => setTab('received')}
          className={`border rounded-[22px] px-4 py-2 text-[13px] font-bold cursor-pointer transition ${
            tab === 'received'
              ? 'bg-[#222] text-white border-[#222]'
              : 'bg-white text-[#222] border-[#ddd] hover:bg-gray-50'
          }`}
        >
          New
        </button>
        <button
          type="button"
          onClick={() => setTab('completed')}
          className={`border rounded-[22px] px-4 py-2 text-[13px] font-bold cursor-pointer transition ${
            tab === 'completed'
              ? 'bg-[#222] text-white border-[#222]'
              : 'bg-white text-[#222] border-[#ddd] hover:bg-gray-50'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Orders Grid */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white py-12 px-4 text-center rounded-[12px] text-[#777] text-sm border border-[#e8e8e8]">
          {tab === 'received' ? 'No new orders right now.' : 'No completed orders yet.'}
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5">
          {displayedOrders.map((o) => {
            const when = formatTime(o.createdAt);
            const serviceText = getServiceLabel(o);
            const isBusy = actionLoading === o.id;

            return (
              <article
                key={o.id}
                className="bg-white border border-[#e8e8e8] rounded-[11px] p-2.5 min-w-0 flex flex-col justify-between shadow-2xs hover:border-gray-300 transition"
              >
                <div>
                  {/* Order Head */}
                  <div className="flex justify-between items-start gap-2.5">
                    <div>
                      <div className="text-[16px] font-black text-[#222]">
                        {o.orderNumber || 'New Order'}
                      </div>
                      <div className="text-[11px] text-[#888] mt-1 font-medium">
                        {when}
                      </div>
                    </div>
                    <span className="text-[12px] font-extrabold bg-[#fff2df] text-[#8a4d00] px-2.5 py-1.5 rounded-[8px] h-max shrink-0 tracking-wide">
                      {serviceText}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="text-[12px] leading-[1.4] my-2 text-[#444]">
                    <b className="text-[#222]">{o.customerName || 'Customer'}</b> ·{' '}
                    {o.customerPhone || 'No phone'}
                    {o.notes && (
                      <div className="mt-2 p-2 bg-[#fff4d6] border-l-[3px] border-[#ed101c] rounded-[6px] text-[#754b00] text-[11px] leading-snug">
                        <b>Customer instruction:</b> {o.notes}
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="border-t border-b border-[#eee] py-1.5 space-y-1">
                    {(o.items || []).map((it, idx) => (
                      <div key={idx} className="flex justify-between gap-2 py-0.5 text-[12px]">
                        <span className="text-[#333] truncate">
                          {it.name} × {it.quantity}
                        </span>
                        <b className="tabular-nums font-bold text-[#222] shrink-0">
                          {money(Number(it.price) * Number(it.quantity || 1))}
                        </b>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-[14px] font-black py-2 text-[#222]">
                    <span>Total</span>
                    <span className="tabular-nums">{money(o.total)}</span>
                  </div>
                </div>

                {/* Complete Action Button */}
                <div className="mt-2 pt-1">
                  {tab === 'received' ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => markCompleted(o.id)}
                      className="w-full border-0 rounded-[8px] bg-[#159447] hover:bg-[#12813d] active:scale-98 text-white p-2.5 text-[12px] font-black cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <span>{isBusy ? 'UPDATING…' : '✓ COMPLETE ORDER'}</span>
                    </button>
                  ) : (
                    <div className="w-full bg-[#e9f7ed] text-[#168343] text-center p-3 rounded-[9px] font-black text-[13px]">
                      ✓ COMPLETED
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Note */}
      <p className="text-[11px] text-[#777] leading-[1.5] my-3 mt-4">
        All pending orders are shown together with newest orders first. Click &quot;✓ COMPLETE ORDER&quot; to move an order to completed.
      </p>
    </div>
  );
}
export default OrdersPage;
