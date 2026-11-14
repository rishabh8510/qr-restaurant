"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function CartSheet() {
  const router = useRouter();
  const { isLoggedIn, openLoginModal } = useAuth();
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

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLoginModal(() => {
        closeCart();
        router.push("/checkout");
      });
      return;
    }
    closeCart();
    router.push("/checkout");
  };

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
                className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-2.5 sm:p-3 shadow-2xs transition-shadow hover:shadow-xs"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs sm:text-sm font-bold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs font-semibold text-gray-600 mt-0.5">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="flex items-center rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md text-gray-600 transition hover:bg-white active:scale-95"
                    >
                      <FiMinus className="h-3 w-3" />
                    </button>
                    <span className="w-5 sm:w-6 text-center text-xs font-bold tabular-nums text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md text-gray-600 transition hover:bg-white active:scale-95"
                    >
                      <FiPlus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-lg p-1 sm:p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Checkout Summary */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-6 -mb-3 sm:-mb-4 border-t border-gray-100 bg-white px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between text-sm sm:text-base font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-amber-600 font-black">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button type="button" onClick={handleCheckoutClick} className="mt-3 sm:mt-4 block w-full cursor-pointer">
              <Button variant="primary" className="w-full gap-2 text-sm sm:text-base font-bold py-2.5 sm:py-3">
                <span>Make Order</span>
                <FiArrowRight className="h-4 w-4" />
              </Button>
            </button>

            <button
              type="button"
              onClick={closeCart}
              className="mt-2 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 shadow-2xs transition hover:bg-gray-50 active:scale-98 cursor-pointer"
            >
              + Add more items
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
