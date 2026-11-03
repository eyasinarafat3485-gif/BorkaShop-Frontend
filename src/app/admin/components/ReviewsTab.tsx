"use client";

import React, { useState, useEffect } from "react";
import { FiStar, FiCheck, FiX, FiTrash2, FiMessageSquare, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

interface ReviewItem {
  _id?: string;
  id?: string;
  customerName?: string;
  name?: string;
  email?: string;
  rating: number;
  productName: string;
  comment: string;
  date?: string;
  createdAt?: string;
  status?: "Approved" | "Pending";
  verified?: boolean;
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/reviews?limit=100`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    try {
      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
      await fetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
      toast.success("Review deleted from database");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-zinc-900 font-serif flex items-center gap-2">
            <FiStar className="text-amber-500 fill-amber-500" />
            <span>Customer Testimonials & Reviews</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
            Manage verified customer ratings, testimonials, and public storefront reviews
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchReviews}
            disabled={isLoading}
            className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors cursor-pointer"
            title="Refresh Reviews"
          >
            <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
          <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-50 text-amber-800 text-[11px] sm:text-xs font-bold border border-amber-200 flex items-center gap-1.5 whitespace-nowrap">
            <FiStar className="fill-amber-500 text-amber-500" size={13} />
            <span>{avgRating} / 5.0 Average ({reviews.length} Reviews)</span>
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200/90 p-8 text-center text-zinc-500 text-xs sm:text-sm">
            {isLoading ? "Loading customer reviews..." : "No reviews found in database."}
          </div>
        ) : (
          reviews.map((r, idx) => {
            const reviewId = r._id || r.id || String(idx);
            const reviewerName = r.name || r.customerName || "Customer";
            const reviewDate = r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : r.date || "Recent";

            return (
              <div
                key={reviewId}
                className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs hover:border-[#ff2056]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="font-bold text-zinc-900 text-xs sm:text-sm">
                      {reviewerName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Buyer
                    </span>
                    {r.email && (
                      <span className="text-zinc-400 text-[11px] sm:text-xs">
                        ({r.email})
                      </span>
                    )}
                    <span className="text-zinc-400 text-[11px] sm:text-xs">
                      • {reviewDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 flex-wrap text-xs">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={13}
                          className={i < (r.rating || 5) ? "fill-amber-400" : "text-zinc-300"}
                        />
                      ))}
                    </div>
                    {r.productName && (
                      <span className="text-[11px] sm:text-xs font-bold text-zinc-700 ml-1">
                        for <span className="text-[#ff2056] font-semibold">{r.productName}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed italic">
                    &quot;{r.comment}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <span className="py-1 px-2.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Approved
                  </span>

                  <button
                    onClick={() => deleteReview(reviewId)}
                    className="p-1.5 sm:p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
