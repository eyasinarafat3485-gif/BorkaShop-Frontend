"use client";

import React, { useState, useEffect } from "react";
import {
  FiSettings,
  FiSave,
  FiTruck,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiCheck,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";

export default function SettingsTab() {
  const { shippingSettings, updateShippingSettings } = useShop();

  const [insideDhaka, setInsideDhaka] = useState(shippingSettings.insideDhaka);
  const [outsideDhaka, setOutsideDhaka] = useState(shippingSettings.outsideDhaka);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(shippingSettings.freeShippingThreshold);
  const [helplinePhone, setHelplinePhone] = useState(shippingSettings.helplinePhone);
  const [helplineEmail, setHelplineEmail] = useState(shippingSettings.helplineEmail);
  const [enableCod, setEnableCod] = useState(shippingSettings.enableCod);
  const [enableBkash, setEnableBkash] = useState(shippingSettings.enableBkash);
  const [enableNagad, setEnableNagad] = useState(shippingSettings.enableNagad);
  const [enableRocket, setEnableRocket] = useState(shippingSettings.enableRocket);

  useEffect(() => {
    if (shippingSettings) {
      setInsideDhaka(shippingSettings.insideDhaka);
      setOutsideDhaka(shippingSettings.outsideDhaka);
      setFreeShippingThreshold(shippingSettings.freeShippingThreshold);
      setHelplinePhone(shippingSettings.helplinePhone);
      setHelplineEmail(shippingSettings.helplineEmail);
      setEnableCod(shippingSettings.enableCod);
      setEnableBkash(shippingSettings.enableBkash);
      setEnableNagad(shippingSettings.enableNagad);
      setEnableRocket(shippingSettings.enableRocket);
    }
  }, [shippingSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingSettings({
      insideDhaka: Number(insideDhaka),
      outsideDhaka: Number(outsideDhaka),
      freeShippingThreshold: Number(freeShippingThreshold),
      helplinePhone,
      helplineEmail,
      enableCod,
      enableBkash,
      enableNagad,
      enableRocket,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 font-serif">
            Store & Shipping Settings
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure delivery fees, contact helpline, and accepted payment gateways
          </p>
        </div>
      </div>

      {/* 2. Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping & Delivery Fees */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 shadow-xs space-y-5 text-xs">
          <h3 className="text-sm font-bold text-zinc-900 font-serif flex items-center gap-2 border-b border-zinc-100 pb-3">
            <FiTruck className="text-[#ff2056]" size={16} />
            <span>Delivery Rates (Bangladesh)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Inside Dhaka Delivery Fee (৳)
              </label>
              <input
                type="number"
                required
                value={insideDhaka}
                onChange={(e) => setInsideDhaka(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Default: ৳70 (Dhaka City)</p>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Outside Dhaka Delivery Fee (৳)
              </label>
              <input
                type="number"
                required
                value={outsideDhaka}
                onChange={(e) => setOutsideDhaka(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Default: ৳130 (All districts)</p>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Free Delivery Threshold (৳)
              </label>
              <input
                type="number"
                required
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Orders above this amount get free shipping</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 shadow-xs space-y-5 text-xs">
          <h3 className="text-sm font-bold text-zinc-900 font-serif flex items-center gap-2 border-b border-zinc-100 pb-3">
            <FiPhone className="text-[#ff2056]" size={16} />
            <span>Helpline & Customer Support</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Official Phone / WhatsApp Number
              </label>
              <input
                type="text"
                required
                value={helplinePhone}
                onChange={(e) => setHelplinePhone(e.target.value)}
                placeholder="01810 559 258"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1.5">
                Support Email Address
              </label>
              <input
                type="email"
                required
                value={helplineEmail}
                onChange={(e) => setHelplineEmail(e.target.value)}
                placeholder="support@burkashop.com"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:border-[#ff2056]"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Toggle */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-zinc-900 font-serif flex items-center gap-2 border-b border-zinc-100 pb-3">
            <FiCreditCard className="text-[#ff2056]" size={16} />
            <span>Accepted Payment Methods</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
              <span className="font-bold text-zinc-800">Cash on Delivery (COD)</span>
              <input
                type="checkbox"
                checked={enableCod}
                onChange={(e) => setEnableCod(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff2056] focus:ring-[#ff2056] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
              <span className="font-bold text-zinc-800">bKash Payment</span>
              <input
                type="checkbox"
                checked={enableBkash}
                onChange={(e) => setEnableBkash(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff2056] focus:ring-[#ff2056] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
              <span className="font-bold text-zinc-800">Nagad Payment</span>
              <input
                type="checkbox"
                checked={enableNagad}
                onChange={(e) => setEnableNagad(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff2056] focus:ring-[#ff2056] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
              <span className="font-bold text-zinc-800">Rocket Payment</span>
              <input
                type="checkbox"
                checked={enableRocket}
                onChange={(e) => setEnableRocket(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff2056] focus:ring-[#ff2056] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-6 bg-[#ff2056] hover:bg-[#3D182D] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#ff2056]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiSave size={15} />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
