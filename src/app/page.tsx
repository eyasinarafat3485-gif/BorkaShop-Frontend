"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HeroSlider from "@/components/HeroSlider";
import CategoriesSection from "@/components/CategoriesSection";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/ShopContext";

export default function Home() {
  const router = useRouter();
  const { products } = useShop();
  const [visibleRecentCount, setVisibleRecentCount] = useState<number>(5);

  // Group products from live MongoDB Atlas database
  const activeProducts = products && products.length > 0 ? products : PRODUCTS;
  const eidProducts = activeProducts.slice(0, 5); // First 5 products in EID COLLECTION 2026
  const abayaProducts = activeProducts.filter((p) => p.category === "abaya");
  const recentProducts = activeProducts.slice(0, visibleRecentCount);

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen pb-14 sm:pb-8">
      {/* 1. Hero Image Slider */}
      <HeroSlider />

      {/* 2. Categories Loop Carousel */}
      <CategoriesSection
        onSelectCategory={(catId) => {
          router.push(`/product-category/${catId}`);
        }}
      />

      {/* 3. Section: EID COLLECTION 2026 */}
      <section id="eid-section" className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Elementor Divider with Text */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-[#FAF9F8] px-5 font-['Hind_Siliguri'] text-[16px] sm:text-[18px] font-bold text-[#4F213B] uppercase tracking-wider text-center flex-shrink-0">
            EID COLLECTION 2026
          </span>
          <div className="border-t border-zinc-200 w-full" />
        </div>

        {/* 5-Column Grid (Matches digital-product-grid on live site) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {eidProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Section: ABAYA */}
      <section id="abaya-section" className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Elementor Divider with Text */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-[#FAF9F8] px-5 font-['Hind_Siliguri'] text-[16px] sm:text-[18px] font-bold text-[#4F213B] uppercase tracking-wider text-center flex-shrink-0">
            ABAYA
          </span>
          <div className="border-t border-zinc-200 w-full" />
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {abayaProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Section: Recent Products */}
      <section id="recent-section" className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Elementor Divider with Text */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-[#FAF9F8] px-5 font-['Hind_Siliguri'] text-[16px] sm:text-[18px] font-bold text-[#4F213B] uppercase tracking-wider text-center flex-shrink-0">
            Recent Products
          </span>
          <div className="border-t border-zinc-200 w-full" />
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleRecentCount < PRODUCTS.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() =>
                setVisibleRecentCount((prev) =>
                  Math.min(prev + 5, PRODUCTS.length)
                )
              }
              className="bg-[#4F213B] hover:bg-[#3D182D] text-white px-8 py-2.5 rounded-[3px] font-['Hind_Siliguri'] text-sm font-medium uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              More Products
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
