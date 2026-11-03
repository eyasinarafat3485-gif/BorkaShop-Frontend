"use client";

import React, { useState, useMemo } from "react";
import {
  FiUsers,
  FiSearch,
  FiPhone,
  FiMail,
  FiShoppingBag,
  FiDownload,
  FiCheckCircle,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useShop } from "@/context/ShopContext";
import toast from "react-hot-toast";

export default function CustomersTab() {
  const { customers, deleteCustomer, orders } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Real customers directly from MongoDB Atlas database
  const customerList = useMemo(() => {
    if (customers && customers.length > 0) {
      return customers;
    }
    // Fallback if network offline
    const customerMap: Record<string, any> = {};
    orders.forEach((ord) => {
      const key = ord.phone || ord.customerName;
      if (!customerMap[key]) {
        customerMap[key] = {
          id: `CUST-${ord.id}`,
          name: ord.customerName,
          phone: ord.phone,
          email: `${ord.customerName.toLowerCase().replace(/[^a-z]/g, "")}@customer.borkashop.com`,
          address: ord.address,
          role: ord.role === "user" ? "Registered Member" : "Guest Shopper",
          totalOrders: 1,
          totalSpent: ord.total,
          lastOrder: ord.createdAt,
        };
      } else {
        customerMap[key].totalOrders += 1;
        customerMap[key].totalSpent += ord.total;
      }
    });
    return Object.values(customerMap);
  }, [customers, orders]);

  const filteredCustomers = useMemo(() => {
    return customerList.filter((c) => {
      if (roleFilter === "registered" && c.role !== "Registered Member" && c.role !== "Admin") return false;
      if (roleFilter === "guest" && c.role !== "Guest Shopper") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customerList, roleFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ["Customer ID", "Name", "Phone", "Email", "Address", "Type", "Total Orders", "Total Spent (BDT)"];
    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      c.email,
      `"${c.address.replace(/"/g, '""')}"`,
      c.role,
      c.totalOrders,
      c.totalSpent,
    ]);

    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encoded = encodeURI(csv);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `borkashop_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Customer list exported to CSV!", { icon: "📥" });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 font-serif">
              Customer Directory
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verified buyers, contact info, total orders, and purchase history
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="py-2 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            <FiDownload size={14} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-8 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search customers by name, phone, email, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:bg-white focus:outline-none focus:border-[#4F213B]"
            >
              <option value="all">All Shoppers ({customerList.length})</option>
              <option value="registered">Registered Members</option>
              <option value="guest">Guest Checkouts</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Customer Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#4F213B]" />
            <p className="text-sm font-bold text-zinc-700">No customers found</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View (Zero Horizontal Scroll) */}
            <div className="sm:hidden divide-y divide-zinc-100">
              {filteredCustomers.map((c) => {
                const cleanPhone = c.phone.replace(/[^0-9]/g, "");
                const whatsappUrl = `https://wa.me/88${cleanPhone}`;

                return (
                  <div key={c.id} className="p-3.5 space-y-2.5 hover:bg-zinc-50/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#ff2056] font-bold text-xs flex items-center justify-center shrink-0 border border-purple-100">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 text-xs">{c.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{c.id}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center shrink-0 ${
                          c.role === "Registered Member"
                            ? "bg-purple-50 text-[#ff2056] border border-purple-200"
                            : c.role === "Admin"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        }`}
                      >
                        {c.role}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="text-zinc-600 font-mono text-[11px]">{c.phone}</p>
                      <p className="text-zinc-400 text-[10px] truncate">{c.email}</p>
                      {c.address && (
                        <p className="text-zinc-500 text-[11px] line-clamp-1">{c.address}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                      <div className="text-xs">
                        <span className="font-bold text-[#ff2056]">৳{c.totalSpent.toLocaleString()}</span>
                        <span className="text-zinc-400 text-[10px] ml-1.5">({c.totalOrders} orders)</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${c.phone}`}
                          className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:text-[#ff2056]"
                          title="Call customer"
                        >
                          <FiPhone size={13} />
                        </a>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:text-emerald-700"
                          title="Chat on WhatsApp"
                        >
                          <FaWhatsapp size={14} />
                        </a>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove customer "${c.name}" from database?`)) {
                              deleteCustomer(c.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:text-rose-700 cursor-pointer"
                          title="Delete customer"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table (Preserved) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-bold border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Account Type</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCustomers.map((c) => {
                  const cleanPhone = c.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/88${cleanPhone}`;

                  return (
                    <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#4F213B] font-bold text-xs flex items-center justify-center shrink-0 border border-purple-100">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900">{c.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{c.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-zinc-800">{c.phone}</p>
                        <p className="text-[11px] text-zinc-400">{c.email}</p>
                      </td>

                      {/* Account Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap inline-flex items-center shrink-0 ${
                            c.role === "Registered Member"
                              ? "bg-purple-50 text-[#4F213B] border border-purple-200"
                              : c.role === "Admin"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          {c.role}
                        </span>
                      </td>

                      {/* Total Orders */}
                      <td className="py-3.5 px-4 font-bold text-zinc-800">
                        {c.totalOrders} order{c.totalOrders > 1 ? "s" : ""}
                      </td>

                      {/* Total Spent */}
                      <td className="py-3.5 px-4 font-bold text-sm text-[#4F213B]">
                        ৳{c.totalSpent.toLocaleString()}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-zinc-600">
                        {c.address}
                      </td>

                      {/* Quick Contact Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="p-2 rounded-xl bg-zinc-100 hover:bg-[#4F213B] hover:text-white text-zinc-700 transition-colors"
                            title="Call customer"
                          >
                            <FiPhone size={14} />
                          </a>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <FaWhatsapp size={14} />
                          </a>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove customer "${c.name}" from database?`)) {
                                deleteCustomer(c.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                            title="Delete customer from database"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
