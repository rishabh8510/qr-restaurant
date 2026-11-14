"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchPublicBanners } from "@/lib/api";

const FALLBACK_BANNERS: string[] = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
];

function useVisibleCount() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisible(4);
      else if (w >= 768) setVisible(3);
      else if (w >= 640) setVisible(2);
      else setVisible(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return visible;
}

export default function HomeBanner() {
  const [banners, setBanners] = useState<string[]>(FALLBACK_BANNERS);
  const [current, setCurrent] = useState(0);
  const VISIBLE = useVisibleCount();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchPublicBanners();
      if (!cancelled && data.length > 0) {
        setBanners(data.map((b) => b.image));
        setCurrent(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(goNext, 3000);
    return () => clearInterval(timer);
  }, [goNext, banners.length]);

  const extended = [...banners, ...banners];
  const gapPx = 16;
  const slideWidth = `calc(${100 / VISIBLE}% - ${
    (gapPx * (VISIBLE - 1)) / VISIBLE
  }px)`;

  if (banners.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-2.5 py-1 sm:px-6">
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="flex gap-1 transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * (100 / VISIBLE)}%)`,
          }}
        >
          {extended.map((src, index) => (
            <div
              key={index}
              className="relative shrink-0"
              style={{ minWidth: slideWidth }}
            >
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                width={400}
                height={400}
                className="h-[120px] xs:h-[140px] w-full rounded-xl object-cover sm:h-[200px] md:h-[240px] lg:h-[280px]"
                priority={index < VISIBLE}
              />
            </div>
          ))}
        </div>

        <button
          onClick={goPrev}
          className="absolute left-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm transition hover:bg-white sm:left-2 sm:h-9 sm:w-9"
          aria-label="Previous banner"
        >
          <FiChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm transition hover:bg-white sm:right-2 sm:h-9 sm:w-9"
          aria-label="Next banner"
        >
          <FiChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
        </button>
      </div>

      <div className="mt-2 sm:mt-3 flex justify-center gap-1.5 sm:gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
              current === index ? "w-5 sm:w-6 bg-[#ed101c]" : "w-1.5 sm:w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
