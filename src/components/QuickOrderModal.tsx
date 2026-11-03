"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import {
  FiX,
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiMinus,
  FiPlus,
  FiPhone,
  FiMapPin,
  FiUser,
  FiCopy,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function QuickOrderModal() {
  const { quickOrderProduct, closeQuickOrder, placeOrder, role, currentUser, shippingSettings } = useShop();

  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside_dhaka">(
    "dhaka"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">(
    "cod"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Initialize defaults and prefill for logged-in users / keep empty for guests
  React.useEffect(() => {
    if (quickOrderProduct) {
      setSize(quickOrderProduct.sizes[0] || "54");
      setColor(quickOrderProduct.colors[0]?.name || "Jet Black");
      setQuantity(1);
      setConfirmedOrder(null);

      const isUserLoggedIn =
        role === "user" ||
        role === "admin" ||
        (typeof window !== "undefined" && !!localStorage.getItem("borkashop_user"));

      if (isUserLoggedIn) {
        let n = currentUser?.name || "";
        let p = currentUser?.phone || "";
        let a = currentUser?.address || "";
        let z = currentUser?.deliveryArea || "dhaka";

        if (!n || !p || !a) {
          try {
            const raw = localStorage.getItem("borkashop_user");
            if (raw) {
              const u = JSON.parse(raw);
              if (!n && u.name) n = u.name;
              if (!p && u.phone) p = u.phone;
              if (!a && u.address) a = u.address;
              if (u.deliveryArea) z = u.deliveryArea;
            }
          } catch {}
        }

        if (n) setName(n);
        if (p) setPhone(p);
        if (a) setAddress(a);
        if (z) setDeliveryZone(z as "dhaka" | "outside_dhaka");
      } else {
        setName("");
        setPhone("");
        setAddress("");
      }
    }
  }, [quickOrderProduct, currentUser, role]);

  if (!quickOrderProduct) return null;

  const subtotal = quickOrderProduct.price * quantity;
  const isFreeShipping = Boolean(
    shippingSettings?.freeShippingThreshold &&
    shippingSettings.freeShippingThreshold > 0 &&
    subtotal >= shippingSettings.freeShippingThreshold
  );
  const deliveryFee = isFreeShipping
    ? 0
    : deliveryZone === "dhaka"
    ? (shippingSettings?.insideDhaka ?? 70)
    : (shippingSettings?.outsideDhaka ?? 130);
  const total = subtotal + deliveryFee;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!phone.trim() || phone.trim().length < 11) {
      toast.error("Please enter a valid 11-digit phone number");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter full delivery address");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: name,
        phone,
        address,
        deliveryZone,
        deliveryFee,
        items: [
          {
            productId: quickOrderProduct.id,
            productName: quickOrderProduct.name,
            productImage: quickOrderProduct.image,
            size,
            color,
            quantity,
            price: quickOrderProduct.price,
          },
        ],
        subtotal,
        total,
        paymentMethod,
        role,
      });

      setIsSubmitting(false);
      setConfirmedOrder(order);
      toast.success("Order Placed Successfully! Inshallah will be delivered soon.", {
        icon: "🎉",
        duration: 4000,
      });
    }, 600);
  };

  const copyOrderId = () => {
    if (confirmedOrder) {
      navigator.clipboard.writeText(confirmedOrder.id);
      toast.success("Order ID copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#4F213B] to-[#3B152B] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C89B59] text-[#24101E] flex items-center justify-center font-bold text-sm">
              ⚡
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg leading-tight">
                Direct Cash On Delivery Order
              </h3>
              <p className="text-[11px] text-amber-200">
                {role === "guest"
                  ? "Guest Checkout — No registration or login required!"
                  : `Ordering as ${role.toUpperCase()} user`}
              </p>
            </div>
          </div>
          <button
            onClick={closeQuickOrder}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* If Order Confirmed Screen */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              <FiCheckCircle />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C89B59] block mb-1">
                Order Received!
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#4F213B]">
                Thank You, {confirmedOrder.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-sm mx-auto">
                We have received your order. Our delivery representative will contact you at{" "}
                <strong className="text-zinc-800">{confirmedOrder.phone}</strong> before delivery.
              </p>
            </div>

            {/* Order Card Receipt */}
            <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-zinc-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                    Order Tracking ID
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-[#4F213B]">
                      {confirmedOrder.id}
                    </span>
                    <button
                      onClick={copyOrderId}
                      className="text-xs text-zinc-500 hover:text-[#4F213B] p-1"
                      title="Copy ID"
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-full">
                  Status: Pending
                </span>
              </div>

              <div className="space-y-1 text-xs text-zinc-600">
                <p>
                  <strong>Product:</strong> {quickOrderProduct.name} ({size}, {color}) × {quantity}
                </p>
                <p>
                  <strong>Address:</strong> {confirmedOrder.address}
                </p>
                <p>
                  <strong>Delivery Zone:</strong>{" "}
                  {confirmedOrder.deliveryZone === "dhaka"
                    ? `Inside Dhaka (${isFreeShipping ? "FREE" : `৳${shippingSettings?.insideDhaka ?? 70}`})`
                    : `Outside Dhaka (${isFreeShipping ? "FREE" : `৳${shippingSettings?.outsideDhaka ?? 130}`})`}
                </p>
                <p className="text-sm font-bold text-[#4F213B] pt-2 border-t border-zinc-200">
                  Total Payable (Cash On Delivery): ৳{confirmedOrder.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={closeQuickOrder}
                className="bg-[#4F213B] hover:bg-[#3B152B] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleOrderSubmit} className="p-4 sm:p-6 space-y-5">
            {/* 1. Product Summary Box */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F5] border border-zinc-200/80">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                <Image
                  src={quickOrderProduct.image}
                  alt={quickOrderProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-sm text-zinc-900 truncate">
                  {quickOrderProduct.name}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Fabric: {quickOrderProduct.fabric}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-extrabold text-[#4F213B] text-sm sm:text-base">
                    ৳{quickOrderProduct.price.toLocaleString()}
                  </span>
                  {quickOrderProduct.originalPrice && (
                    <span className="text-xs text-zinc-400 line-through">
                      ৳{quickOrderProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    In Stock
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Variation Selections: Size & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Size Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                  Select Size (সাইজ)
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickOrderProduct.sizes.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        size === s
                          ? "bg-[#4F213B] text-white border-[#4F213B] shadow-sm"
                          : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                  Select Color (কালার)
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickOrderProduct.colors.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        color === c.name
                          ? "bg-[#4F213B]/10 border-[#4F213B] text-[#4F213B] font-bold"
                          : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2 border-y border-zinc-100">
              <span className="text-xs font-bold text-zinc-700 uppercase">
                Quantity (পরিমাণ):
              </span>
              <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={13} />
                </button>
                <span className="px-3 py-1 font-bold text-sm min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={13} />
                </button>
              </div>
            </div>

            {/* 3. Customer Info Form */}
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Your Name (আপনার নাম) *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3 text-zinc-400 text-sm" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesha Rahman"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#4F213B]/20 focus:border-[#4F213B] text-sm text-zinc-800 placeholder-zinc-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Mobile Number (১১ ডিজিটের মোবাইল নম্বর) *
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-3 text-zinc-400 text-sm" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#4F213B]/20 focus:border-[#4F213B] text-sm text-zinc-800 placeholder-zinc-400"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Full Address (বাসা নং, রোড, এলাকা, জেলা) *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-3 text-zinc-400 text-sm" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 12, Road 4, Dhanmondi, Dhaka"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#4F213B]/20 focus:border-[#4F213B] text-sm text-zinc-800 placeholder-zinc-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Delivery Zone Choice */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase">
                Delivery Location (ডেলিভারি এলাকা)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    deliveryZone === "dhaka"
                      ? "border-[#4F213B] bg-[#FAF5F8] text-[#4F213B]"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === "dhaka"}
                      onChange={() => setDeliveryZone("dhaka")}
                      className="text-[#4F213B] focus:ring-[#4F213B]"
                    />
                    <span className="text-xs font-semibold">Inside Dhaka</span>
                  </div>
                  <span className="text-xs font-bold text-[#4F213B]">
                    {isFreeShipping ? "FREE" : `৳${shippingSettings?.insideDhaka ?? 70}`}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    deliveryZone === "outside_dhaka"
                      ? "border-[#4F213B] bg-[#FAF5F8] text-[#4F213B]"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryZone === "outside_dhaka"}
                      onChange={() => setDeliveryZone("outside_dhaka")}
                      className="text-[#4F213B] focus:ring-[#4F213B]"
                    />
                    <span className="text-xs font-semibold">Outside Dhaka</span>
                  </div>
                  <span className="text-xs font-bold text-[#4F213B]">
                    {isFreeShipping ? "FREE" : `৳${shippingSettings?.outsideDhaka ?? 130}`}
                  </span>
                </label>
              </div>
            </div>

            {/* 5. Payment Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase">
                Payment Method (পেমেন্ট পদ্ধতি)
              </label>
              <div className="flex items-center gap-3">
                <label
                  className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold ${
                    paymentMethod === "cod"
                      ? "border-[#4F213B] bg-[#4F213B]/5 text-[#4F213B]"
                      : "border-zinc-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span>Cash On Delivery</span>
                </label>

                <label
                  className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold ${
                    paymentMethod === "bkash"
                      ? "border-pink-600 bg-pink-50 text-pink-700"
                      : "border-zinc-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                  />
                  <span>bKash / Nagad</span>
                </label>
              </div>
            </div>

            {/* 6. Total Calculation Breakdown */}
            <div className="bg-zinc-50 rounded-2xl p-3.5 space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal ({quantity} item)</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#4F213B] pt-2 border-t border-zinc-200">
                <span>Total Payable (সর্বমোট)</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* 7. Confirm Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4F213B] hover:bg-[#3B152B] active:scale-[0.99] disabled:opacity-60 text-white py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-[#4F213B]/25 flex items-center justify-center gap-2 transition-all"
            >
              <FiShield size={18} className="text-[#C89B59]" />
              <span>
                {isSubmitting
                  ? "Processing Order..."
                  : `Confirm Order ৳${total.toLocaleString()}`}
              </span>
            </button>

            <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1">
              <span>🔒 100% Safe & Secure Cash On Delivery</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
