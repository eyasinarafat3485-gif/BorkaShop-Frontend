import { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { FiChevronRight } from "react-icons/fi";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${title} Collection - Borka Shop`,
    description: `Explore our exclusive ${title} modest fashion collection. High quality fabrics, elegant designs, and nationwide cash on delivery.`,
  };
}

async function getCategoryProducts(catSlug: string): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:5000/api/products", { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        return data.products.filter((p: Product) => p.category.toLowerCase() === catSlug);
      }
    }
  } catch {}
  return PRODUCTS.filter((p) => p.category.toLowerCase() === catSlug);
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catSlug = category.toLowerCase();

  const products = await getCategoryProducts(catSlug);

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

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
              Categories
            </Link>
            <FiChevronRight size={13} className="text-zinc-400" />
            <span className="text-zinc-900 font-semibold">{categoryName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Category Header */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-['Hind_Siliguri'] text-2xl sm:text-3xl font-bold text-zinc-900">
                {categoryName} Collection
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Showing {products.length} products in this category
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-semibold text-[#4F213B] hover:underline"
            >
              Browse All Categories →
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center my-6">
            <p className="text-base font-semibold text-zinc-800 mb-2">
              No products available in this category yet.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-3 px-4 py-2 bg-[#4F213B] text-white rounded text-xs font-semibold uppercase tracking-wider"
            >
              Back to Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
