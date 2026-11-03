"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiExternalLink,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// Active Web3Forms API Key
const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
  "c3782d45-a5c1-4919-a75b-072431d09230";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  botcheck: string;
}

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "Order Status & Tracking",
  message: "",
  botcheck: "",
};

/**
 * Strict Real Email Validator:
 * 1. Checks standard RFC email format.
 * 2. Checks Google (Gmail) official account rules (6-30 chars, valid chars, no consecutive dots).
 * 3. Rejects fake/dummy usernames (test@, fake@, asdf@, 123@).
 * 4. Rejects disposable / temporary domains (tempmail, mailinator, etc.).
 */
function validateRealEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { isValid: false, error: "অনুগ্রহ করে আপনার ইমেইল এড্রেসটি দিন।" };
  }

  // 1. Basic RFC syntax check
  const EMAIL_SYNTAX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!EMAIL_SYNTAX.test(trimmed)) {
    return {
      isValid: false,
      error: "ইমেইলের ফরম্যাট সঠিক নয় (যেমন: name@gmail.com)।",
    };
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return { isValid: false, error: "ইমেইল এড্রেসটি সঠিক নয়।" };
  }

  const [username, domain] = parts;

  // 2. Domain check
  if (!domain.includes(".") || domain.endsWith(".")) {
    return { isValid: false, error: "ডোমেইন নাম সঠিক নয় (যেমন: @gmail.com)।" };
  }

  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: "সঠিক ডোমেইন এক্সটেনশন দিন (যেমন: .com)।" };
  }

  // 3. Block known fake / test / disposable domains
  const blockedDomains = [
    "example.com",
    "test.com",
    "fake.com",
    "tempmail.com",
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
    "yopmail.com",
    "trashmail.com",
    "throwawaymail.com",
    "asdf.com",
    "email.com",
    "dummy.com",
    "none.com",
    "sample.com",
  ];
  if (blockedDomains.includes(domain)) {
    return {
      isValid: false,
      error: "অনুগ্রহ করে আপনার আসল ও সক্রিয় ইমেইল দিন (যেমন: আপনার আসল Gmail)।",
    };
  }

  // 4. Block common fake / dummy usernames
  const fakeUsernames = [
    "test",
    "fake",
    "asdf",
    "admin",
    "user",
    "abc",
    "xyz",
    "demo",
    "dummy",
    "noone",
    "123",
    "123456",
  ];
  if (fakeUsernames.includes(username)) {
    return {
      isValid: false,
      error: "অনুগ্রহ করে আপনার আসল ব্যক্তিগত ইমেইল দিন (কোনো ডামি ইমেইল নয়)।",
    };
  }

  // 5. Strict Google (Gmail) rules
  if (domain === "gmail.com" || domain === "googlemail.com") {
    if (username.length < 6) {
      return {
        isValid: false,
        error: "Gmail ইউজারনেম কমপক্ষে ৬ অক্ষরের হতে হবে (যেমন: yourname@gmail.com)।",
      };
    }
    if (username.length > 30) {
      return {
        isValid: false,
        error: "Gmail ইউজারনেম ৩০ অক্ষরের বেশি হতে পারে না।",
      };
    }
    if (!/^[a-z0-9.]+$/.test(username)) {
      return {
        isValid: false,
        error: "Gmail-এ শুধুমাত্র ইংরেজি বর্ণ (a-z), সংখ্যা (0-9) এবং ডট (.) অনুমোদিত।",
      };
    }
    if (
      username.startsWith(".") ||
      username.endsWith(".") ||
      username.includes("..")
    ) {
      return {
        isValid: false,
        error: "Gmail-এর শুরুতে/শেষে ডট বা পর পর দুইটি ডট (..) দেওয়া যাবে না।",
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates Bangladeshi mobile phone numbers
 */
function validateBdPhone(phone: string): { isValid: boolean; error?: string } {
  const clean = phone.replace(/[\s-]/g, "");
  const isBd = /^(?:\+8801|01)[3-9]\d{8}$/.test(clean);
  if (!isBd) {
    return {
      isValid: false,
      error: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।",
    };
  }
  return { isValid: true };
}

export default function ContactClient() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time email validation feedback
  const emailValidation = useMemo(() => {
    if (!formData.email) return null;
    return validateRealEmail(formData.email);
  }, [formData.email]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Name validation
    if (!formData.name.trim()) {
      toast.error("অনুগ্রহ করে আপনার পুরো নাম লিখুন।");
      return;
    }

    // 2. Strict Real Email validation
    const emailCheck = validateRealEmail(formData.email);
    if (!emailCheck.isValid) {
      toast.error(emailCheck.error || "সঠিক ও আসল ইমেইল এড্রেস দিন।");
      return;
    }

    // 3. Bangladeshi Phone validation
    const phoneCheck = validateBdPhone(formData.phone);
    if (!phoneCheck.isValid) {
      toast.error(phoneCheck.error || "সঠিক ১১ ডিজিটের ফোন নম্বর দিন।");
      return;
    }

    // 4. Message validation (must be at least 5 characters)
    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      toast.error("অনুগ্রহ করে আপনার বার্তা বা প্রশ্নটি লিখুন।");
      return;
    }
    if (trimmedMessage.length < 5) {
      toast.error(
        "বার্তাটি অন্তত ৫ অক্ষরের হতে হবে (যেমন: সাইজ বা অর্ডার সম্পর্কে)।"
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: formData.name.trim(), // Shows customer name in inbox
          replyto: formData.email.trim(), // Direct reply to customer email
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: `${formData.subject} - Message from ${formData.name.trim()}`,
          message: formData.message.trim(),
          botcheck: formData.botcheck,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast.success("বার্তাটি সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
        setFormData(INITIAL_FORM);
      } else {
        const errorText =
          result.message || "মেসেজ পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।";
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (err) {
      console.error("Web3Forms submission error:", err);
      const errStr =
        "নেটওয়ার্ক সমস্যা। আপনার ইন্টারনেট চেক করুন অথবা WhatsApp-এ যোগাযোগ করুন।";
      setErrorMessage(errStr);
      toast.error(errStr);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen text-zinc-900 pb-16">
      {/* 1. Header Banner */}
      <section className="w-full bg-[#EDEDED] py-8 sm:py-10 flex flex-col items-center justify-center border-b border-zinc-200/80 px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight text-center">
          Contact Us
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 mt-1.5 font-medium">
          <Link href="/" className="hover:text-[#4F213B] transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-[#4F213B]">Contact</span>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* 2. Top Quick Connect Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Phone Hotline */}
          <a
            href="tel:+8801810559258"
            className="group bg-white p-5 rounded-xl border border-zinc-200/90 shadow-xs hover:border-[#4F213B]/40 hover:shadow-md transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-lg bg-[#4F213B]/10 text-[#4F213B] flex items-center justify-center shrink-0 group-hover:bg-[#4F213B] group-hover:text-white transition-colors">
              <FiPhone size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Call Us Directly
              </p>
              <p className="text-sm font-bold text-zinc-900 mt-0.5 group-hover:text-[#4F213B] transition-colors">
                01810-559258
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                9:00 AM – 10:00 PM (Daily)
              </p>
            </div>
          </a>

          {/* WhatsApp Support */}
          <a
            href="https://wa.me/8801810559258?text=Hello%20Borka%20Shop%20Team%2C%20I%20need%20assistance"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-5 rounded-xl border border-zinc-200/90 shadow-xs hover:border-[#25D366]/40 hover:shadow-md transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <FaWhatsapp size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                WhatsApp Chat
              </p>
              <p className="text-sm font-bold text-zinc-900 mt-0.5 group-hover:text-[#25D366] transition-colors">
                +880 1810-559258
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Fastest Response
              </p>
            </div>
          </a>

          {/* Email Support */}
          <a
            href="mailto:support@borkashop.borbila.net"
            className="group bg-white p-5 rounded-xl border border-zinc-200/90 shadow-xs hover:border-[#4F213B]/40 hover:shadow-md transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-lg bg-[#4F213B]/10 text-[#4F213B] flex items-center justify-center shrink-0 group-hover:bg-[#4F213B] group-hover:text-white transition-colors">
              <FiMail size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Email Desk
              </p>
              <p className="text-sm font-bold text-zinc-900 mt-0.5 truncate group-hover:text-[#4F213B] transition-colors">
                support@borkashop.borbila.net
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Reply within 24 hours
              </p>
            </div>
          </a>

          {/* Showroom Location */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#4F213B]/10 text-[#4F213B] flex items-center justify-center shrink-0">
              <FiMapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Showroom Studio
              </p>
              <p className="text-sm font-bold text-zinc-900 mt-0.5">
                Dhanmondi, Dhaka
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                House 48, Road 10/A
              </p>
            </div>
          </div>
        </div>

        {/* 3. Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Store Details, Support Hours & Showroom Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customer Care & Promise */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#4F213B]/10 text-[#4F213B]">
                  Borka Shop Customer Care
                </span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Now
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-900 mb-2">
                We are Here to Guide Your Modest Wardrobe
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Need help choosing the right burqa fabric, Dubai Nida abaya, Medina
                silk hijab, custom length sizing, order tracking, or exchange
                request? Our team provides personalized support.
              </p>

              <div className="mt-5 pt-5 border-t border-zinc-100 flex items-center gap-3">
                <a
                  href="https://wa.me/8801810559258"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <FaWhatsapp size={16} />
                  <span>WhatsApp Help</span>
                </a>
                <a
                  href="tel:+8801810559258"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white py-2.5 px-4 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <FiPhone size={14} />
                  <span>Call Hotline</span>
                </a>
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#4F213B]/10 text-[#4F213B] flex items-center justify-center">
                  <FiClock size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Showroom & Support Hours
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Fastest response during working hours
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="font-medium text-zinc-700">Saturday – Thursday</span>
                  <span className="font-bold text-zinc-900">10:00 AM – 08:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-100">
                  <span className="font-medium text-zinc-700">Friday (Showroom)</span>
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm">
                    Closed
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="font-medium text-zinc-700">Online Store & Orders</span>
                  <span className="font-bold text-emerald-600">24 Hours / 7 Days</span>
                </div>
              </div>
            </div>

            {/* Showroom Map Card */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-[#4F213B]" size={16} />
                  <h3 className="text-sm font-bold text-zinc-900">
                    Visit Our Showroom
                  </h3>
                </div>
                <a
                  href="https://maps.google.com/?q=House+48,+Road+10/A,+Dhanmondi,+Dhaka,+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#4F213B] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <FiExternalLink size={11} />
                </a>
              </div>
              <p className="text-xs text-zinc-600 mb-3.5">
                House 48, Road 10/A, Dhanmondi, Dhaka, Bangladesh. Please call ahead
                if you are checking for specific size or fabric availability.
              </p>

              <div className="w-full h-52 rounded-xl overflow-hidden border border-zinc-200 relative bg-zinc-100">
                <iframe
                  title="Borka Shop Showroom Location"
                  src="https://maps.google.com/maps?q=House%2048%2C%20Road%2010%2FA%2C%20Dhanmondi%2C%20Dhaka%2C%20Bangladesh&t=m&z=15&output=embed&iwloc=near"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Contact & Email Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/90 shadow-xs">
              {/* Form Title */}
              <div className="border-b border-zinc-100 pb-5 mb-6">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4F213B] text-white flex items-center justify-center">
                    <FiMessageSquare size={16} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                    Send Us a Message
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Have a question or request? Submit this form and our customer
                  desk will receive it directly via email.
                </p>
              </div>

              {/* Success Notification View */}
              {isSubmitted ? (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <FiCheckCircle size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-zinc-600 max-w-md leading-relaxed mb-6">
                    Thank you for reaching out to Borka Shop. Our customer support team
                    has received your message and will reply to your email within 24
                    hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-[#4F213B] hover:bg-[#3D182D] text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot Spam Prevention (Hidden) */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    checked={formData.botcheck === "true"}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        botcheck: e.target.checked ? "true" : "",
                      }))
                    }
                    className="hidden"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Row 1: Full Name & Real Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-zinc-700 mb-1.5"
                      >
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                          <FiUser size={15} />
                        </span>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Fatima Rahman"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Real Email (with live validation) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-zinc-700"
                        >
                          Google (Gmail) / Email <span className="text-rose-500">*</span>
                        </label>
                        {formData.email && (
                          <span className="text-[11px] font-medium flex items-center gap-1">
                            {emailValidation?.isValid ? (
                              <span className="text-emerald-600 flex items-center gap-0.5">
                                <FiCheck size={12} className="stroke-[3]" /> Valid
                              </span>
                            ) : (
                              <span className="text-rose-500">Invalid</span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                          <FiMail size={15} />
                        </span>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="yourname@gmail.com"
                          className={`w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/80 border rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none transition-colors ${
                            formData.email && !emailValidation?.isValid
                              ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                              : formData.email && emailValidation?.isValid
                              ? "border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              : "border-zinc-200 focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B]"
                          }`}
                        />
                      </div>
                      {/* Helpful guidance if error */}
                      {formData.email && !emailValidation?.isValid && (
                        <p className="text-[11px] text-rose-500 mt-1 leading-tight">
                          {emailValidation?.error}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone & Subject Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold text-zinc-700 mb-1.5"
                      >
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                          <FiPhone size={15} />
                        </span>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="017XXXXXXXX"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold text-zinc-700 mb-1.5"
                      >
                        Inquiry Topic <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B] transition-colors cursor-pointer"
                      >
                        <option value="Order Status & Tracking">
                          Order Status & Tracking
                        </option>
                        <option value="Size & Fitting Advice">
                          Size & Fitting Advice
                        </option>
                        <option value="Exchange & Return Request">
                          Exchange & Return Request
                        </option>
                        <option value="Fabric & Product Details">
                          Fabric & Product Details
                        </option>
                        <option value="Wholesale / Bulk Order">
                          Wholesale / Bulk Order
                        </option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Message Textarea */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-zinc-700"
                      >
                        Your Message <span className="text-rose-500">*</span>
                      </label>
                      <span
                        className={`text-[11px] ${
                          formData.message.trim().length >= 5
                            ? "text-emerald-600 font-medium"
                            : "text-zinc-400"
                        }`}
                      >
                        {formData.message.trim().length} characters (min 5)
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please write your questions, order number, or product details here (at least 5 characters)..."
                      className="w-full p-3.5 bg-zinc-50/80 border border-zinc-200 rounded-lg text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F213B] focus:ring-1 focus:ring-[#4F213B] transition-colors resize-y min-h-[120px]"
                    ></textarea>
                    {formData.message && formData.message.trim().length < 5 && (
                      <p className="text-[11px] text-amber-600 mt-1">
                        বার্তাটি অন্তত ৫ অক্ষরের হতে হবে (যেমন: বোরকার সাইজ বা বিস্তারিত)।
                      </p>
                    )}
                  </div>

                  {/* Error Notification Banner */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                      <FiAlertCircle className="text-rose-600 shrink-0 mt-0.5" size={15} />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#4F213B] hover:bg-[#3D182D] text-white px-8 py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <FiSend size={15} />
                          <span>Send Message to Borka Shop</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-zinc-400 mt-2.5">
                      We respect your privacy. Your information is strictly used for
                      replying to your inquiry.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4. Bottom Support FAQ Teaser */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900">
              Need Instant Answers to Common Questions?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Find instant solutions for delivery times, exchange policy, payment
              methods, and burqa size measurements.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/faq"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Read FAQs
            </Link>
            <Link
              href="/size-guide"
              className="bg-[#4F213B]/10 hover:bg-[#4F213B]/20 text-[#4F213B] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Size Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
