import type { Metadata } from "next";
import { Hind_Siliguri, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { ShopProvider } from "@/context/ShopContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import TrackOrderModal from "@/components/TrackOrderModal";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Borka Shop – Best Shop in Bangladesh | Luxury Abaya, Burqa & Hijab",
  description:
    "Premium Modest Islamic Fashion in Bangladesh. Authentic Dubai Nida Abayas, Korean Georgette Burqas, Medina Silk Hijabs, Khimars & Niqabs with 1-Click Guest Cash On Delivery.",
  keywords: [
    "borka shop",
    "abaya bangladesh",
    "burqa online",
    "hijab bd",
    "eid collection 2026",
    "modest sets",
    "cash on delivery",
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${hindSiliguri.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-zinc-900 font-sans antialiased selection:bg-[#4F213B] selection:text-white">
        <LenisProvider>
          <ShopProvider>
            {/* Main Header */}
            <Header />

            {/* Main Dynamic Content */}
            <main className="flex-1 w-full">{children}</main>

            {/* Modals & Overlays */}
            <CartDrawer />
            <SearchModal />
            <TrackOrderModal />

            {/* Toast Notifications */}
            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Footer */}
            <Footer />
          </ShopProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
