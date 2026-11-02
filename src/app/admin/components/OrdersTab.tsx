"use client";

import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiTrash2,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPrinter,
  FiShoppingBag,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useShop } from "@/context/ShopContext";
import { Order } from "@/types";
import toast from "react-hot-toast";

interface OrdersTabProps {
  onOpenOrderModal: (orderId: string) => void;
  initialStatusFilter?: string;
}

export default function OrdersTab({
  onOpenOrderModal,
  initialStatusFilter = "All",
}: OrdersTabProps) {
  const { orders, updateOrderStatus, deleteOrder } = useShop();

  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("All");

  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Status Filter
      if (statusFilter !== "All" && ord.status !== statusFilter) {
        return false;
      }
      // 2. Zone Filter
      if (zoneFilter !== "All" && ord.deliveryZone !== zoneFilter) {
        return false;
      }
      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = ord.id.toLowerCase().includes(q);
        const matchesName = ord.customerName.toLowerCase().includes(q);
        const matchesPhone = ord.phone.includes(q);
        const matchesAddress = ord.address.toLowerCase().includes(q);
        const matchesProduct = ord.items.some((i) => i.productName.toLowerCase().includes(q));
        if (!matchesId && !matchesName && !matchesPhone && !matchesAddress && !matchesProduct) {
          return false;
        }
      }
      return true;
    });
  }, [orders, statusFilter, zoneFilter, searchQuery]);

  const handleDelete = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteOrder(orderId);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Phone", "Address", "Items", "Total (BDT)", "Payment", "Status", "Date"];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.items.map((i) => `${i.productName} (${i.size}, ${i.color}) x${i.quantity}`).join("; "),
      o.total,
      o.paymentMethod.toUpperCase(),
      o.status,
      o.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `borkashop_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV!", { icon: "📥" });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 font-serif">
              Orders Management
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live order tracking, fulfillment pipeline, and automated receipts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="py-2 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <FiDownload size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {statuses.map((st) => {
            const count = st === "All" ? orders.length : orders.filter((o) => o.status === st).length;
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`py-2 px-3.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[#ff2056] text-white shadow-md shadow-[#ff2056]/20"
                    : "bg-zinc-100/80 hover:bg-zinc-200/80 text-zinc-600"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Zone Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-8 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search by order ID, customer name, phone, address, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#ff2056] focus:ring-1 focus:ring-[#ff2056] transition-all"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:bg-white focus:outline-none focus:border-[#ff2056]"
            >
              <option value="All">All Delivery Zones</option>
              <option value="dhaka">Inside Dhaka (৳70)</option>
              <option value="outside_dhaka">Outside Dhaka (৳130)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Orders Table Container */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <FiShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#ff2056]" />
            <p className="text-sm font-bold text-zinc-700">No matching orders found</p>
            <p className="text-xs text-zinc-400 mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-bold border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Items & Styling</th>
                  <th className="py-3 px-4">Total & Payment</th>
                  <th className="py-3 px-4">Status & Action</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.map((ord) => {
                  const cleanPhone = ord.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/88${cleanPhone}`;

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-zinc-900 block">{ord.id}</span>
                        <span className="text-[11px] text-zinc-400 font-sans">{ord.createdAt}</span>
                        <span
                          className={`mt-1 inline-block text-[9px] font-bold px-1.5 py-0.2 rounded capitalize ${
                            ord.role === "user" ? "bg-purple-50 text-[#ff2056]" : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {ord.role} checkout
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-zinc-900">{ord.customerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${ord.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-[#ff2056] font-semibold"
                            title="Call customer"
                          >
                            <FiPhone size={12} />
                            <span>{ord.phone}</span>
                          </a>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-700"
                            title="Message on WhatsApp"
                          >
                            <FaWhatsapp size={14} />
                          </a>
                        </div>
                      </td>

                      {/* Delivery Address */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-zinc-700 line-clamp-2 leading-relaxed">
                          {ord.address}
                        </p>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.deliveryZone === "dhaka"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          <FiTruck size={10} />
                          <span>{ord.deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</span>
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-8 h-8 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                              />
                              <div className="text-[11px] leading-tight">
                                <p className="font-semibold text-zinc-800 line-clamp-1">
                                  {item.productName}
                                </p>
                                <p className="text-zinc-500">
                                  Size: <span className="font-bold">{item.size}</span> • Color:{" "}
                                  <span className="font-bold">{item.color}</span> • Qty:{" "}
                                  <span className="font-bold">{item.quantity}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-sm text-[#ff2056]">
                          ৳{ord.total.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Delivery: ৳{ord.deliveryFee}
                        </p>
                        <span className="mt-1 inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                          {ord.paymentMethod.toUpperCase()}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className={`py-1.5 px-2.5 rounded-xl font-bold text-xs border focus:outline-none cursor-pointer ${
                            ord.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : ord.status === "Processing"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : ord.status === "Shipped"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : ord.status === "Cancelled"
                              ? "bg-rose-50 text-rose-800 border-rose-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenOrderModal(ord.id)}
                            className="p-2 rounded-xl bg-purple-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white transition-colors cursor-pointer"
                            title="View & Print Official Invoice"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(ord.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
