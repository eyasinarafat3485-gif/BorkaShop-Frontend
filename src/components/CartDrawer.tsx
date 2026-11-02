"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import {
  FiX,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
} from "react-icons/fi";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    openQuickOrder,
  } = useShop();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2000;
  const progressPercent = Math.min(
    100,
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartTotal
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="bg-[#4F213B] text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiShoppingBag size={20} className="text-[#C89B59]" />
              <h3 className="font-serif font-bold text-lg">
                Shopping Cart ({cartCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Close Cart"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FAF5F8] p-3.5 border-b border-zinc-200 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-800 mb-1.5">
              <FiTruck className="text-[#4F213B]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#4F213B]">৳{remainingForFreeShipping.toLocaleString()}</strong> more to enjoy FREE delivery!
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">
                  🎉 Congratulations! You have unlocked FREE Delivery!
                </span>
              )}
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4F213B] to-[#C89B59] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF5F8] text-[#4F213B] flex items-center justify-center mx-auto text-2xl">
                  <FiShoppingBag />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-zinc-800">
                    Your cart is currently empty
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Explore our Eid Collection & luxury Abayas to find your fit.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#4F213B] hover:bg-[#3B152B] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-zinc-200/80 bg-[#FAF9F7] relative group"
                >
                  <div className="relative w-18 h-24 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-sm text-zinc-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Size: <strong className="text-zinc-700">{item.size}</strong> | Color:{" "}
                        <strong className="text-zinc-700">{item.color}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60">
                      <div className="flex items-center border border-zinc-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100"
                        >
                          <FiMinus size={11} />
                        </button>
                        <span className="px-2 font-bold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100"
                        >
                          <FiPlus size={11} />
                        </button>
                      </div>

                      <span className="font-sans font-extrabold text-sm text-[#4F213B]">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 font-medium">Subtotal</span>
                <span className="font-sans text-xl font-extrabold text-[#4F213B]">
                  ৳{cartTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Delivery charge and taxes calculated at checkout.
              </p>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#4F213B] hover:bg-[#3B152B] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg shadow-[#4F213B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
