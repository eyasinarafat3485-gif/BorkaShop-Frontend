"use client";

import React, { useState, useEffect } from "react";
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
  const {
    addToCart,
    openQuickOrder,
    toggleWishlist,
    isInWishlist,
    shippingSettings,
    currentUser,
    role,
  } = useShop();

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

  // Reviews logic (MongoDB Atlas 'reviews' collection)
  const isUserLoggedIn =
    role === "user" ||
    role === "admin" ||
    Boolean(currentUser && (currentUser.email || currentUser.name));

  interface ReviewData {
    _id?: string;
    id?: string;
    productId: string;
    productName?: string;
    productImage?: string;
    userAvatar?: string;
    userId?: string | null;
    name: string;
    email: string;
    rating: number;
    comment: string;
    createdAt?: string;
  }

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://borkashop-backend.onrender.com/api";

  // Sync user info if logged in
  useEffect(() => {
    if (currentUser?.name) setReviewerName(currentUser.name);
    if (currentUser?.email) setReviewerEmail(currentUser.email);
  }, [currentUser]);

  // Fetch reviews from database
  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const res = await fetch(`${API_BASE}/reviews?productId=${encodeURIComponent(product.id)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      }
    } catch (e) {
      console.warn("Notice: could not fetch reviews:", e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = isUserLoggedIn
      ? (currentUser?.name || reviewerName || "Verified Customer")
      : reviewerName.trim();
    const finalEmail = isUserLoggedIn
      ? (currentUser?.email || reviewerEmail || "customer@burkashop.com")
      : reviewerEmail.trim();

    if (!finalName) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }
    if (!finalEmail) {
      toast.error("অনুগ্রহ করে আপনার ইমেইল লিখুন");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("অনুগ্রহ করে আপনার রিভিউ বা মন্তব্য লিখুন");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          userAvatar: (currentUser as any)?.image || "",
          userId: currentUser?.id || null,
          name: finalName,
          email: finalEmail,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        toast.success("রিভিউ সফলভাবে জমা দেওয়া হয়েছে!", { icon: "⭐" });
        setReviewComment("");
        if (!isUserLoggedIn) {
          setReviewerName("");
          setReviewerEmail("");
        }
        setReviews((prev) => [data.review, ...prev]);
      } else {
        toast.error(data.error || "রিভিউ জমা দিতে সমস্যা হয়েছে");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleOrderNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    const rawPhone = shippingSettings?.helplinePhone || "01810559258";
    const digits = rawPhone.replace(/[^0-9]/g, "");
    const phone = digits.startsWith("88") ? digits : `88${digits}`;
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
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={14}
                        className={
                          reviews.length > 0
                            ? star <=
                              Math.round(
                                reviews.reduce((sum, r) => sum + (r.rating || 5), 0) /
                                  reviews.length
                              )
                              ? "text-amber-400"
                              : "text-zinc-200"
                            : star <= Math.round(product.rating || 5)
                            ? "text-amber-400"
                            : "text-zinc-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-zinc-500 text-xs sm:text-sm">
                    ({reviews.length} customer {reviews.length === 1 ? "review" : "reviews"})
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
              Reviews ({reviews.length})
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
                {/* 1. Review Summary Score */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <div className="text-3xl font-extrabold text-[#4F213B]">
                    {reviews.length > 0
                      ? (
                          reviews.reduce((sum, r) => sum + (r.rating || 5), 0) /
                          reviews.length
                        ).toFixed(1)
                      : product.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={15}
                          className={
                            star <=
                            Math.round(
                              reviews.length > 0
                                ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) /
                                  reviews.length
                                : product.rating
                            )
                              ? "text-amber-400"
                              : "text-zinc-200"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Based on {reviews.length} customer {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>

                {/* 2. Real Original Last Recent Max 2-3 Reviews */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                      <p className="text-xs sm:text-sm font-medium text-zinc-500">
                        এখনো কোনো রিভিউ দেওয়া হয়নি। আপনি প্রথম রিভিউ দিন!
                      </p>
                    </div>
                  ) : (
                    reviews.slice(0, 3).map((r, idx) => (
                      <div
                        key={r._id || r.id || idx}
                        className="border-b border-zinc-100 pb-3.5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#4F213B]/10 text-[#4F213B] font-bold text-xs flex items-center justify-center uppercase">
                              {r.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 text-sm leading-tight">
                                {r.name}
                              </p>
                              <p className="text-[10px] text-zinc-400">
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Verified Customer"}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Verified Buyer
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400 text-xs my-1 gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FaStar
                              key={s}
                              className={s <= (r.rating || 5) ? "text-amber-400" : "text-zinc-200"}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-zinc-700 leading-relaxed">
                          {r.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* 3. Review Comment Form (Logged in vs Guest) */}
                <div className="mt-8 pt-6 border-t border-zinc-200">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 mb-3 font-serif">
                    Write a Review (আপনার মতামত লিখুন)
                  </h3>

                  <form
                    onSubmit={handleReviewSubmit}
                    className="space-y-4 bg-zinc-50/70 p-4 sm:p-5 rounded-2xl border border-zinc-200/80"
                  >
                    {/* Star Rating Select */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Your Rating (রেটিং দিন) *
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-lg sm:text-xl transition-transform hover:scale-110 cursor-pointer"
                          >
                            <FaStar
                              className={
                                star <= (hoverRating || reviewRating)
                                  ? "text-amber-400"
                                  : "text-zinc-300"
                              }
                            />
                          </button>
                        ))}
                        <span className="text-xs font-semibold text-zinc-600 ml-2">
                          ({reviewRating} / 5 Stars)
                        </span>
                      </div>
                    </div>

                    {/* If Logged In: Auto show Name and Email; If Guest: inputs for Name & Email */}
                    {isUserLoggedIn ? (
                      <div className="bg-white p-3 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-zinc-500">Posting review as: </span>
                          <span className="font-bold text-zinc-900">
                            {currentUser?.name || reviewerName || "Logged-in User"}
                          </span>
                          <span className="text-zinc-400 ml-1">
                            ({currentUser?.email || reviewerEmail || ""})
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#4F213B]/10 text-[#4F213B] font-bold text-[10px]">
                          Logged In
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Full Name (আপনার নাম) *
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            placeholder="যেমন: Eyasin Arafat"
                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#4F213B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">
                            Email Address (আপনার ইমেইল) *
                          </label>
                          <input
                            type="email"
                            required
                            value={reviewerEmail}
                            onChange={(e) => setReviewerEmail(e.target.value)}
                            placeholder="যেমন: yourname@gmail.com"
                            className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#4F213B]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Review Comment Textarea */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Your Review / Comment (আপনার মন্তব্য লিখুন) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="প্রোডাক্টের ফেব্রিক, কোয়ালিটি ও ফিটিংস কেমন লেগেছে জানান..."
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#4F213B] resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-[#4F213B] hover:bg-[#3B152B] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review (রিভিউ জমা দিন)"}
                      </button>
                    </div>
                  </form>
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
