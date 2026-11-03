"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import {
  FiX,
  FiMail,
  FiLock,
  FiUser,
  FiShield,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setRole } = useShop();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please fill in email and password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "signin") {
        const { data, error } = await signIn.email({
          email: email.trim(),
          password,
        });

        if (error) {
          toast.error(error.message || "Invalid email or password.");
          setIsLoading(false);
          return;
        }

        setRole("user");
        toast.success(`Welcome back, ${data?.user?.name || "Customer"}!`, {
          icon: "✨",
        });
        setIsAuthModalOpen(false);
      } else {
        const { data, error } = await signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0],
        });

        if (error) {
          toast.error(error.message || "Failed to create account.");
          setIsLoading(false);
          return;
        }

        setRole("user");
        toast.success(
          `Account created successfully! Welcome, ${data?.user?.name || "Customer"}!`,
          { icon: "🎉" }
        );
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Graceful fallback notice if backend server is not running
      toast.error(
        "Could not connect to auth server. Please ensure Backend is running on port 5000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    setRole("guest");
    toast("Continuing as Guest! You can place direct orders anytime.", {
      icon: "👤",
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => !isLoading && setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#4F213B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C89B59] text-[#24101E] flex items-center justify-center font-bold text-sm">
              B
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                {mode === "signin"
                  ? "Account Sign In"
                  : "Create Customer Account"}
              </h3>
              <p className="text-[11px] text-amber-200">
                Secured by Better Auth & MongoDB
              </p>
            </div>
          </div>
          <button
            onClick={() => !isLoading && setIsAuthModalOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Guest User Highlight Banner */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5">
            <FiShield className="text-amber-700 text-lg flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="text-xs font-bold text-amber-900">
                Want to buy without an account?
              </h5>
              <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                Guests can click &quot;Order Now&quot; on any product for instant
                1-click Cash on Delivery with no sign-up!
              </p>
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="mt-2 text-xs font-bold text-[#4F213B] underline flex items-center gap-1 hover:text-black cursor-pointer"
              >
                <span>Continue as Guest User</span>
                <FiArrowRight />
              </button>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3 text-zinc-400 text-sm" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesha Rahman"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#4F213B]/20 focus:border-[#4F213B] text-sm text-zinc-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3 text-zinc-400 text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#4F213B]/20 focus:border-[#4F213B] text-sm text-zinc-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3 text-zinc-400 text-sm" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#4F213B]/20 focus:border-[#4F213B] text-sm text-zinc-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4F213B] hover:bg-[#3B152B] disabled:opacity-60 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-[#4F213B]/20 transition-all mt-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin text-sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {mode === "signin"
                    ? "Sign In to Account"
                    : "Create New Account"}
                </span>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center pt-2">
            {mode === "signin" ? (
              <p className="text-xs text-zinc-500">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-bold text-[#4F213B] hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-500">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-bold text-[#4F213B] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
