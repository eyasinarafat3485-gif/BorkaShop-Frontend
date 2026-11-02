"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiSearch,
  FiX,
  FiArrowRight,
  FiExternalLink,
  FiLogOut,
  FiBell,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiGrid,
  FiCheck,
  FiTrendingUp,
  FiPackage,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";
import toast from "react-hot-toast";

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}: AdminHeaderProps) {
  const router = useRouter();
  const {
    orders,
    products,
    role,
    setRole,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: ⌘K or Ctrl+K to focus search, ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchDropdownOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchDropdownOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target as Node)
      ) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quick navigation shortcuts list
  const navShortcuts = [
    { title: "Overview & Metrics", tab: "overview", icon: FiTrendingUp, keywords: ["stats", "dashboard", "home", "sales", "revenue"] },
    { title: "Orders Management", tab: "orders", icon: FiShoppingBag, keywords: ["orders", "shipping", "delivery", "pending", "invoice"] },
    { title: "Products Catalog", tab: "products", icon: FiBox, keywords: ["products", "inventory", "stock", "burqa", "abaya", "hijab"] },
    { title: "Add New Product", tab: "add-product", icon: FiGrid, keywords: ["new item", "create product", "upload", "add"] },
    { title: "Customer Management", tab: "customers", icon: FiUsers, keywords: ["customers", "users", "buyers", "clients"] },
    { title: "Store Settings", tab: "settings", icon: FiGrid, keywords: ["settings", "shipping", "delivery fee", "bkash", "nagad"] },
  ];

  const q = searchQuery.trim().toLowerCase();

  const filteredShortcuts = navShortcuts.filter((s) =>
    q ? s.title.toLowerCase().includes(q) || s.keywords.some((k) => k.includes(q)) : false
  );

  const filteredProducts = products.filter((p) => {
    if (!q) return false;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  const filteredOrders = orders.filter((o) => {
    if (!q) return false;
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  const totalResults = filteredShortcuts.length + filteredProducts.length + filteredOrders.length;

  const handleSelectNav = (tab: string) => {
    setActiveTab(tab);
    setIsSearchDropdownOpen(false);
    setSearchQuery("");
  };

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30 shadow-xs relative">
      {/* 1. Left: Hamburger & Brand Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <FiMenu size={20} />
        </button>

        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white flex items-center justify-center font-serif font-black text-lg shadow-md shadow-rose-600/20">
            B
          </div>
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-extrabold text-zinc-900 text-lg tracking-tight">
                BorkaShop
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#ff2056] border border-rose-200">
                Admin Panel
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* 2. Middle: Global Command Palette Search */}
      <div ref={searchContainerRef} className="hidden md:flex items-center flex-1 max-w-lg mx-6 relative">
        <div className="relative w-full">
          <FiSearch className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search orders, products, customers, status (e.g. pending)..."
            value={searchQuery}
            onFocus={() => setIsSearchDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchDropdownOpen(true);
            }}
            className="w-full pl-10 pr-20 py-2 bg-zinc-100/90 hover:bg-zinc-100 focus:bg-white border border-transparent focus:border-[#ff2056] rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-all shadow-2xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer"
            >
              <FiX size={14} />
            </button>
          ) : null}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-white border border-zinc-200 rounded shadow-2xs pointer-events-none">
            Ctrl+K
          </span>
        </div>

        {/* Command Palette Dropdown */}
        {isSearchDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden z-50 max-h-[75vh] flex flex-col">
            <div className="p-3 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-zinc-700">
                  {q ? `Search results for "${q}"` : "Quick Navigation & Shortcuts"}
                </span>
                {q && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#ff2056] text-[10px] font-extrabold">
                    {totalResults} found
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-zinc-200 text-[9px] font-mono">
                  ESC
                </kbd>
                <span>to close</span>
              </div>
            </div>

            <div className="overflow-y-auto p-3 space-y-4 divide-y divide-zinc-100 max-h-96">
              {/* Default Shortcuts */}
              {!q && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block px-2">
                    Popular Dashboard Shortcuts
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {navShortcuts.slice(0, 6).map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectNav(item.tab)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-50 text-zinc-700 hover:text-[#ff2056] transition-all text-left text-xs font-semibold border border-transparent hover:border-rose-200 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                            <Icon size={14} />
                          </div>
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matching Pages */}
              {q && filteredShortcuts.length > 0 && (
                <div className="space-y-1.5 pt-2 first:pt-0">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block px-2">
                    Dashboard Pages ({filteredShortcuts.length})
                  </span>
                  <div className="space-y-1">
                    {filteredShortcuts.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectNav(item.tab)}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-zinc-800 hover:text-[#ff2056] transition-colors text-left text-xs cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-zinc-100 group-hover:bg-rose-100 group-hover:text-[#ff2056] flex items-center justify-center text-zinc-600 transition-colors">
                              <Icon size={14} />
                            </div>
                            <span className="font-bold">{item.title}</span>
                          </div>
                          <FiArrowRight size={13} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matching Orders */}
              {q && filteredOrders.length > 0 && (
                <div className="space-y-1.5 pt-3 first:pt-0">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block px-2">
                    Orders Matching &quot;{q}&quot; ({filteredOrders.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredOrders.map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => handleSelectNav("orders")}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-zinc-100 hover:border-purple-200 transition-all text-left text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#4F213B] flex items-center justify-center font-bold text-[11px] shrink-0">
                            <FiShoppingBag size={14} />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-zinc-900">{ord.id}</span>
                              <span className="text-zinc-400">•</span>
                              <span className="font-semibold text-zinc-800">{ord.customerName}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500">
                              {ord.phone} • {ord.items.length} items • ৳{ord.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : ord.status === "Processing"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : ord.status === "Cancelled"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Products */}
              {q && filteredProducts.length > 0 && (
                <div className="space-y-1.5 pt-3 first:pt-0">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block px-2">
                    Products Matching &quot;{q}&quot; ({filteredProducts.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectNav("products")}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 border border-zinc-100 hover:border-purple-200 transition-all text-left text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover bg-zinc-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-zinc-800 line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-zinc-500 capitalize">
                              {p.category} • ৳{p.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#4F213B]">
                          ৳{p.price.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {q && totalResults === 0 && (
                <div className="py-8 text-center text-zinc-400">
                  <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold text-zinc-600">
                    No results found for &quot;{q}&quot;
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Try searching for &quot;Pending&quot;, &quot;Burqa&quot;, or a customer name.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Right: Store Link, Pending Orders Alert, and Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Interactive Notification Bell with Dropdown matching StyleHub */}
        <div ref={notifContainerRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifDropdownOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-zinc-600 hover:text-[#ff2056] hover:bg-rose-50 transition-colors cursor-pointer"
            title={`${unreadNotificationsCount} unread alerts`}
          >
            <FiBell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#ff2056] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-bounce">
                {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in divide-y divide-gray-100">
              {/* Header */}
              <div className="p-3.5 sm:p-4 bg-stone-50/90 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    Notifications
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#ff2056] text-white text-[10px] font-bold rounded-full">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      markAllNotificationsAsRead();
                    }}
                    className="text-[11px] font-bold text-[#ff2056] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Mark all as read"
                  >
                    <FiCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center px-4 space-y-2">
                    <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                      <FiBell className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">No Notifications Yet</p>
                    <p className="text-[11px] text-gray-500">
                      You&apos;re all caught up! Updates regarding store orders and inventory will show here.
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((item) => {
                    const isUnread = !item.isRead;
                    const notifId = item._id || item.id || "";
                    const getRelativeTime = (d: string | Date | undefined) => {
                      if (!d) return "Just now";
                      try {
                        const sec = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
                        if (sec < 60) return "Just now";
                        if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
                        if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
                        return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      } catch {
                        return "Just now";
                      }
                    };

                    return (
                      <div
                        key={notifId}
                        onClick={() => {
                          if (isUnread) {
                            markNotificationAsRead(notifId);
                          }
                          setNotifDropdownOpen(false);
                          if (item.orderId || item.type === "order") {
                            setActiveTab("orders");
                          } else {
                            setActiveTab("notifications");
                          }
                        }}
                        className={`p-3.5 sm:p-4 transition-all flex items-start gap-3 cursor-pointer hover:bg-stone-50 ${
                          isUnread ? "bg-rose-50/40" : "bg-white"
                        }`}
                      >
                        <div className="relative shrink-0 mt-0.5">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.title}
                              className="w-10 h-11 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-slate-700">
                              <FiPackage className="w-4 h-4 text-[#ff2056]" />
                            </div>
                          )}
                          {isUnread && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff2056] rounded-full ring-2 ring-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <h4
                              className={`text-xs truncate ${
                                isUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                              {getRelativeTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          {item.orderId && (
                            <div className="pt-1 flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                #{item.orderId}
                              </span>
                              {item.price && item.price > 0 ? (
                                <span className="text-[10px] font-extrabold text-[#ff2056]">
                                  ৳{Number(item.price).toLocaleString("en-BD")}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* View all button */}
              <div className="p-2.5 bg-stone-50 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    setActiveTab("notifications");
                  }}
                  className="w-full py-2 bg-white hover:bg-rose-50 text-slate-800 hover:text-[#ff2056] text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>View All Notifications ({notifications.length})</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          title="Open customer storefront in new tab"
        >
          <FiExternalLink size={13} />
          <span>View Store</span>
        </Link>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              A
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-zinc-900 leading-tight">Admin</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </span>
            </div>
          </button>

          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 z-50 animate-in fade-in duration-100"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-zinc-100">
                <p className="text-xs font-bold text-zinc-900">Admin</p>
                <p className="text-[11px] text-zinc-400">admin12@gmail.com</p>
              </div>

              <div className="py-1 space-y-0.5 text-xs">
                <Link
                  href="/"
                  className="flex items-center gap-2 w-full px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors font-medium"
                >
                  <FiExternalLink size={14} className="text-zinc-400" />
                  <span>Back to Storefront</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setRole("guest");
                    toast.success("Switched to Guest mode");
                    router.push("/");
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors font-medium text-left"
                >
                  <FiLogOut size={14} className="text-zinc-400" />
                  <span>Exit Admin Role</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
