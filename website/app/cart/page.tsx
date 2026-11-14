"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiLock } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    clearCart,
  } = useCart();
  const { isLoggedIn, loading, openLoginModal } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) openLoginModal();
  }, [loading, isLoggedIn, openLoginModal]);

  if (!loading && !isLoggedIn) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
          <FiLock size={28} />
        </div>
        <p className="text-xl font-bold text-gray-900">Login required to view cart</p>
        <p className="mt-1 text-sm text-gray-500">Sign in with OTP to continue</p>
        <button
          type="button"
          onClick={() => openLoginModal()}
          className="mt-6 rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-black shadow-sm hover:bg-amber-500 cursor-pointer"
        >
          Login with OTP
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-10">
      <div className="mb-4 sm:mb-8 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <FiArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Continue shopping
        </Link>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs sm:text-sm font-semibold text-red-500 hover:underline cursor-pointer"
          >
            Clear cart
          </button>
        )}
      </div>

      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-gray-900">
          
        </h1>
        {cartItems.length > 0 && (
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your bag
          </p>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white py-14 sm:py-20 text-center">
          <div className="mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100">
            <FiShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
          </div>
          <p className="text-base sm:text-lg font-bold text-gray-800">Your cart is empty</p>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
            Add something delicious from the menu
          </p>
          <Link
            href="/"
            className="mt-5 sm:mt-6 rounded-xl bg-amber-400 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-black shadow-sm hover:bg-amber-500"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-12">
          {/* Items */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-xs sm:text-base text-gray-900">{item.name}</h3>
                    <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-600">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="flex items-center rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-0.5 sm:p-1">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg text-gray-700 hover:bg-white active:scale-95"
                    >
                      <FiMinus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                    <span className="w-7 sm:w-9 text-center text-xs sm:text-sm font-bold text-gray-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg text-gray-700 hover:bg-white active:scale-95"
                    >
                      <FiPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                  </div>

                  <span className="min-w-[4rem] sm:min-w-[4.5rem] text-right text-sm sm:text-base font-black text-gray-900">
                    ₹{Number(item.price) * item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                    aria-label="Remove"
                  >
                    <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 sm:top-24 rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-400">
                Order summary
              </h3>
              <div className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2.5 sm:pt-3 text-sm sm:text-base font-black text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-amber-600">₹{totalPrice}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-5 sm:mt-6 flex w-full items-center justify-center rounded-xl bg-amber-400 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-black shadow-sm transition hover:bg-amber-500"
              >
                Make Order
              </Link>
              <Link
                href="/"
                className="mt-2.5 sm:mt-3 flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-gray-800 shadow-2xs transition hover:bg-gray-50 active:scale-98"
              >
                + Add more items
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
