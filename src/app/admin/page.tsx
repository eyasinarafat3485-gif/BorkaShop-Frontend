import React, { Suspense } from "react";
import { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard – Borka Shop | Store Management",
  description:
    "Executive store management panel for Borka Shop. Real-time orders fulfillment, catalog inventory, customer database, and revenue analytics.",
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#ff2056]/20 border-t-[#ff2056] rounded-full animate-spin" />
            <p className="text-xs font-bold text-zinc-600 font-serif">
              Loading BorkaShop Admin Dashboard...
            </p>
          </div>
        </div>
      }
    >
      <AdminDashboardClient />
    </Suspense>
  );
}
