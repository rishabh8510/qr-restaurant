"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { fetchMyOrders } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrderItem {
  productId?: string;
  name: string;
  price: number | string;
  quantity: number;
  image?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string | null;
  status: string;
  orderType?: string;
  paymentMethod?: string;
  createdAt: string;
  total: number | string;
  items?: OrderItem[];
  pricingMeta?: {
    cgst?: number;
    sgst?: number;
    deliveryCharge?: number;
    packingCharge?: number;
    discountLabel?: string;
  } | null;
  discount?: number | string;
}

const STATUS_MAP: Record<
  string,
  { label: string; badgeVariant: 'default' | 'amber' | 'emerald' | 'destructive' | 'secondary' | 'outline'; hint: string }
> = {
  completed: {
    label: "Completed",
    badgeVariant: "emerald",
    hint: "✓ Order completed. Thank you for dining with Lotus Hut!",
  },
  cancelled: {
    label: "Cancelled",
    badgeVariant: "destructive",
    hint: "This order was cancelled.",
  },
  pending: {
    label: "Order Placed",
    badgeVariant: "amber",
    hint: "Your order has been placed and is being prepared.",
  },
};

function getStatusInfo(status: string) {
  const st = String(status || "pending").toLowerCase();
  if (st === "completed") return STATUS_MAP.completed;
  if (st === "cancelled") return STATUS_MAP.cancelled;
  return STATUS_MAP.pending;
}

export default function OrdersPage() {
  const { isLoggedIn, token, loading: authLoading, openLoginModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !token) {
      queueMicrotask(() => {
        setLoading(false);
        setOrders([]);
      });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const list = await fetchMyOrders(token);
        if (!cancelled) {
          setOrders(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();

    const id = window.setInterval(async () => {
      if (cancelled) return;
      try {
        const list = await fetchMyOrders(token);
        if (!cancelled) setOrders(Array.isArray(list) ? list : []);
      } catch {
        /* ignore polling errors */
      }
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [isLoggedIn, token, authLoading, refreshTrigger]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        <p className="mt-4 text-xs font-bold text-gray-500">Loading your orders…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
          <FiShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to view orders</h2>
        <p className="mt-1.5 text-xs text-gray-500 max-w-xs mx-auto">
          Login with your mobile number to view live cooking progress and past receipts.
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => openLoginModal()}
          className="mt-6 px-8 text-sm font-bold"
        >
          Sign In with Mobile
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
      >
        <FiArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span>Back to Menu</span>
      </Link>

      <div className="flex items-center justify-between border-b border-gray-100 pb-3 sm:pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">My Orders</h1>
          <p className="mt-0.5 text-[11px] sm:text-xs font-semibold text-gray-500">
            {orders.length} order{orders.length !== 1 ? "s" : ""} · Live status tracking
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          className="gap-1.5 text-xs font-bold py-1 px-2.5 sm:py-2 sm:px-3"
        >
          <FiRefreshCw className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {orders.length === 0 ? (
          <Card className="border-dashed p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <FiPackage size={20} />
            </div>
            <h3 className="mt-3 text-sm sm:text-base font-bold text-gray-900">No active orders</h3>
            <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
              You haven&apos;t placed any orders yet. Check out our menu to order!
            </p>
            <Link href="/" className="mt-4 sm:mt-5 inline-block">
              <Button variant="primary" size="sm" className="text-xs">
                Explore Menu
              </Button>
            </Link>
          </Card>
        ) : (
          orders.map((o) => {
            const st = String(o.status || "pending").toLowerCase();
            const meta = getStatusInfo(st);

            return (
              <Card key={o.id} className="overflow-hidden border-gray-100 bg-white shadow-xs rounded-xl sm:rounded-2xl">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-gray-100 bg-gray-50/60 p-3 sm:px-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-gray-900">{o.orderNumber}</span>
                      {o.tableNumber && (
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-black text-amber-900">
                          {String(o.orderType || '').toLowerCase().includes('drive')
                            ? `🚗 Car #${o.tableNumber}`
                            : `📍 Table #${o.tableNumber}`}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                      <span>{new Date(o.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      <span>•</span>
                      <span className="capitalize font-semibold">{o.orderType || "Dine-in"}</span>
                      <span>•</span>
                      <span className="capitalize">{o.paymentMethod || "Cash"}</span>
                    </p>
                  </div>

                  <Badge variant={meta.badgeVariant} className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold">
                    {meta.label}
                  </Badge>
                </div>

                <CardContent className="p-3 sm:p-6">
                  {/* Status hint box */}
                  <div className={`rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-[11px] sm:text-xs font-bold flex items-center gap-2 ${
                    st === "completed"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      : st === "cancelled"
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-amber-50 text-amber-900 border border-amber-100"
                  }`}>
                    <span>{meta.hint}</span>
                  </div>

                  {/* Items list */}
                  <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-3 sm:pt-4">
                    <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Items Ordered ({o.items?.length || 0})
                    </h4>
                    <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      {(o.items || []).map((it, idx) => (
                        <li key={idx} className="flex justify-between items-center text-gray-800">
                          <span className="font-semibold">
                            {it.quantity}× {it.name}
                          </span>
                          <span className="font-bold tabular-nums">
                            ₹{(Number(it.price) * Number(it.quantity || 1)).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total Amount Only */}
                  <div className="mt-3 sm:mt-4 border-t border-gray-100 pt-2.5 sm:pt-3 flex justify-between text-sm sm:text-base font-black text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-amber-600 tabular-nums">₹{Number(o.total || 0).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </section>
  );
}
