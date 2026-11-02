"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const TOP_5_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "ডেলিভারি হতে কত দিন সময় লাগে? (How long does delivery take?)",
    answer:
      "ঢাকা সিটির ভেতরে সাধারণত ১–৩ কার্যদিবস এবং ঢাকার বাইরে সারাদেশে ৩–৫ কার্যদিবস সময় লাগে। ২,০০০ টাকার বেশি যেকোনো অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!",
  },
  {
    id: "faq-2",
    question: "ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা আছে কি?",
    answer:
      "হ্যাঁ! সারাদেশে সম্পূর্ণ ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। ডেলিভারিম্যানের সামনে পার্সেল চেক করে মূল্য পরিশোধ করার সুযোগ রয়েছে।",
  },
  {
    id: "faq-3",
    question: "সাইজ না মিললে কি এক্সচেঞ্জ করা যাবে? (Can I exchange if size does not fit?)",
    answer:
      "হ্যাঁ। ডেলিভারি পাওয়ার ৩ দিনের মধ্যে আপনি সহজেই সাইজ বা ডিজাইন এক্সচেঞ্জ করতে পারবেন। পণ্যটি অব্যবহৃত এবং মূল ট্যাগযুক্ত অবস্থায় থাকতে হবে।",
  },
  {
    id: "faq-4",
    question: "সঠিক সাইজ কীভাবে নির্বাচন করব? (How can I choose the correct size?)",
    answer:
      "অর্ডার করার পূর্বে আমাদের ওয়েবসাইটের 'Size Guide' চার্টটি দেখে নিন। এছাড়া সঠিক সাইজ নিশ্চিত করতে সরাসরি আমাদের WhatsApp নম্বরে (01793679254) আপনার উচ্চতা জানালে আমরা পারফেক্ট সাইজ সাজেস্ট করব।",
  },
  {
    id: "faq-5",
    question: "আমার অর্ডার কীভাবে ট্র্যাক করব? (How can I track my order?)",
    answer:
      "পার্সেল পাঠানোর সাথে সাথে আপনি ট্র্যাকিং আপডেট পাবেন। এছাড়া ওয়েবসাইটের 'Track Order' অপশনে আপনার অর্ডার আইডি দিয়েও লাইভ স্ট্যাটাস দেখতে পারবেন।",
  },
];

export default function FaqClient() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-white min-h-screen pb-16">
      {/* 1. Top Header Banner (Exact match to live site: light gray bar with bold centered 'FAQS') */}
      <section className="w-full bg-[#EDEDED] py-8 sm:py-10 flex items-center justify-center border-b border-zinc-200/80">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight text-center uppercase">
          FAQS
        </h1>
      </section>

      {/* 2. Top 5 Most Important FAQ Accordions (Clean, without search or category filters) */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="divide-y divide-zinc-200 border-y border-zinc-200">
          {TOP_5_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-4 sm:py-5 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-sm sm:text-base font-semibold transition-colors ${
                      isOpen
                        ? "text-[#4F213B]"
                        : "text-zinc-900 group-hover:text-[#4F213B]"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isOpen
                        ? "bg-[#4F213B] text-white border-[#4F213B]"
                        : "bg-zinc-100 text-zinc-600 border-zinc-200 group-hover:border-zinc-400"
                    }`}
                  >
                    {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8 text-xs sm:text-sm text-zinc-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Subtle Clean WhatsApp Help Link */}
        <div className="mt-10 pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs sm:text-sm text-zinc-500 mb-3">
            অন্য কোনো প্রশ্ন আছে বা আরও জানতে চান?
          </p>
          <a
            href="https://wa.me/8801793679254"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#008a3e] hover:bg-[#007a37] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer shadow-sm"
          >
            <FaWhatsapp size={16} />
            <span>WhatsApp-এ সরাসরি যোগাযোগ করুন: 01793679254</span>
          </a>
        </div>
      </main>
    </div>
  );
}
