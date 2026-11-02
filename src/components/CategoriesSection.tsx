"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/data/products";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CategoriesSectionProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

export default function CategoriesSection({
  onSelectCategory,
  selectedCategory,
}: CategoriesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 relative">
      <div className="relative group">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-700 hover:text-[#4F213B] flex items-center justify-center transition-all opacity-80 hover:opacity-100"
          aria-label="Previous categories"
        >
          <FiChevronLeft size={18} />
        </button>

        {/* Categories Carousel */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className={`flex-shrink-0 w-[110px] sm:w-[145px] md:w-[160px] bg-white border border-[#F1F1F1] rounded-[5px] p-[7px] pb-[9px] text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                  isSelected ? "border-[#4F213B] ring-1 ring-[#4F213B]" : ""
                }`}
              >
                {/* Category Image */}
                <div className="relative w-full aspect-[4/5] rounded-[5px] overflow-hidden bg-zinc-100 mb-2">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 33vw, 160px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Category Title */}
                <h3 className="text-[13px] sm:text-[14.5px] font-medium text-zinc-800 hover:text-[#4F213B] capitalize transition-colors truncate">
                  {cat.name}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-700 hover:text-[#4F213B] flex items-center justify-center transition-all opacity-80 hover:opacity-100"
          aria-label="Next categories"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
