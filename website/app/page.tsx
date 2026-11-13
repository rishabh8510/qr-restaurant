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
      {website.showBanner && <HomeBanner />}
      {website.showDishOfTheDay && <DishOfTheDay />}
      <Menu websiteSettings={website} />
    </>
  );
}
