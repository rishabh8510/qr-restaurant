"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiTruck,
  FiHome,
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
  FiGlobe,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { placeOrder, quoteOrder, OrderQuote } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type OrderType = "delivery" | "dining" | "pickup";
type PaymentMethod = "cash" | "card" | "upi" | "online";

const ORDER_TYPES: {
  value: OrderType;
  label: string;
  desc: string;
  icon: typeof FiTruck;
}[] = [
  { value: "delivery", label: "Delivery", desc: "Get it at your door", icon: FiTruck },
  { value: "dining", label: "Dine-in", desc: "Eat at restaurant", icon: FiHome },
  { value: "pickup", label: "Pickup", desc: "Collect yourself", icon: FiCheckCircle },
];

const PAYMENTS: {
  value: PaymentMethod;
  label: string;
  desc: string;
  icon: typeof FiDollarSign;
}[] = [
  { value: "cash", label: "Cash", desc: "Pay on delivery / counter", icon: FiDollarSign },
  { value: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: FiSmartphone },
  { value: "card", label: "Card", desc: "Debit / Credit card", icon: FiCreditCard },
  { value: "online", label: "Online", desc: "Net banking / wallet", icon: FiGlobe },
];

function BillSummary({
  quote,
  quoteLoading,
}: {
  quote: OrderQuote | null;
  quoteLoading: boolean;
}) {
  if (quoteLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center">
        <p className="text-xs font-semibold text-gray-400">Calculating pricing…</p>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Item Total</span>
        <span className="font-semibold text-gray-900">₹{quote.subtotal}</span>
      </div>

      <div className="border-t border-gray-200/80 pt-2 flex justify-between text-base font-black text-gray-900">
        <span>Total Payable</span>
        <span className="text-amber-600">₹{quote.total}</span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart, tableNumber, setTableNumber } = useCart();
  const { isLoggedIn, token, openLoginModal, user } = useAuth();

  const [step, setStep] = useState<"type" | "payment" | "done">("type");
  const [orderType, setOrderType] = useState<OrderType>(() => (tableNumber ? "dining" : "dining"));
  const [currentTable, setCurrentTable] = useState<string>(() => tableNumber || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const [name, setName] = useState<string>(() => user?.name ?? "");
  const [phone, setPhone] = useState<string>(() => user?.phone ?? "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [syncedUserId, setSyncedUserId] = useState<string | null>(
    user?.id ? String(user.id) : null
  );

  useEffect(() => {
    if (tableNumber) {
      queueMicrotask(() => {
        setCurrentTable((prev) => (prev !== tableNumber ? tableNumber : prev));
        setOrderType("dining");
      });
    }
  }, [tableNumber]);

  if (user?.id && String(user.id) !== syncedUserId) {
    setSyncedUserId(String(user.id));
    if (user.name && !name) setName(user.name);
    if (user.phone && !phone) setPhone(user.phone);
  }

  useEffect(() => {
    if (cartItems.length === 0) {
      let cancelled = false;
      queueMicrotask(() => {
        if (cancelled) return;
        setQuote(null);
      });
      return () => {
        cancelled = true;
      };
    }

    let cancelled = false;
    (async () => {
      setQuoteLoading(true);
      try {
        const q = await quoteOrder(
          cartItems.map((i) => ({
            productId: String(i.id),
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            image: i.image as string,
          })),
          token,
          orderType
        );
        if (!cancelled) setQuote(q);
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cartItems, token, orderType]);

  useEffect(() => {
    if (!isLoggedIn) {
      openLoginModal();
    }
  }, [isLoggedIn, openLoginModal]);

  if (!isLoggedIn) {
    return (
      <section className="mx-auto w-full max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
          <FiLock size={28} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Login Required to Checkout
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-xs text-gray-500">
          Please sign in with your mobile number to view payment options, choose your table, and place your order.
        </p>
        <button
          type="button"
          onClick={() => openLoginModal()}
          className="mt-6 w-full max-w-xs rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-black shadow-md hover:bg-amber-500 cursor-pointer mx-auto block"
        >
          Sign In with Mobile OTP
        </button>
      </section>
    );
  }

  if (cartItems.length === 0 && step !== "done") {
    return (
      <section className="mx-auto w-full max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-gray-700">Cart is empty</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-500"
        >
          Browse menu
        </Link>
      </section>
    );
  }

  const handlePlaceOrder = async () => {
    if (orderType === "dining" && !currentTable.trim()) {
      setError("Please enter or scan your Table Number");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const order = await placeOrder(
        {
          tableNumber: orderType === "dining" ? currentTable.trim() : undefined,
          customerName: name.trim() || undefined,
          customerPhone: phone.trim() || undefined,
          orderType,
          paymentMethod,
          notes: notes || undefined,
          items: cartItems.map((i) => ({
            productId: String(i.id),
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            image: i.image as string,
          })),
        },
        token || null
      );
      setOrderNumber(order.orderNumber || order.id);
      clearCart();
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const displayTotal = quote ? quote.total : totalPrice;

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      {step !== "done" && (
        <div className="mb-6 flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step === "type" ? "bg-amber-400 text-black" : "bg-green-500 text-white"
            }`}
          >
            {step === "type" ? "1" : "✓"}
          </div>
          <div className="h-0.5 flex-1 bg-gray-200">
            <div
              className={`h-full transition-all ${
                step === "payment" ? "w-full bg-amber-400" : "w-0"
              }`}
            />
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step === "payment" ? "bg-amber-400 text-black" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
        </div>
      )}

      {step === "type" && (
        <div className="space-y-6">
          {/* Quick OTP login banner */}
          {!isLoggedIn && (
            <div className="flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Save your order & track status
                </p>
                <p className="text-xs text-amber-700">
                  Login in 5 seconds with WhatsApp / SMS OTP
                </p>
              </div>
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="rounded-xl bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-black shadow-xs hover:bg-amber-500 cursor-pointer"
              >
                Login
              </button>
            </div>
          )}

          <div>
            <p className="mb-3 text-sm font-bold text-gray-800">Choose order type</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ORDER_TYPES.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOrderType(value)}
                  className={`flex flex-col items-center rounded-2xl border-2 p-4 text-center transition ${
                    orderType === value
                      ? "border-amber-400 bg-amber-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-amber-200"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      orderType === value ? "text-amber-600" : "text-gray-500"
                    }`}
                  />
                  <span className="mt-2 block text-sm font-bold text-gray-900">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table number for Dine-in */}
          {orderType === "dining" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-amber-900">
                Table Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 5, T-12"
                  value={currentTable}
                  onChange={(e) => {
                    setCurrentTable(e.target.value);
                    setTableNumber(e.target.value);
                  }}
                  className="flex-1 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-amber-800">
                Found on the acrylic standee at your dining table
              </p>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-800">Customer details</p>
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
            <textarea
              placeholder="Cooking instructions / special requests (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <BillSummary quote={quote} quoteLoading={quoteLoading} />

          <button
            type="button"
            onClick={() => setStep("payment")}
            className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-black shadow-sm transition hover:bg-amber-500"
          >
            Continue to payment
          </button>
        </div>
      )}

      {step === "payment" && (
        <div className="mt-8 space-y-6">
          <button
            type="button"
            onClick={() => setStep("type")}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            ← Change order type
          </button>

          <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm">
            Order type:{" "}
            <span className="font-bold capitalize text-gray-900">{orderType}</span>
          </div>

          <BillSummary quote={quote} quoteLoading={quoteLoading} />

          <div>
            <p className="mb-3 text-sm font-bold text-gray-800">Payment method</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PAYMENTS.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPaymentMethod(value)}
                  className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    paymentMethod === value
                      ? "border-amber-400 bg-amber-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-amber-200"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod === value
                        ? "bg-amber-400 text-black"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-900">{label}</span>
                    <span className="mt-0.5 block text-xs text-gray-500">{desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handlePlaceOrder}
            className="w-full rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-black shadow-sm transition hover:bg-amber-500 disabled:opacity-60"
          >
            {loading ? "Placing order…" : `Place Order · ₹${displayTotal}`}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="mt-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
          <p className="text-2xl font-black text-green-600">Order placed!</p>
          <p className="mt-2 text-sm text-gray-600">
            Order number:{" "}
            <span className="font-semibold text-gray-900">{orderNumber}</span>
          </p>
          <Link
            href="/orders"
            className="mt-8 inline-block rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-black hover:bg-amber-500"
          >
            View my orders
          </Link>
          <Link href="/" className="mt-3 block text-sm text-gray-500 underline">
            Back to menu
          </Link>
        </div>
      )}
    </section>
  );
}
