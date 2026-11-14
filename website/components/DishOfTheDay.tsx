"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { fetchPublicDishOfTheDay } from "@/lib/api";
import { Sparkles } from "lucide-react";

interface Dish {
  id: string | number;
  name: string;
  price: string;
  image: string;
}

export default function DishOfTheDay() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchPublicDishOfTheDay();
      if (!cancelled && data.length > 0) {
        setDishes(
          data.map((d) => ({
            id: d.id,
            name: d.name,
            price: `₹${Number(d.price).toFixed(0)}`,
            image: d.image,
          }))
        );
        setActive(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % dishes.length);
  }, [dishes.length]);

  useEffect(() => {
    if (dishes.length === 0) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [goNext, dishes.length]);

  if (dishes.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-2.5 py-2 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-3 rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-3 sm:p-6 shadow-xs lg:flex-row lg:items-center">
        {/* Title block */}
        <div className="flex shrink-0 flex-col items-start justify-center lg:w-56">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-800 ring-1 ring-amber-200">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
            <span>Chef&apos;s Choice</span>
          </span>
          <h2 className="mt-1 sm:mt-2 text-base sm:text-2xl font-black tracking-tight text-gray-900">
            Dish of the Day
          </h2>
          <p className="mt-0.5 text-[11px] sm:text-xs text-gray-400">
            Handcrafted signatures recommended by our chef
          </p>
        </div>

        {/* Dynamic Accordion items */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden sm:h-52 sm:flex-row sm:gap-2">
          {dishes.map((dish, index) => {
            const isActive = index === active;
            return (
              <button
                key={dish.id}
                type="button"
                onClick={() => setActive(index)}
                className={`relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-900 text-left transition-all duration-500 ease-out sm:h-full cursor-pointer ${
                  isActive ? "h-36 sm:flex-[3]" : "h-14 sm:flex-[1]"
                }`}
              >
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-black">
                      Featured
                    </span>
                    <span className="text-xs sm:text-base font-black text-white">
                      ₹{dish.price}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-lg font-black text-white drop-shadow-sm leading-tight">
                      {dish.name}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
