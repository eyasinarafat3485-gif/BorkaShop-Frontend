"use client";

import React from "react";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiPieChart,
  FiTruck,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";

export default function AnalyticsTab() {
  const { orders, products } = useShop();

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, o) => acc + o.total, 0);

  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const deliveryRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 100;

  // Payment Breakdown
  const codCount = orders.filter((o) => o.paymentMethod === "cod").length;
  const bkashCount = orders.filter((o) => o.paymentMethod === "bkash").length;
  const nagadCount = orders.filter((o) => o.paymentMethod === "nagad").length;

  // Zone Breakdown
  const dhakaCount = orders.filter((o) => o.deliveryZone === "dhaka").length;
  const outsideCount = orders.filter((o) => o.deliveryZone === "outside_dhaka").length;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs">
        <h2 className="text-xl font-bold text-zinc-900 font-serif">
          Store Analytics & Reports
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Financial overview, fulfillment success metrics, and customer payment trends
        </p>
      </div>

      {/* 2. Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Gross Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <FiTrendingUp size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 font-serif">
            ৳ {totalRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>+14.2%</span> <span className="text-zinc-400">vs last period</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Fulfillment Success</span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#4F213B] border border-purple-200">
              <FiCheckCircle size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 font-serif">
            {deliveryRate}%
          </h3>
          <p className="text-[11px] text-zinc-400">
            Completed doorstep deliveries across Bangladesh
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Volume</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <FiShoppingBag size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-zinc-900 font-serif">
            {orders.length} Parcels
          </h3>
          <p className="text-[11px] text-zinc-400">
            Across Dhaka and district hubs
          </p>
        </div>
      </div>

      {/* 3. Distribution Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 font-serif flex items-center gap-2">
            <FiCreditCard className="text-[#4F213B]" />
            <span>Payment Method Distribution</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1 font-semibold text-zinc-700">
                <span>Cash on Delivery (COD)</span>
                <span>{codCount} ({orders.length ? Math.round((codCount / orders.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4F213B] rounded-full"
                  style={{ width: `${orders.length ? (codCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 font-semibold text-zinc-700">
                <span>bKash Online / Manual</span>
                <span>{bkashCount} ({orders.length ? Math.round((bkashCount / orders.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-600 rounded-full"
                  style={{ width: `${orders.length ? (bkashCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 font-semibold text-zinc-700">
                <span>Nagad Digital Wallet</span>
                <span>{nagadCount} ({orders.length ? Math.round((nagadCount / orders.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${orders.length ? (nagadCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 font-serif flex items-center gap-2">
            <FiTruck className="text-[#4F213B]" />
            <span>Shipping Destinations</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1 font-semibold text-zinc-700">
                <span>Inside Dhaka Metro (৳70)</span>
                <span>{dhakaCount} ({orders.length ? Math.round((dhakaCount / orders.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${orders.length ? (dhakaCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 font-semibold text-zinc-700">
                <span>Outside Dhaka / Nationwide (৳130)</span>
                <span>{outsideCount} ({orders.length ? Math.round((outsideCount / orders.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${orders.length ? (outsideCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
