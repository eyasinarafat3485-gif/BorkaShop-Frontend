<div align="center">

# 🧕 BorkaShop — Premium Modest Fashion & E-Commerce Web Application

**A modern, high-performance, and luxury e-commerce platform built with Next.js 16, React 19, and Tailwind CSS v4.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-teal?style=for-the-badge)](https://www.better-auth.com/)
[![Status](https://img.shields.io/badge/Production-Ready-brightgreen?style=for-the-badge)](#)

---

</div>

## 📖 Overview

**BorkaShop** is an elegant, full-featured modest fashion e-commerce storefront crafted for speed, seamless shopping, and responsive usability across all devices. Designed with a luxury aesthetic matching high-end modesty brands, it offers guest-first instant checkout, user account personalization, real-time MongoDB Atlas synchronization, dynamic store delivery configuration, and a comprehensive admin management dashboard.

---

## ✨ Key Features

### 🛍️ Customer Storefront & Shopping Experience
- **Luxury Aesthetic & Responsive Layout:** Crafted with typography pairing (`Hind Siliguri`, `Playfair Display`), smooth transitions, and seamless mobile-first bottom navigation.
- **Product Discovery & Filtering:** Browse by categories (Burqa, Abaya, Niqab, Hijab, Khimar, Modest Sets), price filtering, sort by popularity, and fast search.
- **Interactive Product Details:** High-resolution image zoom (`ProductImageZoom`), size and color selection, WhatsApp direct ordering, and dynamic stock indicator.
- **1-Click Quick Order Modal:** Customers can place instant orders directly from product cards or detail pages without tedious cart steps.
- **Dynamic Reviews System:** Connected directly to MongoDB Atlas `reviews` collection. Logged-in users auto-populate their profile info, while guest users can submit with custom details. Shows real verified customer reviews.
- **Cart & Slide-out Drawer:** Real-time quantity adjustments, free delivery threshold progress, and synchronized local/cloud cart persistence.

### 💳 Smart Checkout & Shipping
- **Guest & Member Dual Checkout:** Logged-in users get instant form auto-completion; guest shoppers can complete checkout with zero account creation friction.
- **Dynamic Delivery Rates:** Automatically synchronizes delivery fees (`Inside Dhaka` vs `Outside Dhaka`) and free shipping thresholds directly configured from the Admin Settings.
- **Cash on Delivery (COD) & Gateway Support:** Integrated cash on delivery flow, bKash/Nagad options, and immediate order confirmation screen with order reference code.

### 🔐 Authentication & Session Isolation
- **Better Auth Integration:** Secure session management, email/password registration, password recovery, and role separation (`user`, `admin`, `guest`).
- **Complete Data Isolation:** Guest orders and carts never leak into newly registered accounts; distinct persistent device tracking.

### 👑 Executive Admin Management Dashboard (`/admin`)
- **Dashboard Overview:** Real-time metrics for total revenue, active orders, customer counts, and stock analytics.
- **All Products & Product Management:** Live search, catalog view, and instant product status toggle.
- **Add New Product:** Multi-image upload preview, size/color variant tagger, price and category assignments.
- **Orders & Sales Management:** Filter by order status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), customer lookup, and batch operations.
- **PDF Invoice Generation:** 1-click printable and downloadable luxury PDF invoice generator powered by `jspdf` and `html2canvas`.
- **Customer CRM:** Comprehensive customer directories with contact details, order frequency, and role management.
- **Store & Delivery Settings:** Real-time editable delivery rates, free shipping criteria, and support helpline synced directly with MongoDB Atlas `storesettings`.
- **Customer Testimonials & Reviews Management:** Moderate, review, approve, and delete customer reviews.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Modern server-side rendering, client components, and nested layouts |
| **Library** | [React 19](https://react.dev/) | Latest React concurrent features and high-performance hooks |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking and reliable component props |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility-first styling with `@tailwindcss/turbopack` |
| **Auth** | [Better Auth](https://www.better-auth.com/) | Secure authentication client with multi-role access control |
| **PDF Generation** | `jspdf` & `html2canvas` | Client-side vector and pixel-perfect invoice generation |
| **State Management**| React Context API (`ShopContext`) | Single source of truth with MongoDB Atlas cloud synchronization |
| **Notifications** | `react-hot-toast` | Lightweight, customized toast feedback |
| **Icons** | `react-icons` (Fi, Fa, Fc) | Feather & FontAwesome iconography |
| **Smooth Scroll** | `lenis` | Cinematic momentum scrolling experience |

---

## 📁 Project Directory Structure

```text
Frontend/
├── public/                 # Static assets, SVG payment badges, logos
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── admin/          # Admin Dashboard & sub-routes
│   │   │   ├── [slug]/     # URL-driven tab routes (/admin/all-products, etc.)
│   │   │   └── components/ # Admin tabs (Orders, Products, Settings, etc.)
│   │   ├── cart/           # Dedicated cart review page
│   │   ├── checkout/       # Intelligent guest/user checkout page
│   │   ├── dashboard/      # User account profile and orders
│   │   ├── login/          # Secure user login portal
│   │   ├── register/       # New customer onboarding
│   │   ├── shop/           # Store catalog, filters, search
│   │   ├── product/[slug]/ # Dynamic product details page
│   │   ├── layout.tsx      # Root layout, fonts, header, footer, toast provider
│   │   └── page.tsx        # Storefront homepage
│   ├── components/         # Reusable UI widgets
│   │   ├── Header.tsx      # Main navigation, mobile drawer, search modal
│   │   ├── Footer.tsx      # Dynamic store contact & payment info
│   │   ├── ProductCard.tsx # Responsive catalog card
│   │   ├── CartDrawer.tsx  # Slide-out quick cart drawer
│   │   ├── QuickOrderModal # 1-Click order popup
│   │   └── AuthModal.tsx   # Fast authentication modal
│   ├── context/
│   │   └── ShopContext.tsx # Global state: cart, wishlist, orders, settings
│   ├── lib/
│   │   └── auth-client.ts  # Better-Auth client instance
│   └── types/              # Global TypeScript interfaces
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.18+` or `v20+`
- **npm**, **pnpm**, or **yarn**
- **Backend Service**: Make sure the Express & MongoDB backend is running on `http://localhost:5000`.

### 1. Installation

Clone the repository and enter the Frontend folder:

```bash
cd Frontend
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root of the `Frontend` directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# Better Auth Backend Endpoint
NEXT_PUBLIC_AUTH_URL="http://localhost:5000"
```

### 3. Running Development Server

Start the development server with Turbopack:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📜 Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js dev server with Turbopack on port `3000` |
| `npm run build` | Compiles production-ready optimized build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint checks across codebase |

---

## 🔗 Key Routes & Navigation

| Route | Purpose |
| :--- | :--- |
| `/` | Luxury storefront homepage with hero slider, featured collections, and reviews |
| `/shop` | Full product catalog with filters and search |
| `/product/[slug]` | Product details with real reviews, size guide, and quick order |
| `/checkout` | Fast checkout with dynamic delivery fee calculations |
| `/login` | User login portal |
| `/register` | User account registration |
| `/dashboard` | User purchase history, address management, and order status |
| `/admin` | Main executive management overview |
| `/admin/all-products`| Product inventory, live stock control |
| `/admin/add-product` | Add new product variant with live preview |
| `/admin/orders` | Comprehensive order management & invoice printing |
| `/admin/customers` | Customer CRM directory |
| `/admin/reviews` | Customer testimonials and review moderation |
| `/admin/settings` | Real-time delivery fee & store helpline configuration |

---

## 🔒 Security & Best Practices

- **Sanitized Inputs:** All customer inputs and review comments are validated on submission.
- **Client/Server Boundary Separation:** Server components and dynamic client boundary encapsulation ensure optimal payload sizes.
- **Responsive Media:** Next.js `<Image />` optimization with remote domain configuration prevents layout shifts and delivers modern WebP/AVIF formats.

---

## 📄 License

This project is proprietary and developed for **BorkaShop**. All rights reserved.

<div align="center">
  <sub>Developed with ❤️ for BorkaShop Luxury Modest Fashion</sub>
</div>
