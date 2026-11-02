"use client";

import React, { useState } from "react";
import {
  FiBell,
  FiPackage,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiTrash2,
  FiCheck,
  FiMail,
} from "react-icons/fi";
import { useShop, StoreNotification } from "@/context/ShopContext";

export default function NotificationsTab() {
  const {
    notifications,
    unreadNotificationsCount,
    notificationCounts,
    markNotificationAsRead,
    markNotificationAsUnread,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useShop();

  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter items
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "unread") {
      return !item.isRead;
    }
    return true;
  });

  // Pagination calculation
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filter: "all" | "unread") => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleItemClick = (notif: StoreNotification) => {
    const id = notif._id || notif.id || notif.orderId || "";
    if (!notif.isRead && id) {
      markNotificationAsRead(id);
    }
  };

  const formatTimestamp = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "Just now";
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateInput);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <FiPackage className="w-5 h-5 text-rose-400" />;
      case "stock":
        return <FiAlertTriangle className="w-5 h-5 text-amber-400" />;
      case "payment":
        return <FiCheckCircle className="w-5 h-5 text-emerald-400" />;
      case "customer":
        return <FiCheckCircle className="w-5 h-5 text-purple-400" />;
      default:
        return <FiInfo className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-3.5 sm:p-8 shadow-xs space-y-4 sm:space-y-6">
      {/* 1. Header with Title, Unread Count & Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              Store Activity & Order Notifications
            </h3>
            {unreadNotificationsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#ff2056] border border-rose-200 text-[11px] font-extrabold animate-pulse">
                {unreadNotificationsCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time alerts for newly placed customer orders, item requests, and store events
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-1.5 bg-[#ff2056] text-white rounded-xl text-xs font-bold hover:bg-[#d6103e] transition-all cursor-pointer self-start sm:self-auto flex items-center gap-1.5 shadow-sm shadow-rose-600/20"
          >
            <FiCheck size={14} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* 2. Filter Pills matching StyleHub exactly */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {[
          {
            id: "all" as const,
            label: "All Alerts",
            count: notificationCounts.all || notifications.length,
          },
          {
            id: "unread" as const,
            label: "🔔 Unread SMS",
            count: notificationCounts.unread || unreadNotificationsCount,
          },
        ].map((item) => {
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFilterChange(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-[#ff2056] text-white shadow-sm shadow-rose-600/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Notifications List */}
      {paginatedNotifications.length === 0 ? (
        <div className="text-center py-12 space-y-3 bg-stone-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-12 h-12 bg-rose-50 text-[#ff2056] rounded-full flex items-center justify-center mx-auto">
            <FiBell className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Notifications Found</h4>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            No alerts matching this filter. New activity notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedNotifications.map((item) => {
            const isUnread = !item.isRead;
            const notifId = item._id || item.id || item.orderId || "";
            return (
              <div
                key={notifId}
                onClick={() => handleItemClick(item)}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex items-start gap-2.5 sm:gap-4 cursor-pointer relative group ${
                  isUnread
                    ? "bg-rose-50/40 border-rose-200/90 shadow-2xs hover:bg-rose-50/70"
                    : "bg-slate-50/50 border-gray-200/60 hover:bg-white hover:border-gray-300"
                }`}
              >
                {/* Thumbnail Image or Icon */}
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.title}
                    className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                  />
                ) : (
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs sm:text-sm">
                    {getNotificationIcon(item.type)}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs sm:text-sm leading-snug truncate ${
                          isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-500"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono block sm:hidden">
                        {formatTimestamp(item.createdAt)}
                      </span>
                    </div>

                    {/* Actions & Timestamp */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <span className="hidden sm:inline text-[10px] text-gray-400 font-medium font-mono">
                        {formatTimestamp(item.createdAt)}
                      </span>

                      {/* Mark as Read / Unread toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isUnread) {
                            markNotificationAsRead(notifId);
                          } else {
                            markNotificationAsUnread(notifId);
                          }
                        }}
                        className={`p-1 sm:p-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                          isUnread
                            ? "text-[#ff2056] hover:bg-rose-100"
                            : "text-emerald-600 hover:text-slate-700 hover:bg-emerald-50"
                        }`}
                        title={isUnread ? "Click to mark as read" : "Read (Click to mark as unread)"}
                      >
                        {isUnread ? (
                          <FiCheck size={15} />
                        ) : (
                          <FiCheckCircle size={15} className="text-emerald-500" />
                        )}
                      </button>

                      {/* Delete / Dismiss */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notifId);
                        }}
                        className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Dismiss alert"
                      >
                        <FiTrash2 size={13} className="sm:w-3.5 sm:h-3.5" />
                      </button>

                      {/* Red pulsing dot for unread */}
                      {isUnread && (
                        <span
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff2056] shrink-0 shadow-xs animate-pulse"
                          title="Unread notification"
                        />
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-[11px] sm:text-xs line-clamp-2 leading-relaxed ${
                      isUnread ? "text-slate-700 font-medium" : "text-slate-400"
                    }`}
                  >
                    {item.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 text-[10px] sm:text-[11px]">
                    {item.price && item.price > 0 ? (
                      <span
                        className={`font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md border text-[10px] sm:text-[11px] ${
                          isUnread
                            ? "text-[#ff2056] bg-rose-50 border-rose-100"
                            : "text-slate-500 bg-slate-100 border-gray-200"
                        }`}
                      >
                        ৳{Number(item.price).toLocaleString("en-BD")}
                      </span>
                    ) : null}

                    {item.orderId && (
                      <span className="font-mono text-slate-700 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-semibold border border-slate-200/60">
                        Order: #{item.orderId}
                      </span>
                    )}

                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-100/80">
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Showing page <strong className="text-slate-900">{currentPage}</strong> of{" "}
            <strong className="text-slate-900">{totalPages}</strong> ({totalItems} total alerts)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
