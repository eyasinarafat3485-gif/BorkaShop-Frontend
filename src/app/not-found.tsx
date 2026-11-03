"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiSearch,
  FiArrowLeft,
  FiHelpCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const quickLinks = [
    { name: "Burqa Collection", href: "/product-category/burqa" },
    { name: "Abaya Designs", href: "/product-category/abaya" },
    { name: "Hijabs & Khimars", href: "/product-category/hijab" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "Size Guide", href: "/size-guide" },
  ];

  return (
    <div className="w-full bg-[#FAF9F8] min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#4F213B]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto text-center relative z-10">
        {/* Animated Badge & Giant 404 */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4F213B]/10 text-[#4F213B] text-xs font-semibold uppercase tracking-wider mb-4 animate-in fade-in duration-300">
          <span className="w-2 h-2 rounded-full bg-[#4F213B] animate-ping" />
          <span>Error 404 – Page Not Found</span>
        </div>

        {/* Big Stylized Typography */}
        <div className="relative my-2 select-none">
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-[#4F213B] opacity-90 font-['Playfair_Display',serif]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm sm:text-base font-bold bg-[#FAF9F8] px-4 py-1 text-zinc-600 rounded-full border border-zinc-200/80 shadow-xs">
              পেজটি খুঁজে পাওয়া যায়নি
            </span>
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-4 tracking-tight">
          Oops! This Modest Look is Out of Sight
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-md mx-auto leading-relaxed">
          The link you followed may be broken, renamed, or the product may be
          temporarily unavailable in our current catalog.
        </p>

        {/* In-Page Quick Search Box */}
        <form
          onSubmit={handleSearch}
          className="mt-8 max-w-md mx-auto relative flex items-center"
        >
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Burqa, Abaya, Hijab, Size..."
              className="w-full pl-10 pr-24 py-3 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:outline-none focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B] transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#4F213B] hover:bg-[#3D182D] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Primary Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#4F213B] hover:bg-[#3D182D] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200"
          >
            <FiHome size={15} />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <FiShoppingBag size={15} />
            <span>Browse All Shop</span>
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 px-3 py-2 transition-colors cursor-pointer"
          >
            <FiArrowLeft size={14} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Popular Collections Quick Pills */}
        <div className="mt-10 pt-8 border-t border-zinc-200/80">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Popular Collections
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 bg-white hover:bg-[#4F213B] text-zinc-700 hover:text-white border border-zinc-200/90 rounded-full text-xs font-medium shadow-2xs transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Immediate Help Card */}
        <div className="mt-8 bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-zinc-200/80 max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
              <FaWhatsapp size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">
                Need Help Finding Something?
              </p>
              <p className="text-[11px] text-zinc-500">
                Hotline: +880 1810-559258 (Daily 9AM–10PM)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/8801810559258?text=Hello%20Borka%20Shop%2C%20I%20could%20not%20find%20a%20product%20page"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Chat</span>
            </a>
            <Link
              href="/contact"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <FiHelpCircle size={13} />
              <span>Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
