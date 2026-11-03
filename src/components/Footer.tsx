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
} from "react-icons/fi";
import {
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const { setIsTrackOrderOpen, shippingSettings } = useShop();
  const pathname = usePathname();

  const phone = shippingSettings?.helplinePhone || "01810 559 258";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const waPhone = cleanPhone.startsWith("88") ? cleanPhone : `88${cleanPhone}`;
  const email = shippingSettings?.helplineEmail || "support@burkashop.com";

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
                      href={`tel:${cleanPhone}`}
                      className="font-bold text-sm sm:text-base text-zinc-950 hover:text-[#4B2438] transition-colors"
                    >
                      {phone}
                    </a>
                    <p className="text-xs text-zinc-600 mt-0.5">Phone & WhatsApp (9:00 AM – 11:00 PM)</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <FiMail className="text-black flex-shrink-0" size={18} />
                  <a
                    href={`mailto:${email}`}
                    className="text-xs sm:text-[13.5px] text-zinc-900 hover:text-[#4B2438] transition-colors"
                  >
                    {email}
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

                {/* Social & Contact Circular Colored Icons */}
                <div className="flex items-center gap-2.5">
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/bengalitbd?_rdc=1&_rdr#"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <FaFacebookF size={13} />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${email}`}
                    className="w-8 h-8 rounded-full bg-[#EA4335] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label="Email"
                    title={`Email: ${email}`}
                  >
                    <FaEnvelope size={13} />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                    aria-label="WhatsApp"
                    title={`WhatsApp: +${waPhone}`}
                  >
                    <FaWhatsapp size={16} />
                  </a>
                </div>
              </div>

              {/* We Accept: bKash, Nagad, COD (Single Line) */}
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

                  {/* COD (Cash on Delivery) */}
                  <div
                    className="bg-white border border-zinc-200 rounded-md px-1.5 sm:px-2 py-1 shadow-xs hover:border-[#4F213B]/50 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                    title="Cash on Delivery (COD)"
                  >
                    <div className="w-4.5 sm:w-5 h-4.5 sm:h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] sm:text-[11px] shrink-0 shadow-2xs">
                      ৳
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="font-extrabold text-[11px] sm:text-[12px] text-zinc-900 tracking-tight">
                        COD
                      </span>
                      <span className="text-[7px] sm:text-[7.5px] text-zinc-500 font-semibold tracking-tighter">
                        Cash On Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Burgundy Bar */}
        <div className="bg-[#4B2438] text-white py-3.5 sm:py-4 border-t border-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-row items-center justify-between gap-2 text-[11px] sm:text-[13px] whitespace-nowrap">
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
    </>
  );
}
