"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { FiX, FiSearch, FiTruck, FiCheckCircle, FiClock, FiBox } from "react-icons/fi";
import { Order } from "@/types";

export default function TrackOrderModal() {
  const { isTrackOrderOpen, setIsTrackOrderOpen, orders } = useShop();
  const [searchVal, setSearchVal] = useState("");
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    const trimmed = searchVal.trim().toLowerCase();
    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === trimmed ||
        o.phone.includes(trimmed)
    );

    setFoundOrder(match || null);
    setSearched(true);
  };

  const steps = [
    { title: "Order Placed", desc: "Received into system", icon: FiCheckCircle, done: true },
    { title: "Processing & QC", desc: "Fabric inspection & packaging", icon: FiBox, done: foundOrder?.status !== "Pending" },
    { title: "Out for Delivery", desc: "Dispatched with delivery rider", icon: FiTruck, done: foundOrder?.status === "Shipped" || foundOrder?.status === "Delivered" },
    { title: "Delivered", desc: "Delivered to your doorstep", icon: FiCheckCircle, done: foundOrder?.status === "Delivered" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setIsTrackOrderOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#4F213B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiTruck className="text-[#C89B59] text-xl" />
            <h3 className="font-serif font-bold text-lg">
              Track Guest & Customer Order
            </h3>
          </div>
          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Lookup Input Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-bold text-zinc-700 uppercase">
              Enter Order ID or Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="e.g. BS-8921 or 017XXXXXXXX"
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#4F213B]/20 focus:border-[#4F213B] text-sm text-zinc-800 placeholder-zinc-400"
              />
              <button
                type="submit"
                className="bg-[#4F213B] hover:bg-[#3B152B] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <FiSearch />
                <span>Track</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-400">
              Try default sample: <strong className="text-zinc-600">BS-8921</strong> or <strong className="text-zinc-600">01712345678</strong>
            </p>
          </form>

          {/* Results display */}
          {searched && foundOrder && (
            <div className="bg-[#FAF7F5] rounded-2xl p-4 sm:p-5 border border-zinc-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                    Order Found
                  </span>
                  <h4 className="font-mono text-base font-extrabold text-[#4F213B]">
                    {foundOrder.id}
                  </h4>
                  <p className="text-xs text-zinc-600">
                    Recipient: <strong>{foundOrder.customerName}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-full inline-block">
                    {foundOrder.status}
                  </span>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {foundOrder.createdAt}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 pt-1">
                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                          st.done
                            ? "bg-[#4F213B] text-white"
                            : "bg-zinc-200 text-zinc-400"
                        }`}
                      >
                        <Icon />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-xs font-bold ${
                            st.done ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {st.title}
                        </p>
                        <p className="text-[11px] text-zinc-500">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Items */}
              <div className="pt-3 border-t border-zinc-200 text-xs text-zinc-600">
                <p>
                  <strong>Total Payable:</strong> ৳{foundOrder.total.toLocaleString()} (Cash On Delivery)
                </p>
                <p className="truncate">
                  <strong>Delivery to:</strong> {foundOrder.address}
                </p>
              </div>
            </div>
          )}

          {searched && !foundOrder && (
            <div className="p-6 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
              <p className="font-bold text-zinc-700 text-sm">No order found with that query</p>
              <p className="text-xs text-zinc-400 mt-1">
                Please verify your 11-digit mobile number or order ID from your SMS/receipt.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
