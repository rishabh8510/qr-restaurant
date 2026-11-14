"use client";

import { useState, useMemo, useEffect } from "react";
import { FiHeart, FiSearch, FiX } from "react-icons/fi";
import menuData from "@/data/menu.json";
import MenuItemDetails, { MenuItem } from "@/components/MenuItemDetails";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/Toast";
import { fetchPublicMenu, likeProduct, WebsiteSettings } from "@/lib/api";

type LocalMenu = {
  categories: { id: string; name: string; image: string; slug?: string | null }[];
  subCategories: {
    id: string;
    name: string;
    title: string;
    description: string;
    categoryId?: string;
  }[];
  items: {
    id: number | string;
    category: string | null;
    subCategory: string | null;
    name: string;
    price: number;
    oldPrice: number | null;
    discount?: string | null;
    offer?: {
      id: string;
      title: string;
      discountType: string;
      discountValue: number;
      savings?: number;
    } | null;
    weight: string;
    time: string;
    description: string;
    likes: number;
    available: boolean;
    isVegan: boolean;
    isVeg?: boolean;
    isEgg?: boolean;
    isNew: boolean;
    isBestseller?: boolean;
    tags?: string[];
    image: string;
  }[];
};

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

export default function Menu({ websiteSettings }: { websiteSettings?: WebsiteSettings }) {
  const ws = websiteSettings || DEFAULT_WEB;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dietFilter, setDietFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [menu, setMenu] = useState<LocalMenu>(menuData as LocalMenu);
  const [loading, setLoading] = useState(true);

  // Lazy init liked products from localStorage
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("liked_products");
      if (raw) return new Set(JSON.parse(raw));
    } catch {}
    return new Set();
  });
  const [likeBusy, setLikeBusy] = useState<string | null>(null);

  const { cartItems, addToCart, increaseQty, decreaseQty } = useCart();
  const { requireAuth, token } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublicMenu();
        if (!cancelled && data && data.items && data.items.length > 0) {
          setMenu({
            categories: data.categories || [],
            subCategories: data.subCategories || [],
            items: (data.items || []).map((i) => ({
              id: i.id,
              category: i.category,
              subCategory: i.subCategory,
              name: i.name,
              price: Number(i.price),
              originalPrice: i.originalPrice != null ? Number(i.originalPrice) : undefined,
              oldPrice: i.oldPrice != null ? Number(i.oldPrice) : null,
              discount: i.discount || null,
              offer: i.offer
                ? {
                    id: i.offer.id,
                    title: i.offer.title,
                    discountType: i.offer.discountType,
                    discountValue: i.offer.discountValue,
                    savings: i.offer.savings,
                  }
                : null,
              weight: i.weight || "",
              time: i.time || "N/A",
              description: i.description || "",
              likes: i.likes || 0,
              available: i.available !== false,
              isVegan: Boolean(i.isVegan),
              isVeg: i.isVeg,
              isEgg: i.isEgg,
              isNew: Boolean(i.isNew),
              isBestseller: Boolean(i.isBestseller),
              tags: i.tags || [],
              image: i.image,
            })),
          });
        }
      } catch (e) {
        console.error("Failed to load public menu:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const availableDietFilters = useMemo(() => {
    const flags = new Set<string>();
    for (const item of menu.items) {
      if (item.isVeg) flags.add("veg");
      if (item.isVeg === false || item.isEgg) flags.add("nonveg");
    }
    const order = ["veg", "nonveg"] as const;
    const filterRecord = ws.filters as Record<string, boolean | undefined> | undefined;
    return order.filter((k) => filterRecord?.[k] !== false && flags.has(k));
  }, [menu.items, ws.filters]);

  // Working search & filter logic:
  // When search query is entered, search across the whole menu in real-time
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menu.items.filter((item) => {
      const categoryMatch =
        q.length > 0
          ? true
          : selectedCategory === "all" ||
            item.category === selectedCategory ||
            menu.categories.find((c) => c.id === selectedCategory)?.slug === item.category;

      let dietMatch = true;
      if (dietFilter === "veg") dietMatch = !!item.isVeg && !item.isEgg;
      else if (dietFilter === "nonveg") dietMatch = item.isVeg === false || !!item.isEgg;

      if (!dietMatch || !categoryMatch) return false;

      if (!q) return true;

      const nameMatch = (item.name || "").toLowerCase().includes(q);
      const descMatch = (item.description || "").toLowerCase().includes(q);
      const tagsMatch = (item.tags || []).some((t) => String(t).toLowerCase().includes(q));
      const catObj = menu.categories.find(
        (c) => c.id === item.category || c.slug === item.category
      );
      const catMatch = (catObj?.name || "").toLowerCase().includes(q);

      return nameMatch || descMatch || tagsMatch || catMatch;
    });
  }, [menu.items, menu.categories, selectedCategory, dietFilter, searchQuery]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setDietFilter("all");
    setSearchQuery("");
  };

  const getQuantity = (id: number | string) => {
    const found = cartItems.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  const handleAddToCart = (
    e: React.MouseEvent,
    item: LocalMenu["items"][number]
  ) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleIncrease = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    increaseQty(id);
  };

  const handleDecrease = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    decreaseQty(id);
  };

  const handleLike = (e: React.MouseEvent, item: LocalMenu["items"][number]) => {
    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      void (async () => {
        const id = String(item.id);
        if (likeBusy === id) return;
        setLikeBusy(id);

        const alreadyLiked = likedIds.has(id);
        const action: "like" | "unlike" = alreadyLiked ? "unlike" : "like";

        try {
          const data = await likeProduct(id, token, action);

          setMenu((prev) => ({
            ...prev,
            items: prev.items.map((it) =>
              String(it.id) === id ? { ...it, likes: data.likes } : it
            ),
          }));

          setLikedIds((prev) => {
            const next = new Set(prev);
            if (data.liked) next.add(id);
            else next.delete(id);
            localStorage.setItem("liked_products", JSON.stringify([...next]));
            return next;
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLikeBusy(null);
        }
      })();
    });
  };

  // Group items by Category Name
  const groupedItems = useMemo(() => {
    const groups: Record<string, LocalMenu["items"]> = {};
    for (const item of filteredItems) {
      const cat = menu.categories.find(
        (c) => c.id === item.category || c.slug === item.category
      );
      const catName = cat?.name || item.category || "Our Menu";
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(item);
    }
    return groups;
  }, [filteredItems, menu.categories]);

  return (
    <section className="mx-auto w-full max-w-[850px] px-2.5 sm:px-4 py-3 sm:py-6 pb-28">
      {/* Quick Heading (matches lotus-hut-drive-in-table-order.html) */}
      <div className="mb-2 sm:mb-3 px-1">
        <h1 className="text-[18px] sm:text-[24px] font-black text-[#211512] tracking-tight leading-tight">
          Order Your Favourites
        </h1>
        <p className="text-[11px] sm:text-[13px] text-[#777] mt-0.5 sm:mt-1 font-medium">
          Quick order for table service, drive-in or takeaway.
        </p>
      </div>

      {/* Search Box - Fast Real-time filtering */}
      {ws.showSearch !== false && (
        <div className="relative my-2 sm:my-3">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="menuSearch"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food or drinks..."
            className="w-full bg-white border border-[#e5e5e5] rounded-[9px] sm:rounded-[10px] pl-9 pr-9 sm:pl-10 sm:pr-10 py-2.5 sm:py-3 text-[13px] sm:text-[14px] text-[#211512] outline-none focus:border-[#ed101c] shadow-xs placeholder:text-[#999] transition-colors"
            aria-label="Search menu"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
              aria-label="Clear search"
            >
              <FiX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      )}

      {/* Sticky Category Bar with Red Active Pills (Exact match to HTML design) */}
      {ws.showCategoryFilter !== false && (
        <nav className="sticky top-14 sm:top-16 z-30 -mx-2.5 sm:-mx-4 px-2.5 sm:px-4 bg-[#f7f7f7] py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none border-b border-gray-200/60">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className={`shrink-0 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[12px] font-bold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#ed101c] text-white border border-[#ed101c] shadow-xs"
                : "bg-white border border-[#e5e5e5] text-[#333] hover:border-gray-300"
            }`}
          >
            All
          </button>
          {menu.categories.map((c) => {
            const active = selectedCategory === c.id || selectedCategory === c.slug;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(active ? "all" : c.id);
                  setSearchQuery("");
                }}
                className={`shrink-0 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[12px] font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-[#ed101c] text-white border border-[#ed101c] shadow-xs"
                    : "bg-white border border-[#e5e5e5] text-[#333] hover:border-gray-300"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </nav>
      )}

      {/* Optional Diet Filters */}
      {availableDietFilters.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
          {availableDietFilters.map((diet) => {
            const active = dietFilter === diet;
            return (
              <button
                key={diet}
                type="button"
                onClick={() => setDietFilter(active ? "all" : diet)}
                className={`shrink-0 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold transition cursor-pointer ${
                  active
                    ? "bg-[#211512] text-white shadow-xs"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {diet === "veg" ? "🟢 Pure Veg" : "🔴 Non-Veg / Egg"}
              </button>
            );
          })}
        </div>
      )}

      {/* Grouped Items List - NO ITEM IMAGES, Exact HTML layout */}
      <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4">
        {loading && (
          <p className="py-6 text-center text-xs text-gray-400">Loading menu…</p>
        )}

        {Object.entries(groupedItems).map(([catName, items]) => (
          <div key={catName} className="menu-group">
            <h2 className="text-[14px] sm:text-[16px] font-extrabold text-[#211512] mt-3 sm:mt-4 mb-1.5 sm:mb-2 px-1">
              {catName}
            </h2>
            <div className="space-y-1.5 sm:space-y-2">
              {items.map((item) => {
                const quantity = getQuantity(item.id);
                const isLiked = likedIds.has(String(item.id));
                const isBusy = likeBusy === String(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#eee] rounded-[10px] sm:rounded-[11px] p-2.5 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 min-h-[58px] sm:min-h-[70px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-gray-300 transition"
                  >
                    {/* Item Info (NO images!) */}
                    <div
                      onClick={() => setSelectedItem(item as MenuItem)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Veg / Non-veg dot */}
                        {item.isVeg !== false && !item.isEgg ? (
                          <span
                            className="flex h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 items-center justify-center rounded-[2px] border border-emerald-600 bg-white"
                            title="Vegetarian"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          </span>
                        ) : (
                          <span
                            className="flex h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 items-center justify-center rounded-[2px] border border-red-600 bg-white"
                            title="Non-Vegetarian"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                          </span>
                        )}
                        <h3 className="text-[13px] sm:text-[15px] font-bold text-[#211512] leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 pl-4.5 sm:pl-5.5 flex-wrap">
                        <span className="text-[14px] sm:text-[16px] font-extrabold text-[#211512]">
                          ₹{Number(item.price).toFixed(0)}
                        </span>
                        {item.oldPrice && (
                          <span className="text-[11px] sm:text-[12px] text-gray-400 line-through">
                            ₹{Number(item.oldPrice).toFixed(0)}
                          </span>
                        )}
                        {item.isBestseller && (
                          <span className="rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black text-amber-900">
                            ★ Best
                          </span>
                        )}
                        {item.description && (
                          <span className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1 hidden sm:inline">
                            · {item.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Actions */}
                    <div className="shrink-0 flex items-center justify-end gap-1.5 sm:gap-2 min-w-[60px] sm:min-w-[70px]">
                      {/* Like button */}
                      <button
                        type="button"
                        onClick={(e) => handleLike(e, item)}
                        disabled={isBusy}
                        className={`p-1 sm:p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition cursor-pointer ${
                          isLiked ? "text-red-500" : ""
                        }`}
                        title={isLiked ? "Liked" : "Like"}
                        aria-label="Like item"
                      >
                        <FiHeart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? "fill-red-500" : ""}`} />
                      </button>

                      {quantity === 0 ? (
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, item)}
                          className="bg-white border-[1.5px] border-[#ed101c] text-[#ed101c] rounded-[6px] sm:rounded-[7px] px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-[12px] font-black min-w-[52px] sm:min-w-[62px] shadow-2xs hover:bg-red-50 active:scale-95 transition cursor-pointer"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#fff4f4] border border-[#ffd4d4] rounded-[6px] sm:rounded-[7px] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[#ed101c] font-black text-[11px] sm:text-xs min-h-[28px] sm:min-h-[34px]">
                          <button
                            type="button"
                            onClick={(e) => handleDecrease(e, item.id)}
                            className="text-sm sm:text-base leading-none px-0.5 sm:px-1 hover:opacity-70 active:scale-90 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="tabular-nums min-w-[12px] sm:min-w-[14px] text-center font-black">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleIncrease(e, item.id)}
                            className="text-sm sm:text-base leading-none px-0.5 sm:px-1 hover:opacity-70 active:scale-90 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-6 text-gray-500 my-4">
            <p className="text-sm font-semibold">No items found. Try another search.</p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-3 text-xs font-bold text-[#ed101c] hover:underline cursor-pointer"
            >
              Reset search &amp; filters
            </button>
          </div>
        )}
      </div>

      <MenuItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />

      <Toast message="Item added to cart!" show={showToast} />
    </section>
  );
}
