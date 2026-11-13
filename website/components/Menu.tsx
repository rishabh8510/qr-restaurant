"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { FiHeart, FiMinus, FiPlus, FiSearch, FiFilter, FiX, FiCheck } from "react-icons/fi";
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
  const [selectedSub, setSelectedSub] = useState<string>("all");
  const [dietFilter, setDietFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<string>("all");
  const [draftSub, setDraftSub] = useState<string>("all");
  const [draftDiet, setDraftDiet] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [menu, setMenu] = useState<LocalMenu>(menuData as LocalMenu);
  const [loading, setLoading] = useState(true);

  // ✅ Lazy init from localStorage — no setState-in-effect needed
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("liked_products");
      if (raw) return new Set(JSON.parse(raw));
    } catch {}
    return new Set();
  });
  const [likeBusy, setLikeBusy] = useState<string | null>(null);

  const { cartItems, addToCart, increaseQty, decreaseQty, openCart } = useCart();
  const { requireAuth, token } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublicMenu();
        if (!cancelled && data && (data.items?.length || data.categories?.length)) {
          setMenu({
            categories: data.categories || [],
            subCategories: (data.subCategories || []).map((s) => ({
              id: s.id,
              name: s.name,
              title: s.title || s.name,
              description: s.description || "",
              categoryId: s.categoryId,
            })),
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

  const filteredSubs = useMemo(() => {
    if (selectedCategory === "all") return menu.subCategories;
    return menu.subCategories.filter(
      (s) => !("categoryId" in s) || (s as { categoryId?: string }).categoryId === selectedCategory
    );
  }, [menu.subCategories, selectedCategory]);

  const activeSubInfo = useMemo(
    () => menu.subCategories.find((s) => s.id === selectedSub),
    [menu.subCategories, selectedSub]
  );

  const availableDietFilters = useMemo(() => {
    const flags = new Set<string>();
    for (const item of menu.items) {
      if (item.isVeg) flags.add("veg");
      if (item.isVeg === false || item.isEgg) flags.add("nonveg");
      if (item.isVegan) flags.add("vegan");
      if (item.isEgg) flags.add("egg");
      if (item.isNew) flags.add("new");
      if (item.isBestseller) flags.add("bestseller");
      if (item.offer || item.discount) flags.add("offers");
    }
    const order = ["veg", "nonveg", "offers", "vegan", "egg", "new", "bestseller"] as const;
    const filterRecord = ws.filters as Record<string, boolean | undefined> | undefined;
    return order.filter((k) => filterRecord?.[k] !== false && flags.has(k));
  }, [menu.items, ws.filters]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menu.items.filter((item) => {
      const categoryMatch =
        selectedCategory === "all" || item.category === selectedCategory;
      const subMatch =
        selectedSub === "all" || item.subCategory === selectedSub;
      let dietMatch = true;
      if (dietFilter === "veg") dietMatch = !!item.isVeg && !item.isEgg;
      else if (dietFilter === "nonveg") dietMatch = item.isVeg === false || !!item.isEgg;
      else if (dietFilter === "vegan") dietMatch = !!item.isVegan;
      else if (dietFilter === "egg") dietMatch = !!item.isEgg;
      else if (dietFilter === "new") dietMatch = !!item.isNew;
      else if (dietFilter === "bestseller") dietMatch = !!item.isBestseller;
      else if (dietFilter === "offers") dietMatch = Boolean(item.offer || item.discount);
      const searchMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.tags || []).some((t) => String(t).toLowerCase().includes(q));
      return categoryMatch && subMatch && dietMatch && searchMatch;
    });
  }, [menu.items, selectedCategory, selectedSub, dietFilter, searchQuery]);

  const selectedCategoryName =
    selectedCategory === "all"
      ? "All categories"
      : menu.categories.find((c) => c.id === selectedCategory)?.name || "Category";

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSub !== "all" ? 1 : 0) +
    (dietFilter !== "all" ? 1 : 0);

  const draftSubs = useMemo(() => {
    if (draftCategory === "all") return menu.subCategories;
    return menu.subCategories.filter(
      (s) => !s.categoryId || s.categoryId === draftCategory
    );
  }, [menu.subCategories, draftCategory]);

  const openFilter = () => {
    setDraftCategory(selectedCategory);
    setDraftSub(selectedSub);
    setDraftDiet(dietFilter);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setSelectedCategory(draftCategory);
    setSelectedSub(draftSub);
    setDietFilter(draftDiet);
    setFilterOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedSub("all");
    setDietFilter("all");
    setDraftCategory("all");
    setDraftSub("all");
    setDraftDiet("all");
    setSearchQuery("");
    setFilterOpen(false);
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

const handleLike = (e: React.MouseEvent, item: LocalMenu['items'][number]) => {
  e.preventDefault();
  e.stopPropagation();

  // Same as Add to cart — login required
  requireAuth(() => {
    void (async () => {
      const id = String(item.id);
      if (likeBusy === id) return;
      setLikeBusy(id);

      const alreadyLiked = likedIds.has(id);
      const action: 'like' | 'unlike' = alreadyLiked ? 'unlike' : 'like';

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
          localStorage.setItem('liked_products', JSON.stringify([...next]));
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
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 sm:py-10">
      {loading && (
        <p className="mb-4 text-center text-sm text-gray-400">Loading menu…</p>
      )}

      {/* ========================================================================= */}
      {/* MOBILE SCREEN MENU VIEW (Exact match to lotus-hut-drive-in-table-order.html) */}
      {/* ========================================================================= */}
      <div className="block md:hidden max-w-[850px] mx-auto">
        {/* Quick Heading */}
        <div className="mb-3 px-1">
          <h1 className="text-[22px] font-black text-[#211512] tracking-tight leading-tight">
            Order Your Favourites
          </h1>
          <p className="text-[12px] text-[#777] mt-1 font-medium">
            Quick order for table service, drive-in or takeaway.
          </p>
        </div>

        {/* Mobile Search Box */}
        <div className="relative my-2.5">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food or drinks..."
            className="w-full bg-white border border-[#e5e5e5] rounded-[10px] px-3.5 py-3 text-[14px] text-[#211512] outline-none focus:border-[#ed101c] shadow-2xs placeholder:text-[#999]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Category Bar (Sticky Horizontal Scroll with Pills) */}
        <nav className="sticky top-16 z-30 -mx-4 px-4 bg-[#f7f7f7] py-2 flex gap-1.5 overflow-x-auto scrollbar-none border-b border-gray-200/60">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-[#ed101c] text-white border border-[#ed101c] shadow-xs"
                : "bg-white border border-[#e5e5e5] text-[#333]"
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
                onClick={() => setSelectedCategory(active ? "all" : c.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-bold transition-all ${
                  active
                    ? "bg-[#ed101c] text-white border border-[#ed101c] shadow-xs"
                    : "bg-white border border-[#e5e5e5] text-[#333]"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </nav>

        {/* Mobile Grouped Items List */}
        <div className="mt-3 space-y-5 pb-24">
          {Object.entries(groupedItems).map(([catName, items]) => (
            <div key={catName} className="menu-group">
              <h2 className="text-[15px] font-extrabold text-[#211512] my-3 px-1">
                {catName}
              </h2>
              <div className="space-y-2">
                {items.map((item) => {
                  const quantity = getQuantity(item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-[#eee] rounded-[11px] p-3 flex items-center justify-between gap-3 min-h-[68px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    >
                      {/* Item Info */}
                      <div
                        onClick={() => setSelectedItem(item as MenuItem)}
                        className="min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] border border-emerald-600 bg-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          </span>
                          <h3 className="text-[13px] font-bold text-[#211512] leading-snug line-clamp-2">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1 pl-5">
                          <span className="text-[15px] font-extrabold text-[#211512]">
                            ₹{item.price}
                          </span>
                          {item.oldPrice && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{item.oldPrice}
                            </span>
                          )}
                          {item.isBestseller && (
                            <span className="rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[9px] font-black text-amber-900">
                              ★ Best
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="shrink-0 flex items-center justify-end min-w-[62px]">
                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, item)}
                            className="bg-white border-[1.5px] border-[#ed101c] text-[#ed101c] rounded-[7px] px-3.5 py-1.5 text-[12px] font-black min-w-[60px] shadow-2xs hover:bg-red-50 active:scale-95 transition cursor-pointer"
                          >
                            ADD
                          </button>
                        ) : (
                          <div className="flex items-center gap-2.5 bg-[#fff4f4] border border-[#ffd4d4] rounded-[7px] px-2 py-1 text-[#ed101c] font-black text-xs">
                            <button
                              type="button"
                              onClick={(e) => handleDecrease(e, item.id)}
                              className="text-base leading-none px-1 hover:opacity-70 active:scale-90"
                            >
                              −
                            </button>
                            <span className="tabular-nums min-w-[14px] text-center font-black">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleIncrease(e, item.id)}
                              className="text-base leading-none px-1 hover:opacity-70 active:scale-90"
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

          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-6 text-gray-500">
              <p className="text-xs font-semibold">No items found. Try another search.</p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-2 text-xs font-bold text-[#ed101c] underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SCREEN MENU VIEW (Rich grid & filters) */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
      {/* Search + Filter */}
      <div className="sticky top-0 z-40 -mx-6 border-b border-gray-200 bg-white/95 px-6 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="flex gap-2">
          {ws.showSearch !== false && (
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, tags…"
                className="w-full rounded-sm border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={openFilter}
            className={`relative inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 text-sm font-bold transition ${
              activeFilterCount > 0
                ? "border-amber-400 bg-amber-400 text-black"
                : "border-gray-200 bg-white text-gray-800 hover:border-amber-300"
            }`}
          >
            <FiFilter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips summary */}
        {(activeFilterCount > 0 || searchQuery) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                Search: “{searchQuery}”
                <button type="button" onClick={() => setSearchQuery("")} className="ml-0.5">
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {selectedCategoryName}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSub("all");
                  }}
                >
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedSub !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {menu.subCategories.find((s) => s.id === selectedSub)?.name || "Sub"}
                <button type="button" onClick={() => setSelectedSub("all")}>
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            {dietFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-800">
                {dietFilter}
                <button type="button" onClick={() => setDietFilter("all")}>
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-500 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Dynamic Horizontal Category Bar */}
        {ws.showCategoryFilter !== false && menu.categories.length > 0 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSub("all");
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>All Items</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedCategory === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {menu.items.length}
              </span>
            </button>

            {menu.categories.map((c) => {
              const active = selectedCategory === c.id;
              const count = menu.items.filter((i) => i.category === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(active ? "all" : c.id);
                    setSelectedSub("all");
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-amber-400 text-black shadow-xs ring-2 ring-amber-300"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {c.image && (
                    <Image
                      src={c.image}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  )}
                  <span>{c.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      active ? "bg-black/10 text-black" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Sub-categories (When category has subcategories) */}
        {filteredSubs.length > 0 && selectedCategory !== "all" && (
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedSub("all")}
              className={`shrink-0 rounded-lg px-3 py-1 text-[11px] font-bold transition ${
                selectedSub === "all"
                  ? "bg-amber-100 text-amber-900"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              All {selectedCategoryName}
            </button>
            {filteredSubs.map((s) => {
              const active = selectedSub === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSub(active ? "all" : s.id)}
                  className={`shrink-0 rounded-lg px-3 py-1 text-[11px] font-bold transition ${
                    active
                      ? "bg-amber-400 text-black shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Dietary & Special Offer Chips */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {availableDietFilters.map((diet) => {
            const active = dietFilter === diet;
            const labels: Record<string, string> = {
              veg: "🟢 Veg Only",
              nonveg: "🔴 Non-Veg",
              offers: "🔥 Active Offers",
              vegan: "🌱 Vegan",
              egg: "🥚 Contains Egg",
              new: "✨ What's New",
              bestseller: "⭐ Bestseller",
            };
            return (
              <button
                key={diet}
                type="button"
                onClick={() => setDietFilter(active ? "all" : diet)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition ${
                  active
                    ? "bg-gray-900 text-white shadow-xs"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {labels[diet] || diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter panel (modal) */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-lg font-black text-gray-900">Filters</h3>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="rounded-sm p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
              {ws.showCategoryFilter !== false && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                    Category
                  </p>
                  <div className="max-h-48 space-y-1 overflow-y-auto rounded-sm border border-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDraftCategory("all");
                        setDraftSub("all");
                      }}
                      className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm font-semibold ${
                        draftCategory === "all"
                          ? "bg-amber-50 text-amber-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All categories
                      {draftCategory === "all" && <FiCheck className="h-4 w-4 text-amber-600" />}
                    </button>
                    {menu.categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setDraftCategory(cat.id);
                          setDraftSub("all");
                        }}
                        className={`flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm font-medium ${
                          draftCategory === cat.id
                            ? "bg-amber-50 text-amber-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                          <Image src={cat.image} alt="" fill className="object-cover" />
                        </span>
                        <span className="flex-1 truncate">{cat.name}</span>
                        {draftCategory === cat.id && (
                          <FiCheck className="h-4 w-4 shrink-0 text-amber-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {ws.showSubCategoryFilter !== false && draftSubs.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                    Sub-category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDraftSub("all")}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        draftSub === "all"
                          ? "border-amber-400 bg-amber-400 text-black"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      All
                    </button>
                    {draftSubs.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setDraftSub(sub.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          draftSub === sub.id
                            ? "border-amber-400 bg-amber-400 text-black"
                            : "border-gray-200 text-gray-700"
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableDietFilters.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                    Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDraftDiet("all")}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        draftDiet === "all"
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      All types
                    </button>
                    {availableDietFilters.map((f) => {
                      const labels: Record<string, string> = {
                        veg: "🟢 Veg",
                        nonveg: "🔴 Non-veg",
                        vegan: "🌿 Vegan",
                        egg: "🥚 Egg",
                        new: "✨ New",
                        bestseller: "⭐ Bestseller",
                      };
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setDraftDiet(f)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            draftDiet === f
                              ? "border-amber-400 bg-amber-400 text-black"
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {labels[f] || f}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 rounded-sm border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={applyFilter}
                className="flex-1 rounded-sm bg-amber-400 py-3 text-sm font-bold text-black hover:bg-amber-500"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Description banner */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex h-28 items-center justify-center rounded-sm bg-gradient-to-br from-amber-300 to-amber-400 px-8 sm:w-72">
          <h2 className="text-2xl font-black text-black">
            {activeSubInfo ? activeSubInfo.title : "All dishes"}
          </h2>
        </div>
        <div className="flex flex-1 items-center rounded-sm bg-gradient-to-r from-amber-200 to-amber-400 px-8 py-5">
          <p className="text-sm font-medium leading-relaxed text-black">
            {activeSubInfo
              ? activeSubInfo.description
              : "Browse our full menu — pick a category above or a section below to filter dishes."}
          </p>
        </div>
      </div>

      {/* Items grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredItems.map((item) => {
          const quantity = getQuantity(item.id);
          const isLiked = likedIds.has(String(item.id));
          const isBusy = likeBusy === String(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item as MenuItem)}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Dietary & highlight badges */}
                  <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
                    {item.isVeg && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-emerald-600 bg-white shadow-2xs" title="Vegetarian">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      </span>
                    )}
                    {item.isVeg === false && !item.isEgg && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-red-600 bg-white shadow-2xs" title="Non-Vegetarian">
                        <span className="h-0 w-0 border-x-4 border-x-transparent border-b-[6px] border-b-red-600" />
                      </span>
                    )}
                    {ws.showOffers && item.offer && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        {item.discount || item.offer.title || "Offer"}
                      </span>
                    )}
                    {item.isBestseller && (
                      <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-black shadow-xs">
                        ★ Bestseller
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2 flex gap-1.5">
                    {item.weight && (
                      <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                        {item.weight}
                      </span>
                    )}
                    {item.time !== "N/A" && item.time && (
                      <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                        {item.time}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-lg font-black text-gray-900">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                    {item.oldPrice != null && Number(item.oldPrice) > Number(item.price) && (
                      <span className="text-xs font-semibold text-gray-400 line-through">
                        ₹{Number(item.oldPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 px-1">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(e, item)}
                  disabled={isBusy}
                  className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold transition ${
                    isLiked
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <FiHeart className={`h-3.5 w-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{item.likes}</span>
                </button>

                {item.available ? (
                  quantity > 0 ? (
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center rounded-xl border border-amber-300 bg-amber-50 p-0.5">
                        <button
                          type="button"
                          onClick={(e) => handleDecrease(e, item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-900 transition hover:bg-amber-200 active:scale-95"
                        >
                          <FiMinus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums text-amber-950">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleIncrease(e, item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-900 transition hover:bg-amber-200 active:scale-95"
                        >
                          <FiPlus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCart();
                        }}
                        className="rounded-lg bg-gray-900 px-2 py-1.5 text-[11px] font-bold text-white hover:bg-black"
                      >
                        Cart
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item)}
                      className="rounded-xl bg-amber-400 px-4 py-1.5 text-xs font-bold text-black shadow-2xs transition-all hover:bg-amber-500 hover:shadow-xs active:scale-95"
                    >
                      Add +
                    </button>
                  )
                ) : (
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && !loading && (
          <div className="col-span-full py-14 text-center">
            <p className="text-base font-semibold text-gray-600">No items found</p>
            <p className="mt-1 text-sm text-gray-400">
              Try another search or clear filters
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-4 text-sm font-semibold text-amber-600 hover:underline"
            >
              Clear search & filters
            </button>
          </div>
        )}
      </div>
      </div>

      <MenuItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />

      <Toast message="Item added to cart!" show={showToast} />
    </section>
  );
}