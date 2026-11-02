"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiSave } from "react-icons/fi";
import { Product } from "@/types";
import { useShop } from "@/context/ShopContext";

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  onClose,
}: EditProductModalProps) {
  const { updateProduct } = useShop();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("burqa");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [fabric, setFabric] = useState("");
  const [inStock, setInStock] = useState(true);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || "");
      setFabric(product.fabric || "");
      setInStock(product.inStock);
      setImage(product.image);
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, {
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      fabric: fabric.trim(),
      inStock,
      image: image.trim() || product.image,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 font-serif">Edit Product</h3>
            <p className="text-[11px] text-zinc-400 font-mono">{product.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold text-zinc-700 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              >
                <option value="burqa">Burqa</option>
                <option value="abaya">Abaya</option>
                <option value="hijab">Hijab</option>
                <option value="khimar">Khimar</option>
                <option value="modest-sets">Modest Sets</option>
                <option value="niqab">Niqab</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Stock Status</label>
              <select
                value={inStock ? "in" : "out"}
                onChange={(e) => setInStock(e.target.value === "in")}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold text-zinc-700 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              >
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Sale Price (৳)</label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Original Price (৳)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Fabric</label>
            <input
              type="text"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-bold text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-[#ff2056] hover:bg-[#3D182D] text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <FiSave size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
