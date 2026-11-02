"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import {
  FiPhone,
  FiMail,
  FiChevronRight,
  FiHome,
  FiShoppingBag,
  FiUser,
  FiGrid,
  FiShoppingCart,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const { cartCount, setIsCartOpen, setIsTrackOrderOpen } = useShop();
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <footer className="bg-[#F8F4EF] border-t border-[#DFDFDF] text-zinc-700">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Column 1: Brand & Contact */}
            <div className="space-y-4 lg:border-r lg:border-black/10 lg:pr-8">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-black tracking-tight text-[#4B2438] uppercase">
                  BORKASHOP
                </span>
              </Link>

              <p className="text-xs sm:text-[13.5px] text-zinc-700 leading-relaxed">
                Burka Shop brings you elegant, comfortable and premium modest fashion designed for everyday confidence and timeless style.
              </p>

              <div className="space-y-3 pt-2">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <FiPhone className="text-black mt-1 flex-shrink-0" size={18} />
                  <div>
                    <a
                      href="tel:01793679254"
                      className="font-bold text-sm sm:text-base text-zinc-950 hover:text-[#4B2438] transition-colors"
                    >
                      01793 679 254
                    </a>
                    <p className="text-xs text-zinc-600 mt-0.5">Phone & WhatsApp (9:00 AM – 11:00 PM)</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <FiMail className="text-black flex-shrink-0" size={18} />
                  <a
                    href="mailto:support@burkashop.com"
                    className="text-xs sm:text-[13.5px] text-zinc-900 hover:text-[#4B2438] transition-colors"
                  >
                    support@burkashop.com
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Customer Service */}
            <div>
              <h3 className="font-bold text-black text-lg sm:text-xl">
                Customer Service
              </h3>
              <div className="w-14 h-[2px] bg-black mt-1.5 mb-5"></div>
              <ul className="space-y-3 text-xs sm:text-[13.5px] text-zinc-800">
                <li>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group"
                  >
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsTrackOrderOpen(true)}
                    className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group"
                  >
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>Track Order</span>
                  </button>
                </li>
                <li>
                  <a href="/faq" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>Return & Exchange</span>
                  </a>
                </li>
                <li>
                  <Link href="/faq" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>Shipping Information</span>
                  </Link>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Useful Links */}
            <div>
              <h3 className="font-bold text-black text-lg sm:text-xl">
                Useful Links
              </h3>
              <div className="w-14 h-[2px] bg-black mt-1.5 mb-5"></div>
              <ul className="space-y-3 text-xs sm:text-[13.5px] text-zinc-800">
                <li>
                  <Link href="/shop" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>All Products</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>Blogs</span>
                  </a>
                </li>
                <li>
                  <Link href="/faq" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>FAQ</span>
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="flex items-center gap-2 hover:text-[#4B2438] transition-colors group">
                    <FiChevronRight size={14} className="text-black group-hover:text-[#4B2438] stroke-[3]" />
                    <span>Size Guide</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Follow Us & We Accept */}
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-black text-lg sm:text-xl">
                  Follow Us
                </h3>
                <p className="text-xs sm:text-[13.5px] text-zinc-600 mt-0.5 mb-3">
                  Stay connected with us
                </p>

                {/* Social Media Circular Colored Icons */}
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#3B5998] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label="Facebook"
                  >
                    <FaFacebookF size={13} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label="X Twitter"
                  >
                    <FaXTwitter size={13} />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#CD201F] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label="YouTube"
                  >
                    <FaYoutube size={14} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#262626] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={14} />
                  </a>
                </div>
              </div>

              {/* We Accept: bKash, Nagad, Rocket (Single Line) */}
              <div className="pt-1">
                <h4 className="font-semibold text-black text-xs sm:text-[13.5px] mb-2">
                  We Accept
                </h4>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
                  {/* bKash */}
                  <div
                    className="bg-white border border-zinc-200 rounded-md px-1.5 sm:px-2 py-1 shadow-xs hover:border-[#D82264]/50 transition-colors flex items-center justify-center shrink-0"
                    title="bKash"
                  >
                    <Image
                      src="/bkash.svg"
                      alt="bKash"
                      width={68}
                      height={22}
                      className="h-4.5 sm:h-5 w-auto object-contain"
                    />
                  </div>

                  {/* Nagad */}
                  <div
                    className="bg-white border border-zinc-200 rounded-md px-1.5 sm:px-2 py-1 shadow-xs hover:border-[#F7941D]/50 transition-colors flex items-center justify-center shrink-0"
                    title="Nagad"
                  >
                    <Image
                      src="/nagad.svg"
                      alt="Nagad"
                      width={68}
                      height={22}
                      className="h-4.5 sm:h-5 w-auto object-contain"
                    />
                  </div>

                  {/* Rocket */}
                  <div
                    className="bg-white border border-zinc-200 rounded-md px-1.5 sm:px-2 py-1 shadow-xs hover:border-[#8C3494]/50 transition-colors flex items-center justify-center shrink-0"
                    title="Rocket"
                  >
                    <Image
                      src="/rocket.svg"
                      alt="Rocket"
                      width={68}
                      height={22}
                      className="h-4.5 sm:h-5 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Burgundy Bar */}
        <div className="bg-[#4B2438] text-white py-3.5 sm:py-4 pb-20 sm:pb-4 border-t border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-[13px]">
            <p className="text-white/95 font-medium">© 2026 BurkaShop</p>
            <p className="text-white/80">
              Design by{" "}
              <a
                href="https://bengalit.com.bd/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white hover:underline transition-all"
              >
                Bengal-IT
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Bar (Exact Elementor icon box floating navigation on borkashop.borbila.net) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around text-center">
        {/* 1. Menu */}
        <a
          href="#categories"
          className="flex flex-col items-center justify-center text-zinc-700 hover:text-[#4F213B] p-1 flex-1"
        >
          <FiGrid size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Menu</span>
        </a>

        {/* 2. Shop */}
        <Link
          href="/shop"
          className="flex flex-col items-center justify-center text-zinc-700 hover:text-[#4F213B] p-1 flex-1"
        >
          <FiShoppingBag size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Shop</span>
        </Link>

        {/* 3. Home (Circular Raised Button) */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center -mt-4 bg-[#4F213B] text-white w-12 h-12 rounded-full shadow-lg border-2 border-white flex-shrink-0"
          aria-label="Home"
        >
          <FiHome size={20} />
        </Link>

        {/* 4. Cart with badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center text-zinc-700 hover:text-[#4F213B] p-1 flex-1 relative"
        >
          <div className="relative">
            <FiShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#4F213B] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Cart</span>
        </button>

        {/* 5. Account */}
        <Link
          href="/login"
          className="flex flex-col items-center justify-center text-zinc-700 hover:text-[#4F213B] p-1 flex-1"
        >
          <FiUser size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Account</span>
        </Link>
      </div>
    </>
  );
}
