"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiZoomIn, FiMove, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  discountPercent?: number;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  priority?: boolean;
}

export default function ProductImageZoom({
  src,
  alt,
  discountPercent,
  isWishlisted,
  onToggleWishlist,
  priority = false,
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomWrapperRef = useRef<HTMLDivElement>(null);

  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(2.4);

  // Tracking touch state
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Reset zoom whenever image source changes
  useEffect(() => {
    resetZoom();
  }, [src]);

  const applyZoom = useCallback(
    (clientX: number, clientY: number, scale: number = zoomScale, smoothOrigin: boolean = false) => {
      if (!containerRef.current || !zoomWrapperRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate percentage inside container (0% to 100%)
      const xPercent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

      const wrapper = zoomWrapperRef.current;
      if (smoothOrigin) {
        wrapper.style.transition =
          "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.08s ease-out";
      } else {
        wrapper.style.transition =
          "transform 0.15s ease-out, transform-origin 0.05s ease-out";
      }

      // transform-origin: Moving cursor right -> origin moves right -> image shifts LEFT
      // Moving cursor up -> origin moves up -> image shifts DOWN
      // Zigzagging -> smoothly pans in all directions
      wrapper.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      wrapper.style.transform = `scale(${scale})`;
    },
    [zoomScale]
  );

  const resetZoom = useCallback(() => {
    if (zoomWrapperRef.current) {
      zoomWrapperRef.current.style.transition =
        "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      zoomWrapperRef.current.style.transform = "scale(1)";
      zoomWrapperRef.current.style.transformOrigin = "50% 50%";
    }
    setIsZoomed(false);
    setIsLocked(false);
    isDraggingRef.current = false;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  // --- MOUSE EVENTS (Desktop) ---
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsZoomed(true);
    applyZoom(e.clientX, e.clientY, zoomScale, true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) {
      setIsZoomed(true);
    }
    applyZoom(e.clientX, e.clientY, zoomScale, false);
  };

  const handleMouseLeave = () => {
    if (!isLocked) {
      resetZoom();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // On desktop, clicking can toggle lock to keep inspecting freely
    if (!isLocked) {
      setIsLocked(true);
      setIsZoomed(true);
      applyZoom(e.clientX, e.clientY, zoomScale, false);
    } else {
      setIsLocked(false);
    }
  };

  // --- TOUCH EVENTS (Mobile Devices) ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isDraggingRef.current = false;

    // If already locked in zoom, immediately pan to this touch
    if (isLocked || isZoomed) {
      applyZoom(touch.clientX, touch.clientY, zoomScale, false);
      return;
    }

    // Touch and hold for 140ms to zoom directly without full tap
    holdTimerRef.current = setTimeout(() => {
      setIsZoomed(true);
      isDraggingRef.current = true;
      applyZoom(touch.clientX, touch.clientY, zoomScale, true);
      if (typeof window !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(15);
        } catch {
          // ignore
        }
      }
    }, 140);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1 || !touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);

    // If moved more than 8px before timer, cancel touch-hold if not zoomed
    if (!isZoomed && !isLocked && (dx > 8 || dy > 8)) {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      return;
    }

    // When zoomed, pan smoothly in real-time
    if (isZoomed || isLocked) {
      isDraggingRef.current = true;
      applyZoom(touch.clientX, touch.clientY, zoomScale, false);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    const dt = Date.now() - touchStartRef.current.time;

    // Quick tap detection (duration < 250ms and movement < 10px)
    if (dt < 250 && dx < 10 && dy < 10) {
      if (isZoomed || isLocked) {
        // Tap while zoomed -> reset
        resetZoom();
      } else {
        // Tap while normal -> zoom in and lock so user can drag around easily
        setIsZoomed(true);
        setIsLocked(true);
        applyZoom(touch.clientX, touch.clientY, zoomScale, true);
      }
      touchStartRef.current = null;
      return;
    }

    // If user was using touch-and-hold drag and it was NOT locked, reset on release
    if (isDraggingRef.current && !isLocked) {
      resetZoom();
    }

    touchStartRef.current = null;
  };

  const handleTouchCancel = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (!isLocked) {
      resetZoom();
    }
    touchStartRef.current = null;
  };

  // Switch zoom level (e.g. 2x, 2.5x, 3x)
  const changeScale = (newScale: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale(newScale);
    if (containerRef.current && zoomWrapperRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      applyZoom(rect.left + rect.width / 2, rect.top + rect.height / 2, newScale, true);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      data-lenis-prevent
      className={`relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 select-none group transition-shadow ${
        isZoomed
          ? "cursor-crosshair shadow-md ring-2 ring-[#4F213B]/20"
          : "cursor-zoom-in"
      }`}
      style={{
        touchAction: isZoomed ? "none" : "pan-y",
      }}
      aria-label="Product Image Zoom"
    >
      {/* Zoomable Image Wrapper */}
      <div
        ref={zoomWrapperRef}
        className="relative w-full h-full will-change-transform"
        style={{
          transformOrigin: "50% 50%",
          transform: "scale(1)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover object-center pointer-events-none"
        />
      </div>

      {/* Discount Badge */}
      {discountPercent && (
        <span
          className={`absolute top-3 left-0 bg-[#4F213B] text-white text-xs font-semibold px-3 py-1 rounded-r-md shadow-sm z-20 pointer-events-none transition-opacity duration-300 ${
            isZoomed ? "opacity-30" : "opacity-100"
          }`}
        >
          {discountPercent}% OFF
        </span>
      )}

      {/* Wishlist Button on image */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist();
        }}
        className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-zinc-700 cursor-pointer"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <FaHeart size={18} className="text-rose-600 fill-rose-600" />
        ) : (
          <FiHeart size={18} className="text-zinc-700 hover:text-rose-600 transition-colors" />
        )}
      </button>

      {/* Default Hint Badge (when NOT zoomed) */}
      <div
        className={`absolute bottom-3 right-3 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-medium shadow-md transition-opacity duration-200 ${
          isZoomed ? "opacity-0" : "opacity-90 group-hover:opacity-100"
        }`}
      >
        <FiZoomIn size={14} className="text-amber-300 animate-pulse" />
        <span className="hidden sm:inline">Hover to zoom</span>
        <span className="sm:hidden">Tap to zoom</span>
      </div>

      {/* Active Zoom Floating Toolbar (when zoomed in) */}
      {isZoomed && (
        <div
          className="absolute inset-x-0 bottom-3 z-30 flex items-center justify-center px-3 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs shadow-xl border border-white/10 pointer-events-auto">
            {/* Movement indicator icon */}
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <FiMove size={13} className="animate-spin" style={{ animationDuration: "6s" }} />
              <span className="text-[11px] sm:text-xs">
                <span className="hidden sm:inline">Move cursor to pan</span>
                <span className="sm:hidden">Drag finger to pan</span>
              </span>
            </div>

            {/* Scale toggle pills */}
            <div className="flex items-center gap-1 pl-2 border-l border-white/20">
              {[2.0, 2.5, 3.0].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => changeScale(s, e)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    zoomScale === s
                      ? "bg-[#4F213B] text-white"
                      : "text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Close / Reset button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
              className="pl-2 border-l border-white/20 text-zinc-300 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
              title="Close Zoom"
            >
              <FiX size={14} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
