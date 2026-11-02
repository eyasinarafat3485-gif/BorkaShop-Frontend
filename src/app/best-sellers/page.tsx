import { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { FiChevronRight } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Best Sellers Collection - Borka Shop",
  description: "Our most-loved and top-rated modest fashion items. Shop customer favorite Burqas, Abayas, and Hijabs.",
};

export default function BestSellersPage() {
  const products = PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <div className="w-full bg-[#FAF9F8] min-h-screen pb-16">
      {/* Breadcrumbs */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600">
            <Link href="/" className="hover:text-[#4F213B] transition-colors">
              Home
            </Link>
            <FiChevronRight size={13} className="text-zinc-400" />
            <Link href="/shop" className="hover:text-[#4F213B] transition-colors">
              Shop
            </Link>
            <FiChevronRight size={13} className="text-zinc-400" />
            <span className="text-zinc-900 font-semibold">Best Sellers</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8 mb-6 shadow-sm">
          <h1 className="font-['Hind_Siliguri'] text-2xl sm:text-3xl font-bold text-zinc-900">
            Best Sellers Collection
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Top-rated customer favorites in burqas, abayas, and modest wear
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
