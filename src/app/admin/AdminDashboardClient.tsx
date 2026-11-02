"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import toast from "react-hot-toast";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import OverviewTab from "./components/OverviewTab";
import OrdersTab from "./components/OrdersTab";
import ProductsTab from "./components/ProductsTab";
import AddProductTab from "./components/AddProductTab";
import BrandsTab from "./components/BrandsTab";
import CategoriesTab from "./components/CategoriesTab";
import TagsTab from "./components/TagsTab";
import AttributesTab from "./components/AttributesTab";
import ReviewsTab from "./components/ReviewsTab";
import CustomersTab from "./components/CustomersTab";
import NotificationsTab from "./components/NotificationsTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettingsTab from "./components/SettingsTab";
import OrderInvoiceModal from "./components/OrderInvoiceModal";
import EditProductModal from "./components/EditProductModal";
import { Product } from "@/types";

export default function AdminDashboardClient() {
  const router = useRouter();
  const { role } = useShop();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");
  const initialStatus = searchParams.get("status") || "All";

  const [activeTab, setActiveTab] = useState<string>(urlTab || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Guard access: only admin allowed
  useEffect(() => {
    const savedRole = localStorage.getItem("borkashop_role") || role;
    if (savedRole === "admin") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      if (savedRole === "user") {
        toast.error("Access restricted: Administrator privileges required.", {
          icon: "🔒",
        });
        router.replace("/");
      } else {
        toast.error("Please sign in with an Administrator account.", {
          icon: "🔒",
        });
        router.replace("/login");
      }
    }
  }, [role, router]);

  // Modals state
  const [selectedOrderIdForModal, setSelectedOrderIdForModal] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-zinc-200 max-w-md">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            🔒
          </div>
          <h2 className="text-lg font-bold text-zinc-900 mb-2">Admin Access Restricted</h2>
          <p className="text-sm text-zinc-600">
            Redirecting to authorized page...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#ff2056]/20 border-t-[#ff2056] rounded-full animate-spin" />
          <p className="text-xs font-bold text-zinc-600 font-serif">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex">
      {/* 1. Left Admin Sidebar (Matching StyleHub dark navy & rose-red) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0 bg-[#F8FAFC]">
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              setActiveTab={setActiveTab}
              onOpenOrderModal={(id) => setSelectedOrderIdForModal(id)}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              onOpenOrderModal={(id) => setSelectedOrderIdForModal(id)}
              initialStatusFilter={initialStatus}
            />
          )}

          {activeTab === "products" && (
            <ProductsTab
              onAddNewProduct={() => setActiveTab("add-product")}
              onEditProduct={(p) => setEditingProduct(p)}
            />
          )}

          {activeTab === "add-product" && (
            <AddProductTab onSuccess={() => setActiveTab("products")} />
          )}

          {activeTab === "brands" && <BrandsTab />}

          {activeTab === "categories" && <CategoriesTab />}

          {activeTab === "tags" && <TagsTab />}

          {activeTab === "attributes" && <AttributesTab />}

          {activeTab === "reviews" && <ReviewsTab />}

          {activeTab === "customers" && <CustomersTab />}

          {activeTab === "notifications" && <NotificationsTab />}

          {activeTab === "analytics" && <AnalyticsTab />}

          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

      {/* 3. Global Modals */}
      {selectedOrderIdForModal && (
        <OrderInvoiceModal
          orderId={selectedOrderIdForModal}
          onClose={() => setSelectedOrderIdForModal(null)}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
