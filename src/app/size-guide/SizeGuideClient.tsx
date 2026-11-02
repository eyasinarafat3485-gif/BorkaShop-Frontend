"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiMaximize2, FiX } from "react-icons/fi";

export default function SizeGuideClient() {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* 1. Header Banner: Exact match to live site (Light gray bar with bold centered 'Size Guide') */}
      <section className="w-full bg-[#EDEDED] py-8 sm:py-10 flex items-center justify-center border-b border-zinc-200/80">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight text-center">
          Size Guide
        </h1>
      </section>

      {/* 2. Main Content: Centered Official Size Guide Infographic Card */}
      <main className="w-full py-8 sm:py-12 md:py-14 px-4 sm:px-6 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[768px] mx-auto group">
          <div
            onClick={() => setIsZoomed(true)}
            className="cursor-pointer relative overflow-hidden rounded-md shadow-xs transition-all duration-200 hover:shadow-md"
            title="Click to view full screen"
          >
            <Image
              src="/size-guide.png"
              alt="বোরকার সাইজ গাইড - Burqa Size Guide"
              width={768}
              height={1085}
              priority
              className="w-full h-auto object-contain mx-auto block"
              sizes="(max-width: 768px) 100vw, 768px"
            />

            {/* Subtle Zoom Hint on Hover */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs pointer-events-none">
              <FiMaximize2 size={13} />
              <span>Click to Zoom</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Lightbox Modal for Full Screen Inspection */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[95vh] overflow-y-auto bg-white rounded-xl p-3 sm:p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-3">
              <h3 className="font-bold text-zinc-900 text-sm sm:text-base">
                Size Guide – Borka Shop
              </h3>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 hover:text-black transition-colors cursor-pointer"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="w-full flex justify-center">
              <Image
                src="/size-guide.png"
                alt="বোরকার সাইজ গাইড - Burqa Size Guide Zoomed"
                width={768}
                height={1085}
                className="w-full h-auto object-contain max-h-[82vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
