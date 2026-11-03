"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiTruck,
  FiCheckCircle,
  FiShoppingBag,
  FiShield,
  FiClock,
  FiStar,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { useShop } from "@/context/ShopContext";

export default function LoginClient() {
  const router = useRouter();
  const { setRole } = useShop();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
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
        setRole("admin", true);
        toast.success(
          `Welcome Administrator ${data?.user?.name || ""}! Redirecting to Dashboard...`,
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
        setRole("user", true);
        toast.success(
          `Welcome back, ${data?.user?.name || "Customer"}! Logged in successfully.`,
          {
            icon: "✨",
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
      console.error("Login error:", err);
      toast.error(
        "Could not connect to authentication server. Please ensure Backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast("Google OAuth login will be available once Google Client ID is configured.", {
      icon: "ℹ️",
    });
  };

  return (
    <div className="w-full bg-[#FAF9F8] min-h-[92vh] pb-16">
      {/* 1. Header Banner matching luxury Borbila theme */}
      <section className="w-full bg-[#EDEDED] py-7 sm:py-9 flex flex-col items-center justify-center border-b border-zinc-200/80 px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight text-center">
          My Account
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 mt-1.5 font-medium">
          <Link href="/" className="hover:text-[#4F213B] transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-[#4F213B]">Sign In</span>
        </div>
      </section>

      {/* 2. Spacious Luxury 2-Column Auth Card Container */}
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Brand Showcase & Member Privileges (Desktop & Tablet) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#4F213B] via-[#3E172C] to-[#270D1B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle luxury ambient pattern overlay */}
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
                    Luxury Modest Fashion
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
                  Elegance in Every Stitch.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  Sign in to your member account to effortlessly manage your modest wardrobe, track real-time dispatches, and enjoy personalized styling.
                </p>
              </div>

              {/* Privilege Highlights */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                    <FiTruck size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Express Nationwide Delivery
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Quick dispatch across Dhaka (24-48 hrs) and all districts in Bangladesh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                    <FiShield size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      100% Cash on Delivery
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Inspect your abaya and burqa fabric quality at your doorstep before payment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                    <FiStar size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      Original Dubai Nida & Silk
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-normal">
                      Authentic imported fabrics crafted with maximum modesty and premium breathability.
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
                  <span>Buying without an account?</span>
                </p>
                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  Guests can place 1-click Cash on Delivery orders directly without registering.
                </p>
                <Link
                  href="/shop"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                >
                  <span>Continue as Guest</span>
                  <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Spacious Login Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 bg-white flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              
              {/* Form Heading */}
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
                  Please enter your account email and password to sign in.
                </p>
              </div>

              {/* Social Login Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 transition-all text-xs sm:text-sm font-semibold text-zinc-700 shadow-2xs cursor-pointer group"
              >
                <FcGoogle size={20} className="group-hover:scale-105 transition-transform" />
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="flex-1 border-t border-zinc-200" />
                <span className="flex-shrink-0 bg-white px-4 text-[11px] text-zinc-400 font-bold uppercase tracking-wider whitespace-nowrap">
                  Or Sign In With Email
                </span>
                <div className="flex-1 border-t border-zinc-200" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-zinc-700 mb-1.5"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
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

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-zinc-700"
                    >
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toast("Password reset link will be sent once SMTP is configured.", {
                          icon: "🔑",
                        })
                      }
                      className="text-[11px] text-[#4F213B] font-semibold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <FiLock size={17} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-zinc-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-[#4F213B] focus:ring-[#4F213B] cursor-pointer"
                    />
                    <span className="font-medium text-xs">Remember me on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#4F213B] hover:bg-[#3D182D] text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In to Account</span>
                  )}
                </button>
              </form>

              {/* Bottom Toggle Link */}
              <div className="text-center pt-6 border-t border-zinc-100 mt-8">
                <p className="text-xs sm:text-sm text-zinc-600">
                  Don&apos;t have an account yet?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-[#4F213B] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Create an account</span>
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

