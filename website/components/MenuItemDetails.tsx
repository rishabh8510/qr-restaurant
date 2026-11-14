"use client";

import Image from "next/image";
import { FiMinus, FiPlus, FiHeart, FiClock } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Toast from "@/components/Toast";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MenuItem {
  id: number | string;
  name: string;
  price: number | string;
  image: string;
  oldPrice?: number | string | null;
  weight?: string;
  time?: string;
  description?: string;
  likes?: number;
  available?: boolean;
  isVegan?: boolean;
  isVeg?: boolean;
  isEgg?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  category?: string;
  subCategory?: string;
  offer?: {
    id?: string;
    title?: string;
    discountType?: string;
    discountValue?: number;
    savings?: number;
  } | null;
  discount?: string | null;
  tags?: string[];
}

interface MenuItemDetailsProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function MenuItemDetails({ item, onClose }: MenuItemDetailsProps) {
  const { cartItems, addToCart, increaseQty, decreaseQty, openCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  if (!item) return null;

  const cartEntry = cartItems.find((i) => i.id === item.id);
  const quantity = cartEntry ? cartEntry.quantity : 0;

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <Dialog open={!!item} onClose={onClose} maxWidth="max-w-lg">
      <DialogClose onClose={onClose} />

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        {/* Dietary Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          {item.isVeg && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-600" />
              Veg
            </span>
          )}
          {item.isVeg === false && !item.isEgg && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-red-700 ring-1 ring-red-200">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-600" />
              Non-Veg
            </span>
          )}
          {item.isBestseller && (
            <span className="rounded-full bg-amber-400 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black text-black shadow-xs">
              ★ Bestseller
            </span>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-snug">{item.name}</h2>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xl sm:text-2xl font-black text-gray-900">
            ₹{Number(item.price).toFixed(2)}
          </span>
        </div>

        {(item.weight || (item.time && item.time !== "N/A")) && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
            {item.weight && (
              <span className="rounded-lg bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium text-gray-600">
                {String(item.weight)}
              </span>
            )}
            {item.time && item.time !== "N/A" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium text-gray-600">
                <FiClock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                {String(item.time)}
              </span>
            )}
          </div>
        )}

        {item.description && (
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-500">
            {item.description}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          {typeof item.likes === "number" && (
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50/60 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-gray-600">
              <FiHeart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
              <span>{item.likes}</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {item.available !== false ? (
              quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-0.5 sm:p-1">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-white active:scale-95"
                    >
                      <FiMinus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold tabular-nums text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-white active:scale-95"
                    >
                      <FiPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onClose();
                      openCart();
                    }}
                    className="text-xs sm:text-sm py-1.5 px-3 sm:px-4"
                  >
                    View Cart
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  className="px-5 sm:px-6 text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Add to cart
                </Button>
              )
            ) : (
              <span className="rounded-xl bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-gray-400">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      <Toast message="Item added to cart!" show={showToast} />
    </Dialog>
  );
}
