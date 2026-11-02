"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useShop } from "@/context/ShopContext";
import { FiEye, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const isWishlisted = isInWishlist(product.id);

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard";
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : "Default";
    addToCart(product, defaultSize, defaultColor, 1);
    router.push("/checkout");
  };

  // Price formatting matching borkashop.borbila.net
  const formattedPrice = product.originalPrice ? (
    <span className="flex items-center justify-center gap-1.5 flex-wrap">
      {product.price.toLocaleString()}৳{" "}
      <span className="text-zinc-600 line-through text-xs font-normal">
        {product.originalPrice.toLocaleString()}৳
      </span>
    </span>
  ) : (
    <span>{product.price.toLocaleString()}৳</span>
  );

  return (
    <div className="group relative bg-white rounded-[5px] border border-[#F1F1F1] p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* 1. Image Container with Sale Badge, Wishlist Love Button & Hover View Button */}
      <div className="relative w-full aspect-[4/5] rounded-[5px] overflow-hidden bg-zinc-50 mb-2.5">
        <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover object-center group-hover:scale-102 transition-transform duration-300 cursor-pointer"
          />
        </Link>

        {/* Sale Badge (Matches Borbila percent_off badge on live site) */}
        {product.discountPercent && (
          <span className="absolute top-2 left-0 bg-[#4F213B] text-white text-[11px] sm:text-[12px] font-normal px-2 py-0.5 rounded-r-[3px] shadow-sm z-10 pointer-events-none">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Love Button on Right Top */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 text-zinc-700"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <FaHeart size={15} className="text-rose-600 fill-rose-600" />
          ) : (
            <FiHeart size={16} className="text-zinc-700 hover:text-rose-600 transition-colors" />
          )}
        </button>

        {/* Hover View Button Overlay (Navigates to Product Details Page) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-200 flex items-center justify-center z-10 pointer-events-none">
          <Link
            href={`/product/${product.slug}`}
            className="pointer-events-auto bg-white hover:bg-[#4F213B] text-zinc-900 hover:text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-semibold shadow-md flex items-center gap-1.5 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 group-active:translate-y-0 active:scale-95"
            aria-label={`View details for ${product.name}`}
          >
            <FiEye size={15} />
            <span>View</span>
          </Link>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="flex flex-col flex-1 justify-between text-center">
        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="font-['Hind_Siliguri'] text-[13px] sm:text-[15px] font-medium text-zinc-900 group-hover:text-[#4F213B] transition-colors leading-[18px] line-clamp-2 mb-1.5 min-h-[36px] flex items-center justify-center"
        >
          <h3>{product.name}</h3>
        </Link>

        {/* Price */}
        <div className="font-['Hind_Siliguri'] text-[14px] sm:text-[17px] font-bold text-[#4F213B] my-1">
          {formattedPrice}
        </div>

        {/* Order Now Button (Direct checkout without opening modal) */}
        <button
          type="button"
          onClick={handleOrderNow}
          className="w-full bg-[#4F213B] hover:bg-[#3D182D] active:scale-[0.99] text-white rounded-[3px] py-2 sm:py-2.5 font-['Hind_Siliguri'] text-[13px] sm:text-[15px] font-medium uppercase tracking-wide transition-all shadow-sm mt-1 cursor-pointer"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
