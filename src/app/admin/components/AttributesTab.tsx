"use client";

import React, { useState } from "react";
import { FiSliders, FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AttributesTab() {
  const [sizes, setSizes] = useState([
    { size: "50", length: "50 inches", bust: "40-42\"", standard: "Height 5'0\" - 5'2\"" },
    { size: "52", length: "52 inches", bust: "42-44\"", standard: "Height 5'2\" - 5'4\"" },
    { size: "54", length: "54 inches", bust: "44-46\"", standard: "Height 5'4\" - 5'6\"" },
    { size: "56", length: "56 inches", bust: "46-48\"", standard: "Height 5'6\" - 5'8\"" },
  ]);

  const [colors, setColors] = useState([
    { name: "Jet Black", hex: "#0a0a0a" },
    { name: "Olive Green", hex: "#556b2f" },
    { name: "Rose Pink", hex: "#e07a9a" },
    { name: "Deep Navy", hex: "#1a2a4b" },
    { name: "Plum Maroon", hex: "#5e192f" },
    { name: "Mocha Brown", hex: "#6e473b" },
  ]);

  const [fabrics, setFabrics] = useState([
    { name: "Original Dubai Nida", grade: "Premium A+", description: "Silky matte drape, breathable, wrinkle-free" },
    { name: "Korean Zoom", grade: "Everyday Luxury", description: "Slight stretch, structured texture, easy iron" },
    { name: "Cherry Georgette", grade: "Festive Flow", description: "Double-layered, graceful flow, featherweight" },
    { name: "Medina Silk", grade: "Ultra Soft", description: "Sheen finish, gentle on skin, ideal for hijabs" },
  ]);

  // Add attribute modal states
  const [isAdding, setIsAdding] = useState(false);
  const [attrType, setAttrType] = useState<"size" | "color" | "fabric">("size");

  // Form input states
  const [sizeVal, setSizeVal] = useState("");
  const [sizeLength, setSizeLength] = useState("");
  const [sizeBust, setSizeBust] = useState("");
  const [sizeHeight, setSizeHeight] = useState("");

  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#ff2056");

  const [fabricName, setFabricName] = useState("");
  const [fabricGrade, setFabricGrade] = useState("Premium A+");
  const [fabricDesc, setFabricDesc] = useState("");

  const handleAddAttribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (attrType === "size") {
      if (!sizeVal.trim()) return toast.error("Please enter a size number");
      const newSize = {
        size: sizeVal.trim(),
        length: sizeLength.trim() || `${sizeVal.trim()} inches`,
        bust: sizeBust.trim() || '44-46"',
        standard: sizeHeight.trim() || "Standard Fit",
      };
      setSizes((prev) => [...prev, newSize]);
      toast.success(`Size "${sizeVal}" added successfully!`, { icon: "✨" });
      setSizeVal("");
      setSizeLength("");
      setSizeBust("");
      setSizeHeight("");
    } else if (attrType === "color") {
      if (!colorName.trim()) return toast.error("Please enter a color name");
      const newColor = {
        name: colorName.trim(),
        hex: colorHex.trim() || "#000000",
      };
      setColors((prev) => [...prev, newColor]);
      toast.success(`Color "${colorName}" added successfully!`, { icon: "🎨" });
      setColorName("");
      setColorHex("#ff2056");
    } else if (attrType === "fabric") {
      if (!fabricName.trim()) return toast.error("Please enter a fabric name");
      const newFabric = {
        name: fabricName.trim(),
        grade: fabricGrade.trim() || "Premium",
        description: fabricDesc.trim() || "High quality modest fabric",
      };
      setFabrics((prev) => [...prev, newFabric]);
      toast.success(`Fabric "${fabricName}" added successfully!`, { icon: "🧵" });
      setFabricName("");
      setFabricDesc("");
    }
    setIsAdding(false);
  };

  const handleDeleteSize = (sizeNum: string) => {
    if (confirm(`Remove size ${sizeNum}?`)) {
      setSizes((prev) => prev.filter((s) => s.size !== sizeNum));
      toast.success(`Size ${sizeNum} removed`);
    }
  };

  const handleDeleteColor = (name: string) => {
    if (confirm(`Remove color "${name}"?`)) {
      setColors((prev) => prev.filter((c) => c.name !== name));
      toast.success(`Color "${name}" removed`);
    }
  };

  const handleDeleteFabric = (name: string) => {
    if (confirm(`Remove fabric "${name}"?`)) {
      setFabrics((prev) => prev.filter((f) => f.name !== name));
      toast.success(`Fabric "${name}" removed`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add Button */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-zinc-900 font-serif flex items-center gap-2">
            <FiSliders className="text-[#ff2056]" />
            <span>Product Attributes & Sizing Matrix</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
            Configure standard modest sizes, fabric qualities, and color palette swatches
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-1.5 px-3 sm:py-2 sm:px-4 bg-[#ff2056] hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-rose-600/20 whitespace-nowrap self-start sm:self-auto"
        >
          <FiPlus size={14} />
          <span>Add Attribute</span>
        </button>
      </div>

      {/* 2. Add Attribute Modal / Form (Matching Tags & Categories) */}
      {isAdding && (
        <form
          onSubmit={handleAddAttribute}
          className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-md space-y-4 text-xs animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="font-bold text-sm text-zinc-900">Add New Attribute</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-400 hover:text-zinc-600 cursor-pointer p-1"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Select Attribute Type Pill Tabs */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1.5">Select Attribute Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAttrType("size")}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  attrType === "size"
                    ? "bg-[#ff2056] text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Size Guide
              </button>
              <button
                type="button"
                onClick={() => setAttrType("color")}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  attrType === "color"
                    ? "bg-[#ff2056] text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Color Swatch
              </button>
              <button
                type="button"
                onClick={() => setAttrType("fabric")}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  attrType === "fabric"
                    ? "bg-[#ff2056] text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                Fabric
              </button>
            </div>
          </div>

          {/* Type 1: Size Inputs */}
          {attrType === "size" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Size Number *</label>
                <input
                  type="text"
                  required
                  value={sizeVal}
                  onChange={(e) => setSizeVal(e.target.value)}
                  placeholder="e.g. 58"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Length</label>
                <input
                  type="text"
                  value={sizeLength}
                  onChange={(e) => setSizeLength(e.target.value)}
                  placeholder="e.g. 58 inches"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Bust Measurement</label>
                <input
                  type="text"
                  value={sizeBust}
                  onChange={(e) => setSizeBust(e.target.value)}
                  placeholder="e.g. 48-50&quot;"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Height Guide</label>
                <input
                  type="text"
                  value={sizeHeight}
                  onChange={(e) => setSizeHeight(e.target.value)}
                  placeholder="e.g. Height 5'8&quot; - 6'0&quot;"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
            </div>
          )}

          {/* Type 2: Color Inputs */}
          {attrType === "color" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Color Name *</label>
                <input
                  type="text"
                  required
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="e.g. Sage Green / Desert Sand"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Color Hex & Picker</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-zinc-200 p-0.5 cursor-pointer bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    placeholder="#ff2056"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:border-[#ff2056]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Type 3: Fabric Inputs */}
          {attrType === "fabric" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Fabric Name *</label>
                <input
                  type="text"
                  required
                  value={fabricName}
                  onChange={(e) => setFabricName(e.target.value)}
                  placeholder="e.g. Turkish Crinkle"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Grade / Badge</label>
                <input
                  type="text"
                  value={fabricGrade}
                  onChange={(e) => setFabricGrade(e.target.value)}
                  placeholder="e.g. Premium A+ / Summer Soft"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block font-bold text-zinc-700 mb-1">Fabric Description</label>
                <input
                  type="text"
                  value={fabricDesc}
                  onChange={(e) => setFabricDesc(e.target.value)}
                  placeholder="e.g. Flowy, airy texture, soft feel and easy wash"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff2056]"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="py-1.5 px-3 rounded-xl bg-zinc-100 text-zinc-700 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-4 rounded-xl bg-[#ff2056] text-white font-bold cursor-pointer shadow-xs hover:bg-[#3D182D] transition-colors"
            >
              Save Attribute
            </button>
          </div>
        </form>
      )}

      {/* 3. Grid of Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sizing Matrix */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-xs sm:text-sm text-zinc-900">Standard Abaya Sizing (Height Guide)</h3>
            <span className="text-[10px] font-bold text-[#ff2056] bg-rose-50 px-2 py-0.5 rounded-full">
              {sizes.length} Default Sizes
            </span>
          </div>

          <div className="space-y-2">
            {sizes.map((s) => (
              <div
                key={s.size}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs gap-2"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center font-mono text-xs shrink-0">
                    {s.size}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-800 truncate">Length: {s.length}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{s.standard}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-zinc-500 font-mono text-[11px] sm:text-xs">Bust: {s.bust}</span>
                  <button
                    onClick={() => handleDeleteSize(s.size)}
                    className="p-1 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Size"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-xs sm:text-sm text-zinc-900">Active Color Palette</h3>
            <span className="text-[10px] font-bold text-[#ff2056] bg-rose-50 px-2 py-0.5 rounded-full">
              {colors.length} Swatches
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {colors.map((c) => (
              <div
                key={c.name}
                className="p-2 sm:p-3 rounded-xl border border-zinc-200 flex items-center gap-2 sm:gap-3 bg-zinc-50"
              >
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-inner border border-black/10 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="overflow-hidden flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-800 truncate">{c.name}</p>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase truncate">{c.hex}</p>
                </div>
                <button
                  onClick={() => handleDeleteColor(c.name)}
                  className="p-1 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Color"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fabrics */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-xs sm:text-sm text-zinc-900">Standard Fabric Specifications</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {fabrics.length} Standard Fabrics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {fabrics.map((f) => (
              <div
                key={f.name}
                className="p-3 sm:p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-zinc-900 truncate">{f.name}</h4>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 shrink-0">
                      {f.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed mt-1.5">
                    {f.description}
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-100 mt-2">
                  <button
                    onClick={() => handleDeleteFabric(f.name)}
                    className="p-1 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Fabric"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
