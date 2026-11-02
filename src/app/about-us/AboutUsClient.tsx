"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiShield,
  FiAward,
  FiShoppingBag,
  FiLayers,
  FiScissors,
  FiPackage,
  FiTrendingUp,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function AboutUsClient() {
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(4); // Default to Oct 2026 (Present)

  // 1. E-Commerce Craftsmanship & Order Journey (Pure Fashion E-Commerce Terminology)
  const workflowSteps = [
    {
      step: "STEP 01",
      title: "100% Original Fabric Sourcing (প্রিমিয়াম ফেব্রিক নির্বাচন)",
      desc: "We directly import genuine Korean Zoom Georgette, Original Dubai Nida, and Medina Silk. Every fabric roll is rigorously inspected for zero see-through opacity, lightweight breathability, and wrinkle-resistant longevity.",
      icon: <FiLayers className="text-sky-600" size={18} />,
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      cardBorder: "border-sky-300 hover:border-sky-400 bg-sky-50/20",
      lineColor: "bg-sky-400",
    },
    {
      step: "STEP 02",
      title: "Modest Islamic Pattern Cutting (মার্জিত কাটিং ও প্যাটার্ন)",
      desc: "Our master pattern designers create modest, non-revealing silhouettes tailored specifically for Bangladeshi body proportions. Generous chest and bottom flares ensure complete modesty with graceful, effortless drape.",
      icon: <FiScissors className="text-amber-600" size={18} />,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      cardBorder: "border-amber-300 hover:border-amber-400 bg-amber-50/20",
      lineColor: "bg-amber-400",
    },
    {
      step: "STEP 03",
      title: "Master Artisan Tailoring & Stonework (দক্ষ কারিগরদের নিখুঁত সেলাই)",
      desc: "Experienced artisans meticulously craft every garment with double-needle reinforced seams, concealed durable zippers, comfortable elastic sleeves, and handcrafted crystal stonework that never sheds.",
      icon: <FiAward className="text-blue-600" size={18} />,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      cardBorder: "border-blue-300 hover:border-blue-400 bg-blue-50/20",
      lineColor: "bg-blue-400",
    },
    {
      step: "STEP 04",
      title: "Multi-Point Quality Control & Steam Press (নিখুঁত কোয়ালিটি চেক ও প্রেসিং)",
      desc: "Each finished abaya and hijab undergoes thorough manual quality checks for stitch density, stone adherence, and exact size measurements, followed by 140°C sanitized steam ironing.",
      icon: <FiShield className="text-emerald-600" size={18} />,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cardBorder: "border-emerald-300 hover:border-emerald-400 bg-emerald-50/20",
      lineColor: "bg-emerald-400",
    },
    {
      step: "STEP 05",
      title: "Protective Packaging & Cash on Delivery (সুরক্ষিত প্যাকিং ও হোম ডেলিভারি)",
      desc: "Sealed in protective fragrance packaging and dispatched via express courier nationwide. You can inspect the parcel before paying the delivery agent, backed by our 7-day hassle-free size exchange guarantee.",
      icon: <FiPackage className="text-purple-600" size={18} />,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      cardBorder: "border-purple-300 hover:border-purple-400 bg-purple-50/20",
      lineColor: "bg-purple-400",
    },
  ];

  // 2. Monthly Performance Data from June 2026 to Present (October 2026)
  const monthlyData = [
    {
      month: "Jun 2026",
      shortMonth: "Jun",
      orders: "850+",
      repeatRate: "35%",
      sla: "99.1%",
      rating: "4.80 / 5.0",
      x: 110,
      slaY: 53,
      ratingY: 80,
      ordersY: 275,
      repeatY: 305,
    },
    {
      month: "Jul 2026",
      shortMonth: "Jul",
      orders: "1,750+",
      repeatRate: "48%",
      sla: "99.3%",
      rating: "4.86 / 5.0",
      x: 250,
      slaY: 52,
      ratingY: 72,
      ordersY: 210,
      repeatY: 275,
    },
    {
      month: "Aug 2026",
      shortMonth: "Aug",
      orders: "2,500+",
      repeatRate: "62%",
      sla: "99.4%",
      rating: "4.90 / 5.0",
      x: 390,
      slaY: 51,
      ratingY: 64,
      ordersY: 155,
      repeatY: 240,
    },
    {
      month: "Sep 2026",
      shortMonth: "Sep",
      orders: "3,250+",
      repeatRate: "74%",
      sla: "99.6%",
      rating: "4.93 / 5.0",
      x: 530,
      slaY: 50,
      ratingY: 58,
      ordersY: 105,
      repeatY: 205,
    },
    {
      month: "Oct 2026 (Now)",
      shortMonth: "Oct 2026",
      orders: "4,120+",
      repeatRate: "84%",
      sla: "99.8%",
      rating: "4.96 / 5.0",
      x: 670,
      slaY: 48,
      ratingY: 52,
      ordersY: 60,
      repeatY: 165,
    },
  ];

  const currentMonth = monthlyData[activeMonthIdx];

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen pb-20">
      {/* 1. Top Gray Header Banner: Exact match to live site */}
      <section className="w-full bg-[#EDEDED] py-8 sm:py-10 flex items-center justify-center border-b border-zinc-200/80">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight text-center">
          About Us
        </h1>
      </section>

      {/* 2. SECTION 1: Product Journey & Craftsmanship Process (E-Commerce Focused) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="text-center space-y-2 mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Our Craftsmanship & Order Journey
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            প্রিমিয়াম ফেব্রিক নির্বাচন থেকে শুরু করে নিখুঁত সেলাই, কোয়ালিটি কন্ট্রোল এবং আপনার দোরগোড়ায় নিরাপদ ডেলিভারির ৫টি নির্ভরযোগ্য ধাপ।
          </p>
        </div>

        {/* Workflow Pipeline with colored connector */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-[23px] sm:left-[27px] top-6 bottom-10 w-[2px] bg-gradient-to-b from-sky-400 via-amber-400 via-blue-400 via-emerald-400 to-purple-400 z-0" />

          <div className="space-y-5 sm:space-y-6 relative z-10">
            {workflowSteps.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 sm:gap-6 group">
                {/* Left Badge with Step icon & number */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 flex flex-col items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${item.badgeColor}`}
                  >
                    <div>{item.icon}</div>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-tight mt-0.5">
                      {item.step}
                    </span>
                  </div>
                </div>

                {/* Right Content Card */}
                <div
                  className={`flex-1 p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md ${item.cardBorder}`}
                >
                  <h3 className="font-bold text-base sm:text-lg text-zinc-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: Customer Trust & Order Growth Performance (June 2026 to Present Month) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-[#4F213B]" size={20} />
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                  Customer Trust & Order Growth
                </h2>
              </div>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                মাসিক অর্ডার সংখ্যা, গ্রাহক আস্থা ও সফল ডেলিভারির লাইভ পারফরম্যান্স ট্রেন্ড (জুন ২০২৬ – বর্তমান)।
              </p>
            </div>

            <span className="self-start sm:self-auto text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
              Live Trend: Jun – Oct 2026
            </span>
          </div>

          {/* Metric Legend Tabs (E-Commerce Focused) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Orders Delivered ({currentMonth.orders})</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Repeat Customers ({currentMonth.repeatRate})</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>On-Time Delivery Rate ({currentMonth.sla})</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Customer Rating ({currentMonth.rating})</span>
            </span>
          </div>

          {/* Interactive Multi-Line Graph Chart from Jun 2026 to Oct 2026 */}
          <div className="w-full relative pt-2">
            <div className="relative aspect-[16/8] max-h-[350px] w-full">
              <svg
                viewBox="0 0 800 370"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Horizontal Grid lines */}
                <line x1="70" y1="50" x2="720" y2="50" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="70" y1="120" x2="720" y2="120" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="70" y1="190" x2="720" y2="190" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="70" y1="260" x2="720" y2="260" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="70" y1="330" x2="720" y2="330" stroke="#E2E8F0" strokeWidth="1.5" />

                {/* Vertical Guidelines for each month column */}
                {monthlyData.map((m, idx) => (
                  <line
                    key={idx}
                    x1={m.x}
                    y1="40"
                    x2={m.x}
                    y2="330"
                    stroke={activeMonthIdx === idx ? "#4F213B" : "#F8FAFC"}
                    strokeWidth={activeMonthIdx === idx ? "1.5" : "1"}
                    strokeDasharray={activeMonthIdx === idx ? "3 3" : "2 2"}
                    className="transition-colors"
                  />
                ))}

                {/* Left Y-Axis labels (Scale 0 to 400) */}
                <text x="55" y="55" textAnchor="end" className="text-[11px] fill-zinc-400 font-sans">400</text>
                <text x="55" y="125" textAnchor="end" className="text-[11px] fill-zinc-400 font-sans">300</text>
                <text x="55" y="195" textAnchor="end" className="text-[11px] fill-zinc-400 font-sans">200</text>
                <text x="55" y="265" textAnchor="end" className="text-[11px] fill-zinc-400 font-sans">100</text>
                <text x="55" y="335" textAnchor="end" className="text-[11px] fill-zinc-400 font-sans">0</text>

                {/* Right Y-Axis labels (Percentage 0% to 100%) */}
                <text x="735" y="55" className="text-[11px] fill-zinc-400 font-sans">100%</text>
                <text x="735" y="125" className="text-[11px] fill-zinc-400 font-sans">75%</text>
                <text x="735" y="195" className="text-[11px] fill-zinc-400 font-sans">50%</text>
                <text x="735" y="265" className="text-[11px] fill-zinc-400 font-sans">25%</text>
                <text x="735" y="335" className="text-[11px] fill-zinc-400 font-sans">0%</text>

                {/* X-Axis Month Labels: Jun, Jul, Aug, Sep, Oct 2026 */}
                {monthlyData.map((m, idx) => (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onClick={() => setActiveMonthIdx(idx)}
                  >
                    <rect
                      x={m.x - 45}
                      y="336"
                      width="90"
                      height="26"
                      rx="6"
                      fill={activeMonthIdx === idx ? "#4F213B" : "transparent"}
                      className="transition-colors"
                    />
                    <text
                      x={m.x}
                      y="354"
                      textAnchor="middle"
                      className={`text-[12px] font-bold font-sans transition-colors ${
                        activeMonthIdx === idx ? "fill-white" : "fill-zinc-700"
                      }`}
                    >
                      {m.shortMonth}
                    </text>
                  </g>
                ))}

                {/* --- LINE 1: Blue - On-time Delivery Rate (99.1% to 99.8%) --- */}
                <path
                  d="M110 53 L250 52 L390 51 L530 50 L670 48"
                  stroke="#3B82F6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {monthlyData.map((m, idx) => (
                  <circle
                    key={`blue-${idx}`}
                    cx={m.x}
                    cy={m.slaY}
                    r={activeMonthIdx === idx ? "6.5" : "4.5"}
                    fill="#3B82F6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveMonthIdx(idx)}
                  />
                ))}

                {/* --- LINE 2: Purple - Customer Rating (4.80 to 4.96 ★) --- */}
                <path
                  d="M110 80 L250 72 L390 64 L530 58 L670 52"
                  stroke="#8B5CF6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {monthlyData.map((m, idx) => (
                  <circle
                    key={`purple-${idx}`}
                    cx={m.x}
                    cy={m.ratingY}
                    r={activeMonthIdx === idx ? "6.5" : "4.5"}
                    fill="#8B5CF6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveMonthIdx(idx)}
                  />
                ))}

                {/* --- LINE 3: Green - Monthly Orders Growth (June: 850+ -> Oct: 4,120+) --- */}
                <path
                  d="M110 275 L250 210 L390 155 L530 105 L670 60"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {monthlyData.map((m, idx) => (
                  <circle
                    key={`green-${idx}`}
                    cx={m.x}
                    cy={m.ordersY}
                    r={activeMonthIdx === idx ? "7" : "5"}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveMonthIdx(idx)}
                  />
                ))}

                {/* --- LINE 4: Amber - Repeat Modest Buyers (35% -> 84%) --- */}
                <path
                  d="M110 305 L250 275 L390 240 L530 205 L670 165"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {monthlyData.map((m, idx) => (
                  <circle
                    key={`amber-${idx}`}
                    cx={m.x}
                    cy={m.repeatY}
                    r={activeMonthIdx === idx ? "6.5" : "4.5"}
                    fill="#F59E0B"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveMonthIdx(idx)}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Active Month Live Inspector Banner */}
          <div className="bg-[#FAF7F5] rounded-2xl p-4 sm:p-5 border border-[#4F213B]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#4F213B] animate-pulse" />
              <div>
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  Selected Month Summary
                </span>
                <h4 className="text-base sm:text-lg font-bold text-zinc-900">
                  {currentMonth.month} E-Commerce Performance
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center w-full sm:w-auto">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">Orders Fulfilled</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600">{currentMonth.orders}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">Repeat Buyers</span>
                <span className="text-xs sm:text-sm font-bold text-amber-600">{currentMonth.repeatRate}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">On-Time Delivery</span>
                <span className="text-xs sm:text-sm font-bold text-blue-600">{currentMonth.sla}</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">Customer Rating</span>
                <span className="text-xs sm:text-sm font-bold text-purple-600">{currentMonth.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Call To Action Banner (Fashion E-Commerce Shopping & Sizing) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4F213B] to-[#361427] text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-xs uppercase tracking-widest text-amber-300 font-bold">
              PREMIUM MODEST ELEGANCE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
              Ready to Find Your Perfect Abaya & Burqa?
            </h2>
            <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
              Explore our curated collection of luxury abayas, everyday burqas, and premium hijabs. 100% Cash on Delivery nationwide with open-box inspection and 7-day easy exchange.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/shop"
              className="bg-white hover:bg-zinc-100 text-[#4F213B] font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-sm shadow-md transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer"
            >
              <FiShoppingBag size={17} />
              <span>Explore Collection</span>
            </Link>

            <Link
              href="/size-guide"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-sm transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer"
            >
              <span>Size Guide</span>
            </Link>

            <a
              href="https://wa.me/8801793679254?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20Borka%20Shop%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#008a3e] hover:bg-[#007a37] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-sm shadow-md transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer"
            >
              <FaWhatsapp size={18} />
              <span>WhatsApp: 01793679254</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
