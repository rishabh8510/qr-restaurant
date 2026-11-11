import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Order } from '@/types/index';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThermalPrintModal } from '@/components/ThermalPrintModal';
import { X, ChefHat, BellRing, CheckCircle2, Phone, Clock, FileText, Printer } from 'lucide-react';

function usePortalNode() {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-order-detail-portal', '');
    document.documentElement.appendChild(el);
    nodeRef.current = el;
    forceRender((n) => n + 1);
    return () => {
      document.documentElement.removeChild(el);
      nodeRef.current = null;
    };
  }, []);

  return nodeRef.current;
}

const STATUS: Record<string, { label: string; badge: 'warning' | 'info' | 'secondary' | 'success' | 'destructive' }> = {
  pending: { label: 'New order', badge: 'warning' },
  confirmed: { label: 'Accepted', badge: 'info' },
  preparing: { label: 'Preparing', badge: 'secondary' },
  ready: { label: 'Ready', badge: 'secondary' },
  completed: { label: 'Completed', badge: 'success' },
  cancelled: { label: 'Cancelled', badge: 'destructive' },
};

function money(n: number | string | undefined | null) {
  return `₹${Number(n || 0).toFixed(2)}`;
}

function formatTime(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderDetailPanel({
  order,
  onClose,
  busy,
  onAccept,
  onReject,
  onStatus,
}: {
  order: Order;
  onClose: () => void;
  busy: boolean;
  onAccept: () => void;
  onReject: () => void;
  onStatus: (s: string) => void;
}) {
  const portalNode = usePortalNode();
  const [printType, setPrintType] = useState<'kot' | 'bill' | null>(null);
  const st = String(order.status || 'pending').toLowerCase();
  const cfg = STATUS[st] || STATUS.pending;
  const meta = order.pricingMeta || {};
  const billLines: Array<{ label: string; value: string; tone?: string }> = [];

  if (!portalNode) return null;

  if (order.subtotal != null) billLines.push({ label: 'Subtotal', value: money(order.subtotal) });
  if (Number(order.discount) > 0)
    billLines.push({ label: meta.discountLabel || 'Discount', value: `-${money(order.discount)}`, tone: 'text-emerald-700' });
  if (Number(meta.cgst) > 0) billLines.push({ label: `CGST (${meta.cgstPercent ?? ''}%)`, value: money(meta.cgst) });
  if (Number(meta.sgst) > 0) billLines.push({ label: `SGST (${meta.sgstPercent ?? ''}%)`, value: money(meta.sgst) });
  if (Number(meta.packingCharge) > 0) billLines.push({ label: 'Packing', value: money(meta.packingCharge) });
  if (Number(meta.deliveryCharge) > 0) billLines.push({ label: 'Delivery', value: money(meta.deliveryCharge) });

  return createPortal(
    <div className="fixed inset-0 top-0 left-0 z-[9999] flex h-screen w-screen justify-end">
      <button
        type="button"
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative flex h-screen w-full max-w-md flex-col bg-white shadow-2xl ring-1 ring-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-black tracking-tight text-gray-900">{order.orderNumber}</h2>
              <Badge variant={cfg.badge} className="mt-1">
                {cfg.label}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Customer info card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Customer</p>
                <p className="mt-1 font-bold text-gray-900">{order.customerName || 'Guest'}</p>
                {order.customerPhone && (
                  <a href={`tel:${order.customerPhone}`} className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline">
                    <Phone className="h-3 w-3" />
                    {order.customerPhone}
                  </a>
                )}
                {order.tableNumber && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-900">
                    <span>📍 Table #{order.tableNumber}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Placed</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  {formatTime(order.createdAt)}
                </p>
                <p className="mt-1 text-xs font-semibold capitalize text-gray-500">
                  {order.orderType || '—'} · {order.paymentMethod || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <span className="font-bold">Customer Note: </span>
                <span>{order.notes}</span>
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Order Items ({order.items?.length || 0})
            </h3>
            <ul className="space-y-2">
              {(order.items || []).map((it, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    {it.image ? (
                      <img src={it.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm">🍽️</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{it.name}</p>
                    <p className="text-xs font-medium text-gray-500">
                      {it.quantity} × {money(it.price)}
                    </p>
                  </div>
                  <p className="font-bold tabular-nums text-gray-900">
                    {money(Number(it.price) * Number(it.quantity || 1))}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Bill summary */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 text-sm">
            <div className="space-y-2 text-gray-600">
              {billLines.map((line) => (
                <div key={line.label} className={`flex justify-between ${line.tone || ''}`}>
                  <span className="text-xs">{line.label}</span>
                  <span className="text-xs font-semibold">{line.value}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-200 pt-2.5 text-base font-black text-gray-900">
                <span>Total</span>
                <span>{money(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Print Bar */}
        <div className="flex gap-2 border-t border-gray-100 bg-gray-50/80 px-6 py-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPrintType('kot')}
            className="flex-1 gap-1.5 text-xs font-bold text-gray-800 hover:bg-white"
          >
            <Printer className="h-3.5 w-3.5 text-amber-600" />
            <span>Print KOT</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPrintType('bill')}
            className="flex-1 gap-1.5 text-xs font-bold text-gray-800 hover:bg-white"
          >
            <Printer className="h-3.5 w-3.5 text-emerald-600" />
            <span>Print Bill</span>
          </Button>
        </div>

        {/* Bottom actions */}
        <div className="flex gap-2.5 border-t border-gray-100 p-4">
          {st === 'pending' && !order.assignedStaffId && (
            <>
              <Button
                variant="primary"
                disabled={busy}
                onClick={onAccept}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Accept Order
              </Button>
              <Button
                variant="destructive"
                disabled={busy}
                onClick={onReject}
                className="flex-1"
              >
                Reject
              </Button>
            </>
          )}
          {st === 'confirmed' && (
            <Button
              variant="default"
              disabled={busy}
              onClick={() => onStatus('preparing')}
              className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <ChefHat className="h-4 w-4" />
              <span>Start Preparing</span>
            </Button>
          )}
          {st === 'preparing' && (
            <Button
              variant="default"
              disabled={busy}
              onClick={() => onStatus('ready')}
              className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <BellRing className="h-4 w-4" />
              <span>Mark as Ready</span>
            </Button>
          )}
          {st === 'ready' && (
            <Button
              variant="primary"
              disabled={busy}
              onClick={() => onStatus('completed')}
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete Order</span>
            </Button>
          )}
          {['confirmed', 'preparing'].includes(st) && (
            <Button
              variant="outline"
              disabled={busy}
              onClick={onReject}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {printType && (
        <ThermalPrintModal
          order={order}
          initialType={printType}
          onClose={() => setPrintType(null)}
        />
      )}
    </div>,
    document.body
  );
}
