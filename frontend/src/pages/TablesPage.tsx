import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import type { Order } from '@/types/index';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useRestaurant } from '@/hooks';
import {
  QrCode,
  Printer,
  Copy,
  ExternalLink,
  Check,
  Globe,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export function TablesPage() {
  const { data: restData } = useRestaurant();
  const { data: ordersData } = useQuery({
    queryKey: ['tableOrders'],
    queryFn: () =>
      api.get<{ success: boolean; data: Order[] }>('/orders', { params: { limit: 50 } }).then((r) => r.data),
  });
  const restaurantName = restData?.data?.name || 'Cafe & Restaurant';

  const [baseUrl, setBaseUrl] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cafe_qr_base_url') : null;
    if (saved && !saved.includes('localhost') && !saved.includes('127.0.0.1')) {
      return saved;
    }
    if (typeof window !== 'undefined') {
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return window.location.origin;
      }
    }
    return 'https://lotushut.bluewebspark.com';
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('cafe_qr_base_url', baseUrl);
  }, [baseUrl]);

  const qrUrl = baseUrl.replace(/\/+$/, '');

  const copyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Find active orders by table
  const activeOrders = (ordersData?.data || []).filter((o: Order) =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(String(o.status).toLowerCase())
  );

  const activeTablesMap = new Map<string, number>();
  activeOrders.forEach((o: Order) => {
    if (o.tableNumber) {
      const t = String(o.tableNumber);
      activeTablesMap.set(t, (activeTablesMap.get(t) || 0) + 1);
    }
  });

  return (
    <div className="space-y-8">
      {/* Print Styles for Universal Acrylic Table Standee */}
      <style>{`
        @media print {
          @page {
            size: A5 portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-standee, #printable-standee * {
            visibility: visible !important;
          }
          #printable-standee {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 130mm !important;
            border: 2px solid #000 !important;
            padding: 10mm !important;
            border-radius: 8mm !important;
            text-align: center !important;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Restaurant QR Code &amp; Table Standee
          </h1>
          <p className="text-xs font-medium text-gray-500">
            One universal QR code for all tables. Customers scan with their phone and enter their table number.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="default"
            onClick={handlePrint}
            className="gap-2 bg-gray-900 text-white hover:bg-black font-bold"
          >
            <Printer className="h-4 w-4" />
            <span>Print Table Standee</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Master QR Standee Preview (8 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            id="printable-standee"
            className="relative flex w-full max-w-md flex-col items-center rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg"
          >
            {/* Header Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-900 ring-1 ring-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Contactless Digital Menu</span>
            </div>

            {/* Restaurant Brand Title */}
            <div className="mb-6 flex flex-col items-center">
              <img
                src="/logo.jpeg"
                alt="Lotus Hut"
                className="mb-2 h-16 w-16 rounded-full object-cover shadow-md ring-2 ring-red-100"
              />
              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                {restaurantName}
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Scan • Select Table • Order
              </p>
            </div>

            {/* Large High-Res QR Code */}
            <div className="my-2 rounded-3xl border-2 border-dashed border-gray-200 bg-white p-5 shadow-xs">
              <QRCodeSVG
                value={qrUrl}
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-6 w-full space-y-2 rounded-2xl bg-gray-50/80 p-4 text-xs font-medium text-gray-700">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                  1
                </span>
                <span>Open your phone camera &amp; scan this QR code</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                  2
                </span>
                <span>Browse our menu &amp; add your favorite food to cart</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                  3
                </span>
                <span>Enter your <b>Table Number</b> at checkout for delivery!</span>
              </div>
            </div>

            {/* Bottom URL */}
            <p className="mt-4 text-[11px] font-mono text-gray-400 truncate max-w-full">
              {qrUrl}
            </p>

            {/* Action Bar (Hidden on print) */}
            <div className="no-print mt-6 flex w-full gap-2.5 border-t border-gray-100 pt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
                className="flex-1 gap-1.5 text-xs font-bold"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-gray-500" />
                    <span>Copy Menu Link</span>
                  </>
                )}
              </Button>

              <a
                href={qrUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                <span>Test Menu</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Settings & Live Table Status (5 Cols) */}
        <div className="no-print lg:col-span-5 space-y-6">
          {/* Base URL configuration */}
          <Card className="border-gray-100 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary-600" />
                <span>Customer Web Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-500">
                The web address encoded into the table QR code. In local testing use <code>http://localhost:3000</code>.
              </p>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://yourcafe.com"
                className="font-mono text-xs font-bold"
              />
            </CardContent>
          </Card>

          {/* Active Tables Overview */}
          <Card className="border-gray-100 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-amber-600" />
                  <span>Current Table Occupancy</span>
                </CardTitle>
                <Badge variant={activeTablesMap.size > 0 ? 'success' : 'secondary'}>
                  {activeTablesMap.size} Active {activeTablesMap.size === 1 ? 'Table' : 'Tables'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {activeTablesMap.size === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                  <p className="text-xs font-semibold text-gray-500">No active dine-in orders right now</p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    When customers scan the QR and order with their table number, active tables appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {Array.from(activeTablesMap.entries()).map(([table, count]) => (
                    <div
                      key={table}
                      className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 p-3"
                    >
                      <div>
                        <p className="text-xs font-black text-amber-950">Table #{table}</p>
                        <p className="text-[10px] font-medium text-amber-700">
                          {count} active {count === 1 ? 'order' : 'orders'}
                        </p>
                      </div>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips for Restaurant Owners */}
          <Card className="border-gray-100 bg-white">
            <CardContent className="p-5 text-xs text-gray-600 space-y-2">
              <p className="font-bold text-gray-900">💡 Printing &amp; Setup Tip:</p>
              <p>
                Print 10–20 copies of this standee card on cardstock or acrylic 4×6 tents. Place one on every table and at your billing counter.
              </p>
              <p>
                Customers will scan, view the live digital menu, and simply enter their table number when submitting their order!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
