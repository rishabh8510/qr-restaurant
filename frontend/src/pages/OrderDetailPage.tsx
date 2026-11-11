import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { Loader } from '@/components/ui/Loader';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
  productId?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  orderType?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  total: number | string;
  subtotal?: number | string;
  tax?: number | string;
  discount?: number | string;
  items: OrderItem[];
  notes?: string | null;
  assignedStaffId?: string | null;
  assignedStaff?: { id: string; name: string } | null;
  orderSource?: string;
  createdAt: string;
  pricingMeta?: {
    cgst?: number;
    sgst?: number;
    cgstPercent?: number;
    sgstPercent?: number;
    deliveryCharge?: number;
    packingCharge?: number;
    discountLabel?: string | null;
  } | null;
};

const statusStyle: Record<string, { label: string; badge: string; border: string }> = {
  pending: {
    label: 'New order',
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
    border: 'border-amber-400',
  },
  confirmed: {
    label: 'Accepted',
    badge: 'bg-blue-100 text-blue-800 ring-blue-200',
    border: 'border-blue-500',
  },
  preparing: {
    label: 'Preparing',
    badge: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
    border: 'border-indigo-500',
  },
  ready: {
    label: 'Ready',
    badge: 'bg-purple-100 text-purple-800 ring-purple-200',
    border: 'border-purple-500',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    border: 'border-emerald-500',
  },
  cancelled: {
    label: 'Rejected',
    badge: 'bg-red-100 text-red-800 ring-red-200',
    border: 'border-red-500',
  },
};

function money(n: number | string | undefined | null) {
  return `₹${Number(n || 0).toFixed(2)}`;
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data?.data ?? res.data);
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Order not found';
      setError(msg);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const accept = async () => {
    if (!order) return;
    setBusy(true);
    try {
      await api.post(`/orders/${order.id}/accept`);
      await load();
    } catch (e: unknown) {
      alert(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to accept'
      );
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (status: string) => {
    if (!order) return;
    setBusy(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status });
      await load();
    } catch (e: unknown) {
      alert(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to update'
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-lg font-semibold text-gray-800">{error || 'Order not found'}</p>
        <Link
          to="/orders"
          className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  const st = String(order.status || 'pending').toLowerCase();
  const cfg = statusStyle[st] || statusStyle.pending;
  const meta = order.pricingMeta || {};

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to orders
        </button>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${cfg.badge}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Header card */}
      <div className={`rounded-2xl border border-l-4 bg-white p-5 shadow-sm ${cfg.border}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Order detail
            </p>
            <h1 className="mt-1 text-2xl font-black text-gray-900">{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
              {order.orderSource ? ` · ${order.orderSource}` : ''}
            </p>
          </div>
          <p className="text-2xl font-black tabular-nums text-gray-900">{money(order.total)}</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-[10px] font-bold uppercase text-gray-400">Customer</p>
            <p className="mt-1 font-semibold text-gray-900">{order.customerName || 'Guest'}</p>
            {order.customerPhone && (
              <a
                href={`tel:${order.customerPhone}`}
                className="text-sm text-primary-600 hover:underline"
              >
                {order.customerPhone}
              </a>
            )}
            {order.customerEmail && (
              <p className="text-xs text-gray-500">{order.customerEmail}</p>
            )}
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-[10px] font-bold uppercase text-gray-400">Type / payment</p>
            <p className="mt-1 font-semibold capitalize text-gray-900">
              {order.orderType || '—'}
            </p>
            <p className="text-sm uppercase text-gray-600">
              {order.paymentMethod || '—'}
              {order.paymentStatus ? ` · ${order.paymentStatus}` : ''}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-[10px] font-bold uppercase text-gray-400">Staff</p>
            <p className="mt-1 font-semibold text-gray-900">
              {order.assignedStaff?.name || 'Unassigned'}
            </p>
          </div>
        </div>

        {order.notes && (
          <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <span className="font-bold">Customer note: </span>
            {order.notes}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Items ordered</h2>
        <ul className="mt-4 space-y-3">
          {(order.items || []).map((it, i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-xl border border-gray-50 bg-gray-50/50 p-3"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                {it.image ? (
                  <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{it.name}</p>
                <p className="text-sm text-gray-500">
                  {it.quantity} × {money(it.price)}
                </p>
              </div>
              <p className="text-base font-bold tabular-nums text-gray-900">
                {money(Number(it.price) * Number(it.quantity || 1))}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Bill */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Bill breakdown</h2>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {order.subtotal != null && (
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>
          )}
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>{meta.discountLabel || 'Discount'}</span>
              <span>-{money(order.discount)}</span>
            </div>
          )}
          {Number(meta.cgst) > 0 && (
            <div className="flex justify-between">
              <span>CGST ({meta.cgstPercent ?? ''}%)</span>
              <span>{money(meta.cgst)}</span>
            </div>
          )}
          {Number(meta.sgst) > 0 && (
            <div className="flex justify-between">
              <span>SGST ({meta.sgstPercent ?? ''}%)</span>
              <span>{money(meta.sgst)}</span>
            </div>
          )}
          {Number(meta.packingCharge) > 0 && (
            <div className="flex justify-between">
              <span>Packing</span>
              <span>{money(meta.packingCharge)}</span>
            </div>
          )}
          {Number(meta.deliveryCharge) > 0 && (
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{money(meta.deliveryCharge)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-100 pt-3 text-lg font-black text-gray-900">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        {st === 'pending' && !order.assignedStaffId && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={accept}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Accept order
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setStatus('cancelled')}
              className="rounded-xl border border-red-200 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}
        {st === 'confirmed' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus('preparing')}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Start preparing
          </button>
        )}
        {st === 'preparing' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus('ready')}
            className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            Mark ready
          </button>
        )}
        {st === 'ready' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus('completed')}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Complete
          </button>
        )}
        {['confirmed', 'preparing'].includes(st) && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus('cancelled')}
            className="rounded-xl border border-red-200 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
}