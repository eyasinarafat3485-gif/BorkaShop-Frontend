"use client";

import React, { useState } from "react";
import { FiSliders, FiPlus, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
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

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 font-serif flex items-center gap-2">
            <FiSliders className="text-[#ff2056]" />
            <span>Product Attributes & Sizing Matrix</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure standard modest sizes, fabric qualities, and color palette swatches
          </p>
        </div>
      </div>

      {/* Grid of Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sizing Matrix */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900">Standard Abaya Sizing (Height Guide)</h3>
            <span className="text-[10px] font-bold text-[#ff2056] bg-rose-50 px-2 py-0.5 rounded-full">
              4 Default Sizes
            </span>
          </div>

          <div className="space-y-2">
            {sizes.map((s) => (
              <div
                key={s.size}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center font-mono">
                    {s.size}
                  </span>
                  <div>
                    <p className="font-bold text-zinc-800">Length: {s.length}</p>
                    <p className="text-[11px] text-zinc-500">{s.standard}</p>
                  </div>
                </div>
                <span className="text-zinc-500 font-mono">Bust: {s.bust}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900">Active Color Palette</h3>
            <span className="text-[10px] font-bold text-[#ff2056] bg-rose-50 px-2 py-0.5 rounded-full">
              {colors.length} Swatches
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {colors.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-xl border border-zinc-200 flex items-center gap-3 bg-zinc-50"
              >
                <div
                  className="w-7 h-7 rounded-full shadow-inner border border-black/10 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-zinc-800 truncate">{c.name}</p>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fabrics */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900">Standard Fabric Specifications</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              High Quality Tested
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fabrics.map((f) => (
              <div
                key={f.name}
                className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-zinc-900">{f.name}</h4>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
                    {f.grade}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
