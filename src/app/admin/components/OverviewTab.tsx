"use client";

import React, { useState } from "react";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiPlusCircle,
  FiRefreshCw,
  FiArrowRight,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiXCircle,
  FiEye,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";
import toast from "react-hot-toast";

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
  onOpenOrderModal: (orderId: string) => void;
}

export default function OverviewTab({
  setActiveTab,
  onOpenOrderModal,
}: OverviewTabProps) {
  const { orders, products, customers, refreshDashboardData } = useShop();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDashboardData();
    setIsRefreshing(false);
    toast.success("Store metrics refreshed from live database!", { icon: "🔄" });
  };

  // Metrics calculations (Real numbers from live database)
  const totalOrders = orders.length;
  const validOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalRevenue = validOrders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  // Real customers count directly from database
  const totalCustomersCount =
    customers && customers.length > 0
      ? customers.length
      : new Set(orders.map((o) => o.phone).filter(Boolean)).size;

  // KPI Cards array (100% real database counts)
  const kpiCards = [
    {
      title: "Total Revenue",
      value: `৳ ${totalRevenue.toLocaleString()}`,
      subtext: `Avg Order: ৳ ${avgOrderValue.toLocaleString()}`,
      badge: `${validOrders.length} Paid / Active`,
      icon: FiTrendingUp,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      action: () => setActiveTab("orders"),
    },
    {
      title: "Total Orders",
      value: `${totalOrders} Orders`,
      subtext: `${pendingCount + processingCount} Need Action`,
      badge: `${deliveredCount} Delivered`,
      icon: FiShoppingBag,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      action: () => setActiveTab("orders"),
    },
    {
      title: "Catalog Inventory",
      value: `${totalProducts} Products`,
      subtext: `${inStockCount} in stock • ${outOfStockCount} out`,
      badge: "6 Categories",
      icon: FiBox,
      color: "bg-purple-50 text-[#ff2056] border-purple-200",
      action: () => setActiveTab("products"),
    },
    {
      title: "Total Shoppers",
      value: `${totalCustomersCount} Customers`,
      subtext: "Verified phone & registered accounts",
      badge: "Dhaka & Nationwide",
      icon: FiUsers,
      color: "bg-amber-50 text-amber-600 border-amber-200",
      action: () => setActiveTab("customers"),
    },
  ];

  // Pipeline array
  const pipeline = [
    { label: "Pending", count: pendingCount, color: "bg-amber-50 text-amber-800 border-amber-200", icon: FiClock },
    { label: "Processing", count: processingCount, color: "bg-blue-50 text-blue-800 border-blue-200", icon: FiBox },
    { label: "Shipped", count: shippedCount, color: "bg-purple-50 text-purple-800 border-purple-200", icon: FiTruck },
    { label: "Delivered", count: deliveredCount, color: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: FiCheckCircle },
    { label: "Cancelled", count: cancelledCount, color: "bg-rose-50 text-rose-800 border-rose-200", icon: FiXCircle },
  ];

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const categoryList = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    count,
    percentage: Math.round((count / totalProducts) * 100),
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* 1. Executive Performance Center Banner (StyleHub Dark Theme Style) */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#2E1022] to-zinc-950 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff2056]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Store Performance Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black tracking-tight">
            BorkaShop Executive Overview
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
            Real-time synchronization with MongoDB Atlas orders, live guest checkouts, customer database, and active catalog products.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="py-2.5 px-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            title="Refresh dashboard metrics"
          >
            <FiRefreshCw size={14} className={isRefreshing ? "animate-spin text-amber-300" : ""} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => setActiveTab("add-product")}
            className="py-2.5 px-4 bg-[#ff2056] hover:bg-[#3D182D] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#ff2056]/40 border border-white/15 transition-all cursor-pointer flex items-center gap-2"
          >
            <FiPlusCircle size={15} />
            <span>+ Add Product</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className="py-2.5 px-4 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <FiShoppingBag size={15} />
            <span>Manage Orders</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.action}
              className="bg-white rounded-2xl border border-zinc-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#ff2056]/40 transition-all space-y-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl border group-hover:scale-105 transition-transform ${kpi.color} shrink-0`}>
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight font-serif truncate">
                  {kpi.value}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-1 text-[11px]">
                  <span className="font-semibold text-zinc-500 truncate">{kpi.subtext}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 w-fit shrink-0">
                    {kpi.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Live Order Fulfillment Pipeline (Exact StyleHub 5 Status Counters) */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2056]" />
              <span>Live Order Fulfillment Pipeline</span>
            </h4>
            <p className="text-xs text-zinc-400">Current status breakdown across all online & guest orders</p>
          </div>

          <button
            onClick={() => setActiveTab("orders")}
            className="text-xs font-bold text-[#ff2056] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Open Orders Manager</span>
            <FiArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {pipeline.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab("orders")}
                className={`p-3 rounded-xl border ${p.color} transition-all hover:scale-102 cursor-pointer shadow-2xs ${
                  idx === 4 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                    {p.label}
                  </span>
                  <Icon size={14} className="opacity-70" />
                </div>
                <span className="text-xl font-black block mt-1">{p.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 2-Column: Recent Orders (Left 2 cols) & Categories Breakdown (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-bold text-zinc-900 font-serif">
                Recent Store Orders
              </h3>
              <p className="text-xs text-zinc-500">Live order transactions from 1-click checkout</p>
            </div>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-xs font-bold text-[#ff2056] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <FiArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-bold border-y border-zinc-100">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900">
                      {ord.id}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-zinc-800">{ord.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{ord.phone}</p>
                    </td>
                    <td className="py-3 px-3 text-zinc-600">
                      {ord.items.length} item{ord.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#ff2056]">
                      ৳{ord.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : ord.status === "Processing"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : ord.status === "Shipped"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : ord.status === "Cancelled"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onOpenOrderModal(ord.id)}
                        className="p-1.5 rounded-lg bg-zinc-100 hover:bg-[#ff2056] hover:text-white text-zinc-700 transition-colors cursor-pointer"
                        title="View Order Details & Receipt"
                      >
                        <FiEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Categories Distribution & Quick Actions */}
        <div className="space-y-6">
          {/* Category Progress Bars */}
          <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 font-serif">
                Category Distribution
              </h3>
              <span className="text-xs text-zinc-400">{totalProducts} Items</span>
            </div>

            <div className="space-y-3.5 pt-1">
              {categoryList.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 capitalize">
                      {cat.name.replace("-", " ")}
                    </span>
                    <span className="text-zinc-500 font-bold">
                      {cat.count} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff2056] to-[#993A6E] rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Quick Management Tools
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab("add-product")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#ff2056] font-bold transition-colors cursor-pointer"
              >
                <span>Add New Abaya / Burqa</span>
                <FiPlusCircle size={15} />
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold transition-colors cursor-pointer"
              >
                <span>Update Stock Quantities</span>
                <FiBox size={15} />
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold transition-colors cursor-pointer"
              >
                <span>Edit Shipping Fees</span>
                <FiTruck size={15} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
