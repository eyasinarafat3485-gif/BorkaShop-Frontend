"use client";

import React, { useState } from "react";
import {
  FiBox,
  FiUpload,
  FiPlus,
  FiCheck,
  FiX,
  FiEye,
  FiImage,
  FiDollarSign,
  FiTag,
  FiLayers,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface AddProductTabProps {
  onSuccess: () => void;
}

export default function AddProductTab({ onSuccess }: AddProductTabProps) {
  const { addProduct } = useShop();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("abaya");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [fabric, setFabric] = useState("Original Dubai Nida");
  const [tag, setTag] = useState("EID COLLECTION 2026");
  const [inStock, setInStock] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const availableSizeOptions = ["50", "52", "54", "56", "58", "S", "M", "L", "XL", "XXL", "Standard"];
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["52", "54", "56"]);

  const colorPresets = [
    { name: "Jet Black", hex: "#111111" },
    { name: "Royal Navy", hex: "#1B2A4A" },
    { name: "Deep Maroon", hex: "#4F213B" },
    { name: "Coffee Mocha", hex: "#4E3629" },
    { name: "Dusty Olive", hex: "#556B2F" },
    { name: "Rose Mauve", hex: "#9E6B7A" },
  ];
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    colorPresets[0],
    colorPresets[2],
  ]);

  const toggleSize = (sz: string) => {
    if (selectedSizes.includes(sz)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== sz));
      } else {
        toast.error("At least one size must be selected.");
      }
    } else {
      setSelectedSizes([...selectedSizes, sz]);
    }
  };

  const toggleColor = (c: { name: string; hex: string }) => {
    const exists = selectedColors.some((col) => col.name === c.name);
    if (exists) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((col) => col.name !== c.name));
      }
    } else {
      setSelectedColors([...selectedColors, c]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a product title.");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    const finalImage =
      imageUrl.trim() ||
      "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png";

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newProduct: Product = {
      id: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      slug: slug || `abaya-${Date.now()}`,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent:
        originalPrice && Number(originalPrice) > Number(price)
          ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
          : undefined,
      rating: 5.0,
      reviewsCount: 1,
      image: finalImage,
      tag: tag.trim() || undefined,
      inStock,
      isNewArrival: true,
      sizes: selectedSizes,
      colors: selectedColors,
      fabric: fabric.trim() || "Premium Fabric",
      description: description.trim() || "Authentic luxury modest design crafted for exceptional comfort and modesty.",
    };

    addProduct(newProduct);
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 font-serif">
            Add New Product
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Create an abaya, burqa, hijab, or modest set with custom fabric and size options
          </p>
        </div>
      </div>

      {/* 2. Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Dubai Nida Embroidered Abaya"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:bg-white focus:outline-none focus:border-[#4F213B]"
              >
                <option value="burqa">Burqa</option>
                <option value="abaya">Abaya</option>
                <option value="hijab">Hijab</option>
                <option value="khimar">Khimar</option>
                <option value="modest-sets">Modest Sets</option>
                <option value="niqab">Niqab</option>
              </select>
            </div>
          </div>

          {/* Row 2: Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Sale Price (৳ BDT) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="3200"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Original Price (৳ BDT) <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min={1}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder="3950"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Badge / Tag <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. EID COLLECTION"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B]"
              />
            </div>
          </div>

          {/* Row 3: Fabric & Stock Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Fabric Material
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. Original Dubai Nida / Korean Zoom Georgette"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Initial Stock Status
              </label>
              <div className="flex items-center gap-4 pt-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                  <input
                    type="radio"
                    name="stock"
                    checked={inStock}
                    onChange={() => setInStock(true)}
                    className="text-[#4F213B] focus:ring-[#4F213B]"
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                  <input
                    type="radio"
                    name="stock"
                    checked={!inStock}
                    onChange={() => setInStock(false)}
                    className="text-[#4F213B] focus:ring-[#4F213B]"
                  />
                  <span>Out of Stock</span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 4: Available Sizes Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">
              Select Available Sizes <span className="text-zinc-400 font-normal">(click to toggle)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSizeOptions.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#4F213B] text-white shadow-xs"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Available Colors */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">
              Select Colors
            </label>
            <div className="flex flex-wrap gap-2.5">
              {colorPresets.map((c) => {
                const isSelected = selectedColors.some((col) => col.name === c.name);
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => toggleColor(c)}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#4F213B] bg-purple-50 text-[#4F213B]"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    {isSelected && <FiCheck size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Image URL with Live Preview */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Product Image URL
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or image link"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B]"
              />

              {imageUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 shrink-0">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://borkashop.borbila.net/wp-content/uploads/2026/08/classic-everyday-black-burqa.png";
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Leave blank to use default BorkaShop high-resolution showcase image.
            </p>
          </div>

          {/* Row 7: Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fabric feel, drape, modest coverage, and styling tips..."
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B]"
            />
          </div>

        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="py-3 px-6 bg-[#4F213B] hover:bg-[#3D182D] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#4F213B]/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <FiPlus size={16} />
            <span>Publish Product to Store</span>
          </button>
        </div>
      </form>
    </div>
  );
}
