"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiStar,
  FiShoppingBag,
  FiGift,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";
import { useShop } from "@/context/ShopContext";

export default function RegisterClient() {
  const router = useRouter();
  const { setRole } = useShop();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("borkashop_role");
      if (savedRole === "admin") {
        router.replace("/admin");
      }
    } catch {
      // ignore
    }
  }, [router]);

  // Email validation check
  const isEmailValid = useMemo(() => {
    if (!email) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim() || !isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please re-check.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      // Check role: if role is admin or email matches admin -> immediate admin dashboard redirect
      const userRole = (data?.user as any)?.role;
      const normalizedEmail = email.trim().toLowerCase();
      const isAdmin =
        userRole === "admin" ||
        normalizedEmail === "admin12@gmail.com" ||
        normalizedEmail.startsWith("admin");

      if (isAdmin) {
        setRole("admin", true);
        try {
          localStorage.setItem("borkashop_role", "admin");
          if (data?.user) {
            localStorage.setItem(
              "borkashop_user",
              JSON.stringify({ ...data.user, role: "admin" })
            );
          }
        } catch {
          // ignore
        }
        toast.success(
          `Admin Account created successfully! Welcome ${data?.user?.name || name.trim()}! Redirecting to Dashboard...`,
          {
            icon: "👑",
            style: {
              borderRadius: "10px",
              background: "#1E293B",
              color: "#fff",
              fontSize: "14px",
            },
          }
        );
        router.push("/admin");
      } else {
        setRole("user", true);
        try {
          localStorage.setItem("borkashop_role", "user");
          if (data?.user) {
            localStorage.setItem(
              "borkashop_user",
              JSON.stringify({ ...data.user, role: "user" })
            );
          }
        } catch {
          // ignore
        }
        toast.success(
          `Account created successfully! Welcome to Borka Shop, ${data?.user?.name || name.trim()}!`,
          {
            icon: "🎉",
            style: {
              borderRadius: "10px",
              background: "#4F213B",
              color: "#fff",
              fontSize: "14px",
            },
          }
        );
        router.push("/");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
        "Could not connect to authentication server. Please ensure Backend is running on port 5000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast("Google OAuth sign up will be available once Google Client ID is configured.", {
      icon: "ℹ️",
    });
  };

  return (
    <div className="w-full bg-[#FAF9F8] min-h-[92vh] pb-16">
      {/* 1. Header Banner matching luxury Borbila theme */}
      <section className="w-full bg-[#EDEDED] py-7 sm:py-9 flex flex-col items-center justify-center border-b border-zinc-200/80 px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight text-center">
          Create Customer Account
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 mt-1.5 font-medium">
          <Link href="/" className="hover:text-[#4F213B] transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-[#4F213B]">Register</span>
        </div>
      </section>

      {/* 2. Spacious Luxury 2-Column Auth Card Container */}
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Brand Showcase & Member Benefits */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#4F213B] via-[#3E172C] to-[#270D1B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient pattern overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FAF9F8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-serif font-black text-2xl shadow-inner">
                  B
                </div>
                <div>
                  <span className="text-lg font-black tracking-wider uppercase text-white block">
                    BORKA SHOP
                  </span>
                  <span className="text-[11px] text-amber-200/90 font-medium tracking-widest uppercase">
                    Member Privileges
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
                  Join the Borka Shop Club.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  Register in seconds to unlock express repeat checkouts, live delivery notifications, and exclusive member discounts.
                </p>
              </div>

              {/* Privilege Highlights */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                    <FiGift size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Exclusive Eid & Seasonal Drops
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Get early notifications before premium Dubai Nida and Medina silk abayas sell out.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                    <FiTruck size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Instant Parcel Tracking
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Receive live updates on your phone from parcel packaging to final doorstep handover.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                    <FiShield size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Saved Addresses & Express Orders
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Re-order in 1-click without typing your delivery details again.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Guest Checkout Callout */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FiShoppingBag className="text-amber-300" />
                  <span>Prefer shopping as Guest?</span>
                </p>
                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  Registration is 100% optional. You can buy directly with Cash on Delivery anytime!
                </p>
                <Link
                  href="/shop"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                >
                  <span>Browse Catalog</span>
                  <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Spacious Registration Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 bg-white flex flex-col justify-center">
            <div className="w-full">
              
              {/* Form Heading */}
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
                  Please fill in your basic information to get started.
                </p>
              </div>

              {/* Social Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 transition-all text-xs sm:text-sm font-semibold text-zinc-700 shadow-2xs cursor-pointer group"
              >
                <FcGoogle size={20} className="group-hover:scale-105 transition-transform" />
                <span>Sign up with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="flex-1 border-t border-zinc-200" />
                <span className="flex-shrink-0 bg-white px-4 text-[11px] text-zinc-400 font-bold uppercase tracking-wider whitespace-nowrap">
                  Or Register With Email
                </span>
                <div className="flex-1 border-t border-zinc-200" />
              </div>

              {/* Registration Form with 2-Column Responsive Grid */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold text-zinc-700 mb-1.5"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <FiUser size={17} />
                      </span>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ayesha Rahman"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-2 focus:ring-[#4F213B]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-zinc-700 mb-1.5"
                    >
                      Phone Number <span className="text-zinc-400 text-[10px] font-normal">(for delivery)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <FiPhone size={17} />
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-2 focus:ring-[#4F213B]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address (Full Width) */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-zinc-700"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      {email && (
                        <span className="text-[11px] font-medium flex items-center gap-0.5">
                          {isEmailValid ? (
                            <span className="text-emerald-600 flex items-center gap-0.5 font-semibold">
                              <FiCheck size={13} className="stroke-[3]" /> Valid email
                            </span>
                          ) : (
                            <span className="text-rose-500">Invalid email format</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <FiMail size={17} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-2 focus:ring-[#4F213B]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-zinc-700 mb-1.5"
                    >
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <FiLock size={17} />
                      </span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-2 focus:ring-[#4F213B]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-zinc-700 mb-1.5"
                    >
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <FiLock size={17} />
                      </span>
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-2 focus:ring-[#4F213B]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="sm:col-span-2 pt-1 flex items-start gap-2.5">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-[#4F213B] focus:ring-[#4F213B] mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-zinc-600 cursor-pointer select-none">
                      I agree to the{" "}
                      <Link href="/faq" className="text-[#4F213B] font-bold hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and Privacy Policy.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#4F213B] hover:bg-[#3D182D] text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <span>Create My Account</span>
                      )}
                    </button>
                  </div>

                </div>
              </form>

              {/* Bottom Toggle Link */}
              <div className="text-center pt-6 border-t border-zinc-100 mt-8">
                <p className="text-xs sm:text-sm text-zinc-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[#4F213B] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Sign in here</span>
                    <FiArrowRight size={13} />
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

