"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function CartSheet() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <Sheet
      open={isCartOpen}
      onClose={closeCart}
      title="Your Cart"
      description={totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} selected` : undefined}
    >
      {cartItems.length === 0 ? (
        <div className="flex h-[70vh] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <FiShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-[220px]">
            Explore our handcrafted coffees and dishes to add them here.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={closeCart}
            className="mt-5"
          >
            Explore Menu
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          {/* Item List */}
          <div className="space-y-3 pb-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-red-500 hover:text-red-700"
              >
                Clear all
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <Image
                    src={item.image as string}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-xs font-semibold text-gray-600">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white active:scale-95"
                    >
                      <FiMinus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold tabular-nums text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white active:scale-95"
                    >
                      <FiPlus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Checkout Summary */}
          <div className="sticky bottom-0 -mx-6 -mb-4 border-t border-gray-100 bg-white px-6 py-4 shadow-lg">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Taxes & charges</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={closeCart} className="mt-4 block">
              <Button variant="primary" className="w-full gap-2 text-base font-bold">
                <span>Proceed to Checkout</span>
                <FiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}
