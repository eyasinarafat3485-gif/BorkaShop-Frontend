"use client";

import React, { useState } from "react";
import { FiStar, FiCheck, FiX, FiTrash2, FiMessageSquare } from "react-icons/fi";
import toast from "react-hot-toast";

interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  productName: string;
  comment: string;
  date: string;
  status: "Approved" | "Pending";
  verified: boolean;
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "rev-1",
      customerName: "Ayesha Siddiqua",
      rating: 5,
      productName: "Classic Dubai Front-Open Abaya",
      comment: "Alhamdulillah khub sundor hoyeche! Fabric ekdom original Dubai Nida, falling and drape is unmatched. Will order again in sha Allah.",
      date: "Oct 28, 2026",
      status: "Approved",
      verified: true,
    },
    {
      id: "rev-2",
      customerName: "Fatima Tuz Zohra",
      rating: 5,
      productName: "Luxury Georgette Borka with Handwork",
      comment: "Handwork stone finish ta khub clean and premium. Dhaka delivery matro 24 ghontay peyechi. Cash on delivery chilo.",
      date: "Oct 26, 2026",
      status: "Approved",
      verified: true,
    },
    {
      id: "rev-3",
      customerName: "Nusrat Jahan",
      rating: 4,
      productName: "French Cut Modest Khimar Set",
      comment: "Khimar er coverage khub valo, chest and back proper cover kore. Hijab pin charao bhalo thake.",
      date: "Oct 24, 2026",
      status: "Approved",
      verified: true,
    },
    {
      id: "rev-4",
      customerName: "Samia Akter",
      rating: 5,
      productName: "Everyday Modest Black Borka",
      comment: "Regular use er jonno perfect! Kaporer texture halka and comfortable for summer.",
      date: "Oct 22, 2026",
      status: "Approved",
      verified: true,
    },
  ]);

  const toggleStatus = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Approved" ? "Pending" : "Approved" }
          : r
      )
    );
    toast.success("Review status updated");
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Review deleted");
  };

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
          <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-50 text-amber-800 text-[11px] sm:text-xs font-bold border border-amber-200 flex items-center gap-1.5 whitespace-nowrap">
            <FiStar className="fill-amber-500 text-amber-500" size={13} />
            <span>4.9 / 5.0 Average (128+ Reviews)</span>
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-zinc-200/90 p-3.5 sm:p-5 shadow-xs hover:border-[#ff2056]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="font-bold text-zinc-900 text-xs sm:text-sm">{r.customerName}</span>
                {r.verified && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified Buyer
                  </span>
                )}
                <span className="text-zinc-400 text-[11px] sm:text-xs">• {r.date}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 flex-wrap text-xs">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={13}
                      className={i < r.rating ? "fill-amber-400" : "text-zinc-300"}
                    />
                  ))}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-zinc-700 ml-1">
                  for <span className="text-[#ff2056] font-semibold">{r.productName}</span>
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed italic">
                &quot;{r.comment}&quot;
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
              <button
                onClick={() => toggleStatus(r.id)}
                className={`py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-colors cursor-pointer ${
                  r.status === "Approved"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {r.status}
              </button>

              <button
                onClick={() => deleteReview(r.id)}
                className="p-1.5 sm:p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
                title="Delete"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
