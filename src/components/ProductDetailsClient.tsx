"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/ProductCard";
import ProductImageZoom from "@/components/ProductImageZoom";
import {
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiChevronRight,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShare2,
} from "react-icons/fi";
import { FaHeart, FaStar, FaStarHalfAlt, FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart, openQuickOrder, toggleWishlist, isInWishlist } = useShop();

  const isWishlisted = isInWishlist(product.id);

  const availableSizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["S", "M", "L", "XL", "XXL"];

  const availableColors =
    product.colors && product.colors.length > 0
      ? product.colors.map((c) => (typeof c === "string" ? c : c.name))
      : ["Black", "Navy", "Mocha", "Beige"];

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes.includes("M") ? "M" : availableSizes[0] || "M"
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors.includes("Black") ? "Black" : availableColors[0] || "Black"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"description" | "additional" | "reviews">("description");

  // Gallery images (main + alternate if available)
  const images = [
    product.image,
    product.alternateImage || product.image,
  ];
  const [activeImage, setActiveImage] = useState<string>(product.image);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleOrderNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    const phone = "8801793679254";
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const totalPrice = (product.price * quantity).toLocaleString();
    const message = `আসসালামু আলাইকুম, আমি Borka Shop থেকে এই প্রোডাক্টটি অর্ডার করতে চাই:
• প্রোডাক্ট: ${product.name}
• সাইজ: ${selectedSize}
• কালার: ${selectedColor}
• পরিমাণ: ${quantity}
• মোট মূল্য: ${totalPrice}৳
• প্রোডাক্ট লিংক: ${currentUrl}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Category title display
  const categoryTitle =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen pb-16">
      {/* 1. Breadcrumbs */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 flex-wrap">
            <Link href="/" className="hover:text-[#4F213B] transition-colors">
              Home
            </Link>
            <FiChevronRight size={13} className="text-zinc-400" />
            <Link href="/shop" className="hover:text-[#4F213B] transition-colors">
              Shop
            </Link>
            <FiChevronRight size={13} className="text-zinc-400" />
            <Link
              href={`/product-category/${product.category}`}
              className="hover:text-[#4F213B] transition-colors"
            >
              {categoryTitle}
            </Link>
            <FiChevronRight size={13} className="text-zinc-400" />
            <span className="text-zinc-900 font-medium truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="bg-white rounded-lg border border-zinc-200/80 shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Image Gallery (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-4">
              <ProductImageZoom
                src={activeImage}
                alt={product.name}
                discountPercent={product.discountPercent}
                isWishlisted={isWishlisted}
                onToggleWishlist={() => toggleWishlist(product.id)}
                priority
              />

              {/* Thumbnails */}
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-24 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-[#4F213B] ring-1 ring-[#4F213B]"
                        : "border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details & Purchase Controls (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Stock Status & Share */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#4F213B] transition-colors cursor-pointer"
                  >
                    <FiShare2 size={14} />
                    <span>Share</span>
                  </button>
                </div>

                {/* Product Title */}
                <h1 className="font-['Hind_Siliguri'] text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
                  {product.name}
                </h1>

                {/* Reviews & Ratings */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center text-amber-400">
                    <FaStar size={14} />
                    <FaStar size={14} />
                    <FaStar size={14} />
                    <FaStar size={14} />
                    <FaStar size={14} />
                  </div>
                  <span className="text-zinc-500 text-xs sm:text-sm">
                    ({product.reviewsCount} customer reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-['Hind_Siliguri'] text-2xl sm:text-3xl font-bold text-[#4F213B]">
                    {product.price.toLocaleString()}৳
                  </span>
                  {product.originalPrice && (
                    <span className="text-base sm:text-lg text-zinc-400 line-through font-normal">
                      {product.originalPrice.toLocaleString()}৳
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Save {(product.originalPrice! - product.price).toLocaleString()}৳
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <div className="bg-[#FAF7F2] p-3.5 sm:p-4 rounded-md border border-[#EBE4D8] text-xs sm:text-sm text-zinc-700 leading-relaxed">
                  {product.description}
                </div>

                {/* Fabric & Specs Quick Info */}
                <div className="text-xs sm:text-sm text-zinc-600 space-y-1 py-1">
                  <p>
                    <strong className="text-zinc-800">Fabric:</strong> {product.fabric}
                  </p>
                  <p>
                    <strong className="text-zinc-800">Category:</strong> {categoryTitle}
                  </p>
                </div>

                {/* Options & Purchase Controls Section */}
                <div className="border-t border-dashed border-zinc-300 pt-4 mt-2 space-y-4">
                  {/* Size Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-900 mb-2">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-10 sm:min-w-11 h-9 px-3 flex items-center justify-center rounded-sm text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                            selectedSize === s
                              ? "bg-[#4F213B] text-white border-[#4F213B] shadow-sm"
                              : "bg-white text-zinc-800 border-zinc-300 hover:border-zinc-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-900 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((colorName) => (
                        <button
                          key={colorName}
                          type="button"
                          onClick={() => setSelectedColor(colorName)}
                          className={`h-9 px-3.5 sm:px-4 flex items-center justify-center rounded-sm text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                            selectedColor === colorName
                              ? "bg-[#4F213B] text-white border-[#4F213B] shadow-sm"
                              : "bg-white text-zinc-800 border-zinc-300 hover:border-zinc-400"
                          }`}
                        >
                          {colorName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and Action Buttons Row */}
                  <div className="flex items-center gap-2 sm:gap-2.5 pt-1">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-zinc-300 rounded-sm bg-white h-11 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 sm:w-9 h-full flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-50 text-base font-medium transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 sm:w-10 text-center font-bold text-sm text-zinc-900 select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 sm:w-9 h-full flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-50 text-base font-medium transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 h-11 bg-[#4F213B] hover:bg-[#3D182D] text-white rounded-sm text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.99] flex items-center justify-center whitespace-nowrap cursor-pointer"
                    >
                      ADD TO CART
                    </button>

                    {/* BUY NOW */}
                    <button
                      type="button"
                      onClick={handleOrderNow}
                      className="flex-1 h-11 bg-black hover:bg-zinc-900 text-white rounded-sm text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.99] flex items-center justify-center whitespace-nowrap cursor-pointer"
                    >
                      BUY NOW
                    </button>
                  </div>

                  {/* WhatsApp Order Button */}
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full h-11 sm:h-12 bg-[#008a3e] hover:bg-[#007a37] text-white rounded-sm font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <FaWhatsapp size={20} className="text-white shrink-0" />
                    <span>WhatsApp এ অর্ডার করুন</span>
                  </button>

                </div>
              </div>

              {/* Delivery & Assurance Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-200 text-center text-xs text-zinc-600">
                <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100">
                  <FiTruck size={20} className="mx-auto text-[#4F213B] mb-1" />
                  <p className="font-semibold text-zinc-800">ফ্রি ডেলিভারি</p>
                  <p className="text-[11px] text-zinc-500">২,০০০৳ এর বেশি অর্ডারে</p>
                </div>
                <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100">
                  <FiRefreshCw size={20} className="mx-auto text-[#4F213B] mb-1" />
                  <p className="font-semibold text-zinc-800">সহজ এক্সচেঞ্জ</p>
                  <p className="text-[11px] text-zinc-500">৭ দিনের মধ্যে</p>
                </div>
                <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100">
                  <FiShield size={20} className="mx-auto text-[#4F213B] mb-1" />
                  <p className="font-semibold text-zinc-800">১০০% অরিজিনাল</p>
                  <p className="text-[11px] text-zinc-500">প্রিমিয়াম ফেব্রিক গ্যারান্টি</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Product Tabs: Description / Additional / Reviews */}
        <div className="mt-8 bg-white rounded-lg border border-zinc-200/80 shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-200 bg-zinc-50/70">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-3.5 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "description"
                  ? "border-[#4F213B] text-[#4F213B] bg-white"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("additional")}
              className={`py-3.5 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "additional"
                  ? "border-[#4F213B] text-[#4F213B] bg-white"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3.5 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "border-[#4F213B] text-[#4F213B] bg-white"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Reviews ({product.reviewsCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 text-sm text-zinc-700 leading-relaxed">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-zinc-900">
                  About {product.name}
                </h3>
                <p>{product.description}</p>
                <div className="pt-2">
                  <h4 className="font-bold text-zinc-900 mb-2">Product Highlights:</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-zinc-600">
                    <li>Original imported fabric with non-transparent finish</li>
                    <li>Comfortable modest cut with graceful and modest drape</li>
                    <li>Suitable for regular wear, university, office & family gatherings</li>
                    <li>Easy maintenance: machine washable on gentle cycle or hand wash</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-zinc-100">
                      <th className="py-2.5 font-bold text-zinc-900 w-44">Fabric</th>
                      <td className="py-2.5 text-zinc-700">{product.fabric}</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <th className="py-2.5 font-bold text-zinc-900">Available Sizes</th>
                      <td className="py-2.5 text-zinc-700">{product.sizes.join(", ")}</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <th className="py-2.5 font-bold text-zinc-900">Colors</th>
                      <td className="py-2.5 text-zinc-700">
                        {product.colors.map((c) => c.name).join(", ")}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2.5 font-bold text-zinc-900">Care Instructions</th>
                      <td className="py-2.5 text-zinc-700">
                        Cold wash with mild detergent. Iron on low to medium heat.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50 border border-zinc-100">
                  <div className="text-3xl font-extrabold text-[#4F213B]">
                    {product.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center text-amber-400">
                      <FaStar size={16} />
                      <FaStar size={16} />
                      <FaStar size={16} />
                      <FaStar size={16} />
                      <FaStar size={16} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Based on {product.reviewsCount} customer reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-zinc-100 pb-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-zinc-900 text-sm">Shabnam Sultana</p>
                      <span className="text-xs text-zinc-400">Verified Buyer</span>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs my-1">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <p className="text-xs text-zinc-600">
                      ফেব্রিক কোয়ালিটি অনেক ভালো এবং ফিটিং পারফেক্ট হয়েছে। ডেলিভারিও অনেক দ্রুত পেয়েছি। ধন্যবাদ বোরকা শপ!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Hind_Siliguri'] text-xl sm:text-2xl font-bold text-zinc-900">
                Related Products
              </h2>
              <Link
                href="/shop"
                className="text-xs sm:text-sm font-semibold text-[#4F213B] hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
