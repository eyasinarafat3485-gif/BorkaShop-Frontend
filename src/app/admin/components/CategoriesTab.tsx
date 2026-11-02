"use client";

import React, { useState } from "react";
import { FiGrid, FiPlus, FiBox, FiCheck, FiX } from "react-icons/fi";
import { useShop } from "@/context/ShopContext";
import toast from "react-hot-toast";

export default function CategoriesTab() {
  const { products } = useShop();

  const [categories, setCategories] = useState([
    {
      id: "burqa",
      name: "Burqa",
      slug: "burqa",
      description: "Classic everyday & festive burqas crafted with premium georgette and zoom fabric.",
      image: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png",
    },
    {
      id: "abaya",
      name: "Abaya",
      slug: "abaya",
      description: "Original Dubai Nida front-open, belted, and embroidered luxury abayas.",
      image: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "hijab",
      name: "Hijab",
      slug: "hijab",
      description: "Medina silk, georgette, and crinkle hijabs for all seasons.",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "khimar",
      name: "Khimar",
      slug: "khimar",
      description: "French and diamond cut modest khimars providing effortless chest and back drape.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "modest-sets",
      name: "Modest Sets",
      slug: "modest-sets",
      description: "Coordinated two-piece and three-piece abaya & inner sets for formal events.",
      image: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-lightweight-long-niqab.png",
    },
    {
      id: "niqab",
      name: "Niqab",
      slug: "niqab",
      description: "Ultra-breathable 1-layer, 2-layer, and 3-layer flap niqabs.",
      image: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-lightweight-long-niqab.png",
    },
  ]);

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newCat = {
      id: slug,
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim() || "Exclusive modest fashion collection.",
      image: "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png",
    };

    setCategories([...categories, newCat]);
    setNewCatName("");
    setNewCatDesc("");
    setIsAdding(false);
    toast.success(`Category "${newCat.name}" added successfully!`, { icon: "✨" });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 font-serif">
            Categories Management
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Organize catalog groupings, product counts, and collections
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-2 px-4 bg-[#ff2056] hover:bg-[#3D182D] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <FiPlus size={15} />
          <span>+ Add Category</span>
        </button>
      </div>

      {/* Add Category Form Modal */}
      {isAdding && (
        <form onSubmit={handleAddCategory} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-md space-y-4 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="font-bold text-sm text-zinc-900">Create New Category</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600">
              <FiX size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Prayer Sets / Kaftan"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Description</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief summary of items in this category"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="py-1.5 px-3 rounded-xl bg-zinc-100 text-zinc-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-4 rounded-xl bg-[#ff2056] text-white font-bold"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* 2. Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#ff2056]/40 transition-all flex flex-col justify-between"
            >
              <div className="relative h-36 bg-zinc-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="font-serif font-black text-white text-lg tracking-wide uppercase">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-amber-200 font-bold">
                      {productCount} Products Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Slug: /{cat.slug}</span>
                  <span className="font-bold text-[#ff2056] font-sans">Active</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
