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

      {item.image && (
        <div className="relative h-64 w-full shrink-0 overflow-hidden bg-gray-50">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Dietary Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {item.isVeg && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-xs backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Veg
              </span>
            )}
            {item.isVeg === false && !item.isEgg && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-red-700 shadow-xs backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Non-Veg
              </span>
            )}
            {item.isBestseller && (
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black text-black shadow-xs">
                ★ Bestseller
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">{item.name}</h2>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-2xl font-black text-gray-900">
            ₹{Number(item.price).toFixed(2)}
          </span>
          {item.oldPrice != null && Number(item.oldPrice) > Number(item.price) && (
            <span className="text-sm font-semibold text-gray-400 line-through">
              ₹{Number(item.oldPrice).toFixed(2)}
            </span>
          )}
          {item.offer && (
            <Badge variant="destructive">
              {item.offer.title || "Offer active"}
            </Badge>
          )}
          {item.discount && (
            <Badge variant="amber">
              {String(item.discount)}
            </Badge>
          )}
        </div>

        {(item.weight || (item.time && item.time !== "N/A")) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.weight && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {String(item.weight)}
              </span>
            )}
            {item.time && item.time !== "N/A" && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                <FiClock className="h-3.5 w-3.5 text-gray-400" />
                {String(item.time)}
              </span>
            )}
          </div>
        )}

        {item.description && (
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            {item.description}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
          {typeof item.likes === "number" && (
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2 text-xs font-semibold text-gray-600">
              <FiHeart className="h-4 w-4 text-red-500" />
              <span>{item.likes}</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            {item.available !== false ? (
              quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-white active:scale-95"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-white active:scale-95"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onClose();
                      openCart();
                    }}
                  >
                    View Cart
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  className="px-6"
                >
                  Add to cart
                </Button>
              )
            ) : (
              <span className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-400">
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
