"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SLIDES = [
  {
    id: 1,
    image: "https://borkashop.borbila.net/wp-content/uploads/2026/08/ChatGPT-Image-Aug-21-2026-03_49_56-AM-1.png",
    title: "Borka Shop Eid Collection 2026",
    link: "#eid-section",
  },
  {
    id: 2,
    image: "https://borkashop.borbila.net/wp-content/uploads/2026/08/ChatGPT-Image-Aug-21-2026-03_49_57-AM-2.png",
    title: "Exclusive Abaya & Burqa Collection",
    link: "#abaya-section",
  },
  {
    id: 3,
    image: "https://borkashop.borbila.net/wp-content/uploads/2026/08/ChatGPT-Image-Aug-21-2026-03_49_57-AM-3.png",
    title: "Medina Silk Hijabs & Khimars",
    link: "#hijab-section",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5 pb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full rounded-md sm:rounded-lg overflow-hidden aspect-[1916/821] shadow-sm bg-zinc-100">
        {SLIDES.map((slide, index) => (
          <a
            key={slide.id}
            href={slide.link}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={index === 0}
              className="object-cover object-center"
            />
          </a>
        ))}

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prev();
          }}
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#4F213B] text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100"
          aria-label="Previous Slide"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            next();
          }}
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#4F213B] text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100"
          aria-label="Next Slide"
        >
          <FiChevronRight size={20} />
        </button>

        {/* Dots Pagination */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setCurrent(i);
              }}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-6 h-2 bg-[#4F213B]" : "w-2 h-2 bg-white/70 hover:bg-white"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
