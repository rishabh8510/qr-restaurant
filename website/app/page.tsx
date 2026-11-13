"use client";

import { useEffect, useState } from "react";
import HomeBanner from "@/components/HomeBanner";
import DishOfTheDay from "@/components/DishOfTheDay";
import Menu from "@/components/Menu";
import { fetchPublicSettings, WebsiteSettings } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_WEB: WebsiteSettings = {
  showBanner: true,
  showDishOfTheDay: true,
  showOffers: true,
  showSearch: true,
  showCategoryFilter: true,
  showSubCategoryFilter: true,
  filters: {
    veg: true,
    nonveg: true,
    vegan: true,
    egg: true,
    new: true,
    bestseller: true,
  },
};

export default function Home() {
  const [website, setWebsite] = useState<WebsiteSettings>(DEFAULT_WEB);
  const [ready, setReady] = useState(false);
  const { tableNumber, setTableNumber } = useCart();
  const { isLoggedIn, openLoginModal } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchPublicSettings();
      if (!cancelled && data?.website) {
        setWebsite({ ...DEFAULT_WEB, ...data.website, filters: { ...DEFAULT_WEB.filters, ...data.website.filters } });
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <p className="mt-3 text-xs font-bold text-stone-500">Opening Digital Menu…</p>
      </div>
    );
  }

  return (
    <>
      {/* Artisan Bistro Hero Welcome Section */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 p-6 sm:p-10 text-white shadow-xl shadow-stone-900/10">
          {/* Ambient Lighting Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-600/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            {/* Table Indicator or Selector */}
            {tableNumber ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/30">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>You are seated at Table #{tableNumber}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    openLoginModal();
                    return;
                  }
                  const t = prompt("Dining in? Enter your Table Number:");
                  if (t) setTableNumber(t.trim());
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-amber-300 ring-1 ring-white/15 hover:bg-white/15 transition cursor-pointer"
              >
                <span>📍 Sitting at a table? Tap to select table</span>
              </button>
            )}

            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl text-white">
              Specialty Coffee &amp; Artisan Dining
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              Order directly from your phone without waiting for waiters or bills. Your freshly prepared meal will be delivered straight to your table.
            </p>

            {/* Value Props */}
            <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-amber-200/90">
              <span className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 backdrop-blur-xs ring-1 ring-white/10">
                ⚡ 10–15 Min Fast Prep
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 backdrop-blur-xs ring-1 ring-white/10">
                🌿 Fresh Ingredients
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 backdrop-blur-xs ring-1 ring-white/10">
                💳 Cash / UPI / Pay at Counter
              </span>
            </div>
          </div>
        </div>
      </section>

      {website.showBanner && <HomeBanner />}
      {website.showDishOfTheDay && <DishOfTheDay />}
      <Menu websiteSettings={website} />
    </>
  );
}
