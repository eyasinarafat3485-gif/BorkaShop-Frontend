"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/ProductCard";
import { FiChevronRight, FiFilter, FiSearch, FiSliders, FiX } from "react-icons/fi";

function ShopContent() {
  const searchParams = useSearchParams();
  const { products } = useShop();
  const qParam = searchParams.get("q") || searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const filterParam = searchParams.get("filter") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(qParam);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  // Keep state synchronized with URL search parameters
  useEffect(() => {
    if (qParam) {
      setSearchQuery(qParam);
      // When searching a specific product or keyword, include all categories so it's always found
      setSelectedCategory("all");
    } else {
      setSearchQuery("");
    }
  }, [qParam]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "burqa", label: "Burqa" },
    { id: "abaya", label: "Abaya" },
    { id: "hijab", label: "Hijab" },
    { id: "khimar", label: "Khimar" },
    { id: "modest-sets", label: "Modest Sets" },
    { id: "niqab", label: "Niqab" },
  ];

  // Filtered and sorted products from live database
  const filteredProducts = useMemo(() => {
    const catalog = products && products.length > 0 ? products : PRODUCTS;
    let result = [...catalog];

    // Filter by search query (intelligent search across all fields)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const words = q.split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        const textToSearch = [
          p.name,
          p.category,
          p.fabric || "",
          p.description || "",
          p.tag || "",
          p.id || "",
          ...(p.sizes || []),
          ...(p.colors?.map((c) => (typeof c === "string" ? c : c.name)) || []),
        ]
          .join(" ")
          .toLowerCase();

        return textToSearch.includes(q) || words.every((word) => textToSearch.includes(word));
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by special query params
    if (filterParam === "new-arrivals") {
      result = result.filter((p) => p.isNewArrival);
    } else if (filterParam === "best-sellers") {
      result = result.filter((p) => p.isBestSeller);
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, filterParam, searchQuery, sortBy]);

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen pb-16">
      {/* Breadcrumbs */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600">
            <Link href="/" className="hover:text-[#4F213B] transition-colors">
              Home
            </Link>
            <FiChevronRight size={13} className="text-zinc-400" />
            <span className="text-zinc-900 font-medium">Shop</span>
            {selectedCategory !== "all" && (
              <>
                <FiChevronRight size={13} className="text-zinc-400" />
                <span className="text-[#4F213B] font-semibold capitalize">
                  {selectedCategory}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Header Bar */}
        <div className="bg-white rounded-lg border border-zinc-200 p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-['Hind_Siliguri'] text-2xl sm:text-3xl font-bold text-zinc-900">
                {searchQuery.trim()
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory === "all"
                  ? filterParam === "new-arrivals"
                    ? "New Arrivals Collection"
                    : filterParam === "best-sellers"
                    ? "Best Sellers Collection"
                    : "Shop All Collections"
                  : `${selectedCategory.toUpperCase()} Collection`}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </span>
                {searchQuery.trim() && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="text-[#4F213B] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer bg-[#4F213B]/5 px-2 py-0.5 rounded text-xs"
                  >
                    <FiX size={12} /> Clear search filter
                  </button>
                )}
              </p>
            </div>

            {/* Search within Shop */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products in shop..."
                className="w-full pl-9 pr-8 py-2 rounded-md border border-zinc-300 text-xs sm:text-sm bg-zinc-50 focus:bg-white focus:outline-none focus:border-[#4F213B] transition-colors"
              />
              <FiSearch className="absolute left-3 top-2.5 text-zinc-400" size={15} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 cursor-pointer p-0.5"
                  aria-label="Clear search"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills and Sort Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 pt-5 border-t border-zinc-100">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-[#4F213B] text-white border-[#4F213B] shadow-sm"
                      : "bg-white text-zinc-700 border-zinc-200 hover:border-[#4F213B] hover:text-[#4F213B]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <FiSliders size={14} className="text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs sm:text-sm font-semibold text-zinc-800 bg-white border border-zinc-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#4F213B]"
              >
                <option value="default">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center my-6">
            <p className="text-base font-semibold text-zinc-800 mb-2">
              No products found
            </p>
            <p className="text-xs text-zinc-500 mb-4">
              Try selecting another category or clearing your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#4F213B] text-white rounded text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4F213B]"></div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
