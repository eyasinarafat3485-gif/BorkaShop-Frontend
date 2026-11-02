"use client";

import React, { useState } from "react";
import { FiTag, FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
}

export default function TagsTab() {
  const [tags, setTags] = useState<TagItem[]>([
    { id: "1", name: "Eid Collection 2026", slug: "eid-collection", color: "bg-purple-100 text-purple-700 border-purple-200", count: 18 },
    { id: "2", name: "Dubai Original", slug: "dubai-original", color: "bg-rose-100 text-[#ff2056] border-rose-200", count: 24 },
    { id: "3", name: "Korean Zoom", slug: "korean-zoom", color: "bg-blue-100 text-blue-700 border-blue-200", count: 15 },
    { id: "4", name: "Best Seller", slug: "best-seller", color: "bg-amber-100 text-amber-800 border-amber-200", count: 32 },
    { id: "5", name: "Free Delivery", slug: "free-delivery", color: "bg-emerald-100 text-emerald-700 border-emerald-200", count: 9 },
    { id: "6", name: "Luxury Handwork", slug: "luxury-handwork", color: "bg-pink-100 text-pink-700 border-pink-200", count: 11 },
    { id: "7", name: "Summer Breathable", slug: "summer-breathable", color: "bg-teal-100 text-teal-700 border-teal-200", count: 14 },
    { id: "8", name: "Medina Silk", slug: "medina-silk", color: "bg-indigo-100 text-indigo-700 border-indigo-200", count: 19 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const newTag: TagItem = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      slug: newTagName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      color: "bg-rose-100 text-[#ff2056] border-rose-200",
      count: 0,
    };

    setTags([...tags, newTag]);
    setNewTagName("");
    setIsAdding(false);
    toast.success(`Tag "${newTag.name}" created!`, { icon: "🏷️" });
  };

  const handleDelete = (id: string, name: string) => {
    setTags(tags.filter((t) => t.id !== id));
    toast.success(`Tag "${name}" deleted`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 font-serif flex items-center gap-2">
            <FiTag className="text-[#ff2056]" />
            <span>Product Tags & Badges</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage product badges, marketing labels, search filters, and campaign tags
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-2 px-4 bg-[#ff2056] hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs shadow-rose-600/20"
        >
          <FiPlus size={15} />
          <span>+ Add Tag</span>
        </button>
      </div>

      {/* Add Tag Modal */}
      {isAdding && (
        <form
          onSubmit={handleAddTag}
          className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-md space-y-4 text-xs animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="font-bold text-sm text-zinc-900">Create Tag</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <FiX size={16} />
            </button>
          </div>
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Tag Name</label>
            <input
              type="text"
              required
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="e.g. Ramadan Special / Velvet Edition"
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
            />
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
              Save Tag
            </button>
          </div>
        </form>
      )}

      {/* Tags Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-xs hover:border-[#ff2056]/30 transition-all flex items-center justify-between"
          >
            <div className="space-y-1">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${tag.color}`}
              >
                #{tag.name}
              </span>
              <p className="text-[11px] text-zinc-400">
                {tag.count} products linked
              </p>
            </div>

            <button
              onClick={() => handleDelete(tag.id, tag.name)}
              className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Tag"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
