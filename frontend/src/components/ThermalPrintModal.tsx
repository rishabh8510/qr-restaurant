import { useState } from 'react';
import type { Order } from '@/types/index';
import { Button } from '@/components/ui/Button';
import { Printer, X, ChefHat, Receipt } from 'lucide-react';

interface ThermalPrintModalProps {
  order: Order | null;
  onClose: () => void;
  initialType?: 'kot' | 'bill';
}

function money(n: number | string | undefined | null) {
  return `₹${Number(n || 0).toFixed(2)}`;
}

function formatDateTime(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ThermalPrintModal({
  order,
  onClose,
  initialType = 'kot',
}: ThermalPrintModalProps) {
  const [printType, setPrintType] = useState<'kot' | 'bill'>(initialType);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const meta = order.pricingMeta || {};
  const totalItemsCount = (order.items || []).reduce(
    (sum, i) => sum + Number(i.quantity || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Background overlay (hidden during print) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs no-print"
        onClick={onClose}
      />

      {/* Scoped Thermal Print Styles */}
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0mm;
          }
          body * {
            visibility: hidden !important;
          }
          #thermal-print-area, #thermal-print-area * {
            visibility: visible !important;
          }
          #thermal-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 78mm !important;
            padding: 4mm !important;
            font-family: monospace, Courier, sans-serif !important;
            color: #000 !important;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Dialog Card */}
      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl no-print">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-gray-700" />
            <h2 className="text-base font-bold text-gray-900">Thermal Print Preview</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Toggle Mode: KOT vs Customer Bill */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2">
          <button
            type="button"
            onClick={() => setPrintType('kot')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
              printType === 'kot'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ChefHat className="h-4 w-4 text-amber-600" />
            <span>KOT (Kitchen Ticket)</span>
          </button>
          <button
            type="button"
            onClick={() => setPrintType('bill')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
              printType === 'bill'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Receipt className="h-4 w-4 text-emerald-600" />
            <span>Customer Bill</span>
          </button>
        </div>

        {/* Receipt Paper Preview Container */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div
            id="thermal-print-area"
            className="mx-auto w-[300px] border border-dashed border-gray-300 bg-white p-5 font-mono text-xs text-gray-900 shadow-sm"
          >
            {printType === 'kot' ? (
              /* KOT Content */
              <div className="space-y-3">
                <div className="border-b-2 border-dashed border-black pb-2 text-center">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    *** KITCHEN ORDER ***
                  </h2>
                  <p className="text-[11px] font-bold">KOT Ticket</p>
                </div>

                {/* Table & Order Highlight */}
                <div className="border-b border-dashed border-black pb-2 text-center">
                  <p className="text-xl font-black tracking-tight">
                    {order.tableNumber
                      ? String(order.orderType || '').toLowerCase().includes('drive')
                        ? `CAR #${order.tableNumber}`
                        : `TABLE #${order.tableNumber}`
                      : 'TAKEAWAY / PICKUP'}
                  </p>
                  <p className="text-xs font-bold">Order: {order.orderNumber}</p>
                  <p className="text-[10px] text-gray-600">Time: {formatDateTime(order.createdAt)}</p>
                </div>

                {/* Items */}
                <div className="space-y-1.5 py-1">
                  <div className="flex justify-between border-b border-black pb-1 text-[11px] font-bold uppercase">
                    <span>QTY  ITEM</span>
                  </div>
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs">
                      <span className="font-bold">
                        [{it.quantity}] {it.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-black pt-2 text-xs font-bold">
                  <p>Total Items: {totalItemsCount}</p>
                </div>

                {/* Customer Notes */}
                {order.notes && (
                  <div className="border-t border-black pt-2 text-xs">
                    <p className="font-bold uppercase">Chef Note:</p>
                    <p className="font-semibold">{order.notes}</p>
                  </div>
                )}

                <div className="border-t-2 border-dashed border-black pt-2 text-center text-[10px]">
                  <p>-- End of KOT --</p>
                </div>
              </div>
            ) : (
              /* Customer Bill / Tax Invoice Content */
              <div className="space-y-3">
                <div className="border-b-2 border-dashed border-black pb-2 text-center">
                  <h2 className="text-base font-black uppercase">RESTAURANT &amp; CAFE</h2>
                  <p className="text-[10px]">Tax Invoice / Bill of Supply</p>
                  <p className="text-[10px] text-gray-600">{formatDateTime(order.createdAt)}</p>
                </div>

                {/* Order Details */}
                <div className="border-b border-dashed border-black pb-2 text-[11px]">
                  <p><span className="font-bold">Bill No:</span> {order.orderNumber}</p>
                  {order.tableNumber && (
                    <p>
                      <span className="font-bold">
                        {String(order.orderType || '').toLowerCase().includes('drive')
                          ? 'Car:'
                          : 'Table:'}
                      </span>{' '}
                      #{order.tableNumber}
                    </p>
                  )}
                  <p><span className="font-bold">Customer:</span> {order.customerName || 'Guest'}</p>
                  {order.customerPhone && (
                    <p><span className="font-bold">Phone:</span> {order.customerPhone}</p>
                  )}
                </div>

                {/* Items Table */}
                <div className="space-y-1 py-1 text-[11px]">
                  <div className="flex justify-between border-b border-black pb-1 font-bold">
                    <span>ITEM</span>
                    <span>QTY</span>
                    <span>AMT</span>
                  </div>
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate pr-1 max-w-[150px]">{it.name}</span>
                      <span>{it.quantity}</span>
                      <span>{money(Number(it.price) * Number(it.quantity || 1))}</span>
                    </div>
                  ))}
                </div>

                {/* Summary Lines */}
                <div className="space-y-1 border-t border-dashed border-black pt-2 text-[11px]">
                  {order.subtotal != null && (
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{money(order.subtotal)}</span>
                    </div>
                  )}
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-{money(order.discount)}</span>
                    </div>
                  )}
                  {Number(meta.cgst) > 0 && (
                    <div className="flex justify-between">
                      <span>CGST ({meta.cgstPercent}%):</span>
                      <span>{money(meta.cgst)}</span>
                    </div>
                  )}
                  {Number(meta.sgst) > 0 && (
                    <div className="flex justify-between">
                      <span>SGST ({meta.sgstPercent}%):</span>
                      <span>{money(meta.sgst)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t-2 border-black pt-1.5 text-sm font-black">
                    <span>TOTAL:</span>
                    <span>{money(order.total)}</span>
                  </div>

                  <div className="pt-1 text-[10px] text-gray-600">
                    <p>Payment: {String(order.paymentMethod || 'Cash').toUpperCase()} ({order.paymentStatus || 'Pending'})</p>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-black pt-3 text-center text-[11px]">
                  <p className="font-bold">THANK YOU! VISIT AGAIN</p>
                  <p className="text-[9px] text-gray-500">Please pay at counter or via UPI</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-white p-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handlePrint}
            className="gap-2 bg-gray-900 text-white hover:bg-black font-bold"
          >
            <Printer className="h-4 w-4" />
            <span>Print {printType === 'kot' ? 'KOT' : 'Bill'} Now</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
