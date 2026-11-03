import React, { Suspense } from "react";
import { Metadata } from "next";
import AdminDashboardClient from "../AdminDashboardClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const titles: Record<string, string> = {
    "all-products": "All Products – Admin | Borka Shop",
    products: "All Products – Admin | Borka Shop",
    "add-product": "Add New Product – Admin | Borka Shop",
    orders: "Orders & Sales – Admin | Borka Shop",
    customers: "Customer Management – Admin | Borka Shop",
    notifications: "Alerts & Notifications – Admin | Borka Shop",
    analytics: "Reports & Analytics – Admin | Borka Shop",
    settings: "Store Settings – Admin | Borka Shop",
    brands: "Brands – Admin | Borka Shop",
    categories: "Categories – Admin | Borka Shop",
    tags: "Tags – Admin | Borka Shop",
    attributes: "Attributes – Admin | Borka Shop",
    reviews: "Product Reviews – Admin | Borka Shop",
    overview: "Dashboard Overview – Admin | Borka Shop",
  };

  return {
    title: titles[slug] || "Admin Dashboard – Borka Shop",
    description: "Executive store management panel for Borka Shop.",
  };
}

export default async function AdminSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#ff2056]/20 border-t-[#ff2056] rounded-full animate-spin" />
            <p className="text-xs font-bold text-zinc-600 font-serif">
              Loading BorkaShop Admin...
            </p>
          </div>
        </div>
      }
    >
      <AdminDashboardClient initialTab={slug} />
    </Suspense>
  );
}

