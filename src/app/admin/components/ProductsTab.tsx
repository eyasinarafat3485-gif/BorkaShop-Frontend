"use client";

import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
  FiBox,
  FiCheck,
  FiX,
  FiStar,
  FiEye,
  FiTag,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface ProductsTabProps {
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export default function ProductsTab({
  onAddNewProduct,
  onEditProduct,
}: ProductsTabProps) {
  const { products, updateProduct, deleteProduct } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "burqa", label: "Burqa" },
    { id: "abaya", label: "Abaya" },
    { id: "hijab", label: "Hijab" },
    { id: "khimar", label: "Khimar" },
    { id: "modest-sets", label: "Modest Sets" },
    { id: "niqab", label: "Niqab" },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      // Stock filter
      if (stockFilter === "in_stock" && !p.inStock) return false;
      if (stockFilter === "out_of_stock" && p.inStock) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesFabric = p.fabric?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesFabric) return false;
      }
      return true;
    });
  }, [products, selectedCategory, stockFilter, searchQuery]);

  const handleToggleStock = (product: Product) => {
    updateProduct(product.id, { inStock: !product.inStock });
    toast.success(
      `Product "${product.name}" marked as ${!product.inStock ? "IN STOCK" : "OUT OF STOCK"}!`,
      { icon: !product.inStock ? "✅" : "⚠️" }
    );
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}" from catalog?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 font-serif">
              Products Catalog
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Manage modest fashion inventory, pricing, stock levels, and fabric details
            </p>
          </div>

          <button
            onClick={onAddNewProduct}
            className="py-2.5 px-4 bg-[#ff2056] hover:bg-[#3D182D] text-white text-xs font-bold rounded-xl shadow-md shadow-[#ff2056]/20 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <FiPlusCircle size={15} />
            <span>+ Add New Product</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search product by title, fabric, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#ff2056] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:bg-white focus:outline-none focus:border-[#ff2056]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="sm:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:bg-white focus:outline-none focus:border-[#ff2056]"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Products Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <FiBox className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#ff2056]" />
            <p className="text-sm font-bold text-zinc-700">No products match your criteria</p>
            <p className="text-xs text-zinc-400 mt-1">
              Try changing the search term or resetting the category filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-bold border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Fabric & Sizes</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-zinc-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{p.id}</p>
                          {p.tag && (
                            <span className="mt-1 inline-block text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {p.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 uppercase tracking-wider">
                        {p.category.replace("-", " ")}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-sm text-[#ff2056]">
                        ৳{p.price.toLocaleString()}
                      </p>
                      {p.originalPrice && (
                        <p className="text-[11px] text-zinc-400 line-through">
                          ৳{p.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </td>

                    {/* Fabric & Sizes */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-zinc-800 line-clamp-1">
                        {p.fabric || "Premium Fabric"}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                        Sizes: {p.sizes.join(", ")}
                      </p>
                    </td>

                    {/* Stock Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          p.inStock
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        }`}
                        title="Click to toggle stock status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.inStock ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-2 rounded-xl bg-purple-50 hover:bg-[#ff2056] text-[#ff2056] hover:text-white transition-colors cursor-pointer"
                          title="Edit Product Details"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
