"use client";

import React, { useState } from "react";
import { FiAward, FiPlus, FiCheck, FiX, FiExternalLink, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface BrandItem {
  id: string;
  name: string;
  origin: string;
  productsCount: number;
  featured: boolean;
  website: string;
  badge: string;
}

export default function BrandsTab() {
  const [brands, setBrands] = useState<BrandItem[]>([
    {
      id: "al-haramain",
      name: "Al-Haramain Modesty",
      origin: "Dubai, UAE",
      productsCount: 14,
      featured: true,
      website: "https://alharamainmodesty.com",
      badge: "Luxury Partner",
    },
    {
      id: "dubai-nida-luxe",
      name: "Dubai Nida Luxe",
      origin: "Sharjah, UAE",
      productsCount: 22,
      featured: true,
      website: "https://dubainidaluxe.ae",
      badge: "Top Seller",
    },
    {
      id: "medina-craft",
      name: "Medina Silk & Hijab",
      origin: "Medina, Saudi Arabia",
      productsCount: 18,
      featured: true,
      website: "https://medinasilk.sa",
      badge: "Exclusive",
    },
    {
      id: "borka-craft-dhaka",
      name: "BorkaCraft Heritage",
      origin: "Dhaka, Bangladesh",
      productsCount: 35,
      featured: false,
      website: "https://borkashop.com",
      badge: "In-House Label",
    },
    {
      id: "korean-zoom-fabrics",
      name: "Korean Zoom Mills",
      origin: "Seoul, South Korea",
      productsCount: 12,
      featured: false,
      website: "https://koreanzoom.kr",
      badge: "Fabric Supplier",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandOrigin, setNewBrandOrigin] = useState("Dubai, UAE");
  const [newBrandBadge, setNewBrandBadge] = useState("Official Partner");

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const newBrand: BrandItem = {
      id: newBrandName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: newBrandName.trim(),
      origin: newBrandOrigin.trim(),
      productsCount: 0,
      featured: true,
      website: "#",
      badge: newBrandBadge.trim() || "Brand Partner",
    };

    setBrands([newBrand, ...brands]);
    setNewBrandName("");
    setIsAdding(false);
    toast.success(`Brand "${newBrand.name}" registered successfully!`, { icon: "🏷️" });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove brand "${name}"?`)) {
      setBrands(brands.filter((b) => b.id !== id));
      toast.success(`Brand "${name}" removed`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 font-serif flex items-center gap-2">
            <FiAward className="text-[#ff2056]" />
            <span>Brand Partners & Labels</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage fabric manufacturers, verified modest fashion brands, and designer labels
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-2 px-4 bg-[#ff2056] hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs shadow-rose-600/20"
        >
          <FiPlus size={15} />
          <span>+ Add Brand</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <form
          onSubmit={handleAddBrand}
          className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-md space-y-4 text-xs animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="font-bold text-sm text-zinc-900">Register New Brand</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="e.g. Al-Noor Dubai"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Origin / Country</label>
              <input
                type="text"
                value={newBrandOrigin}
                onChange={(e) => setNewBrandOrigin(e.target.value)}
                placeholder="e.g. Dubai, UAE"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Badge Tag</label>
              <input
                type="text"
                value={newBrandBadge}
                onChange={(e) => setNewBrandBadge(e.target.value)}
                placeholder="e.g. Luxury Partner"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="py-1.5 px-3 rounded-xl bg-zinc-100 text-zinc-700 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-4 rounded-xl bg-[#ff2056] text-white font-bold cursor-pointer"
            >
              Save Brand
            </button>
          </div>
        </form>
      )}

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs hover:border-[#ff2056]/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#ff2056] font-serif font-black text-xl flex items-center justify-center border border-rose-100 shadow-xs">
                {b.name.charAt(0)}
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                {b.badge}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-base text-zinc-900">{b.name}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Origin: {b.origin}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-600">
                {b.productsCount} Products Listed
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Brand"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
