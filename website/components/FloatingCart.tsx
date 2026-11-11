"use client";

import { usePathname } from "next/navigation";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const { totalItems, totalPrice, openCart } = useCart();
  const pathname = usePathname();

  // Hide on checkout or orders page
  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/orders")) {
    return null;
  }

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-5 left-4 right-4 z-50 flex justify-center sm:bottom-6"
        >
          <button
            type="button"
            onClick={openCart}
            className="flex w-full max-w-md items-center justify-between rounded-2xl bg-gray-900 px-5 py-3.5 text-white shadow-xl transition-all duration-200 hover:bg-black hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <FiShoppingBag className="h-5 w-5 text-amber-400" />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-black">
                  {totalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-300">
                  {totalItems} item{totalItems > 1 ? "s" : ""} in cart
                </p>
                <p className="text-sm font-black text-white">
                  ₹{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-400">
              <span>View Cart</span>
              <FiArrowRight className="h-4 w-4" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
