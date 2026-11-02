"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { PRODUCTS } from "@/data/products";
import { FiSearch, FiX, FiZap } from "react-icons/fi";
import { Product } from "@/types";

export default function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, addToCart, products } = useShop();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const catalog = products && products.length > 0 ? products : PRODUCTS;
  const filteredProducts: Product[] = query.trim()
    ? catalog.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.fabric.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const quickTags = ["Abaya", "Burqa", "Medina Silk", "Khimar", "Eid 2026", "Modest Sets"];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden mt-12 sm:mt-20 z-10 animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center gap-3">
          <FiSearch className="text-[#4F213B] text-xl flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Abayas, Burqas, Hijabs, Fabrics..."
            className="w-full text-base sm:text-lg font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-zinc-400 hover:text-zinc-600 bg-zinc-100 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
            aria-label="Close search"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-3 bg-[#FAF8F6] border-b border-zinc-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-zinc-600 font-semibold uppercase text-[10px] tracking-wider flex-shrink-0">
            Popular:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:border-[#4F213B] hover:text-[#4F213B] transition-colors flex-shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-zinc-400 text-sm">
              <p>Type keywords to search our live modest fashion collection</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <p className="font-serif text-lg font-bold text-zinc-700">
                No matching modest wear found
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Try searching for &quot;Burqa&quot;, &quot;Abaya&quot;, &quot;Georgette&quot;, or &quot;Hijab&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Found {filteredProducts.length} items
              </p>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-[#FAF5F8] border border-transparent hover:border-[#4F213B]/20 transition-all group"
                >
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#C89B59]">
                        {p.category}
                      </span>
                      {p.discountPercent && (
                        <span className="text-[10px] bg-[#4F213B] text-white px-1.5 py-0.2 rounded font-bold">
                          {p.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-zinc-900 group-hover:text-[#4F213B] truncate">
                      {p.name}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">
                      {p.fabric}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 flex items-center gap-3">
                    <div>
                      <span className="font-sans font-extrabold text-sm text-[#4F213B] block">
                        ৳{p.price.toLocaleString()}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-zinc-400 line-through block">
                          ৳{p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        const defaultSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : "Standard";
                        const defaultColor = p.colors && p.colors.length > 0 ? p.colors[0].name : "Default";
                        addToCart(p, defaultSize, defaultColor, 1);
                        router.push("/checkout");
                      }}
                      className="bg-[#4F213B] hover:bg-[#3D182D] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <FiZap className="text-amber-300" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
