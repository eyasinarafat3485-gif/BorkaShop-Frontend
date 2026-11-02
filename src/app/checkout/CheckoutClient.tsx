"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import { PRODUCTS } from "@/data/products";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiCheckCircle,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CheckoutClient() {
  const { cart, removeFromCart, updateQuantity, clearCart, placeOrder, addToCart, syncCheckoutInfo } = useShop();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"dhaka" | "outside_dhaka">("outside_dhaka");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{
    id: string;
    customerName: string;
    total: number;
    phone: string;
  } | null>(null);

  // Sync draft checkout info to 'my-collection' in real-time
  useEffect(() => {
    if (fullName || phoneNumber || fullAddress) {
      const timer = setTimeout(() => {
        syncCheckoutInfo({
          fullName,
          phone: phoneNumber,
          address: fullAddress,
          deliveryArea,
          couponCode,
          appliedDiscount,
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fullName, phoneNumber, fullAddress, deliveryArea, couponCode, appliedDiscount]);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharge = deliveryArea === "dhaka" ? 100 : 150;
  const grandTotal = Math.max(0, subtotal - appliedDiscount + deliveryCharge);

  // Handle coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.error("অনুগ্রহ করে একটি কুপন কোড লিখুন");
      return;
    }

    if (code === "BORKA10" || code === "SAVE10") {
      const discountVal = Math.round(subtotal * 0.1);
      setAppliedDiscount(discountVal);
      toast.success(`Coupon "${code}" applied! 10% discount added. (৳${discountVal})`);
    } else if (code === "EID50") {
      setAppliedDiscount(150);
      toast.success(`Coupon "${code}" applied! ৳150 off.`);
    } else {
      toast.error("Invalid coupon code. Try 'BORKA10'");
    }
  };

  // Handle Order Submit
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("অনুগ্রহ করে আপনার পুরো নাম লিখুন (Full Name is required)");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 11) {
      toast.error("অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন (Valid 11-digit Phone is required)");
      return;
    }
    if (!fullAddress.trim()) {
      toast.error("অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা লিখুন (Full Address is required)");
      return;
    }
    if (cart.length === 0) {
      toast.error("আপনার কার্ট খালি! অনুগ্রহ করে প্রোডাক্ট সিলেক্ট করুন");
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = placeOrder({
        customerName: fullName.trim(),
        phone: phoneNumber.trim(),
        address: fullAddress.trim(),
        deliveryZone: deliveryArea,
        deliveryFee: deliveryCharge,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        total: grandTotal,
        paymentMethod: "cod",
        role: "guest",
      });

      clearCart();
      setOrderPlaced({
        id: newOrder.id,
        customerName: newOrder.customerName,
        total: newOrder.total,
        phone: newOrder.phone,
      });

      toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!", {
        duration: 4000,
        style: {
          background: "#4F213B",
          color: "#fff",
        },
      });
    } catch {
      toast.error("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully placed, render Order Success View
  if (orderPlaced) {
    return (
      <div className="w-full bg-[#FAF9F8] min-h-screen py-12 sm:py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-zinc-200 p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <FiCheckCircle size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              ধন্যবাদ, {orderPlaced.customerName}!
            </h1>
            <p className="text-sm text-zinc-600">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে।
            </p>
          </div>

          <div className="bg-zinc-50 rounded-xl p-4 sm:p-5 border border-zinc-200 text-left space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-medium">Order ID:</span>
              <span className="font-bold text-[#4F213B] font-mono">{orderPlaced.id}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-medium">Phone Number:</span>
              <span className="font-semibold text-zinc-800">{orderPlaced.phone}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-medium">Payment Method:</span>
              <span className="font-semibold text-zinc-800">Cash on Delivery</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-zinc-700 font-bold">Total Amount to Pay:</span>
              <span className="font-extrabold text-base text-[#4F213B]">
                {orderPlaced.total.toLocaleString()}৳
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/8801793679254?text=${encodeURIComponent(
                `আসসালামু আলাইকুম! আমি বোরকা শপ থেকে অর্ডার করেছি। অর্ডার আইডি: ${orderPlaced.id}, মোট টাকা: ${orderPlaced.total}৳। অর্ডার কনফার্ম করতে সহায়তা চাচ্ছি।`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#008a3e] hover:bg-[#007a37] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <FaWhatsapp size={18} />
              <span>WhatsApp-এ অর্ডার কনফার্ম করুন (01793679254)</span>
            </a>

            <Link
              href="/shop"
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FiShoppingBag size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen py-8 sm:py-12 md:py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT COLUMN: CUSTOMER FORM ================= */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
            {/* Top Prompt Banner */}
            <div className="p-4 sm:p-5 border-b border-zinc-200/80">
              <p className="text-xs sm:text-[13px] font-bold text-zinc-900 leading-snug">
                Complete your order by filling in the details and clicking the order button.
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-900 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-lg border border-zinc-300 focus-within:border-[#4F213B] focus-within:ring-1 focus-within:ring-[#4F213B] bg-white transition-all">
                  <span className="pl-3.5 pr-1 text-zinc-400">
                    <FiUser size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full py-2.5 px-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-900 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-lg border border-zinc-300 focus-within:border-[#4F213B] focus-within:ring-1 focus-within:ring-[#4F213B] bg-white transition-all">
                  <span className="pl-3.5 pr-1 text-zinc-400">
                    <FiPhone size={16} />
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="w-full py-2.5 px-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-900 mb-1.5">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center rounded-lg border border-zinc-300 focus-within:border-[#4F213B] focus-within:ring-1 focus-within:ring-[#4F213B] bg-white transition-all">
                  <span className="pl-3.5 pr-1 text-zinc-400">
                    <FiMapPin size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Enter your full address"
                    className="w-full py-2.5 px-2.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Select Delivery Area */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-zinc-900 mb-2">
                  Select Delivery Area <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Inside Dhaka */}
                  <label
                    onClick={() => setDeliveryArea("dhaka")}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      deliveryArea === "dhaka"
                        ? "border-[#4F213B] border-2 bg-white ring-1 ring-[#4F213B]/20"
                        : "border-zinc-300 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="delivery_zone"
                        checked={deliveryArea === "dhaka"}
                        onChange={() => setDeliveryArea("dhaka")}
                        className="accent-[#4F213B] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-bold text-zinc-900">Inside Dhaka</span>
                    </div>
                    <span className="text-zinc-700 font-semibold">100৳</span>
                  </label>

                  {/* Outside Dhaka */}
                  <label
                    onClick={() => setDeliveryArea("outside_dhaka")}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                      deliveryArea === "outside_dhaka"
                        ? "border-[#4F213B] border-2 bg-white ring-1 ring-[#4F213B]/20"
                        : "border-zinc-300 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="delivery_zone"
                        checked={deliveryArea === "outside_dhaka"}
                        onChange={() => setDeliveryArea("outside_dhaka")}
                        className="accent-[#4F213B] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-bold text-zinc-900">Outside Dhaka</span>
                    </div>
                    <span className="text-zinc-700 font-semibold">150৳</span>
                  </label>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="pt-2">
                <label className="block text-xs sm:text-sm font-bold text-zinc-900 mb-2">
                  Payment Method
                </label>
                <div className="rounded-xl border border-[#4F213B] p-3.5 bg-white space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked
                      readOnly
                      className="accent-[#4F213B] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-zinc-900">
                      Cash on delivery
                    </span>
                  </div>
                  <div className="bg-[#FAF9F8] rounded-lg p-2.5 border border-zinc-200/80 text-xs text-zinc-600">
                    Pay with cash upon delivery.
                  </div>
                </div>
              </div>

              {/* Privacy Disclaimer */}
              <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p>

              {/* Big Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-zinc-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl text-sm sm:text-base tracking-wide transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <span>Place Order</span>
                )}
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: ORDER INFORMATION ================= */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200/80">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900">
                Order Information
              </h2>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Product Table Header (Desktop Only) */}
              <div className="hidden sm:grid bg-[#F8F8F8] rounded-lg border border-zinc-200/60 grid-cols-12 py-2 px-2 text-[11px] sm:text-xs font-bold text-zinc-800 text-center">
                <span className="col-span-2">Delete</span>
                <span className="col-span-5 text-left pl-2">Product</span>
                <span className="col-span-3">Quantity</span>
                <span className="col-span-2 text-right pr-2">Price</span>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-zinc-100">
                {cart.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500">
                    Your cart is currently empty.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id}>
                      {/* Mobile View: Spacious & Clean (Zero cramping) */}
                      <div className="sm:hidden py-3 px-1 space-y-2.5">
                        <div className="flex items-start gap-3">
                          {/* Product Thumbnail */}
                          <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-xs text-zinc-900 leading-snug">
                                {item.product.name}
                              </p>
                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 p-1 -mt-1 -mr-1 transition-colors cursor-pointer shrink-0"
                                title="Delete item"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </div>

                            <p className="text-[11px] text-zinc-500 mt-1">
                              Size: <span className="font-bold text-zinc-700">{item.size}</span> • Color: <span className="font-bold text-zinc-700">{item.color}</span>
                            </p>

                            {/* Quantity & Price Row with plenty of space */}
                            <div className="flex items-center justify-between pt-2 mt-1 border-t border-zinc-50">
                              {/* Quantity Stepper */}
                              <div className="flex items-center border border-zinc-300 rounded-lg bg-white shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                  <FiMinus size={11} />
                                </button>
                                <span className="px-3 font-bold text-xs text-zinc-800">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                  <FiPlus size={11} />
                                </button>
                              </div>

                              {/* Total Price */}
                              <div className="text-right font-bold text-sm text-[#ff2056]">
                                {(item.product.price * item.quantity).toLocaleString()}৳
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop & Tablet View (100% Unchanged) */}
                      <div className="hidden sm:grid grid-cols-12 items-center py-3 px-1 text-xs sm:text-sm">
                        {/* Delete Icon */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>

                        {/* Product Thumbnail & Name */}
                        <div className="col-span-5 flex items-center gap-2 pl-1 min-w-0">
                          <div className="relative w-10 h-12 sm:w-12 sm:h-14 rounded-md overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0 pr-1">
                            <p className="font-semibold text-xs text-zinc-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate">
                              - {item.size}, {item.color}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="col-span-3 flex justify-center">
                          <div className="flex items-center border border-zinc-300 rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                            >
                              <FiMinus size={11} />
                            </button>
                            <span className="px-2 font-bold text-xs text-zinc-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                            >
                              <FiPlus size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-right pr-2 font-bold text-zinc-900 text-xs sm:text-sm">
                          {(item.product.price * item.quantity).toLocaleString()}৳
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations Breakdown */}
              <div className="border-t border-zinc-200 pt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-zinc-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-zinc-900">{subtotal.toLocaleString()}৳</span>
                </div>

                <div className="flex items-center justify-between text-zinc-700">
                  <span className="font-medium">Discount</span>
                  <span className="font-semibold text-zinc-900">{appliedDiscount.toLocaleString()}৳</span>
                </div>

                <div className="flex items-center justify-between text-zinc-700">
                  <span className="font-medium">Delivery Charge</span>
                  <span className="font-semibold text-zinc-900">{deliveryCharge}৳</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-zinc-900 font-extrabold text-sm sm:text-base">
                  <span>Grand Total</span>
                  <span className="text-[#4F213B]">{grandTotal.toLocaleString()}৳</span>
                </div>
              </div>

              {/* Coupon Container matching screenshot: Plum background container */}
              <div className="bg-[#4F213B] rounded-xl p-2.5 sm:p-3 mt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Apply Coupon"
                    className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 px-3.5 py-2 rounded-lg text-xs sm:text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-transparent hover:bg-white/10 text-white font-bold text-xs px-4 py-2 rounded-full border border-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    APPLY
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
