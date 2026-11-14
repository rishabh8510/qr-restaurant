"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const { totalItems, totalPrice, openCart } = useCart();
  const { isLoggedIn, openLoginModal } = useAuth();
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
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#eee] px-3 sm:px-4 py-2 sm:py-2.5 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-[850px] mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#666]">
                {totalItems} item{totalItems > 1 ? "s" : ""} added
              </div>
              <div className="text-[15px] sm:text-[17px] font-black text-[#211512] mt-0.5 leading-none">
                ₹{totalPrice.toFixed(2)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  openLoginModal();
                  return;
                }
                openCart();
              }}
              className="bg-[#ed101c] text-white border-0 rounded-[8px] sm:rounded-[9px] px-4 py-2 sm:px-5 sm:py-2.5 font-extrabold text-xs sm:text-[13px] tracking-wide shadow-md hover:bg-red-700 active:scale-98 transition cursor-pointer"
            >
              VIEW CART →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
