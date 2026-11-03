"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiGrid,
  FiShoppingBag,
  FiChevronDown,
  FiChevronRight,
  FiLayers,
  FiPlusCircle,
  FiAward,
  FiFolder,
  FiTag,
  FiSliders,
  FiStar,
  FiPackage,
  FiUsers,
  FiBell,
  FiBarChart2,
  FiSettings,
  FiHome,
  FiLogOut,
  FiShield,
  FiX,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";
import toast from "react-hot-toast";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const router = useRouter();
  const { orders, customers, setRole, unreadNotificationsCount } = useShop();

  // Accordion state for Products - defaults to open like in the user's screenshot
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  // Sub-items for Products accordion
  const productSubItems = [
    { id: "products", slug: "all-products", label: "All Products", icon: FiLayers },
    { id: "add-product", slug: "add-product", label: "Add new product", icon: FiPlusCircle },
    { id: "brands", slug: "brands", label: "Brands", icon: FiAward },
    { id: "categories", slug: "categories", label: "Categories", icon: FiFolder },
    { id: "tags", slug: "tags", label: "Tags", icon: FiTag },
    { id: "attributes", slug: "attributes", label: "Attributes", icon: FiSliders },
    { id: "reviews", slug: "reviews", label: "Reviews", icon: FiStar },
  ];

  const isProductSubActive = productSubItems.some((item) => item.id === activeTab);

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("borkashop_user");
      localStorage.removeItem("better_auth_token");
      setRole("guest");
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Dark Sidebar with Guaranteed Native & Touch Scrolling */}
      <aside
        data-lenis-prevent="true"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#070913] text-slate-300 border-r border-slate-800/80 p-4 h-screen max-h-screen overflow-y-auto overflow-x-hidden overscroll-contain flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 admin-sidebar-scroll select-none ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#334155 transparent",
        }}
      >
        <div className="space-y-4">
          {/* 1. Profile Block */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              {/* Pink Avatar with 'A' and Online Indicator */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff2056] to-rose-400 text-white font-serif font-black text-xl flex items-center justify-center shadow-md">
                  A
                </div>
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#070913] rounded-full"
                  title="Online"
                />
              </div>

              {/* User details */}
              <div className="overflow-hidden text-left">
                <h3 className="font-serif font-bold text-white text-sm tracking-tight truncate">
                  Admin
                </h3>
                <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                  admin12@gmail.com
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <FiShield className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Navigation */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              MAIN MANAGEMENT
            </p>

            {/* Dashboard Overview */}
            <Link
              href="/admin"
              onClick={() => handleTabClick("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "overview"
                  ? "bg-[#ff2056] text-white shadow-lg shadow-rose-600/30 font-bold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <FiGrid className={`w-4 h-4 ${activeTab === "overview" ? "text-white" : "text-slate-400"}`} />
              <span>Dashboard Overview</span>
            </Link>

            {/* Products Accordion */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isProductSubActive && !isProductsOpen
                    ? "bg-[#ff2056]/20 text-[#ff2056] border border-rose-500/30"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiShoppingBag
                    className={`w-4 h-4 ${
                      isProductSubActive ? "text-[#ff2056]" : "text-slate-400"
                    }`}
                  />
                  <span>Products</span>
                </div>
                <FiChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isProductsOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              {/* Sub-items Indented List */}
              {isProductsOpen && (
                <div className="ml-4 pl-3.5 border-l border-slate-800 space-y-1 pt-1 pb-1">
                  {productSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === sub.id;
                    return (
                      <Link
                        key={sub.id}
                        href={`/admin/${sub.slug}`}
                        onClick={() => handleTabClick(sub.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-[#ff2056] text-white shadow-md font-bold"
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                        }`}
                      >
                        <SubIcon
                          className={`w-3.5 h-3.5 ${
                            isSubActive ? "text-white" : "text-slate-400"
                          }`}
                        />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Orders & Sales */}
            <Link
              href="/admin/orders"
              onClick={() => handleTabClick("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "orders"
                  ? "bg-[#ff2056] text-white shadow-lg shadow-rose-600/30 font-bold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiPackage
                  className={`w-4 h-4 ${
                    activeTab === "orders" ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>Orders & Sales</span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  activeTab === "orders"
                    ? "bg-white/20 text-white"
                    : "bg-[#ff2056]/20 text-[#ff2056] border border-rose-500/30"
                }`}
              >
                {pendingOrdersCount > 0 ? `${pendingOrdersCount} NEW` : `${orders.length} TOTAL`}
              </span>
            </Link>

            {/* Customers */}
            <Link
              href="/admin/customers"
              onClick={() => handleTabClick("customers")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "customers"
                  ? "bg-[#ff2056] text-white shadow-lg shadow-rose-600/30 font-bold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiUsers
                  className={`w-4 h-4 ${
                    activeTab === "customers" ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>Customers</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                {customers && customers.length > 0 ? customers.length : (new Set(orders.map(o => o.phone).filter(Boolean))).size}
              </span>
            </Link>

            {/* Alerts & Notifications */}
            <Link
              href="/admin/notifications"
              onClick={() => handleTabClick("notifications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "notifications"
                  ? "bg-[#ff2056] text-white shadow-lg shadow-rose-600/30 font-bold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiBell
                  className={`w-4 h-4 ${
                    activeTab === "notifications" ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>Alerts & Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    activeTab === "notifications"
                      ? "bg-white/20 text-white"
                      : "bg-[#ff2056] text-white shadow-sm shadow-rose-600/40"
                  }`}
                >
                  {unreadNotificationsCount} New
                </span>
              )}
            </Link>

            {/* Reports & Analytics */}
            <Link
              href="/admin/analytics"
              onClick={() => handleTabClick("analytics")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "analytics"
                  ? "bg-[#ff2056] text-white shadow-lg shadow-rose-600/30 font-bold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiBarChart2
                  className={`w-4 h-4 ${
                    activeTab === "analytics" ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>Reports & Analytics</span>
              </div>
            </Link>

            {/* Store Settings */}
            <Link
              href="/admin/settings"
              onClick={() => handleTabClick("settings")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "settings"
                  ? "bg-[#ff2056] text-white shadow-lg shadow-rose-600/30 font-bold"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FiSettings
                  className={`w-4 h-4 ${
                    activeTab === "settings" ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>Store Settings</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* 3. Bottom Links */}
        <div className="pt-4 border-t border-slate-800/80 mt-6 space-y-1.5 shrink-0">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <FiHome className="w-4 h-4 text-slate-400" />
              <span>Back to Home</span>
            </div>
            <FiChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-[#ff2056] hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-left"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
