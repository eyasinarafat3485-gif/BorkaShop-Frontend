"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiX,
  FiTruck,
  FiPhone,
  FiShield,
  FiHelpCircle,
  FiLogOut,
  FiGrid,
  FiLogIn,
  FiShoppingBag,
  FiBox,
  FiArrowRight,
} from "react-icons/fi";
import { signOut } from "@/lib/auth-client";
import { PRODUCTS } from "@/data/products";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const {
    cartCount,
    cartTotal,
    setIsCartOpen,
    setIsSearchOpen,
    setIsTrackOrderOpen,
    role,
    setRole,
    products,
  } = useShop();

  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const catalog = products && products.length > 0 ? products : PRODUCTS;
  const searchResults = searchQuery.trim()
    ? catalog.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        const words = q.split(/\s+/).filter(Boolean);
        const textToSearch = [
          p.name,
          p.category,
          p.fabric,
          p.description,
          p.id,
          p.tag,
          ...(p.sizes || []),
          ...(p.colors?.map((c: any) => (typeof c === "string" ? c : c.name)) || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return textToSearch.includes(q) || words.every((word) => textToSearch.includes(word));
      })
    : [];

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string } | null>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchPanelOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchPanelOpen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("borkashop_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      } else {
        setCurrentUser(null);
      }
    } catch {
      // ignore
    }
  }, [role]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setAccountDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("borkashop_user");
      localStorage.removeItem("better_auth_token");
      try {
        await signOut();
      } catch { }
      setRole("guest", true);
      setCurrentUser(null);
      setAccountDropdownOpen(false);
      toast.success("Logged out successfully", {
        icon: "👋",
        style: {
          borderRadius: "10px",
          background: "#1E293B",
          color: "#fff",
          fontSize: "14px",
        },
      });
      if (pathname.startsWith("/admin")) {
        router.push("/");
      }
    } catch {
      setRole("guest", true);
      router.push("/");
    }
  };



  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Burqa", href: "/product-category/burqa" },
    { name: "Abaya", href: "/product-category/abaya" },
    { name: "Hijab", href: "/product-category/hijab" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Best Sellers", href: "/best-sellers" },
  ];

  return (
    <>
      {/* 1. Announcement Bar (Exact Borbila theme style) */}
      <div className="bg-[#4F213B] text-white text-[12px] sm:text-[13px] py-1.5 px-4 font-medium border-b border-[#3E172C]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate">
              Free Delivery on Orders Over ৳4,000 | Easy Exchange Available
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-zinc-200 text-xs">
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Track Order
            </button>
            <span className="text-white/30">|</span>
            <Link
              href="/contact"
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Contact Us
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/faq"
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Sticky) */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white ${isScrolled ? "shadow-md py-2.5 border-b border-zinc-200" : "py-3 border-b border-zinc-200"
          }`}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-zinc-800 hover:text-[#4F213B] rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Open mobile navigation menu"
          >
            {mobileMenuOpen ? <FiX size={22} className="sm:w-6 sm:h-6" /> : <FiMenu size={22} className="sm:w-6 sm:h-6" />}
          </button>

          {/* Logo (Same to same live site logo image) */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative h-8 w-32 sm:h-12 sm:w-52">
              <Image
                src="https://borkashop.borbila.net/wp-content/uploads/2026/07/logo-1.png"
                alt="Borka Shop Logo"
                fill
                sizes="(max-width: 640px) 128px, 208px"
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Nav Items with bottom border on hover */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-medium text-zinc-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1.5 transition-colors relative group cursor-pointer ${isActive
                    ? "text-[#4F213B] font-semibold"
                    : "text-zinc-800 hover:text-[#4F213B]"
                    }`}
                >
                  <span>{link.name}</span>
                  {/* Bottom Border on Hover & Active */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2.5px] bg-[#4F213B] rounded-full transition-all duration-300 ease-out ${isActive
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Search Button (Toggles Previous Navbar Slide-Down Search Bar) */}
            <button
              onClick={() => {
                setSearchPanelOpen(!searchPanelOpen);
                if (!searchPanelOpen) {
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }
              }}
              className="p-1.5 sm:p-2 text-zinc-800 hover:text-[#4F213B] transition-colors rounded-full hover:bg-zinc-100 cursor-pointer"
              aria-label="Toggle Search"
            >
              <FiSearch size={20} className="sm:w-[21px] sm:h-[21px]" />
            </button>

            {/* Account Icon with Dynamic Dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setAccountDropdownOpen(!accountDropdownOpen);
                }}
                className={`p-1.5 sm:p-2 transition-all rounded-full relative cursor-pointer ${accountDropdownOpen
                    ? "bg-[#4F213B]/10 text-[#4F213B]"
                    : "text-zinc-800 hover:text-[#4F213B] hover:bg-zinc-100"
                  }`}
                aria-label="User Account Menu"
                aria-expanded={accountDropdownOpen}
              >
                <FiUser size={20} className="sm:w-[21px] sm:h-[21px]" />
                {role === "admin" && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500/20" />
                )}
                {role === "user" && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#4F213B] rounded-full border-2 border-white ring-1 ring-[#4F213B]/20" />
                )}
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-2xl border border-zinc-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                  {/* CASE 1: ADMIN IS LOGGED IN */}
                  {role === "admin" && (
                    <div className="space-y-1">
                      {/* Admin Profile Header */}
                      <div className="px-3.5 py-3 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white mx-2 rounded-xl mb-2 shadow-inner">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg shrink-0 shadow-xs">
                            👑
                          </div>
                          <div className="overflow-hidden flex-1 text-left">
                            <p className="text-xs font-bold text-white truncate">
                              {currentUser?.name || "MD: Eyasin Arafat"}
                            </p>
                            <p className="text-[11px] text-zinc-300 truncate">
                              {currentUser?.email || "admin12@gmail.com"}
                            </p>
                            <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Store Administrator
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Navigation Links */}
                      <div className="px-2 space-y-1">
                        <Link
                          href="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F213B] hover:bg-[#3D182D] transition-colors shadow-xs"
                        >
                          <FiGrid size={16} />
                          <div className="flex-1 text-left">
                            <p className="leading-tight">Admin Dashboard</p>
                            <p className="text-[10px] text-rose-200 font-normal">Full store management & stats</p>
                          </div>
                          <FiArrowRight size={14} />
                        </Link>

                        <Link
                          href="/admin?tab=products"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-[#4F213B] transition-colors"
                        >
                          <FiBox size={15} className="text-zinc-400" />
                          <span>Manage Products</span>
                        </Link>

                        <Link
                          href="/admin?tab=orders"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-[#4F213B] transition-colors"
                        >
                          <FiShoppingBag size={15} className="text-zinc-400" />
                          <span>Orders & Shipments</span>
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 my-1.5" />

                      {/* Logout Button */}
                      <div className="px-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <FiLogOut size={15} className="text-rose-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 2: REGULAR CUSTOMER LOGGED IN */}
                  {role === "user" && (
                    <div className="space-y-1">
                      {/* Customer Profile Header */}
                      <div className="px-3.5 py-3 bg-[#FAF8F5] border border-zinc-200/80 mx-2 rounded-xl mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#4F213B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {(currentUser?.name || "Customer").slice(0, 1).toUpperCase()}
                          </div>
                          <div className="overflow-hidden flex-1 text-left">
                            <p className="text-xs font-bold text-zinc-900 truncate">
                              {currentUser?.name || "Customer Account"}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate">
                              {currentUser?.email || "Member"}
                            </p>
                            <span className="inline-block mt-0.5 text-[9px] font-bold text-[#4F213B] uppercase tracking-wider">
                              Verified Member
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-2 space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            setIsTrackOrderOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-[#4F213B] transition-colors text-left cursor-pointer"
                        >
                          <FiTruck size={15} className="text-zinc-400" />
                          <span>Track My Order</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-[#4F213B] transition-colors text-left cursor-pointer"
                        >
                          <FiShoppingBag size={15} className="text-zinc-400" />
                          <span>My Shopping Bag</span>
                        </button>
                      </div>

                      <div className="border-t border-zinc-100 my-1.5" />

                      <div className="px-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <FiLogOut size={15} className="text-rose-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 3: NOT LOGGED IN (GUEST) */}
                  {role === "guest" && (
                    <div className="p-3 space-y-3">
                      <div className="text-left px-1">
                        <p className="text-xs font-bold text-zinc-900 font-serif">Welcome to Borka Shop</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                          Sign in to manage your orders & access member privileges
                        </p>
                      </div>

                      {/* Login Button */}
                      <Link
                        href="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="w-full py-2.5 px-4 bg-[#4F213B] hover:bg-[#3D182D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <FiLogIn size={15} />
                        <span>Sign In / Login</span>
                      </Link>

                      {/* Register Link */}
                      <div className="text-center text-[11px] text-zinc-500 pt-0.5">
                        <span>New customer? </span>
                        <Link
                          href="/register"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="font-bold text-[#4F213B] hover:underline"
                        >
                          Create Account
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            setIsTrackOrderOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-[#4F213B] hover:bg-zinc-50 transition-colors text-left cursor-pointer"
                        >
                          <FiTruck size={14} className="text-zinc-400" />
                          <span>Track Parcel (Guest Order)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 sm:p-2 text-zinc-800 hover:text-[#4F213B] transition-colors rounded-full hover:bg-zinc-100 relative cursor-pointer"
              aria-label="View Cart"
            >
              <div className="relative">
                {/* Shopping Basket SVG */}
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800 fill-current"
                  viewBox="0 0 1000 1000"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M104 365C104 365 105 365 105 365H208L279 168C288 137 320 115 355 115H646C681 115 713 137 723 170L793 365H896C896 365 897 365 897 365H958C975 365 990 379 990 396S975 427 958 427H923L862 801C848 851 803 885 752 885H249C198 885 152 851 138 798L78 427H42C25 427 10 413 10 396S25 365 42 365H104ZM141 427L199 785C205 807 225 823 249 823H752C775 823 796 807 801 788L860 427H141ZM726 365L663 189C660 182 654 177 645 177H355C346 177 340 182 338 187L274 365H726ZM469 521C469 504 483 490 500 490S531 504 531 521V729C531 746 517 760 500 760S469 746 469 729V521ZM677 734C674 751 658 762 641 760 624 758 613 742 615 725L644 519C647 502 663 490 680 492S708 510 706 527L677 734ZM385 725C388 742 375 757 358 760 341 762 325 750 323 733L293 527C291 510 303 494 320 492 337 489 353 501 355 518L385 725Z" />
                </svg>
                <span className="absolute -top-1 -right-1.5 bg-[#4F213B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 3. Dropdown Search Panel (Matches .bs-search-panel on borkashop.borbila.net) */}
        {searchPanelOpen && (
          <div className="w-full bg-[#FAF8F6] border-t border-b border-zinc-200 py-3 sm:py-3.5 px-3 sm:px-4 animate-in slide-in-from-top-2 duration-150 relative z-50">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Products..."
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-md border border-zinc-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchPanelOpen(false);
                      }
                    }}
                  />
                  <FiSearch className="absolute left-3 top-2.5 sm:top-3 text-zinc-400" size={16} />
                </div>
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchPanelOpen(false);
                    }
                  }}
                  className="bg-[#4F213B] hover:bg-[#3D182D] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setSearchPanelOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-800 cursor-pointer shrink-0"
                  aria-label="Close search"
                >
                  <FiX size={19} />
                </button>
              </div>

              {/* Real-time Universal Filter Results Dropdown */}
              {searchQuery.trim() !== "" && (
                <div className="mt-2 bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden max-h-80 overflow-y-auto animate-in fade-in duration-150">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">
                      No matching products found for &quot;<span className="font-semibold text-zinc-800">{searchQuery}</span>&quot;
                    </div>
                  ) : (
                    <div>
                      <div className="px-3 py-1.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-[11px] font-bold text-zinc-500">
                        <span>Matching Products ({searchResults.length})</span>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                            setSearchPanelOpen(false);
                          }}
                          className="text-[#4F213B] hover:underline cursor-pointer font-semibold text-[11px]"
                        >
                          View in Shop →
                        </button>
                      </div>
                      <div className="divide-y divide-zinc-100">
                        {searchResults.slice(0, 8).map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              router.push(`/shop?q=${encodeURIComponent(product.name)}`);
                              setSearchPanelOpen(false);
                              setSearchQuery("");
                            }}
                            className="p-2.5 hover:bg-[#FAF5F8] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-10 h-12 rounded-md overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-xs text-zinc-900 group-hover:text-[#4F213B] truncate">
                                  {product.name}
                                </p>
                                <p className="text-[10px] text-zinc-400 truncate">
                                  {product.category} {product.fabric ? `• ${product.fabric}` : ""}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-bold text-xs text-[#4F213B] block">
                                ৳{product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}



        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-6 py-5 space-y-4 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="relative h-10 w-48 mb-2">
              <Image
                src="https://borkashop.borbila.net/wp-content/uploads/2026/07/logo-1.png"
                alt="Borka Shop Logo"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>
            <nav className="flex flex-col space-y-1 text-sm font-medium text-zinc-800 border-t border-zinc-100 pt-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 px-2.5 rounded-sm transition-colors flex items-center justify-between border-b cursor-pointer ${isActive
                      ? "text-[#4F213B] font-bold bg-[#4F213B]/5 border-b-2 border-b-[#4F213B]"
                      : "text-zinc-800 border-zinc-100 hover:text-[#4F213B] hover:border-b-[#4F213B]/40 hover:bg-zinc-50"
                      }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F213B]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-zinc-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#4F213B] text-white py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <FiUser size={15} />
                <span>Login / Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
