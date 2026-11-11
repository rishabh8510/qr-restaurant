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

const FLOW = ["pending", "confirmed", "preparing", "ready", "completed"] as const;

const STATUS_MAP: Record<
  string,
  { label: string; badgeVariant: 'default' | 'amber' | 'emerald' | 'destructive' | 'secondary' | 'outline'; hint: string }
> = {
  pending: {
    label: "Order Placed",
    badgeVariant: "amber",
    hint: "Kitchen is reviewing your order...",
  },
  confirmed: {
    label: "Accepted",
    badgeVariant: "default",
    hint: "Chef has accepted your order.",
  },
  preparing: {
    label: "Preparing",
    badgeVariant: "amber",
    hint: "Your food is being freshly prepared in the kitchen.",
  },
  ready: {
    label: "Ready for Pickup / Table",
    badgeVariant: "emerald",
    hint: "Order is ready! Staff is serving your table.",
  },
  completed: {
    label: "Completed",
    badgeVariant: "emerald",
    hint: "Order served and completed. Enjoy your meal!",
  },
  cancelled: {
    label: "Cancelled",
    badgeVariant: "destructive",
    hint: "This order was cancelled.",
  },
};

function OrderStepper({ status }: { status: string }) {
  const st = status.toLowerCase();
  if (st === "cancelled") {
    return (
      <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-center text-xs font-semibold text-red-600">
        Order Cancelled
      </div>
    );
  }

  const currentIdx = FLOW.indexOf(st as (typeof FLOW)[number]);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="mt-4 flex items-center justify-between gap-1">
      {FLOW.map((step, i) => {
        const done = i <= activeIdx;
        const current = i === activeIdx;

        return (
          <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              {i > 0 && (
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    done ? "bg-amber-400" : "bg-gray-100"
                  }`}
                />
              )}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${
                  current
                    ? "bg-amber-400 text-black ring-4 ring-amber-100 scale-110"
                    : done
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {done && !current ? "✓" : i + 1}
              </div>
              {i < FLOW.length - 1 && (
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < activeIdx ? "bg-amber-400" : "bg-gray-100"
                  }`}
                />
              )}
            </div>
            <span
              className={`text-[10px] font-bold capitalize tracking-tight ${
                current ? "text-amber-800" : done ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {STATUS_MAP[step]?.label || step}
            </span>
          </div>
        );
      })}
    </div>
  );
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
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
      >
        <FiArrowLeft className="h-4 w-4" />
        <span>Back to Menu</span>
      </Link>

      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">My Orders</h1>
          <p className="mt-0.5 text-xs font-semibold text-gray-500">
            {orders.length} order{orders.length !== 1 ? "s" : ""} · Live status tracking
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          className="gap-2 text-xs font-bold"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {orders.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <FiPackage size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">No active orders</h3>
            <p className="mt-1 text-xs text-gray-500">
              You haven&apos;t placed any orders yet. Check out our menu to order!
            </p>
            <Link href="/" className="mt-5 inline-block">
              <Button variant="primary" size="sm">
                Explore Menu
              </Button>
            </Link>
          </Card>
        ) : (
          orders.map((o) => {
            const st = String(o.status || "pending").toLowerCase();
            const meta = STATUS_MAP[st] || STATUS_MAP.pending;
            const pm = o.pricingMeta || {};

            return (
              <Card key={o.id} className="overflow-hidden border-gray-100 bg-white shadow-xs">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 p-4 sm:px-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-gray-900">{o.orderNumber}</span>
                      {o.tableNumber && (
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-900">
                          Table #{o.tableNumber}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{new Date(o.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      <span>•</span>
                      <span className="capitalize font-semibold">{o.orderType || "Dine-in"}</span>
                      <span>•</span>
                      <span className="capitalize">{o.paymentMethod || "Cash"}</span>
                    </p>
                  </div>

                  <Badge variant={meta.badgeVariant} className="px-3 py-1 text-xs font-bold">
                    {meta.label}
                  </Badge>
                </div>

                <CardContent className="p-4 sm:p-6">
                  {/* Status hint & progress stepper */}
                  <p className="text-xs font-medium text-gray-500">{meta.hint}</p>
                  <OrderStepper status={st} />

                  {/* Items list */}
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Items Ordered ({o.items?.length || 0})
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm">
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

                  {/* Pricing Breakdown */}
                  <div className="mt-4 border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-500">
                    {Number(o.discount) > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>{pm.discountLabel || "Discount"}</span>
                        <span>-₹{Number(o.discount).toFixed(2)}</span>
                      </div>
                    )}
                    {Number(pm.cgst) > 0 && (
                      <div className="flex justify-between">
                        <span>CGST</span>
                        <span>₹{Number(pm.cgst).toFixed(2)}</span>
                      </div>
                    )}
                    {Number(pm.sgst) > 0 && (
                      <div className="flex justify-between">
                        <span>SGST</span>
                        <span>₹{Number(pm.sgst).toFixed(2)}</span>
                      </div>
                    )}
                    {Number(pm.deliveryCharge) > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>₹{Number(pm.deliveryCharge).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-black text-gray-900">
                      <span>Total Paid</span>
                      <span>₹{Number(o.total || 0).toFixed(2)}</span>
                    </div>
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
