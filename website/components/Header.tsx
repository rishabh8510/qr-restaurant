"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  FiShoppingBag,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiCoffee,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [showHours, setShowHours] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { totalItems, openCart, tableNumber, setTableNumber } = useCart();
  const { isLoggedIn, openLoginModal, user, logout } = useAuth();
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      openLoginModal();
    } else {
      setShowProfileMenu((v) => !v);
    }
  };

  const goProfile = () => {
    setShowProfileMenu(false);
    router.push("/profile");
  };

  const goOrders = () => {
    setShowProfileMenu(false);
    router.push("/orders");
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-header border-b border-stone-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105">
              <FiCoffee className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-stone-900 leading-none">
                CAFE &amp; BISTRO
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 leading-none mt-1">
                Digital Menu
              </span>
            </div>
          </Link>

          {/* Quick timing indicator */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setShowHours((v) => !v)}
              className="flex items-center gap-2 rounded-xl bg-stone-100/70 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200/70 transition"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open: 09:00 AM – 11:00 PM</span>
              <FiChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showHours ? "rotate-180" : ""}`}
              />
            </button>
            {showHours && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xl">
                <p className="text-xs font-bold text-stone-900 pb-2 border-b border-stone-100">
                  Kitchen Hours
                </p>
                <div className="mt-2 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Mon – Fri</span>
                    <span className="font-semibold text-stone-900">09:00 – 23:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sat – Sun</span>
                    <span className="font-semibold text-stone-900">08:00 – 00:00</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right tools: Table pill + Cart + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Table Pill */}
          {tableNumber ? (
            <button
              type="button"
              onClick={() => {
                const next = prompt("Enter your Table Number:", tableNumber);
                if (next !== null) setTableNumber(next.trim() || null);
              }}
              className="flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50/90 px-3.5 py-2 text-xs font-black text-amber-950 shadow-xs transition hover:bg-amber-100 active:scale-98"
              title="Click to change your table"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Table #{tableNumber}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const next = prompt("Dining in? Enter your Table Number:");
                if (next) setTableNumber(next.trim());
              }}
              className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition active:scale-98"
            >
              <span className="text-amber-600">📍</span>
              <span>Select Table</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 items-center gap-2 rounded-2xl bg-stone-900 px-3.5 sm:px-4 text-white shadow-md shadow-stone-900/10 transition-all hover:bg-black active:scale-98 cursor-pointer"
            aria-label="View Cart"
          >
            <FiShoppingBag className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline text-xs font-bold text-amber-300">
              Cart
            </span>
            {totalItems > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-black text-stone-950">
                {totalItems}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={handleProfileClick}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 shadow-2xs hover:bg-stone-50 transition active:scale-98"
              aria-label="Account"
            >
              <FiUser className="h-4 w-4" />
            </button>

            {isLoggedIn && showProfileMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-stone-200 bg-white py-1.5 shadow-2xl">
                <div className="border-b border-stone-100 px-4 py-3">
                  <p className="truncate text-xs font-bold text-stone-900">
                    {user?.name || "Customer"}
                  </p>
                  <p className="truncate text-[11px] text-stone-400">
                    {user?.phone || "Dine-in Guest"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goOrders}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                >
                  <FiPackage className="h-4 w-4 text-amber-600" />
                  <span>My Orders</span>
                </button>

                <button
                  type="button"
                  onClick={goProfile}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                >
                  <FiUser className="h-4 w-4 text-amber-600" />
                  <span>Profile Settings</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 border-t border-stone-100 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
